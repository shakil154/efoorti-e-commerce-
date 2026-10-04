<?php

namespace Tests\Feature;

use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use App\Models\Setting;
use App\Models\User;
use App\Services\MetaCapiService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\Request;
use Tests\TestCase;

class TrackingIntegrationTest extends TestCase
{
    use RefreshDatabase;

    /** Test phone normalization for Bangladesh and international numbers. */
    public function test_meta_capi_phone_normalization(): void
    {
        $this->assertEquals('8801712345678', MetaCapiService::normalizePhone('01712345678'));
        $this->assertEquals('8801712345678', MetaCapiService::normalizePhone('+8801712345678'));
        $this->assertEquals('8801712345678', MetaCapiService::normalizePhone('8801712345678'));
        $this->assertEquals('8801812345678', MetaCapiService::normalizePhone('018-1234-5678'));
        $this->assertNull(MetaCapiService::normalizePhone(''));
    }

    /** Test Meta user_data hashing standards. */
    public function test_meta_capi_user_data_hashing(): void
    {
        $request = Request::create('/', 'GET', [], [], [], [
            'REMOTE_ADDR'     => '103.100.100.10',
            'HTTP_USER_AGENT' => 'Mozilla/5.0 Test Browser',
        ]);

        $userData = MetaCapiService::buildUserData($request, [
            'email'      => 'Customer@Example.Com',
            'phone'      => '01711223344',
            'first_name' => 'John Doe',
            'city'       => 'Dhaka',
        ]);

        // Email must be SHA-256 hashed lowercase & trimmed
        $this->assertArrayHasKey('em', $userData);
        $this->assertEquals(hash('sha256', 'customer@example.com'), $userData['em'][0]);

        // Phone must be SHA-256 hashed with 88 prefix
        $this->assertArrayHasKey('ph', $userData);
        $this->assertEquals(hash('sha256', '8801711223344'), $userData['ph'][0]);

        // IP and User-Agent must NOT be hashed (Meta API requirement)
        $this->assertEquals('103.100.100.10', $userData['client_ip_address']);
        $this->assertEquals('Mozilla/5.0 Test Browser', $userData['client_user_agent']);
    }

    /** Test store front HTML contains tracking head and body scripts. */
    public function test_storefront_renders_tracking_head_and_body(): void
    {
        Setting::put('tracking_meta_pixel_id', '998877665544');
        Setting::put('tracking_ga4_id', 'G-ABC123XYZ');
        Setting::put('tracking_google_ads_id', 'AW-123456789');
        Setting::put('tracking_google_ads_label', 'LABEL123');

        $response = $this->get('/');
        $response->assertStatus(200);

        $html = $response->getContent();
        $this->assertStringContainsString('window.__tracking', $html);
        $this->assertStringContainsString('998877665544', $html);
        $this->assertStringContainsString('G-ABC123XYZ', $html);
        $this->assertStringContainsString('AW-123456789', $html);
        $this->assertStringContainsString('https://connect.facebook.net/en_US/fbevents.js', $html);
        $this->assertStringContainsString('fbq(\'init\', \'998877665544\')', $html);
    }

    /** Test admin tracking routes and saving settings. */
    public function test_admin_can_update_tracking_settings(): void
    {
        $admin = User::first() ?? User::factory()->create(['role' => 'admin']);

        $response = $this->actingAs($admin)->post('/admin/tracking', [
            'tracking_meta_pixel_id'        => '112233445566',
            'tracking_meta_capi_enabled'    => '1',
            'tracking_meta_capi_token'      => 'EAAGmTESTTOKEN123',
            'tracking_meta_test_event_code' => 'TEST999',
            'tracking_ga4_id'               => 'G-GA4TEST123',
            'tracking_google_ads_id'        => 'AW-987654321',
            'tracking_google_ads_label'     => 'CONV_LABEL_TEST',
            'tracking_tiktok_pixel_id'      => 'C1234567890TT',
        ]);

        $response->assertSessionHasNoErrors();
        $response->assertRedirect();

        $this->assertEquals('112233445566', Setting::get('tracking_meta_pixel_id'));
        $this->assertEquals('1', Setting::get('tracking_meta_capi_enabled'));
        $this->assertEquals('EAAGmTESTTOKEN123', Setting::get('tracking_meta_capi_token'));
        $this->assertEquals('TEST999', Setting::get('tracking_meta_test_event_code'));
        $this->assertEquals('G-GA4TEST123', Setting::get('tracking_ga4_id'));
        $this->assertEquals('AW-987654321', Setting::get('tracking_google_ads_id'));
        $this->assertEquals('CONV_LABEL_TEST', Setting::get('tracking_google_ads_label'));
        $this->assertEquals('C1234567890TT', Setting::get('tracking_tiktok_pixel_id'));
    }

    /** Test legacy settings tab=tracking redirects to dedicated /admin/tracking. */
    public function test_legacy_settings_tracking_tab_redirects(): void
    {
        $admin = User::first() ?? User::factory()->create(['role' => 'admin']);

        $response = $this->actingAs($admin)->get('/admin/settings?tab=tracking');
        $response->assertRedirect('/admin/tracking');
    }

    /** Test Meta CAPI purchase event sends correct structure and matching eventID. */
    public function test_meta_capi_purchase_event_payload_structure(): void
    {
        \Illuminate\Support\Facades\Http::fake([
            'https://graph.facebook.com/*' => \Illuminate\Support\Facades\Http::response([
                'events_received' => 1,
                'fbtrace_id'      => 'trace_xyz_123',
            ], 200),
        ]);

        Setting::put('tracking_meta_pixel_id', '123456789');
        Setting::put('tracking_meta_capi_enabled', '1');
        Setting::put('tracking_meta_capi_token', 'EAAG_TEST_TOKEN');
        Setting::put('currency_code', 'BDT');

        $order = Order::create([
            'order_number'       => 'ORD-260907-TEST',
            'confirmation_token' => 'token_1234567890abcdef',
            'customer_name'      => 'Karim Rahman',
            'customer_phone'     => '01711223344',
            'customer_email'     => 'karim@example.com',
            'shipping_address'   => 'House 1, Road 2, Dhanmondi',
            'city'               => 'Dhaka',
            'postal_code'        => '1205',
            'subtotal'           => 1500,
            'shipping_charge'    => 60,
            'tax'                => 0,
            'total'              => 1560,
            'payment_method'     => 'cod',
            'payment_status'     => 'pending',
            'status'             => 'pending',
            'ip_address'         => '103.10.10.1',
            'user_agent'         => 'Mozilla/5.0 Test Agent',
        ]);

        $category = \App\Models\Category::create([
            'name' => 'Fashion',
            'slug' => 'fashion',
        ]);

        $product = Product::create([
            'category_id'    => $category->id,
            'name'           => 'Premium Panjabi',
            'slug'           => 'premium-panjabi',
            'regular_price'  => 1500,
            'stock_quantity' => 20,
            'is_published'   => true,
        ]);

        OrderItem::create([
            'order_id'     => $order->id,
            'product_id'   => $product->id,
            'product_name' => 'Premium Panjabi',
            'quantity'     => 1,
            'unit_price'   => 1500,
            'line_total'   => 1500,
        ]);

        $result = MetaCapiService::sendPurchaseEvent($order);

        $this->assertNotNull($result);
        $this->assertEquals(1, $result['events_received']);

        \Illuminate\Support\Facades\Http::assertSent(function (\Illuminate\Http\Client\Request $request) use ($order, $product) {
            $data = $request->data();
            $event = $data['data'][0] ?? null;

            return str_contains($request->url(), 'graph.facebook.com')
                && str_contains($request->url(), '123456789/events')
                && $event !== null
                && $event['event_name'] === 'Purchase'
                && $event['event_id'] === 'order_' . $order->order_number
                && $event['custom_data']['value'] == 1560
                && $event['custom_data']['currency'] === 'BDT'
                && $event['custom_data']['contents'][0]['id'] === (string) $product->id;
        });
    }

    /** Test Facebook domain verification tag and custom scripts render in HTML. */
    public function test_domain_verification_and_custom_scripts_render(): void
    {
        Setting::put('meta_domain_verification', 'meta_verify_token_987');
        Setting::put('custom_header_scripts', '<script id="custom-test-head">console.log("head ok")</script>');
        Setting::put('custom_body_scripts', '<div id="custom-test-body">body ok</div>');

        $response = $this->get('/');
        $response->assertStatus(200);

        $html = $response->getContent();
        $this->assertStringContainsString('<meta name="facebook-domain-verification" content="meta_verify_token_987"', $html);
        $this->assertStringContainsString('<script id="custom-test-head">console.log("head ok")</script>', $html);
        $this->assertStringContainsString('<div id="custom-test-body">body ok</div>', $html);
    }

    /** Test that landing page renders full-funnel tracking (ViewContent, InitiateCheckout). */
    public function test_landing_page_renders_full_funnel_tracking(): void
    {
        Setting::put('tracking_meta_pixel_id', '998877665544');

        $category = \App\Models\Category::create([
            'name' => 'Cosmetics',
            'slug' => 'cosmetics',
        ]);

        $product = Product::create([
            'category_id'    => $category->id,
            'name'           => 'Glow Serum',
            'slug'           => 'glow-serum',
            'regular_price'  => 1200,
            'sale_price'     => 950,
            'stock_quantity' => 15,
            'is_published'   => true,
        ]);

        $landingPage = \App\Models\LandingPage::create([
            'product_id' => $product->id,
            'title'      => 'Glow Serum Campaign',
            'slug'       => 'glow-serum-lp',
            'design'     => 'nuraya',
            'is_active'  => true,
            'content'    => [
                'offer_price'   => 950,
                'regular_price' => 1200,
            ],
        ]);

        $response = $this->get('/lp/glow-serum-lp');
        $response->assertStatus(200);

        $html = $response->getContent();
        $this->assertStringContainsString('trackLandingInitiateCheckout', $html);
        $this->assertStringContainsString('ViewContent', $html);
        $this->assertStringContainsString('InitiateCheckout', $html);
    }
}

