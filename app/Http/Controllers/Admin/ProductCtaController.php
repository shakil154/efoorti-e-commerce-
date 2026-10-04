<?php

namespace App\Http\Controllers\Admin;

use Inertia\Inertia;
use App\Http\Controllers\Controller;
use App\Models\Setting;
use Illuminate\Http\Request;

class ProductCtaController extends Controller
{
    public function edit()
    {
        return Inertia::render('Admin/ProductCta', [
            'settings' => [
                // COD Button
                'product_page_cod_enabled'        => (bool) setting('product_page_cod_enabled', true),
                'product_page_cod_text'           => (string) setting('product_page_cod_text', 'ক্যাশ অন ডেলিভারিতে অর্ডার করুন'),
                'product_page_cod_bg_color'       => (string) setting('product_page_cod_bg_color', '#16a34a'),
                'product_page_cod_text_color'     => (string) setting('product_page_cod_text_color', '#ffffff'),

                // WhatsApp Button
                'product_page_whatsapp_enabled'   => (bool) setting('product_page_whatsapp_enabled', true),
                'product_page_whatsapp_text'      => (string) setting('product_page_whatsapp_text', 'WhatsApp Order'),
                'product_page_whatsapp_number'    => (string) setting('product_page_whatsapp_number', setting('whatsapp_number', '+8801923443872')),
                'product_page_whatsapp_bg_color'  => (string) setting('product_page_whatsapp_bg_color', '#25D366'),
                'product_page_whatsapp_text_color'=> (string) setting('product_page_whatsapp_text_color', '#ffffff'),

                // Call For Order Button
                'product_page_call_enabled'       => (bool) setting('product_page_call_enabled', true),
                'product_page_call_text'          => (string) setting('product_page_call_text', 'Call For Order'),
                'product_page_call_number'        => (string) setting('product_page_call_number', setting('call_number', '01923443872')),
                'product_page_call_bg_color'      => (string) setting('product_page_call_bg_color', '#294294'),
                'product_page_call_text_color'    => (string) setting('product_page_call_text_color', '#ffffff'),

                // Add to Cart & Buy Now Buttons
                'product_page_add_cart_text'      => (string) setting('product_page_add_cart_text', 'ADD TO CART'),
                'product_page_add_cart_bg_color'  => (string) setting('product_page_add_cart_bg_color', '#f15a24'),
                'product_page_add_cart_text_color'=> (string) setting('product_page_add_cart_text_color', '#ffffff'),
                'product_page_buy_text'           => (string) setting('product_page_buy_text', 'ORDER NOW'),
                'product_page_buy_bg_color'       => (string) setting('product_page_buy_bg_color', '#0b1c21'),
                'product_page_buy_text_color'     => (string) setting('product_page_buy_text_color', '#ffffff'),

                // Product Card Settings
                'product_card_preset'                  => (string) setting('product_card_preset', 'preset-1'),
                'product_card_bg_color'                => (string) setting('product_card_bg_color', '#FFFFFF'),
                'product_card_text_color'              => (string) setting('product_card_text_color', '#111827'),
                'product_card_btn_bg_color'            => (string) setting('product_card_btn_bg_color', '#f15a24'),
                'product_card_btn_text_color'          => (string) setting('product_card_btn_text_color', '#ffffff'),
                'product_card_secondary_btn_bg_color'  => (string) setting('product_card_secondary_btn_bg_color', '#e11d48'),
                'product_card_secondary_btn_text_color'=> (string) setting('product_card_secondary_btn_text_color', '#ffffff'),
                'product_card_buy_text'                => (string) setting('product_card_buy_text', setting('default_cta_text', 'অর্ডার করুন')),
                'product_card_view_text'               => (string) setting('product_card_view_text', 'বিস্তারিত দেখুন'),
                'product_card_options_text'            => (string) setting('product_card_options_text', setting('product_card_buy_text', 'অর্ডার করুন')),
                'product_cta_action'                   => setting('product_cta_action', 'checkout') === 'cart' ? 'cart' : 'checkout',
                'product_card_shadow_style'            => (string) setting('product_card_shadow_style', 'subtle'),
                'product_card_shadow_color'            => (string) setting('product_card_shadow_color', '#000000'),
                'product_card_border_color'            => (string) setting('product_card_border_color', '#f1f5f9'),
                'product_card_border_radius'           => (string) setting('product_card_border_radius', 'preset-default'),

                // Mobile Sticky Action Bar
                'product_mobile_sticky_enabled'             => (bool) setting('product_mobile_sticky_enabled', true),
                'product_mobile_sticky_add_cart_text'       => (string) setting('product_mobile_sticky_add_cart_text', 'কার্টে রাখুন'),
                'product_mobile_sticky_add_cart_bg_color'   => (string) setting('product_mobile_sticky_add_cart_bg_color', '#ffffff'),
                'product_mobile_sticky_add_cart_text_color' => (string) setting('product_mobile_sticky_add_cart_text_color', '#f43f5e'),
                'product_mobile_sticky_add_cart_border_color'=> (string) setting('product_mobile_sticky_add_cart_border_color', '#f43f5e'),
                'product_mobile_sticky_buy_text'            => (string) setting('product_mobile_sticky_buy_text', 'অর্ডার করুন'),
                'product_mobile_sticky_buy_bg_color'        => (string) setting('product_mobile_sticky_buy_bg_color', '#f43f5e'),
                'product_mobile_sticky_buy_text_color'      => (string) setting('product_mobile_sticky_buy_text_color', '#ffffff'),
            ]
        ]);
    }

    public function update(Request $request)
    {
        $data = $request->validate([
            // COD Button
            'product_page_cod_enabled'        => ['nullable', 'boolean'],
            'product_page_cod_text'           => ['required', 'string', 'max:100'],
            'product_page_cod_bg_color'       => ['required', 'string', 'max:20'],
            'product_page_cod_text_color'     => ['required', 'string', 'max:20'],

            // WhatsApp Button
            'product_page_whatsapp_enabled'   => ['nullable', 'boolean'],
            'product_page_whatsapp_text'      => ['required', 'string', 'max:100'],
            'product_page_whatsapp_number'    => ['nullable', 'string', 'max:30'],
            'product_page_whatsapp_bg_color'  => ['required', 'string', 'max:20'],
            'product_page_whatsapp_text_color'=> ['required', 'string', 'max:20'],

            // Call For Order Button
            'product_page_call_enabled'       => ['nullable', 'boolean'],
            'product_page_call_text'          => ['required', 'string', 'max:100'],
            'product_page_call_number'        => ['nullable', 'string', 'max:30'],
            'product_page_call_bg_color'      => ['required', 'string', 'max:20'],
            'product_page_call_text_color'    => ['required', 'string', 'max:20'],

            // Add to Cart & Buy Now Buttons
            'product_page_add_cart_text'      => ['required', 'string', 'max:60'],
            'product_page_add_cart_bg_color'  => ['required', 'string', 'max:20'],
            'product_page_add_cart_text_color'=> ['required', 'string', 'max:20'],
            'product_page_buy_text'           => ['required', 'string', 'max:60'],
            'product_page_buy_bg_color'       => ['required', 'string', 'max:20'],
            'product_page_buy_text_color'     => ['required', 'string', 'max:20'],

            // Product Card Settings
            'product_card_preset'                  => ['nullable', 'string', 'in:preset-1,preset-2,preset-3,preset-4,preset-5'],
            'product_card_bg_color'                => ['required', 'string', 'max:20'],
            'product_card_text_color'              => ['required', 'string', 'max:20'],
            'product_card_btn_bg_color'            => ['required', 'string', 'max:20'],
            'product_card_btn_text_color'          => ['required', 'string', 'max:20'],
            'product_card_secondary_btn_bg_color'  => ['nullable', 'string', 'max:20'],
            'product_card_secondary_btn_text_color'=> ['nullable', 'string', 'max:20'],
            'product_card_buy_text'                => ['required', 'string', 'max:60'],
            'product_card_view_text'               => ['nullable', 'string', 'max:60'],
            'product_card_options_text'            => ['nullable', 'string', 'max:60'],
            'product_cta_action'                   => ['required', 'in:checkout,cart'],
            'product_card_shadow_style'            => ['nullable', 'string', 'in:none,subtle,medium,glow'],
            'product_card_shadow_color'            => ['nullable', 'string', 'max:20'],
            'product_card_border_color'            => ['nullable', 'string', 'max:20'],
            'product_card_border_radius'           => ['nullable', 'string', 'max:30'],

            // Mobile Sticky Action Bar
            'product_mobile_sticky_enabled'             => ['nullable', 'boolean'],
            'product_mobile_sticky_add_cart_text'       => ['required', 'string', 'max:60'],
            'product_mobile_sticky_add_cart_bg_color'   => ['required', 'string', 'max:20'],
            'product_mobile_sticky_add_cart_text_color' => ['required', 'string', 'max:20'],
            'product_mobile_sticky_add_cart_border_color'=> ['required', 'string', 'max:20'],
            'product_mobile_sticky_buy_text'            => ['required', 'string', 'max:60'],
            'product_mobile_sticky_buy_bg_color'        => ['required', 'string', 'max:20'],
            'product_mobile_sticky_buy_text_color'      => ['required', 'string', 'max:20'],
        ]);

        foreach ($data as $key => $value) {
            Setting::put($key, is_bool($value) ? ($value ? '1' : '0') : trim((string) $value));
        }

        // Also sync default_cta_text and product_card_options_text
        Setting::put('default_cta_text', trim($data['product_card_buy_text']));
        Setting::put('product_card_options_text', trim($data['product_card_buy_text']));

        return back()->with('status', 'Storefront buttons & CTA settings saved successfully.');
    }
}
