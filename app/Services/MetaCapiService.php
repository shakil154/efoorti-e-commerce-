<?php

namespace App\Services;

use App\Models\Order;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class MetaCapiService
{
    public const API_VERSION = 'v21.0';

    /**
     * Send a Purchase event to Meta Conversions API.
     */
    public static function sendPurchaseEvent(Order $order, ?Request $request = null): ?array
    {
        if (! self::isEnabled()) {
            return null;
        }

        $pixelId = tracking_meta_pixel_id();
        $token = tracking_meta_capi_token();

        if (! $pixelId || ! $token) {
            return null;
        }

        $request = $request ?? request();
        $order->loadMissing('items');

        $eventId = 'order_' . $order->order_number;
        $eventTime = $order->created_at ? $order->created_at->timestamp : time();

        $userData = self::buildUserData($request, [
            'email'       => $order->customer_email,
            'phone'       => $order->customer_phone,
            'first_name'  => $order->customer_name,
            'city'        => $order->city,
            'postal_code' => $order->postal_code,
            'ip'          => $order->ip_address ?: $request->ip(),
            'user_agent'  => $order->user_agent ?: $request->userAgent(),
        ]);

        $contents = $order->items->map(function ($item) {
            return [
                'id'         => (string) $item->product_id,
                'quantity'   => (int) $item->quantity,
                'item_price' => (float) $item->unit_price,
            ];
        })->values()->all();

        $customData = [
            'currency'     => setting('currency_code', 'BDT'),
            'value'        => (float) $order->total,
            'content_type' => 'product',
            'contents'     => $contents,
            'order_id'     => $order->order_number,
            'num_items'    => $order->items->sum('quantity'),
        ];

        return self::dispatchEvents($pixelId, $token, [
            [
                'event_name'         => 'Purchase',
                'event_time'         => $eventTime,
                'event_id'           => $eventId,
                'event_source_url'   => $request->fullUrl() ?: url('/'),
                'action_source'      => 'website',
                'user_data'          => $userData,
                'custom_data'        => $customData,
            ]
        ], tracking_meta_test_event_code());
    }

    /**
     * Build normalized user_data array according to Meta specifications.
     */
    public static function buildUserData(Request $request, array $custom = []): array
    {
        $userData = [];

        // Hashed Email (lowercase, trimmed, SHA-256)
        $email = $custom['email'] ?? null;
        if ($email && filter_var($email, FILTER_VALIDATE_EMAIL)) {
            $userData['em'] = [hash('sha256', strtolower(trim($email)))];
        }

        // Hashed Phone (normalized digits, SHA-256)
        $phone = $custom['phone'] ?? null;
        if ($phone) {
            $normPhone = self::normalizePhone($phone);
            if ($normPhone) {
                $userData['ph'] = [hash('sha256', $normPhone)];
            }
        }

        // Hashed Name
        $name = $custom['first_name'] ?? null;
        if ($name) {
            $userData['fn'] = [hash('sha256', strtolower(trim($name)))];
        }

        // Hashed City
        $city = $custom['city'] ?? null;
        if ($city) {
            $userData['ct'] = [hash('sha256', strtolower(trim($city)))];
        }

        // Hashed Postal code
        $zip = $custom['postal_code'] ?? null;
        if ($zip) {
            $userData['zp'] = [hash('sha256', strtolower(trim($zip)))];
        }

        // Raw IP address (DO NOT HASH)
        $ip = $custom['ip'] ?? $request->ip();
        if ($ip && $ip !== '127.0.0.1' && $ip !== '::1') {
            $userData['client_ip_address'] = $ip;
        }

        // Raw User Agent (DO NOT HASH)
        $userAgent = $custom['user_agent'] ?? $request->userAgent();
        if ($userAgent) {
            $userData['client_user_agent'] = $userAgent;
        }

        // Cookies _fbp and _fbc
        $fbp = $request->cookie('_fbp');
        if ($fbp) {
            $userData['fbp'] = $fbp;
        }

        $fbc = $request->cookie('_fbc');
        if (! $fbc && $request->filled('fbclid')) {
            $fbc = 'fb.1.' . time() . '.' . $request->query('fbclid');
        }
        if ($fbc) {
            $userData['fbc'] = $fbc;
        }

        return $userData;
    }

    /**
     * Send arbitrary events to Meta Conversions API.
     */
    public static function dispatchEvents(string $pixelId, string $token, array $events, ?string $testCode = null): ?array
    {
        $url = "https://graph.facebook.com/" . self::API_VERSION . "/{$pixelId}/events";

        $payload = [
            'data' => $events,
        ];

        if (! empty($testCode)) {
            $payload['test_event_code'] = trim($testCode);
        }

        try {
            $response = Http::timeout(4)
                ->withHeaders([
                    'Accept'       => 'application/json',
                    'Content-Type' => 'application/json',
                ])
                ->post("{$url}?access_token=" . urlencode($token), $payload);

            $result = $response->json();

            if (! $response->successful()) {
                Log::warning('Meta CAPI warning response', [
                    'status' => $response->status(),
                    'body'   => $result,
                ]);
            }

            return $result;
        } catch (\Throwable $e) {
            Log::error('Meta CAPI connection error: ' . $e->getMessage());
            return null;
        }
    }

    /**
     * Test Meta CAPI connection with a sample PageView event.
     */
    public static function testConnection(string $pixelId, string $accessToken, ?string $testCode = null): array
    {
        $pixelId = trim($pixelId);
        $accessToken = trim($accessToken);

        if (empty($pixelId) || empty($accessToken)) {
            return [
                'success' => false,
                'message' => 'Pixel ID and Access Token are required.',
            ];
        }

        $url = "https://graph.facebook.com/" . self::API_VERSION . "/{$pixelId}/events";

        $testEvent = [
            'event_name'       => 'PageView',
            'event_time'       => time(),
            'event_id'         => 'test_' . time(),
            'event_source_url' => url('/'),
            'action_source'    => 'website',
            'user_data'        => [
                'client_user_agent' => request()->userAgent() ?: 'Mozilla/5.0 Test Agent',
                'client_ip_address' => request()->ip() ?: '127.0.0.1',
            ],
            'custom_data'      => [
                'test' => 'Connection Verification from Shopzy Admin',
            ],
        ];

        $payload = [
            'data' => [$testEvent],
        ];

        if (! empty($testCode)) {
            $payload['test_event_code'] = trim($testCode);
        }

        try {
            $response = Http::timeout(6)
                ->withHeaders([
                    'Accept'       => 'application/json',
                    'Content-Type' => 'application/json',
                ])
                ->post("{$url}?access_token=" . urlencode($accessToken), $payload);

            $data = $response->json();

            if ($response->successful() && isset($data['events_received'])) {
                $received = $data['events_received'];
                $msg = "Success! Meta received {$received} test event(s).";
                if (! empty($testCode)) {
                    $msg .= " Check the 'Test Events' tab in your Meta Events Manager.";
                }
                return [
                    'success'         => true,
                    'message'         => $msg,
                    'events_received' => $received,
                    'raw'             => $data,
                ];
            }

            $errorMsg = $data['error']['message'] ?? ('Error: HTTP status ' . $response->status());
            return [
                'success' => false,
                'message' => 'Meta API Error: ' . $errorMsg,
                'raw'     => $data,
            ];
        } catch (\Throwable $e) {
            return [
                'success' => false,
                'message' => 'Failed to connect to Meta API: ' . $e->getMessage(),
            ];
        }
    }

    /**
     * Check whether CAPI is enabled in settings.
     */
    public static function isEnabled(): bool
    {
        return setting('tracking_meta_capi_enabled') === '1';
    }

    /**
     * Normalize Bangladesh and international phone numbers for Meta SHA-256 hashing.
     */
    public static function normalizePhone(string $phone): ?string
    {
        // Remove all non-digits
        $digits = preg_replace('/\D+/', '', $phone);

        if (empty($digits)) {
            return null;
        }

        // Bangladesh specific: 017xxxxxxxx (11 digits) -> 88017xxxxxxxx
        if (str_starts_with($digits, '01') && strlen($digits) === 11) {
            return '88' . $digits;
        }

        // Already has 8801...
        if (str_starts_with($digits, '8801') && strlen($digits) === 13) {
            return $digits;
        }

        return $digits;
    }
}
