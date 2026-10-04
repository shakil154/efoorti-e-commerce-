<?php

namespace App\Http\Middleware;

use App\Models\ContactMessage;
use App\Models\Order;
use App\Models\ProductReview;
use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that is loaded on the first page visit.
     */
    protected $rootView = 'app';

    /**
     * Determine the current asset version.
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     */
    public function share(Request $request): array
    {
        $isAdmin = $request->is('admin*');
        $cartService = app(\App\Services\CartService::class);

        return array_merge(parent::share($request), [
            'auth' => [
                'user' => $request->user() ? [
                    'id'             => $request->user()->id,
                    'name'           => $request->user()->name,
                    'email'          => $request->user()->email,
                    'role'           => $request->user()->role ?? 'customer',
                    'permissions'    => $request->user()->permissions ?? [],
                    'is_super_admin' => $request->user()->isSuperAdmin(),
                ] : null,
            ],
            'flash' => [
                'status' => fn () => $request->session()->get('status'),
                'error'  => fn () => $request->session()->get('error'),
                'cart_open' => fn () => $request->session()->get('cart_open'),
            ],
            'errors' => fn () => $request->session()->get('errors')
                ? $request->session()->get('errors')->getBag('default')->getMessages()
                : (object) [],
            'testing_mode' => testing_mode(),
            'app' => [
                'name'            => site_name(),
                'logo_url'        => logo_url(),
                'has_custom_logo' => has_custom_logo(),
                'favicon_url'     => favicon_url(),
                'currency_symbol' => setting('currency_symbol', '৳'),
                'footer_text'     => setting('footer_text', 'Your one-stop marketplace for quality products at great prices. We deliver the best items directly to your doorstep with care.'),
                'header_template' => setting('header_template', 'modern_tabbed'),
                'header_nav_bg'   => setting('header_nav_bg', ''),
                'header_nav_text' => setting('header_nav_text', ''),
                'header_nav_hover'=> setting('header_nav_hover', ''),
                'settings'        => [
                    'header_template'  => setting('header_template', 'modern_tabbed'),
                    'header_nav_bg'    => setting('header_nav_bg', ''),
                    'header_nav_text'  => setting('header_nav_text', ''),
                    'header_nav_hover' => setting('header_nav_hover', ''),
                    'footer_text'      => setting('footer_text', 'Your one-stop marketplace for quality products at great prices. We deliver the best items directly to your doorstep with care.'),
                    'footer_credit_enabled' => setting('footer_credit_enabled', '1') !== '0',
                    'footer_credit_prefix'  => setting('footer_credit_prefix', 'DESIGNED BY'),
                    'footer_credit_name'    => setting('footer_credit_name', 'PROJOSS'),
                    'footer_credit_url'     => setting('footer_credit_url', 'https://projoss.com/'),
                    'chat_enabled'     => setting('chat_enabled', '1') === '1',
                    'whatsapp_number'  => setting('whatsapp_number', ''),
                    'call_number'      => setting('call_number', ''),
                    'messenger_page'   => setting('messenger_page', ''),
                    'contact_phone'    => setting('contact_phone', ''),
                    'facebook_url'     => setting('facebook_url', ''),
                    'instagram_url'    => setting('instagram_url', ''),
                    'twitter_url'      => setting('twitter_url', ''),
                    'product_card_preset'                  => setting('product_card_preset', 'preset-1'),
                    'product_card_bg_color'                => setting('product_card_bg_color', '#FFFFFF'),
                    'product_card_text_color'              => setting('product_card_text_color', '#111827'),
                    'product_card_btn_bg_color'            => setting('product_card_btn_bg_color', '#f15a24'),
                    'product_card_btn_text_color'          => setting('product_card_btn_text_color', '#ffffff'),
                    'product_card_secondary_btn_bg_color'  => setting('product_card_secondary_btn_bg_color', '#e11d48'),
                    'product_card_secondary_btn_text_color'=> setting('product_card_secondary_btn_text_color', '#ffffff'),
                    'product_card_buy_text'                => setting('product_card_buy_text', setting('default_cta_text', 'অর্ডার করুন')),
                    'product_card_view_text'               => setting('product_card_view_text', 'বিস্তারিত দেখুন'),
                    'product_card_options_text'            => setting('product_card_options_text', setting('product_card_buy_text', 'অর্ডার করুন')),
                    'product_cta_action'                   => setting('product_cta_action', 'checkout'),
                    'product_card_shadow_style'            => setting('product_card_shadow_style', 'subtle'),
                    'product_card_shadow_color'            => setting('product_card_shadow_color', '#000000'),
                    'product_card_border_color'            => setting('product_card_border_color', '#f1f5f9'),
                    'product_card_border_radius'           => setting('product_card_border_radius', 'preset-default'),
                    
                    // Product Page Action Buttons
                    'product_page_add_cart_text'       => setting('product_page_add_cart_text', 'ADD TO CART'),
                    'product_page_add_cart_bg_color'   => setting('product_page_add_cart_bg_color', '#f15a24'),
                    'product_page_add_cart_text_color' => setting('product_page_add_cart_text_color', '#ffffff'),
                    
                    'product_page_buy_text'            => setting('product_page_buy_text', 'ORDER NOW'),
                    'product_page_buy_bg_color'        => setting('product_page_buy_bg_color', '#0b1c21'),
                    'product_page_buy_text_color'      => setting('product_page_buy_text_color', '#ffffff'),

                    'product_page_cod_enabled'         => setting('product_page_cod_enabled', '1') === '1',
                    'product_page_cod_text'            => setting('product_page_cod_text', 'ক্যাশ অন ডেলিভারিতে অর্ডার করুন'),
                    'product_page_cod_bg_color'        => setting('product_page_cod_bg_color', '#16a34a'),
                    'product_page_cod_text_color'      => setting('product_page_cod_text_color', '#ffffff'),

                    'product_page_whatsapp_enabled'    => setting('product_page_whatsapp_enabled', '1') === '1',
                    'product_page_whatsapp_text'       => setting('product_page_whatsapp_text', 'WhatsApp Order'),
                    'product_page_whatsapp_number'     => setting('product_page_whatsapp_number', setting('whatsapp_number', '')),
                    'product_page_whatsapp_bg_color'   => setting('product_page_whatsapp_bg_color', '#25D366'),
                    'product_page_whatsapp_text_color' => setting('product_page_whatsapp_text_color', '#ffffff'),

                    'product_page_call_enabled'        => setting('product_page_call_enabled', '1') === '1',
                    'product_page_call_text'           => setting('product_page_call_text', 'Call For Order'),
                    'product_page_call_number'         => setting('product_page_call_number', setting('call_number', setting('contact_phone', ''))),
                    'product_page_call_bg_color'       => setting('product_page_call_bg_color', '#294294'),
                    'product_page_call_text_color'     => setting('product_page_call_text_color', '#ffffff'),

                    // Mobile Sticky Bottom Action Bar
                    'product_mobile_sticky_enabled'             => setting('product_mobile_sticky_enabled', '1') === '1',
                    'product_mobile_sticky_add_cart_text'       => setting('product_mobile_sticky_add_cart_text', 'কার্টে রাখুন'),
                    'product_mobile_sticky_add_cart_bg_color'   => setting('product_mobile_sticky_add_cart_bg_color', '#ffffff'),
                    'product_mobile_sticky_add_cart_text_color' => setting('product_mobile_sticky_add_cart_text_color', '#f43f5e'),
                    'product_mobile_sticky_add_cart_border_color'=> setting('product_mobile_sticky_add_cart_border_color', '#f43f5e'),
                    'product_mobile_sticky_buy_text'            => setting('product_mobile_sticky_buy_text', 'অর্ডার করুন'),
                    'product_mobile_sticky_buy_bg_color'        => setting('product_mobile_sticky_buy_bg_color', '#f43f5e'),
                    'product_mobile_sticky_buy_text_color'      => setting('product_mobile_sticky_buy_text_color', '#ffffff'),

                    'ship_inside'  => (float) setting('shipping_inside_dhaka', 60),
                    'ship_outside' => (float) setting('shipping_outside_dhaka', 120),
                    'ship_inside_label'  => setting('shipping_inside_label', 'ঢাকার ভেতরে'),
                    'ship_outside_label' => setting('shipping_outside_label', 'ঢাকার বাইরে'),
                    'pay_cod_enabled'    => setting('pay_cod_enabled', '1') === '1',
                    'show_cards_in_footer' => setting('show_cards_in_footer', '0') === '1',
                    'pay_bkash_enabled'    => setting('pay_bkash_enabled', '1') === '1',
                    'pay_nagad_enabled'    => setting('pay_nagad_enabled', '1') === '1',
                    'pay_rocket_enabled'   => setting('pay_rocket_enabled', '1') === '1',
                    'bkash_number'         => setting('bkash_number', ''),
                    'nagad_number'         => setting('nagad_number', ''),
                    'rocket_number'        => setting('rocket_number', ''),
                    'currency_symbol'    => setting('currency_symbol', '৳'),
                    // Whether to show "Pay now (delivery)" split on Thank You page
                    'cod_delivery_upfront' => setting('cod_delivery_upfront', '1') === '1',
                    // Delivery note field in checkout & popup
                    'checkout_delivery_note_enabled' => setting('checkout_delivery_note_enabled', '1') === '1',
                    'checkout_delivery_note_label'   => setting('checkout_delivery_note_label', 'ডেলিভারি সংক্রান্ত বিশেষ নোট (ঐচ্ছিক)'),
                ],
            ],
            'admin_badges' => fn () => $isAdmin && $request->user() ? [
                'pending_orders'  => Order::where('payment_status', 'pending')->count(),
                'pending_reviews' => ProductReview::pending()->count(),
                'new_messages'    => ContactMessage::new()->count(),
            ] : null,
            'admin_theme' => fn () => $isAdmin ? [
                'preset'        => setting('admin_theme_preset', 'orange'),
                'primary_color' => setting('admin_primary_color', '#f97316'),
                'link_color'    => setting('admin_link_color', ''),
                'sidebar_style' => setting('admin_sidebar_style', 'light'),
            ] : null,
            'brand_theme' => [
                'preset'        => setting('admin_theme_preset', 'orange'),
                'primary_color' => setting('admin_primary_color', '#f97316'),
                'link_color'    => setting('admin_link_color', ''),
            ],
            'cartCount' => fn () => $isAdmin ? 0 : $cartService->count(),
            'cartItems' => fn () => $isAdmin ? collect() : $cartService->items(),
            'cartSubtotal' => fn () => $isAdmin ? 0.0 : $cartService->subtotal(),
            'categories' => fn () => $isAdmin ? [] : \App\Models\Category::whereNull('parent_id')
                ->with(['children' => fn($q) => $q->where('is_active', true)->select('id', 'name', 'slug', 'parent_id', 'icon', 'image')])
                ->where('is_active', true)
                ->orderBy('position')
                ->get(['id', 'name', 'slug', 'parent_id', 'icon', 'image'])
                ->values()
                ->toArray(),
            'hasFlashSale' => fn () => $isAdmin ? false : \App\Models\Product::published()->where('is_flash_sale', true)->exists(),
            'promoText' => fn () => $isAdmin ? '' : setting('header_promo_text', ''),
            'promoLink' => fn () => $isAdmin ? '' : setting('header_promo_link', ''),
            'popup' => fn () => $isAdmin ? ['enabled' => false] : [
                'enabled'       => setting('popup_enabled', '0') === '1',
                'title'         => setting('popup_title', ''),
                'text'          => setting('popup_text', ''),
                'image'         => setting('popup_image') ? (str_starts_with(setting('popup_image'), 'http') ? setting('popup_image') : asset(setting('popup_image'))) : '',
                'link'          => setting('popup_link', ''),
                'delay_seconds' => (int) setting('popup_delay_seconds', '3'),
                'btn_label'     => setting('popup_btn_label', 'Shop Now'),
                'frequency'     => setting('popup_frequency', 'once_per_session'),
            ],
        ]);
    }
}
