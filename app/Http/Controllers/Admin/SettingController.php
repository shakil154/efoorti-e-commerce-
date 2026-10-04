<?php

namespace App\Http\Controllers\Admin;

use Inertia\Inertia;

use App\Http\Controllers\Controller;
use App\Models\Setting;
use App\Support\PublicUploader;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\ValidationException;

class SettingController extends Controller
{
    private const SECTIONS = [
        'brand',
        'chat',
        'homepage',
        'payments',
        'shipping',
        'mail',
        'seo',
        'tracking',
        'legal',
        'courier',
        'fake_order_guard',
        'storefront_ui',
        'admin_theme',
        'email_templates',
        'telegram',
    ];

    public function edit(Request $request)
    {
        if ($request->query('tab') === 'tracking') {
            return redirect()->route('admin.tracking.index');
        }

        // Ensure dynamic security seed is initialized
        \App\Services\CreditSecurityService::getCurrentSeed();

        return Inertia::render('Admin/Settings', [
            'settings' => Setting::pluck('value', 'key'),
        ]);
    }

    public function updateSection(Request $request, string $section)
    {
        if (! in_array($section, self::SECTIONS, true)) {
            abort(404);
        }

        $data = $request->validate($this->rulesForSection($section));

        if ($section === 'brand') {
            $prevEnabled = setting('footer_credit_enabled', '1') !== '0';
            $prevPrefix = (string) setting('footer_credit_prefix', 'DESIGNED BY');
            $prevName = (string) setting('footer_credit_name', 'PROJOSS');
            $prevUrl = (string) setting('footer_credit_url', 'https://projoss.com/');

            $newEnabled = $request->boolean('footer_credit_enabled');
            $newPrefix = (string) ($request->input('footer_credit_prefix') ?? 'DESIGNED BY');
            $newName = (string) ($request->input('footer_credit_name') ?? 'PROJOSS');
            $newUrl = (string) ($request->input('footer_credit_url') ?? 'https://projoss.com/');

            $hasCreditChanges = (
                $prevEnabled !== $newEnabled ||
                trim($prevPrefix) !== trim($newPrefix) ||
                trim($prevName) !== trim($newName) ||
                trim($prevUrl) !== trim($newUrl)
            );

            if ($hasCreditChanges) {
                $code = $request->input('verification_code');
                if (! \App\Services\CreditSecurityService::verifyCode($code)) {
                    throw ValidationException::withMessages([
                        'verification_code' => 'অবৈধ অথবা মেয়াদোত্তীর্ণ সিকিউরিটি কোড! ফুটার ক্রেডিট পরিবর্তন বা বন্ধ করতে Projoss সাপোর্ট টিমের সাথে যোগাযোগ করুন।',
                    ]);
                }

                \App\Services\CreditSecurityService::burnAndRegenerateSeed();
            }
        }

        $this->persistSection($section, $data, $request);

        $payload = [
            'message' => $this->sectionLabel($section) . ' saved.',
            'section' => $section,
        ];

        if ($section === 'brand') {
            $payload['logo_url'] = logo_url();
            $payload['favicon_url'] = favicon_url();
            $payload['has_logo'] = has_custom_logo();
            $payload['has_favicon'] = (bool) ($request->boolean('remove_favicon') ? false : setting('favicon'));
        }

        if ($section === 'tracking') {
            $payload['tracking_active'] = tracking_any_enabled();
            $payload['tracking_labels'] = array_values(array_filter([
                tracking_gtm_id() ? 'GTM' : null,
                tracking_ga4_id() ? 'GA4' : null,
                tracking_meta_pixel_id() ? 'Meta Pixel' : null,
                tracking_meta_capi_enabled() ? 'Meta CAPI' : null,
                tracking_google_ads_id() ? 'Google Ads' : null,
                tracking_tiktok_pixel_id() ? 'TikTok Pixel' : null,
            ]));
        }

        if ($request->expectsJson()) {
            return response()->json($payload);
        }

        return back()->with('status', $payload['message']);
    }

    /** Send a test email to the admin using the current mail settings. */
    public function testMail(Request $request)
    {
        $to = $request->validate(['test_email' => ['required', 'email']])['test_email'];

        try {
            $overrides = [];
            foreach (['mail_mailer', 'mail_host', 'mail_port', 'mail_username', 'mail_password', 'mail_encryption', 'mail_from_address', 'mail_from_name'] as $field) {
                if ($request->filled($field)) {
                    $overrides[$field] = $request->input($field);
                }
            }

            $activeMailer = configure_mail_from_settings($overrides ?: null);

            $site = site_name();
            $mailerUpper = strtoupper($activeMailer);
            $hostDetail = ($activeMailer === 'smtp') ? ' (' . config('mail.mailers.smtp.host') . ':' . config('mail.mailers.smtp.port') . ')' : '';

            \Illuminate\Support\Facades\Mail::raw(
                "Congratulations! This is a test email from {$site}.\n\nYour {$mailerUpper} mail configuration is working perfectly.\nTimestamp: " . now()->toDateTimeString() . "\nRecipient: {$to}",
                fn ($m) => $m->to($to)->subject("Test Email from {$site} [Success]")
            );
        } catch (\Throwable $e) {
            $err = $e->getMessage();
            if ($request->expectsJson() || $request->ajax()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Send failed: ' . $err,
                    'error'   => $err,
                ], 422);
            }

            return back()->withErrors(['test_email' => 'Send failed: ' . $err]);
        }

        $where = ($activeMailer === 'smtp') ? "sent to {$to} via SMTP{$hostDetail}" : 'written to storage/logs/laravel.log (log mailer)';
        $message = "Test email successfully {$where}!";

        if ($request->expectsJson() || $request->ajax()) {
            return response()->json([
                'success' => true,
                'message' => $message,
                'mailer'  => $activeMailer,
            ]);
        }

        return back()->with('status', $message);
    }

    /** Send a sample order alert to the configured admin recipient(s). */
    public function testAdminOrderAlert(Request $request)
    {
        $recipients = $request->input('recipient')
            ?: $request->input('mail_admin_order_recipients')
            ?: setting('mail_admin_order_recipients')
            ?: setting('contact_email');

        if (empty($recipients)) {
            return response()->json([
                'success' => false,
                'message' => 'Please enter at least one recipient email address.',
            ], 422);
        }

        $emails = array_filter(array_map('trim', explode(',', (string) $recipients)), function ($e) {
            return filter_var($e, FILTER_VALIDATE_EMAIL);
        });

        if (empty($emails)) {
            return response()->json([
                'success' => false,
                'message' => 'No valid email address found in the recipient list.',
            ], 422);
        }

        try {
            configure_mail_from_settings();
            $tplKey = 'admin_new_order';
            $siteName = site_name();
            $sampleVars = \App\Services\EmailTemplateService::getSampleVariables($tplKey);

            $subject = \App\Services\EmailTemplateService::renderSubject($tplKey, $sampleVars) ?: "[Test Order Alert] #ORD-10024 — {$siteName}";
            $html = \App\Services\EmailTemplateService::renderHtml($tplKey, $sampleVars);

            foreach ($emails as $email) {
                \Illuminate\Support\Facades\Mail::html($html, function ($message) use ($email, $subject) {
                    $message->to($email)->subject($subject);
                });
            }

            return response()->json([
                'success' => true,
                'message' => 'Test admin order alert sent successfully to ' . implode(', ', $emails) . '!',
            ]);
        } catch (\Throwable $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to send test alert: ' . $e->getMessage(),
            ], 500);
        }
    }

    /** Send a test notification to Telegram using provided or saved credentials. */
    public function testTelegram(Request $request)
    {
        $token = $request->input('telegram_bot_token') ?: $request->input('bot_token') ?: setting('telegram_bot_token');
        $chatId = $request->input('telegram_chat_id') ?: $request->input('chat_id') ?: setting('telegram_chat_id');

        if (empty($token)) {
            return response()->json([
                'success' => false,
                'message' => 'Please enter a Telegram Bot Token first.',
            ], 422);
        }

        if (empty($chatId)) {
            return response()->json([
                'success' => false,
                'message' => 'Please enter a Telegram Chat ID first.',
            ], 422);
        }

        $result = \App\Services\TelegramService::sendTestNotification($token, $chatId);

        if ($request->expectsJson() || $request->ajax()) {
            return response()->json($result, $result['success'] ? 200 : 422);
        }

        if ($result['success']) {
            return back()->with('status', $result['message']);
        }

        return back()->withErrors(['telegram' => $result['message']]);
    }

    /** Auto-detect recent chat IDs where the Telegram bot received messages. */
    public function detectTelegramChatId(Request $request)
    {
        $token = $request->query('telegram_bot_token') ?: $request->query('bot_token') ?: $request->query('token') ?: setting('telegram_bot_token');

        $result = \App\Services\TelegramService::detectRecentChats($token);

        return response()->json($result);
    }

    /** Send a test event to Meta Conversions API (CAPI) using provided credentials. */
    public function testMetaCapi(Request $request)
    {
        $validated = $request->validate([
            'pixel_id'        => ['required', 'string'],
            'access_token'    => ['required', 'string'],
            'test_event_code' => ['nullable', 'string'],
        ]);

        $result = \App\Services\MetaCapiService::testConnection(
            $validated['pixel_id'],
            $validated['access_token'],
            $validated['test_event_code'] ?? null
        );

        if ($request->expectsJson() || $request->ajax()) {
            return response()->json($result, $result['success'] ? 200 : 422);
        }

        if ($result['success']) {
            return back()->with('status', $result['message']);
        }

        return back()->withErrors(['meta_capi' => $result['message']]);
    }

    private function rulesForSection(string $section): array
    {
        return match ($section) {
            'brand' => [
                'site_name'       => ['required', 'string', 'max:120'],
                'tagline'         => ['nullable', 'string', 'max:200'],
                'footer_text'     => ['nullable', 'string', 'max:400'],
                'contact_phone'   => ['nullable', 'string', 'max:60'],
                'contact_email'   => ['nullable', 'email', 'max:120'],
                'contact_address' => ['nullable', 'string', 'max:255'],
                'contact_hours'   => ['nullable', 'string', 'max:120'],
                'contact_title'   => ['nullable', 'string', 'max:120'],
                'contact_intro'   => ['nullable', 'string', 'max:255'],
                'facebook_url'    => ['nullable', 'string', 'max:255'],
                'instagram_url'   => ['nullable', 'string', 'max:255'],
                'twitter_url'     => ['nullable', 'string', 'max:255'],
                'search_placeholder' => ['nullable', 'string', 'max:120'],
                'footer_credit_enabled' => ['nullable', 'boolean'],
                'footer_credit_prefix'  => ['nullable', 'string', 'max:50'],
                'footer_credit_name'    => ['nullable', 'string', 'max:50'],
                'footer_credit_url'     => ['nullable', 'string', 'max:255'],
                'verification_code'     => ['nullable', 'string', 'max:100'],
                // Use mimes for reliable MIME-type validation of uploaded branding assets.
                'logo_file'       => ['nullable', 'file', 'mimes:png,jpg,jpeg,svg,webp', 'max:4096'],
                'favicon_file'    => ['nullable', 'file', 'mimes:png,jpg,jpeg,svg,webp,ico', 'max:2048'],
                'remove_logo'     => ['nullable', 'boolean'],
                'remove_favicon'  => ['nullable', 'boolean'],
            ],
            'chat' => [
                'chat_enabled'    => ['nullable', 'boolean'],
                'whatsapp_number' => ['nullable', 'string', 'max:40'],
                'call_number'     => ['nullable', 'string', 'max:40'],
                'messenger_page'  => ['nullable', 'string', 'max:255'],
            ],
            'homepage' => [
                'show_brands_marquee'        => ['nullable', 'boolean'],
                'review_screenshots_enabled' => ['nullable', 'boolean'],
                'brands_marquee'             => ['nullable', 'string', 'max:500'],
                'header_promo_text'   => ['nullable', 'string', 'max:200'],
                'header_promo_link'   => ['nullable', 'string', 'max:255'],
                'shop_subtitle'       => ['nullable', 'string', 'max:255'],
                'deal_ends_at'        => ['nullable', 'date'],
                'delivery_eta_text'   => ['nullable', 'string', 'max:120'],
                'homepage_tab_count'  => ['nullable', 'integer', 'min:1', 'max:8'],
                'home_categories_title' => ['nullable', 'string', 'max:80'],
                'home_hot_deal_title'   => ['nullable', 'string', 'max:80'],
                'home_featured_title'   => ['nullable', 'string', 'max:80'],
                'home_deal_week_title'  => ['nullable', 'string', 'max:80'],
                'home_tabs_title'       => ['nullable', 'string', 'max:80'],
                'home_brands_label'     => ['nullable', 'string', 'max:120'],
                'home_view_more_label'  => ['nullable', 'string', 'max:40'],
                'default_cta_text'      => ['nullable', 'string', 'max:40'],
                'product_cta_action'    => ['nullable', 'in:checkout,cart'],
                'hero_fallback_badge'   => ['nullable', 'string', 'max:40'],
                'hero_fallback_title'   => ['nullable', 'string', 'max:120'],
                'hero_fallback_subtitle'=> ['nullable', 'string', 'max:255'],
                // Popup Notification
                'popup_enabled'        => ['nullable', 'boolean'],
                'popup_text'           => ['nullable', 'string', 'max:400'],
                'popup_link'           => ['nullable', 'string', 'max:255'],
                'popup_btn_label'      => ['nullable', 'string', 'max:40'],
                'popup_delay_seconds'  => ['nullable', 'integer', 'min:0', 'max:60'],
                'popup_image_file'     => ['nullable', 'file', 'mimes:png,jpg,jpeg,webp,gif', 'max:2048'],
                'popup_remove_image'   => ['nullable', 'boolean'],
                'footer_text'          => ['nullable', 'string', 'max:500'],
            ],
            'storefront_ui' => [
                'footer_text'                          => ['nullable', 'string', 'max:500'],
                'product_card_preset'                  => ['nullable', 'string', 'in:preset-1,preset-2,preset-3,preset-4,preset-5'],
                'product_card_bg_color'                => ['nullable', 'string', 'max:20'],
                'product_card_text_color'              => ['nullable', 'string', 'max:20'],
                'product_card_btn_bg_color'            => ['nullable', 'string', 'max:20'],
                'product_card_btn_text_color'          => ['nullable', 'string', 'max:20'],
                'product_card_secondary_btn_bg_color'  => ['nullable', 'string', 'max:20'],
                'product_card_secondary_btn_text_color'=> ['nullable', 'string', 'max:20'],
                'product_card_buy_text'                => ['nullable', 'string', 'max:60'],
                'product_card_view_text'               => ['nullable', 'string', 'max:60'],
                'product_card_options_text'            => ['nullable', 'string', 'max:60'],
                'product_page_add_cart_text' => ['nullable', 'string', 'max:60'],
                'product_page_add_cart_bg_color' => ['nullable', 'string', 'max:20'],
                'product_page_add_cart_text_color' => ['nullable', 'string', 'max:20'],
                'product_page_buy_text'      => ['nullable', 'string', 'max:60'],
                'product_page_buy_bg_color'  => ['nullable', 'string', 'max:20'],
                'product_page_buy_text_color'=> ['nullable', 'string', 'max:20'],
                'product_cta_action'         => ['nullable', 'in:checkout,cart'],
                'default_cta_text'           => ['nullable', 'string', 'max:60'],

                // Cash on delivery button
                'product_page_cod_enabled'   => ['nullable', 'boolean'],
                'product_page_cod_text'      => ['nullable', 'string', 'max:80'],
                'product_page_cod_bg_color'  => ['nullable', 'string', 'max:20'],
                'product_page_cod_text_color'=> ['nullable', 'string', 'max:20'],

                // WhatsApp order button
                'product_page_whatsapp_enabled'    => ['nullable', 'boolean'],
                'product_page_whatsapp_text'       => ['nullable', 'string', 'max:80'],
                'product_page_whatsapp_number'     => ['nullable', 'string', 'max:40'],
                'product_page_whatsapp_bg_color'   => ['nullable', 'string', 'max:20'],
                'product_page_whatsapp_text_color' => ['nullable', 'string', 'max:20'],

                // Call for order button
                'product_page_call_enabled'        => ['nullable', 'boolean'],
                'product_page_call_text'           => ['nullable', 'string', 'max:80'],
                'product_page_call_number'         => ['nullable', 'string', 'max:40'],
                'product_page_call_bg_color'       => ['nullable', 'string', 'max:20'],
                'product_page_call_text_color'     => ['nullable', 'string', 'max:20'],
            ],
            'payments' => [
                'bkash_number'  => ['nullable', 'string', 'max:40'],
                'nagad_number'  => ['nullable', 'string', 'max:40'],
                'rocket_number' => ['nullable', 'string', 'max:40'],
                'pay_cod_enabled' => ['nullable', 'boolean'],
                'pay_bkash_enabled' => ['nullable', 'boolean'],
                'pay_nagad_enabled' => ['nullable', 'boolean'],
                'pay_rocket_enabled' => ['nullable', 'boolean'],
                'show_cards_in_footer' => ['nullable', 'boolean'],
                // COD: whether to show "Pay now (delivery)" breakdown on Thank You page
                'cod_delivery_upfront' => ['nullable', 'boolean'],
            ],
            'shipping' => [
                'shipping_inside_dhaka'  => ['required', 'numeric', 'min:0'],
                'shipping_outside_dhaka' => ['required', 'numeric', 'min:0'],
                'tax_percent'            => ['required', 'numeric', 'min:0', 'max:100'],
                'shipping_inside_label'  => ['nullable', 'string', 'max:80'],
                'shipping_outside_label' => ['nullable', 'string', 'max:120'],
                'currency_symbol'        => ['nullable', 'string', 'max:20'],
                'currency_code'          => ['nullable', 'string', 'max:10'],
                'fraud_order_time_limit_minutes' => ['nullable', 'numeric', 'min:0', 'max:1440'],
                'checkout_delivery_note_enabled' => ['nullable', 'boolean'],
                'checkout_delivery_note_label'   => ['nullable', 'string', 'max:120'],
            ],
            'mail' => [
                'otp_enabled'                         => ['nullable', 'boolean'],
                'mail_notify_password_reset'          => ['nullable', 'boolean'],
                'mail_admin_order_recipients'         => ['nullable', 'string', 'max:500'],
                'mail_notify_customer_order_placed'   => ['nullable', 'boolean'],
                'mail_notify_customer_order_verified' => ['nullable', 'boolean'],
                'mail_notify_admin_new_order'         => ['nullable', 'boolean'],
                'mail_notify_contact_message'         => ['nullable', 'boolean'],
                'mail_mailer'                         => ['required', 'in:log,smtp'],
                'mail_host'                           => ['nullable', 'string', 'max:120'],
                'mail_port'                           => ['nullable', 'numeric'],
                'mail_username'                       => ['nullable', 'string', 'max:180'],
                'mail_password'                       => ['nullable', 'string', 'max:180'],
                'mail_encryption'                     => ['nullable', 'in:tls,ssl,none'],
                'mail_from_address'                   => ['nullable', 'email', 'max:120'],
                'mail_from_name'                      => ['nullable', 'string', 'max:120'],
            ],
            'email_templates' => [],
            'telegram' => [
                'telegram_enabled'               => ['nullable', 'boolean'],
                'telegram_bot_token'             => ['nullable', 'string', 'max:120'],
                'telegram_chat_id'               => ['nullable', 'string', 'max:120'],
                'telegram_notify_order_placed'   => ['nullable', 'boolean'],
                'telegram_notify_order_verified' => ['nullable', 'boolean'],
                'telegram_include_items'         => ['nullable', 'boolean'],
                'telegram_custom_header'         => ['nullable', 'string', 'max:150'],
            ],
            'seo' => [
                'default_meta_title'       => ['nullable', 'string', 'max:180'],
                'default_meta_description' => ['nullable', 'string', 'max:400'],
                'default_meta_keywords'    => ['nullable', 'string', 'max:400'],
            ],
            'tracking' => [
                'tracking_gtm_id'               => ['nullable', 'string', 'max:30', 'regex:/^(|GTM-[A-Z0-9]+)$/i'],
                'tracking_ga4_id'               => ['nullable', 'string', 'max:30', 'regex:/^(|G-[A-Z0-9]+)$/i'],
                'tracking_ga4_api_secret'       => ['nullable', 'string', 'max:120'],
                'tracking_meta_pixel_id'        => ['nullable', 'string', 'max:30', 'regex:/^(|\d+)$/'],
                'tracking_meta_capi_enabled'    => ['nullable', 'boolean'],
                'tracking_meta_capi_token'      => ['nullable', 'string', 'max:2000'],
                'tracking_meta_test_event_code' => ['nullable', 'string', 'max:50'],
                'meta_domain_verification'      => ['nullable', 'string', 'max:500'],
                'tracking_google_ads_id'        => ['nullable', 'string', 'max:50'],
                'tracking_google_ads_label'     => ['nullable', 'string', 'max:100'],
                'tracking_tiktok_pixel_id'      => ['nullable', 'string', 'max:50'],
                'custom_header_scripts'         => ['nullable', 'string', 'max:50000'],
                'custom_body_scripts'           => ['nullable', 'string', 'max:50000'],
            ],
            'legal' => [
                'terms_content'   => ['nullable', 'string', 'max:20000'],
                'privacy_content' => ['nullable', 'string', 'max:20000'],
                'refund_content'  => ['nullable', 'string', 'max:20000'],
            ],
            'courier' => [
                'courier_default'          => ['nullable', 'in:steadfast,pathao,redx'],
                'steadfast_api_key'        => ['nullable', 'string', 'max:120'],
                'steadfast_secret_key'     => ['nullable', 'string', 'max:120'],
                'pathao_environment'       => ['nullable', 'in:live,sandbox'],
                'pathao_client_id'         => ['nullable', 'string', 'max:120'],
                'pathao_client_secret'     => ['nullable', 'string', 'max:120'],
                'pathao_username'          => ['nullable', 'string', 'max:120'],
                'pathao_password'          => ['nullable', 'string', 'max:120'],
                'pathao_store_id'          => ['nullable', 'string', 'max:120'],
                'redx_api_token'           => ['nullable', 'string', 'max:240'],
            ],
            'fake_order_guard' => [
                'fog_enabled'                      => ['nullable', 'boolean'],
                'fog_ip_block_enabled'             => ['nullable', 'boolean'],
                'fog_device_block_enabled'         => ['nullable', 'boolean'],
                'fog_phone_block_enabled'          => ['nullable', 'boolean'],
                'fog_fake_number_block_enabled'    => ['nullable', 'boolean'],
                'fog_ip_cooldown_minutes'          => ['nullable', 'integer', 'min:0', 'max:1440'],
                'fog_phone_cooldown_minutes'       => ['nullable', 'integer', 'min:0', 'max:1440'],
                'fog_max_orders_per_phone'         => ['nullable', 'integer', 'min:0', 'max:100'],
                'fog_auto_block_ip_on_cancel'      => ['nullable', 'boolean'],
                // BD Courier
                'fog_bdcourier_enabled'            => ['nullable', 'boolean'],
                'fog_bdcourier_api_key'            => ['nullable', 'string', 'max:200'],
                'fog_bdcourier_auto_check_checkout'=> ['nullable', 'boolean'],
                'fog_bdcourier_min_success_rate'   => ['nullable', 'integer', 'min:0', 'max:100'],
                'fog_bdcourier_block_risk_levels'  => ['nullable', 'string', 'max:100'],
            ],
            'admin_theme' => [
                'admin_theme_preset'  => ['nullable', 'string', 'max:50'],
                'admin_primary_color' => ['nullable', 'string', 'max:20'],
                'admin_link_color'    => ['nullable', 'string', 'max:20'],
                'admin_sidebar_style' => ['nullable', 'string', 'in:light,dark'],
                'header_template'     => ['nullable', 'string', 'in:modern_tabbed,classic_dark'],
                'header_nav_bg'       => ['nullable', 'string', 'max:20'],
                'header_nav_text'     => ['nullable', 'string', 'max:20'],
                'header_nav_hover'    => ['nullable', 'string', 'max:20'],
            ],
            default => throw ValidationException::withMessages(['section' => 'Unknown settings section.']),
        };
    }

    private function persistSection(string $section, array $data, Request $request): void
    {
        $keys = match ($section) {
            'brand' => [
                'site_name', 'tagline', 'footer_text',
                'contact_phone', 'contact_email', 'contact_address',
                'contact_hours', 'contact_title', 'contact_intro',
                'facebook_url', 'instagram_url', 'twitter_url',
                'search_placeholder',
                'footer_credit_prefix', 'footer_credit_name', 'footer_credit_url',
            ],
            'chat' => [
                'chat_enabled', 'whatsapp_number', 'call_number', 'messenger_page',
            ],

            'homepage' => [
                'brands_marquee', 'header_promo_text', 'header_promo_link',
                'shop_subtitle', 'delivery_eta_text', 'homepage_tab_count',
                'home_categories_title', 'home_hot_deal_title', 'home_featured_title',
                'home_deal_week_title', 'home_tabs_title', 'home_brands_label',
                'home_view_more_label', 'default_cta_text', 'product_cta_action',
                'hero_fallback_badge', 'hero_fallback_title', 'hero_fallback_subtitle',
                'popup_text', 'popup_link', 'popup_btn_label', 'popup_delay_seconds',
                'footer_text',
            ],
            'storefront_ui' => [
                'footer_text',
                'product_card_preset',
                'product_card_bg_color', 'product_card_text_color',
                'product_card_btn_bg_color', 'product_card_btn_text_color',
                'product_card_secondary_btn_bg_color', 'product_card_secondary_btn_text_color',
                'product_card_buy_text', 'product_card_view_text', 'product_card_options_text',
                'product_page_add_cart_text', 'product_page_add_cart_bg_color', 'product_page_add_cart_text_color',
                'product_page_buy_text', 'product_page_buy_bg_color', 'product_page_buy_text_color',
                'product_page_cod_text', 'product_page_cod_bg_color', 'product_page_cod_text_color',
                'product_page_whatsapp_text', 'product_page_whatsapp_number', 'product_page_whatsapp_bg_color', 'product_page_whatsapp_text_color',
                'product_page_call_text', 'product_page_call_number', 'product_page_call_bg_color', 'product_page_call_text_color',
                'product_cta_action', 'default_cta_text',
            ],
            'payments' => ['bkash_number', 'nagad_number', 'rocket_number'],
            'shipping' => [
                'shipping_inside_dhaka', 'shipping_outside_dhaka', 'tax_percent',
                'shipping_inside_label', 'shipping_outside_label',
                'currency_symbol', 'currency_code', 'fraud_order_time_limit_minutes',
                'checkout_delivery_note_label',
            ],
            'mail' => [
                'mail_mailer', 'mail_host', 'mail_port', 'mail_username',
                'mail_encryption', 'mail_from_address', 'mail_from_name',
                'mail_admin_order_recipients',
            ],
            'email_templates' => [],
            'telegram' => [
                'telegram_bot_token',
                'telegram_chat_id',
                'telegram_custom_header',
            ],
            'seo' => ['default_meta_title', 'default_meta_description', 'default_meta_keywords'],
            'tracking' => [
                'tracking_gtm_id', 'tracking_ga4_id', 'tracking_ga4_api_secret', 'tracking_meta_pixel_id',
                'tracking_meta_capi_token', 'tracking_meta_test_event_code',
                'meta_domain_verification', 'tracking_google_ads_id',
                'tracking_google_ads_label', 'tracking_tiktok_pixel_id',
                'custom_header_scripts', 'custom_body_scripts',
            ],
            'legal' => ['terms_content', 'privacy_content', 'refund_content'],
            'courier' => [
                'courier_default', 'steadfast_api_key', 'steadfast_secret_key',
                'pathao_environment', 'pathao_client_id', 'pathao_client_secret', 'pathao_username', 'pathao_password', 'pathao_store_id',
                'redx_api_token',
            ],
            'fake_order_guard' => [
                'fog_ip_cooldown_minutes', 'fog_phone_cooldown_minutes', 'fog_max_orders_per_phone',
                'fog_bdcourier_api_key', 'fog_bdcourier_min_success_rate', 'fog_bdcourier_block_risk_levels',
            ],
            'admin_theme' => [
                'admin_theme_preset', 'admin_primary_color', 'admin_link_color', 'admin_sidebar_style', 'header_template',
                'header_nav_bg', 'header_nav_text', 'header_nav_hover',
            ],
            default => [],
        };

        foreach ($keys as $key) {
            if (! array_key_exists($key, $data)) {
                continue;
            }
            $value = (string) ($data[$key] ?? '');
            if (in_array($key, ['tracking_gtm_id', 'tracking_ga4_id'], true) && $value !== '') {
                $value = strtoupper($value);
            }
            Setting::put($key, $value);
        }

        if ($section === 'brand') {
            Setting::put('footer_credit_enabled', $request->boolean('footer_credit_enabled') ? '1' : '0');
        }

        if ($section === 'shipping') {
            Setting::put('checkout_delivery_note_enabled', $request->boolean('checkout_delivery_note_enabled') ? '1' : '0');
        }

        if ($section === 'tracking') {
            Setting::put('tracking_meta_capi_enabled', $request->boolean('tracking_meta_capi_enabled') ? '1' : '0');
        }

        if ($section === 'storefront_ui') {
            Setting::put('product_page_cod_enabled', $request->boolean('product_page_cod_enabled') ? '1' : '0');
            Setting::put('product_page_whatsapp_enabled', $request->boolean('product_page_whatsapp_enabled') ? '1' : '0');
            Setting::put('product_page_call_enabled', $request->boolean('product_page_call_enabled') ? '1' : '0');
            if ($request->filled('product_card_buy_text')) {
                Setting::put('default_cta_text', (string) $request->input('product_card_buy_text'));
            }
        }

        if ($section === 'admin_theme') {
            if (!empty($data['admin_primary_color'])) {
                $oldCartBg = setting('product_page_add_cart_bg_color');
                if (!$oldCartBg || in_array(strtolower($oldCartBg), ['#f15a24', '#f97316'])) {
                    Setting::put('product_page_add_cart_bg_color', $data['admin_primary_color']);
                }
            }
        }

        if ($section === 'mail') {
            $customerPlaced = $request->boolean('mail_notify_customer_order_placed') ? '1' : '0';
            $customerVerified = $request->boolean('mail_notify_customer_order_verified') ? '1' : '0';
            $adminOrder = $request->boolean('mail_notify_admin_new_order') ? '1' : '0';
            $otp = $request->boolean('otp_enabled') ? '1' : '0';
            $passwordReset = $request->boolean('mail_notify_password_reset') ? '1' : '0';
            $contact = $request->boolean('mail_notify_contact_message') ? '1' : '0';

            Setting::put('otp_enabled', $otp);
            Setting::put('mail_notify_password_reset', $passwordReset);
            Setting::put('mail_notify_customer_order_placed', $customerPlaced);
            Setting::put('mail_notify_customer_order_verified', $customerVerified);
            Setting::put('mail_notify_admin_new_order', $adminOrder);
            Setting::put('mail_notify_contact_message', $contact);

            // Keep EmailTemplateService is_enabled synchronized
            Setting::put('email_tpl_order_placed_is_enabled', $customerPlaced);
            Setting::put('email_tpl_order_verified_is_enabled', $customerVerified);
            Setting::put('email_tpl_admin_new_order_is_enabled', $adminOrder);
            Setting::put('email_tpl_otp_is_enabled', $otp);
            Setting::put('email_tpl_password_reset_is_enabled', $passwordReset);
            Setting::put('email_tpl_contact_message_is_enabled', $contact);

            // mail_password is purposefully excluded from $keys above so leaving it blank in the form does not overwrite an existing password
            if ($request->filled('mail_password')) {
                Setting::put('mail_password', (string) $request->input('mail_password'));
            }
        }

        if ($section === 'telegram') {
            Setting::put('telegram_enabled', $request->boolean('telegram_enabled') ? '1' : '0');
            Setting::put('telegram_notify_order_placed', $request->boolean('telegram_notify_order_placed') ? '1' : '0');
            Setting::put('telegram_notify_order_verified', $request->boolean('telegram_notify_order_verified') ? '1' : '0');
            Setting::put('telegram_include_items', $request->boolean('telegram_include_items') ? '1' : '0');
        }

        if ($section === 'homepage') {
            Setting::put('show_brands_marquee', $request->boolean('show_brands_marquee') ? '1' : '0');
            Setting::put('review_screenshots_enabled', $request->boolean('review_screenshots_enabled') ? '1' : '0');
            Setting::put('popup_enabled', $request->boolean('popup_enabled') ? '1' : '0');
            foreach (['deal_ends_at'] as $dtKey) {
                if ($request->filled($dtKey)) {
                    $raw = str_replace('T', ' ', (string) $request->input($dtKey));
                    if (strlen($raw) === 16) {
                        $raw .= ':00';
                    }
                    Setting::put($dtKey, $raw);
                } elseif (array_key_exists($dtKey, $data)) {
                    Setting::put($dtKey, '');
                }
            }
            // Popup image upload/remove
            if ($request->boolean('popup_remove_image')) {
                $this->deleteStored(Setting::get('popup_image'));
                Setting::put('popup_image', '');
            } elseif ($request->hasFile('popup_image_file')) {
                $path = PublicUploader::storeFromRequest($request, 'popup_image_file', 'popups', 'webp');
                if ($path) {
                    $this->deleteStored(Setting::get('popup_image'));
                    Setting::put('popup_image', $path);
                }
            }
        }

        if ($section === 'payments') {
                        Setting::put('pay_cod_enabled', $request->boolean('pay_cod_enabled') ? '1' : '0');
            Setting::put('pay_bkash_enabled', $request->boolean('pay_bkash_enabled') ? '1' : '0');
            Setting::put('pay_nagad_enabled', $request->boolean('pay_nagad_enabled') ? '1' : '0');
            Setting::put('pay_rocket_enabled', $request->boolean('pay_rocket_enabled') ? '1' : '0');
Setting::put('show_cards_in_footer', $request->boolean('show_cards_in_footer') ? '1' : '0');
        }

        if ($section === 'fake_order_guard') {
            Setting::put('fog_enabled',                    $request->boolean('fog_enabled') ? '1' : '0');
            Setting::put('fog_ip_block_enabled',           $request->boolean('fog_ip_block_enabled') ? '1' : '0');
            Setting::put('fog_device_block_enabled',       $request->boolean('fog_device_block_enabled') ? '1' : '0');
            Setting::put('fog_phone_block_enabled',        $request->boolean('fog_phone_block_enabled') ? '1' : '0');
            Setting::put('fog_fake_number_block_enabled',  $request->boolean('fog_fake_number_block_enabled') ? '1' : '0');
            Setting::put('fog_auto_block_ip_on_cancel',    $request->boolean('fog_auto_block_ip_on_cancel') ? '1' : '0');
            // BD Courier
            Setting::put('fog_bdcourier_enabled',             $request->boolean('fog_bdcourier_enabled') ? '1' : '0');
            Setting::put('fog_bdcourier_auto_check_checkout', $request->boolean('fog_bdcourier_auto_check_checkout') ? '1' : '0');
            if ($request->filled('fog_bdcourier_api_key')) {
                Setting::put('fog_bdcourier_api_key', (string) $request->input('fog_bdcourier_api_key'));
            }
        }

        if ($section === 'brand') {
            $this->handleImage($request, 'logo_file', 'logo', 'remove_logo');
            $this->handleImage($request, 'favicon_file', 'favicon', 'remove_favicon');
        }
    }

    private function sectionLabel(string $section): string
    {
        return match ($section) {
            'brand' => 'Brand & identity',
            'chat' => 'Floating chat',
            'homepage' => 'Homepage',
            'payments' => 'Payments',
            'shipping' => 'Shipping & tax',
            'mail' => 'Email & OTP',
            'seo' => 'SEO defaults',
            'tracking' => 'Marketing & analytics',
            'legal' => 'Legal pages',
            'courier'           => 'Courier APIs',
            'fake_order_guard'  => 'Fake Order Guard',
            'admin_theme'       => 'Admin Theme & Colors',
            'email_templates'   => 'Email Templates',
            'telegram'          => 'Telegram Notifications',
            default             => 'Settings',
        };
    }

    private function handleImage(Request $request, string $fileField, string $settingKey, string $removeField): void
    {
        if ($request->boolean($removeField)) {
            $this->deleteStored(Setting::get($settingKey));
            Setting::put($settingKey, '');

            return;
        }

        $path = PublicUploader::storeFromRequest($request, $fileField, 'branding', 'png');
        if ($path) {
            $this->deleteStored(Setting::get($settingKey));
            Setting::put($settingKey, $path);
        }
    }

    private function deleteStored(?string $path): void
    {
        if (! $path || str_starts_with($path, 'http')) {
            return;
        }

        $relative = ltrim($path, '/');
        if (str_starts_with($relative, 'uploads/')) {
            PublicUploader::delete($relative);

            return;
        }

        Storage::disk('public')->delete($relative);
    }
}