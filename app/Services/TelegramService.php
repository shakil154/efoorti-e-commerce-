<?php

namespace App\Services;

use App\Models\Order;
use App\Models\Setting;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class TelegramService
{
    private const TELEGRAM_API_BASE = 'https://api.telegram.org/bot';

    /**
     * Check if Telegram notifications are enabled and configured.
     */
    public static function isEnabled(): bool
    {
        return (string) Setting::get('telegram_enabled', '0') === '1'
            && ! empty(self::getBotToken())
            && ! empty(self::getChatId());
    }

    public static function getBotToken(): string
    {
        return trim((string) Setting::get('telegram_bot_token', ''));
    }

    public static function getChatId(): string
    {
        return trim((string) Setting::get('telegram_chat_id', ''));
    }

    /**
     * Send a message to Telegram.
     */
    public static function sendMessage(
        string $text,
        ?array $inlineKeyboard = null,
        ?string $chatId = null,
        ?string $botToken = null
    ): array {
        $token = trim((string) ($botToken ?: self::getBotToken()));
        $targetChat = trim((string) ($chatId ?: self::getChatId()));

        if (empty($token)) {
            return ['success' => false, 'message' => 'Telegram Bot Token is not configured.'];
        }

        if (empty($targetChat)) {
            return ['success' => false, 'message' => 'Telegram Chat ID is not configured.'];
        }

        $endpoint = self::TELEGRAM_API_BASE . $token . '/sendMessage';

        $payload = [
            'chat_id'                  => $targetChat,
            'text'                     => $text,
            'parse_mode'               => 'HTML',
            'disable_web_page_preview' => true,
        ];

        if (! empty($inlineKeyboard)) {
            $payload['reply_markup'] = json_encode([
                'inline_keyboard' => $inlineKeyboard,
            ]);
        }

        try {
            $response = Http::timeout(12)
                ->connectTimeout(5)
                ->asForm()
                ->post($endpoint, $payload);

            $result = $response->json();

            if ($response->successful() && ! empty($result['ok'])) {
                return [
                    'success'    => true,
                    'message'    => 'Telegram notification sent successfully.',
                    'message_id' => $result['result']['message_id'] ?? null,
                ];
            }

            $description = $result['description'] ?? ('HTTP Status ' . $response->status());
            Log::warning("Telegram notification failed: {$description}");

            return [
                'success' => false,
                'message' => 'Telegram API error: ' . $description,
                'code'    => $result['error_code'] ?? $response->status(),
            ];
        } catch (\Throwable $e) {
            Log::warning('Telegram HTTP request error: ' . $e->getMessage());

            return [
                'success' => false,
                'message' => 'Connection error: ' . $e->getMessage(),
            ];
        }
    }

    /**
     * Send a formatted new-order alert to Telegram.
     */
    public static function sendOrderNotification(Order $order): bool
    {
        if (! self::isEnabled()) {
            return false;
        }

        // Check if order placed alert is enabled
        if ((string) Setting::get('telegram_notify_order_placed', '1') === '0') {
            return false;
        }

        $order->loadMissing('items');

        $site = site_name();
        $orderNumber = htmlspecialchars($order->order_number, ENT_QUOTES, 'UTF-8');
        $customerName = htmlspecialchars($order->customer_name ?: 'Valued Customer', ENT_QUOTES, 'UTF-8');
        $phone = preg_replace('/[^\d+]/', '', (string) $order->customer_phone);
        $phoneDisplay = htmlspecialchars($order->customer_phone ?: '—', ENT_QUOTES, 'UTF-8');
        $address = htmlspecialchars(($order->shipping_address ?: '—') . ($order->city ? ', ' . $order->city : ''), ENT_QUOTES, 'UTF-8');
        $payment = htmlspecialchars($order->paymentMethodLabel(), ENT_QUOTES, 'UTF-8');
        $total = money($order->total);
        $time = now()->format('d M Y, h:i A');

        $customHeader = trim((string) Setting::get('telegram_custom_header', ''));
        $header = $customHeader ?: "🛍️ <b>NEW ORDER RECEIVED!</b>";

        $lines = [
            $header,
            "━━━━━━━━━━━━━━━━━━━━━━",
            "📦 <b>Order:</b> #<code>{$orderNumber}</code>",
            "💰 <b>Total:</b> <b>{$total}</b> ({$payment})",
            "",
            "👤 <b>Customer Information:</b>",
            "• <b>Name:</b> {$customerName}",
            "• <b>Phone:</b> <a href=\"tel:{$phone}\">{$phoneDisplay}</a>",
            "• <b>Address:</b> {$address}",
        ];

        // Delivery Note if present
        if (! empty($order->delivery_note)) {
            $note = htmlspecialchars($order->delivery_note, ENT_QUOTES, 'UTF-8');
            $lines[] = "• <b>Note:</b> <i>{$note}</i>";
        }

        // Items list if enabled
        $includeItems = (string) Setting::get('telegram_include_items', '1') !== '0';
        if ($includeItems && $order->items->isNotEmpty()) {
            $lines[] = "";
            $lines[] = "🛒 <b>Ordered Items (" . $order->items->count() . "):</b>";
            $i = 1;
            foreach ($order->items as $item) {
                $pName = htmlspecialchars($item->product_name, ENT_QUOTES, 'UTF-8');
                $variant = $item->variant ? ' (' . htmlspecialchars($item->variant, ENT_QUOTES, 'UTF-8') . ')' : '';
                $itemTotal = money($item->line_total);
                $lines[] = "{$i}. {$pName}{$variant} × <b>{$item->quantity}</b> — {$itemTotal}";
                $i++;
            }
        }

        $lines[] = "";
        $lines[] = "⏰ <b>Time:</b> {$time}";
        $lines[] = "🏪 <b>Store:</b> {$site}";
        $lines[] = "━━━━━━━━━━━━━━━━━━━━━━";

        $text = implode("\n", $lines);

        // Buttons (Telegram inline keyboard strictly requires http://, https://, or tg:// URLs)
        $keyboard = [];
        $adminOrderUrl = route('admin.orders.show', $order);

        $row1 = [
            ['text' => '🔍 View Order', 'url' => $adminOrderUrl],
        ];

        // Add WhatsApp direct chat button if phone number is present
        $cleanDigits = preg_replace('/[^\d]/', '', (string) $order->customer_phone);
        if (! empty($cleanDigits)) {
            $waNumber = (str_starts_with($cleanDigits, '01') && strlen($cleanDigits) === 11)
                ? ('88' . $cleanDigits)
                : $cleanDigits;
            $row1[] = ['text' => '💬 WhatsApp', 'url' => 'https://wa.me/' . $waNumber];
        }

        $keyboard[] = $row1;
        $keyboard[] = [
            ['text' => '🌐 Visit Website', 'url' => url('/')],
        ];

        $res = self::sendMessage($text, $keyboard);

        return $res['success'];
    }

    /**
     * Send order verified alert to Telegram if enabled.
     */
    public static function sendOrderVerifiedNotification(Order $order): bool
    {
        if (! self::isEnabled()) {
            return false;
        }

        if ((string) Setting::get('telegram_notify_order_verified', '1') === '0') {
            return false;
        }

        $order->loadMissing('items');
        $site = site_name();
        $orderNumber = htmlspecialchars($order->order_number, ENT_QUOTES, 'UTF-8');
        $customerName = htmlspecialchars($order->customer_name ?: 'Valued Customer', ENT_QUOTES, 'UTF-8');
        $phone = preg_replace('/[^\d+]/', '', (string) $order->customer_phone);
        $phoneDisplay = htmlspecialchars($order->customer_phone ?: '—', ENT_QUOTES, 'UTF-8');
        $total = money($order->total);
        $time = now()->format('d M Y, h:i A');

        $lines = [
            "✅ <b>ORDER PAYMENT VERIFIED!</b>",
            "━━━━━━━━━━━━━━━━━━━━━━",
            "📦 <b>Order:</b> #<code>{$orderNumber}</code>",
            "💰 <b>Total:</b> <b>{$total}</b>",
            "📊 <b>Status:</b> Payment Confirmed & Verified",
            "",
            "👤 <b>Customer Information:</b>",
            "• <b>Name:</b> {$customerName}",
            "• <b>Phone:</b> <a href=\"tel:{$phone}\">{$phoneDisplay}</a>",
            "",
            "⏰ <b>Verified At:</b> {$time}",
            "🏪 <b>Store:</b> {$site}",
            "━━━━━━━━━━━━━━━━━━━━━━",
        ];

        $adminOrderUrl = route('admin.orders.show', $order);
        $keyboard = [
            [
                ['text' => '🔍 View Order', 'url' => $adminOrderUrl],
            ],
        ];

        $cleanDigits = preg_replace('/[^\d]/', '', (string) $order->customer_phone);
        if (! empty($cleanDigits)) {
            $waNumber = (str_starts_with($cleanDigits, '01') && strlen($cleanDigits) === 11)
                ? ('88' . $cleanDigits)
                : $cleanDigits;
            $keyboard[0][] = ['text' => '💬 WhatsApp', 'url' => 'https://wa.me/' . $waNumber];
        }

        $keyboard[] = [
            ['text' => '🌐 Visit Website', 'url' => url('/')],
        ];

        $res = self::sendMessage(implode("\n", $lines), $keyboard);

        return $res['success'];
    }

    /**
     * Send a test notification to verify Bot Token and Chat ID connection.
     */
    public static function sendTestNotification(?string $token = null, ?string $chatId = null): array
    {
        $site = site_name();
        $time = now()->format('d M Y, h:i A');

        $text = implode("\n", [
            "✅ <b>TELEGRAM CONNECTION TEST SUCCESSFUL!</b>",
            "━━━━━━━━━━━━━━━━━━━━━━",
            "Your Telegram Bot is properly connected to <b>{$site}</b>.",
            "You will now receive instant alerts whenever a customer places an order on your website!",
            "",
            "🔔 <b>Notification Features Active:</b>",
            "• Instant Order Alerts",
            "• Customer Details & Phone Link",
            "• Ordered Products Breakdown",
            "• Direct Admin Order Link Button",
            "",
            "⏰ <b>Timestamp:</b> {$time}",
            "━━━━━━━━━━━━━━━━━━━━━━",
        ]);

        $keyboard = [
            [
                ['text' => '🌐 Open Website', 'url' => url('/')],
                ['text' => '⚙️ Admin Settings', 'url' => url('/admin/settings?tab=telegram')],
            ],
        ];

        return self::sendMessage($text, $keyboard, $chatId, $token);
    }

    /**
     * Call getUpdates from Telegram Bot API to detect recent chats and chat IDs automatically.
     */
    public static function detectRecentChats(?string $token = null): array
    {
        $botToken = trim((string) ($token ?: self::getBotToken()));
        if (empty($botToken)) {
            return [
                'success' => false,
                'message' => 'Please enter a Bot Token first.',
                'chats'   => [],
            ];
        }

        $endpoint = self::TELEGRAM_API_BASE . $botToken . '/getUpdates';

        try {
            $response = Http::timeout(8)->get($endpoint);
            $result = $response->json();

            if (! $response->successful() || empty($result['ok'])) {
                $err = $result['description'] ?? ('HTTP Status ' . $response->status());
                return [
                    'success' => false,
                    'message' => 'Telegram error: ' . $err,
                    'chats'   => [],
                ];
            }

            $updates = $result['result'] ?? [];
            $chats = [];

            foreach ($updates as $up) {
                $chat = null;
                if (isset($up['message']['chat'])) {
                    $chat = $up['message']['chat'];
                } elseif (isset($up['my_chat_member']['chat'])) {
                    $chat = $up['my_chat_member']['chat'];
                } elseif (isset($up['channel_post']['chat'])) {
                    $chat = $up['channel_post']['chat'];
                }

                if ($chat && isset($chat['id'])) {
                    $id = (string) $chat['id'];
                    $title = $chat['title'] ?? trim(($chat['first_name'] ?? '') . ' ' . ($chat['last_name'] ?? ''));
                    $type = $chat['type'] ?? 'private';
                    $username = $chat['username'] ?? '';

                    $chats[$id] = [
                        'id'       => $id,
                        'title'    => $title ?: ('Chat ' . $id),
                        'type'     => $type,
                        'username' => $username ? ('@' . $username) : '',
                    ];
                }
            }

            return [
                'success' => true,
                'message' => count($chats) > 0
                    ? 'Found ' . count($chats) . ' recent chat(s).'
                    : 'No recent messages found. Please send a message to your bot in Telegram or add it to your group, then try again.',
                'chats'   => array_values($chats),
            ];
        } catch (\Throwable $e) {
            return [
                'success' => false,
                'message' => 'Connection error: ' . $e->getMessage(),
                'chats'   => [],
            ];
        }
    }
}
