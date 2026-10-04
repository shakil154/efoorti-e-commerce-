import AdminLayout from '@/Layouts/AdminLayout';
import { Head, useForm } from '@inertiajs/react';
import { getCardBoxShadow, getCardRadiusClass } from '@/lib/utils';

const inputClass = "w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300 transition-all";

function ColorField({ label, value, onChange }) {
  return (
    <div>
      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">{label}</label>
      <div className="flex items-center gap-2.5">
        <input
          type="color"
          value={value || '#000000'}
          onChange={e => onChange(e.target.value)}
          className="h-9 w-9 rounded-lg border border-gray-200 cursor-pointer p-0.5 bg-white shadow-sm shrink-0"
        />
        <input
          type="text"
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder="#000000"
          className="w-full uppercase font-mono text-xs border border-gray-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-300"
        />
      </div>
    </div>
  );
}

const PRESETS = [
  {
    id: 'preset-1',
    name: 'Preset 1: Modern Compact (Default)',
    subtitle: 'Classic Balanced Layout',
    desc: 'Square cart button + filled order button with lightning icon. Category & price on top right.',
    badge: 'Standard',
  },
  {
    id: 'preset-2',
    name: 'Preset 2: Flash Deal & Urgency Bar',
    subtitle: 'Urgency & High Conversion (Screenshot 1)',
    desc: 'Stock progress bar (100 LEFT - SELLING FAST), discount pill, timer & circular cart button.',
    badge: 'Urgency',
  },
  {
    id: 'preset-3',
    name: 'Preset 3: Glamour & Beauty Dual CTA',
    subtitle: 'Luxury & Cosmetic (Screenshots 2 & 3)',
    desc: 'Centered text, 5 star rating, centered price, and dual action buttons: View Details + Buy Now.',
    badge: 'Dual CTA',
  },
  {
    id: 'preset-4',
    name: 'Preset 4: Minimal Tech Clean',
    subtitle: 'Clean Minimal Tech (Screenshot 4)',
    desc: 'Price save badge, clean typography, outline pill order button + circular cart button.',
    badge: 'Minimal',
  },
  {
    id: 'preset-5',
    name: 'Preset 5: Soft Pastel & Floating Cart',
    subtitle: 'Soft Aesthetic & Floating Quick-Cart (Unique Style)',
    desc: 'Smooth curved corners, soft pink savings badge, floating image quick-cart button + full-width prominent order button.',
    badge: 'Floating Cart',
  },
];

function Toggle({ enabled, onChange, label, description }) {
  return (
    <div className="flex items-center justify-between py-2">
      <div>
        <p className="text-sm font-semibold text-gray-800">{label}</p>
        {description && <p className="text-xs text-gray-400 mt-0.5">{description}</p>}
      </div>
      <button
        type="button"
        onClick={() => onChange(!enabled)}
        className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
          enabled ? 'bg-orange-500' : 'bg-gray-200'
        }`}
      >
        <span
          className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
            enabled ? 'translate-x-5' : 'translate-x-0'
          }`}
        />
      </button>
    </div>
  );
}

export default function ProductCta({ settings = {} }) {
  const { data, setData, put, processing, errors } = useForm({
    // COD Button
    product_page_cod_enabled: settings.product_page_cod_enabled ?? true,
    product_page_cod_text: settings.product_page_cod_text || 'ক্যাশ অন ডেলিভারিতে অর্ডার করুন',
    product_page_cod_bg_color: settings.product_page_cod_bg_color || '#16a34a',
    product_page_cod_text_color: settings.product_page_cod_text_color || '#ffffff',

    // WhatsApp Button
    product_page_whatsapp_enabled: settings.product_page_whatsapp_enabled ?? true,
    product_page_whatsapp_text: settings.product_page_whatsapp_text || 'WhatsApp Order',
    product_page_whatsapp_number: settings.product_page_whatsapp_number || '+8801923443872',
    product_page_whatsapp_bg_color: settings.product_page_whatsapp_bg_color || '#25D366',
    product_page_whatsapp_text_color: settings.product_page_whatsapp_text_color || '#ffffff',

    // Call For Order Button
    product_page_call_enabled: settings.product_page_call_enabled ?? true,
    product_page_call_text: settings.product_page_call_text || 'Call For Order',
    product_page_call_number: settings.product_page_call_number || '01923443872',
    product_page_call_bg_color: settings.product_page_call_bg_color || '#294294',
    product_page_call_text_color: settings.product_page_call_text_color || '#ffffff',

    // Add to Cart & Buy Now Buttons
    product_page_add_cart_text: settings.product_page_add_cart_text || 'ADD TO CART',
    product_page_add_cart_bg_color: settings.product_page_add_cart_bg_color || '#f15a24',
    product_page_add_cart_text_color: settings.product_page_add_cart_text_color || '#ffffff',
    product_page_buy_text: settings.product_page_buy_text || 'ORDER NOW',
    product_page_buy_bg_color: settings.product_page_buy_bg_color || '#0b1c21',
    product_page_buy_text_color: settings.product_page_buy_text_color || '#ffffff',

    // Product Card Settings
    product_card_preset: settings.product_card_preset || 'preset-1',
    product_card_bg_color: settings.product_card_bg_color || '#FFFFFF',
    product_card_text_color: settings.product_card_text_color || '#111827',
    product_card_btn_bg_color: settings.product_card_btn_bg_color || '#f15a24',
    product_card_btn_text_color: settings.product_card_btn_text_color || '#ffffff',
    product_card_secondary_btn_bg_color: settings.product_card_secondary_btn_bg_color || '#e11d48',
    product_card_secondary_btn_text_color: settings.product_card_secondary_btn_text_color || '#ffffff',
    product_card_buy_text: settings.product_card_buy_text || 'অর্ডার করুন',
    product_card_view_text: settings.product_card_view_text || 'বিস্তারিত দেখুন',
    product_card_options_text: settings.product_card_options_text || 'অর্ডার করুন',
    product_cta_action: settings.product_cta_action || 'checkout',
    product_card_shadow_style: settings.product_card_shadow_style || 'subtle',
    product_card_shadow_color: settings.product_card_shadow_color || '#000000',
    product_card_border_color: settings.product_card_border_color || '#f1f5f9',
    product_card_border_radius: settings.product_card_border_radius || 'preset-default',

    // Mobile Sticky Action Bar Settings
    product_mobile_sticky_enabled: settings.product_mobile_sticky_enabled ?? true,
    product_mobile_sticky_add_cart_text: settings.product_mobile_sticky_add_cart_text || 'কার্টে রাখুন',
    product_mobile_sticky_add_cart_bg_color: settings.product_mobile_sticky_add_cart_bg_color || '#ffffff',
    product_mobile_sticky_add_cart_text_color: settings.product_mobile_sticky_add_cart_text_color || '#f43f5e',
    product_mobile_sticky_add_cart_border_color: settings.product_mobile_sticky_add_cart_border_color || '#f43f5e',
    product_mobile_sticky_buy_text: settings.product_mobile_sticky_buy_text || 'অর্ডার করুন',
    product_mobile_sticky_buy_bg_color: settings.product_mobile_sticky_buy_bg_color || '#f43f5e',
    product_mobile_sticky_buy_text_color: settings.product_mobile_sticky_buy_text_color || '#ffffff',
  });

  const submit = (e) => {
    e.preventDefault();
    put('/admin/product-button', {
      preserveScroll: true,
    });
  };

  return (
    <>
      <Head title="Order &amp; CTA Buttons Customizer" />
      <AdminLayout title="Order &amp; CTA Buttons Customizer">
        <div className="max-w-6xl space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-xl font-bold text-gray-900">Order &amp; CTA Buttons Customizer</h1>
              <p className="text-sm text-gray-500 mt-0.5">
                Customize 1-click COD quick order, WhatsApp, Call buttons, Add to Cart, and Product Card designs.
              </p>
            </div>
            <button
              onClick={submit}
              disabled={processing}
              className="px-6 py-2.5 bg-orange-500 hover:bg-orange-600 disabled:opacity-60 text-white text-sm font-bold rounded-xl transition-colors shadow-sm shadow-orange-200 flex items-center justify-center gap-2"
            >
              {processing ? 'Saving...' : 'Save All Changes'}
            </button>
          </div>

          <form onSubmit={submit} className="grid grid-cols-1 lg:grid-cols-12 gap-6">

            {/* ── Left Column: Form Settings ── */}
            <div className="lg:col-span-7 space-y-6">

              {/* 1. COD Quick Order Button */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-4">
                <div className="flex items-center gap-2 pb-3 border-b border-gray-100">
                  <div className="p-2 rounded-xl bg-green-50 text-green-600">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 text-sm">Cash on Delivery (COD) Quick Order Button</h3>
                    <p className="text-xs text-gray-400">Prominent 1-click modal checkout button on product details page</p>
                  </div>
                </div>

                <Toggle
                  enabled={data.product_page_cod_enabled}
                  onChange={v => setData('product_page_cod_enabled', v)}
                  label={data.product_page_cod_enabled ? "Enabled" : "Disabled"}
                  description="Display full-width high-conversion COD button on product page"
                />

                {data.product_page_cod_enabled && (
                  <div className="space-y-4 pt-2">
                    <div>
                      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">COD Button Text</label>
                      <input
                        type="text"
                        value={data.product_page_cod_text}
                        onChange={e => setData('product_page_cod_text', e.target.value)}
                        className={inputClass}
                        required
                      />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <ColorField
                        label="Button Background Color"
                        value={data.product_page_cod_bg_color}
                        onChange={v => setData('product_page_cod_bg_color', v)}
                      />
                      <ColorField
                        label="Button Text Color"
                        value={data.product_page_cod_text_color}
                        onChange={v => setData('product_page_cod_text_color', v)}
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* 2. WhatsApp Order Button */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-4">
                <div className="flex items-center gap-2 pb-3 border-b border-gray-100">
                  <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 text-sm">WhatsApp Order Button</h3>
                    <p className="text-xs text-gray-400">Opens WhatsApp chat with product name &amp; link</p>
                  </div>
                </div>

                <Toggle
                  enabled={data.product_page_whatsapp_enabled}
                  onChange={v => setData('product_page_whatsapp_enabled', v)}
                  label={data.product_page_whatsapp_enabled ? "Enabled" : "Disabled"}
                  description="Enable direct 1-click WhatsApp order button"
                />

                {data.product_page_whatsapp_enabled && (
                  <div className="space-y-4 pt-2">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Button Text</label>
                        <input
                          type="text"
                          value={data.product_page_whatsapp_text}
                          onChange={e => setData('product_page_whatsapp_text', e.target.value)}
                          className={inputClass}
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Dedicated WhatsApp Number</label>
                        <input
                          type="text"
                          value={data.product_page_whatsapp_number}
                          onChange={e => setData('product_page_whatsapp_number', e.target.value)}
                          placeholder="+8801XXXXXXXXX"
                          className={inputClass}
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <ColorField
                        label="Button Background Color"
                        value={data.product_page_whatsapp_bg_color}
                        onChange={v => setData('product_page_whatsapp_bg_color', v)}
                      />
                      <ColorField
                        label="Button Text Color"
                        value={data.product_page_whatsapp_text_color}
                        onChange={v => setData('product_page_whatsapp_text_color', v)}
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* 3. Call For Order Button */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-4">
                <div className="flex items-center gap-2 pb-3 border-b border-gray-100">
                  <div className="p-2 rounded-xl bg-blue-50 text-blue-600">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 text-sm">Call For Order Button</h3>
                    <p className="text-xs text-gray-400">Initiates direct telephone call from customer device</p>
                  </div>
                </div>

                <Toggle
                  enabled={data.product_page_call_enabled}
                  onChange={v => setData('product_page_call_enabled', v)}
                  label={data.product_page_call_enabled ? "Enabled" : "Disabled"}
                  description="Enable direct call for order button"
                />

                {data.product_page_call_enabled && (
                  <div className="space-y-4 pt-2">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Button Text</label>
                        <input
                          type="text"
                          value={data.product_page_call_text}
                          onChange={e => setData('product_page_call_text', e.target.value)}
                          className={inputClass}
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Dedicated Call Number</label>
                        <input
                          type="text"
                          value={data.product_page_call_number}
                          onChange={e => setData('product_page_call_number', e.target.value)}
                          placeholder="01XXXXXXXXX"
                          className={inputClass}
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <ColorField
                        label="Button Background Color"
                        value={data.product_page_call_bg_color}
                        onChange={v => setData('product_page_call_bg_color', v)}
                      />
                      <ColorField
                        label="Button Text Color"
                        value={data.product_page_call_text_color}
                        onChange={v => setData('product_page_call_text_color', v)}
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* 4. Add to Cart & Order Now Buttons */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-5">
                <div className="flex items-center gap-2 pb-3 border-b border-gray-100">
                  <div className="p-2 rounded-xl bg-orange-50 text-orange-600">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 text-sm">Add to Cart &amp; Order Now Buttons</h3>
                    <p className="text-xs text-gray-400">Styling for main action buttons on product page</p>
                  </div>
                </div>

                {/* Add to cart */}
                <div className="p-4 bg-gray-50/70 rounded-xl border border-gray-100 space-y-3">
                  <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wider flex items-center gap-1.5">
                    <svg className="w-4 h-4 text-orange-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/></svg>
                    <span>Add to Cart Button</span>
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Button Text</label>
                      <input
                        type="text"
                        value={data.product_page_add_cart_text}
                        onChange={e => setData('product_page_add_cart_text', e.target.value)}
                        className={inputClass}
                        required
                      />
                    </div>
                    <ColorField
                      label="BG Color"
                      value={data.product_page_add_cart_bg_color}
                      onChange={v => setData('product_page_add_cart_bg_color', v)}
                    />
                    <ColorField
                      label="Text Color"
                      value={data.product_page_add_cart_text_color}
                      onChange={v => setData('product_page_add_cart_text_color', v)}
                    />
                  </div>
                </div>

                {/* Order now */}
                <div className="p-4 bg-gray-50/70 rounded-xl border border-gray-100 space-y-3">
                  <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wider flex items-center gap-1.5">
                    <svg className="w-4 h-4 text-amber-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
                    <span>Order Now Button</span>
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Button Text</label>
                      <input
                        type="text"
                        value={data.product_page_buy_text}
                        onChange={e => setData('product_page_buy_text', e.target.value)}
                        className={inputClass}
                        required
                      />
                    </div>
                    <ColorField
                      label="BG Color"
                      value={data.product_page_buy_bg_color}
                      onChange={v => setData('product_page_buy_bg_color', v)}
                    />
                    <ColorField
                      label="Text Color"
                      value={data.product_page_buy_text_color}
                      onChange={v => setData('product_page_buy_text_color', v)}
                    />
                  </div>
                </div>
              </div>

              {/* 5. Product Card Customization (Homepage & Shop) */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-4">
                <div className="flex items-center gap-2 pb-3 border-b border-gray-100">
                  <div className="p-2 rounded-xl bg-purple-50 text-purple-600">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 text-sm">Product Card Customization (Homepage &amp; Shop)</h3>
                    <p className="text-xs text-gray-400">Card background, text color &amp; unified order button design</p>
                  </div>
                </div>

                {/* Preset Selector Grid */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider flex items-center gap-1.5">
                      <svg className="w-4 h-4 text-orange-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                      </svg>
                      <span>Choose Product Card Preset Template</span>
                    </label>
                    <span className="text-[11px] font-semibold text-orange-600 bg-orange-50 px-2.5 py-0.5 rounded-full border border-orange-200">
                      5 Design Presets Available
                    </span>
                  </div>

                  <div className="grid grid-cols-1 gap-2.5">
                    {PRESETS.map((p) => {
                      const isActive = data.product_card_preset === p.id;
                      return (
                        <div
                          key={p.id}
                          onClick={() => setData('product_card_preset', p.id)}
                          className={`relative p-3.5 rounded-xl border-2 cursor-pointer transition-all flex items-start gap-3.5 ${
                            isActive
                              ? 'border-orange-500 bg-orange-50/40 shadow-xs ring-2 ring-orange-200/60'
                              : 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50/50'
                          }`}
                        >
                          <div className={`mt-0.5 p-2 rounded-xl shrink-0 ${isActive ? 'bg-orange-500 text-white shadow-xs' : 'bg-gray-100 text-gray-500'}`}>
                            {isActive ? (
                              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                              </svg>
                            ) : (
                              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                <rect x="3" y="3" width="7" height="7" rx="1.5" />
                                <rect x="14" y="3" width="7" height="7" rx="1.5" />
                                <rect x="3" y="14" width="7" height="7" rx="1.5" />
                                <rect x="14" y="14" width="7" height="7" rx="1.5" />
                              </svg>
                            )}
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-2">
                              <h4 className={`text-sm font-bold truncate ${isActive ? 'text-orange-950' : 'text-gray-800'}`}>
                                {p.name}
                              </h4>
                              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md shrink-0 uppercase tracking-wider ${
                                isActive ? 'bg-orange-500 text-white' : 'bg-gray-100 text-gray-600'
                              }`}>
                                {p.badge}
                              </span>
                            </div>
                            <p className="text-xs text-gray-500 mt-0.5 leading-snug">{p.desc}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Primary Button Styling */}
                <div className="p-4 bg-gray-50/70 rounded-xl border border-gray-100 space-y-4">
                  <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wider flex items-center gap-1.5">
                    <svg className="w-4 h-4 text-orange-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                    </svg>
                    <span>Primary Order Button</span>
                  </h4>
                  
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Primary Button Text (All Products)</label>
                    <input
                      type="text"
                      value={data.product_card_buy_text}
                      onChange={e => {
                        setData('product_card_buy_text', e.target.value);
                        setData('product_card_options_text', e.target.value);
                      }}
                      placeholder="অর্ডার করুন / ORDER NOW / Buy Now"
                      className={inputClass}
                      required
                    />
                    <p className="text-[11px] text-gray-400 mt-1">Applies to the main order action button across all product cards.</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <ColorField
                      label="Button Background Color"
                      value={data.product_card_btn_bg_color}
                      onChange={v => setData('product_card_btn_bg_color', v)}
                    />
                    <ColorField
                      label="Button Text Color"
                      value={data.product_card_btn_text_color}
                      onChange={v => setData('product_card_btn_text_color', v)}
                    />
                  </div>
                </div>

                {/* Secondary Button Styling (Preset 3 Dual CTA) */}
                <div className={`p-4 rounded-xl border space-y-4 transition-all ${data.product_card_preset === 'preset-3' ? 'bg-fuchsia-50/40 border-fuchsia-200' : 'bg-gray-50/50 border-gray-100'}`}>
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wider flex items-center gap-1.5">
                      <svg className="w-4 h-4 text-fuchsia-600 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                      <span>Secondary Button (Preset 3 Dual CTA)</span>
                    </h4>
                    {data.product_card_preset === 'preset-3' && (
                      <span className="text-[10px] font-bold text-fuchsia-600 bg-fuchsia-100 px-2 py-0.5 rounded-full">
                        Active in Current Preset
                      </span>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Secondary Button Text (View Details)</label>
                    <input
                      type="text"
                      value={data.product_card_view_text}
                      onChange={e => setData('product_card_view_text', e.target.value)}
                      placeholder="View Details / বিস্তারিত দেখুন"
                      className={inputClass}
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <ColorField
                      label="Secondary Button Background"
                      value={data.product_card_secondary_btn_bg_color}
                      onChange={v => setData('product_card_secondary_btn_bg_color', v)}
                    />
                    <ColorField
                      label="Secondary Button Text"
                      value={data.product_card_secondary_btn_text_color}
                      onChange={v => setData('product_card_secondary_btn_text_color', v)}
                    />
                  </div>
                </div>

                {/* Card Background and Colors */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                  <ColorField
                    label="Product Card Background"
                    value={data.product_card_bg_color}
                    onChange={v => setData('product_card_bg_color', v)}
                  />
                  <ColorField
                    label="Product Card Text Color"
                    value={data.product_card_text_color}
                    onChange={v => setData('product_card_text_color', v)}
                  />
                </div>

                {/* Card Shadow, Border & Curvature Controls */}
                <div className="p-4 bg-gray-50/70 rounded-xl border border-gray-100 space-y-4">
                  <div className="flex items-center justify-between pb-2 border-b border-gray-200/60">
                    <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wider flex items-center gap-1.5">
                      <svg className="w-4 h-4 text-purple-600 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                      </svg>
                      <span>Card Shadow, Border &amp; Corner Controls</span>
                    </h4>
                    <span className="text-[10px] font-semibold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-full border border-purple-200">
                      Shadow &amp; Border
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Shadow Intensity / Style */}
                    <div>
                      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                        Card Shadow Style (শ্যাডো স্টাইল)
                      </label>
                      <select
                        value={data.product_card_shadow_style}
                        onChange={e => setData('product_card_shadow_style', e.target.value)}
                        className={inputClass}
                      >
                        <option value="subtle">Soft &amp; Subtle (সফট ও হালকা - ডিফল্ট)</option>
                        <option value="none">None / Flat (কোন শ্যাডো থাকবে না - ফ্ল্যাট)</option>
                        <option value="medium">Medium Elevation (মিডিয়াম এলিভেশন)</option>
                        <option value="glow">Custom Color Glow (কালার গ্লো শ্যাডো)</option>
                      </select>
                      <p className="text-[11px] text-gray-400 mt-1">শ্যাডোর তীব্রতা ও গভীরতা নিয়ন্ত্রণ করুন।</p>
                    </div>

                    {/* Corner Radius */}
                    <div>
                      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                        Card Corner Radius (কোণার কার্ভ)
                      </label>
                      <select
                        value={data.product_card_border_radius}
                        onChange={e => setData('product_card_border_radius', e.target.value)}
                        className={inputClass}
                      >
                        <option value="preset-default">Preset Signature Curvature (ডিফল্ট সিগনেচার কার্ভ)</option>
                        <option value="rounded-none">Sharp Corners / 0px (চারকোণা সোজা)</option>
                        <option value="rounded-lg">Compact / 8px (কম্প্যাক্ট)</option>
                        <option value="rounded-xl">Standard / 12px (স্ট্যান্ডার্ড)</option>
                        <option value="rounded-2xl">Soft Modern / 16px (সফট কার্ভ)</option>
                        <option value="rounded-3xl">Ultra Curved / 24px (আল্ট্রা কার্ভ)</option>
                      </select>
                      <p className="text-[11px] text-gray-400 mt-1">কার্ডের কোণা কতটা রাউন্ড বা চারকোণা হবে।</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                    {/* Shadow Color */}
                    <ColorField
                      label="Shadow / Glow Color (শ্যাডো কালার)"
                      value={data.product_card_shadow_color}
                      onChange={v => setData('product_card_shadow_color', v)}
                    />

                    {/* Border Color */}
                    <ColorField
                      label="Card Border Color (বর্ডার কালার)"
                      value={data.product_card_border_color}
                      onChange={v => setData('product_card_border_color', v)}
                    />
                  </div>
                </div>

                <div className="pt-1">
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Direct Button Click Behavior (Simple Products)</label>
                  <select
                    value={data.product_cta_action}
                    onChange={e => setData('product_cta_action', e.target.value)}
                    className={inputClass}
                  >
                    <option value="checkout">Direct Checkout (Instantly go to Checkout)</option>
                    <option value="cart">Add to Cart (Add item to cart &amp; stay on page)</option>
                  </select>
                </div>
              </div>

              {/* 6. Mobile Sticky Bottom Action Bar (Product Details Page) */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-4">
                <div className="flex items-center gap-2 pb-3 border-b border-gray-100">
                  <div className="p-2 rounded-xl bg-rose-50 text-rose-600">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <rect x="5" y="2" width="14" height="20" rx="3" />
                      <line x1="12" y1="18" x2="12.01" y2="18" strokeWidth="2.5" strokeLinecap="round" />
                      <line x1="9" y1="15" x2="15" y2="15" strokeLinecap="round" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 text-sm">Mobile Sticky Action Bar (Product Details Page)</h3>
                    <p className="text-xs text-gray-400">Fixed bottom bar on mobile screens with product image, name, price, Add to Cart &amp; Buy Now buttons</p>
                  </div>
                </div>

                <Toggle
                  enabled={data.product_mobile_sticky_enabled}
                  onChange={v => setData('product_mobile_sticky_enabled', v)}
                  label={data.product_mobile_sticky_enabled ? "Enabled" : "Disabled"}
                  description="Display persistent bottom action bar on mobile device product details view"
                />

                {data.product_mobile_sticky_enabled && (
                  <div className="space-y-4 pt-1">
                    {/* Add to Cart styling */}
                    <div className="p-4 bg-gray-50/70 rounded-xl border border-gray-100 space-y-3">
                      <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wider flex items-center gap-1.5">
                        <svg className="w-4 h-4 text-rose-500 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <circle cx="9" cy="21" r="1" />
                          <circle cx="20" cy="21" r="1" />
                          <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
                        </svg>
                        <span>Add to Cart Button (কার্টে রাখুন)</span>
                      </h4>

                      <div>
                        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Button Text</label>
                        <input
                          type="text"
                          value={data.product_mobile_sticky_add_cart_text}
                          onChange={e => setData('product_mobile_sticky_add_cart_text', e.target.value)}
                          placeholder="কার্টে রাখুন / Add to Cart"
                          className={inputClass}
                          required
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <ColorField
                          label="Background Color"
                          value={data.product_mobile_sticky_add_cart_bg_color}
                          onChange={v => setData('product_mobile_sticky_add_cart_bg_color', v)}
                        />
                        <ColorField
                          label="Text Color"
                          value={data.product_mobile_sticky_add_cart_text_color}
                          onChange={v => setData('product_mobile_sticky_add_cart_text_color', v)}
                        />
                        <ColorField
                          label="Border Color"
                          value={data.product_mobile_sticky_add_cart_border_color}
                          onChange={v => setData('product_mobile_sticky_add_cart_border_color', v)}
                        />
                      </div>
                    </div>

                    {/* Buy Now styling */}
                    <div className="p-4 bg-gray-50/70 rounded-xl border border-gray-100 space-y-3">
                      <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wider flex items-center gap-1.5">
                        <svg className="w-4 h-4 text-rose-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.2">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                        <span>Buy Now Button (অর্ডার করুন)</span>
                      </h4>

                      <div>
                        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Button Text</label>
                        <input
                          type="text"
                          value={data.product_mobile_sticky_buy_text}
                          onChange={e => setData('product_mobile_sticky_buy_text', e.target.value)}
                          placeholder="অর্ডার করুন / Buy Now"
                          className={inputClass}
                          required
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <ColorField
                          label="Background Color"
                          value={data.product_mobile_sticky_buy_bg_color}
                          onChange={v => setData('product_mobile_sticky_buy_bg_color', v)}
                        />
                        <ColorField
                          label="Text Color"
                          value={data.product_mobile_sticky_buy_text_color}
                          onChange={v => setData('product_mobile_sticky_buy_text_color', v)}
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>

            </div>

            {/* ── Right Column: Live Preview ── */}
            <div className="lg:col-span-5 space-y-6">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 sticky top-20 space-y-5">
                <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                  <h3 className="font-bold text-gray-900 text-sm">Live Preview</h3>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
                    Interactive
                  </span>
                </div>

                {/* Product Detail Actions Preview */}
                <div className="space-y-3">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Product Details Actions</p>

                  <div className="space-y-2.5 p-4 rounded-xl bg-slate-50 border border-gray-100">
                    {/* COD Button */}
                    {data.product_page_cod_enabled && (
                      <button
                        type="button"
                        style={{
                          backgroundColor: data.product_page_cod_bg_color || '#16a34a',
                          color: data.product_page_cod_text_color || '#ffffff',
                        }}
                        className="w-full py-3 px-4 rounded-xl text-sm font-bold transition-opacity hover:opacity-95 shadow-sm flex items-center justify-center gap-2"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                        {data.product_page_cod_text}
                      </button>
                    )}

                    {/* Add to Cart & Buy Now grid */}
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        style={{
                          backgroundColor: data.product_page_add_cart_bg_color || '#f15a24',
                          color: data.product_page_add_cart_text_color || '#ffffff',
                        }}
                        className="py-2.5 px-3 rounded-xl text-xs font-bold transition-opacity hover:opacity-95 text-center truncate"
                      >
                        {data.product_page_add_cart_text}
                      </button>

                      <button
                        type="button"
                        style={{
                          backgroundColor: data.product_page_buy_bg_color || '#0b1c21',
                          color: data.product_page_buy_text_color || '#ffffff',
                        }}
                        className="py-2.5 px-3 rounded-xl text-xs font-bold transition-opacity hover:opacity-95 text-center truncate"
                      >
                        {data.product_page_buy_text}
                      </button>
                    </div>

                    {/* WhatsApp & Call row */}
                    <div className="grid grid-cols-2 gap-2">
                      {data.product_page_whatsapp_enabled && (
                        <button
                          type="button"
                          style={{
                            backgroundColor: data.product_page_whatsapp_bg_color || '#25D366',
                            color: data.product_page_whatsapp_text_color || '#ffffff',
                          }}
                          className="py-2 px-2.5 rounded-xl text-xs font-semibold transition-opacity hover:opacity-95 flex items-center justify-center gap-1.5 truncate"
                        >
                          <svg className="w-3.5 h-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                          </svg>
                          <span className="truncate">{data.product_page_whatsapp_text}</span>
                        </button>
                      )}

                      {data.product_page_call_enabled && (
                        <button
                          type="button"
                          style={{
                            backgroundColor: data.product_page_call_bg_color || '#294294',
                            color: data.product_page_call_text_color || '#ffffff',
                          }}
                          className="py-2 px-2.5 rounded-xl text-xs font-semibold transition-opacity hover:opacity-95 flex items-center justify-center gap-1.5 truncate"
                        >
                          <svg className="w-3.5 h-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                          </svg>
                          <span className="truncate">{data.product_page_call_text}</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {/* Mobile Sticky Bar Live Preview */}
                {data.product_mobile_sticky_enabled && (
                  <div className="space-y-2 pt-1">
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Mobile Sticky Bar Preview</p>
                      <span className="text-[10px] font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200">
                        Mobile Screen
                      </span>
                    </div>

                    <div className="p-2.5 bg-white rounded-xl border border-gray-200 shadow-sm flex items-center gap-2">
                      <div className="w-10 h-10 rounded-md border border-gray-200 bg-gray-100 flex items-center justify-center shrink-0 text-[9px] text-gray-400 font-bold">
                        IMG
                      </div>
                      <div className="flex flex-col min-w-0 max-w-[95px] shrink-0">
                        <span className="text-[11px] font-bold text-gray-900 truncate leading-tight">Projoss.com</span>
                        <span className="text-[11px] font-extrabold text-[#f43f5e] leading-tight mt-0.5">৳৩৫০</span>
                      </div>
                      <button
                        type="button"
                        style={{
                          backgroundColor: data.product_mobile_sticky_add_cart_bg_color || '#ffffff',
                          color: data.product_mobile_sticky_add_cart_text_color || '#f43f5e',
                          borderColor: data.product_mobile_sticky_add_cart_border_color || '#f43f5e',
                        }}
                        className="flex-1 min-w-0 h-9 rounded-lg border text-[11px] font-bold px-1.5 flex items-center justify-center gap-1 shadow-2xs leading-none"
                      >
                        <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <circle cx="9" cy="21" r="1" />
                          <circle cx="20" cy="21" r="1" />
                          <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
                        </svg>
                        <span className="truncate">{data.product_mobile_sticky_add_cart_text || 'কার্টে রাখুন'}</span>
                      </button>
                      <button
                        type="button"
                        style={{
                          backgroundColor: data.product_mobile_sticky_buy_bg_color || '#f43f5e',
                          color: data.product_mobile_sticky_buy_text_color || '#ffffff',
                        }}
                        className="flex-1 min-w-0 h-9 rounded-lg text-[11px] font-bold px-1.5 flex items-center justify-center gap-1 shadow-2xs leading-none text-white"
                      >
                        <svg className="w-3.5 h-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.2">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                        <span className="truncate">{data.product_mobile_sticky_buy_text || 'অর্ডার করুন'}</span>
                      </button>
                    </div>
                  </div>
                )}

                {/* Product Card Preview */}
                <div className="space-y-3 pt-2">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Product Card Preview</p>
                    <span className="text-[10px] font-bold text-orange-600 bg-orange-50 px-2 py-0.5 rounded-full border border-orange-200">
                      {PRESETS.find(p => p.id === data.product_card_preset)?.name.split(':')[1] || 'Preset 1'}
                    </span>
                  </div>

                  <div className="max-w-[260px] mx-auto">
                    {/* PRESET 2 LIVE PREVIEW (Urgency Stock Bar) */}
                    {data.product_card_preset === 'preset-2' && (
                      <div
                        style={{
                          backgroundColor: data.product_card_bg_color || '#FFFFFF',
                          color: data.product_card_text_color || '#111827',
                          borderColor: data.product_card_border_color || '#f1f5f9',
                          boxShadow: getCardBoxShadow(data.product_card_shadow_style, data.product_card_shadow_color, false),
                        }}
                        className={`${getCardRadiusClass(data.product_card_border_radius, 'rounded-[22px]')} border overflow-hidden p-2.5 space-y-2.5 transition-all`}
                      >
                        <div className="relative h-36 bg-gray-100 rounded-[16px] overflow-hidden flex items-center justify-center text-gray-400 text-xs font-medium">
                          <span className="text-gray-400">Product Image</span>
                          <span className="absolute left-2 top-2 bg-[#fff1f2] text-[#e11d48] border border-[#fecdd3] text-[9px] font-extrabold px-1.5 py-0.5 rounded-md truncate max-w-[calc(100%-48px)] pointer-events-none">
                            সেভ করুন ৳১০০
                          </span>
                          {/* Bottom-left Flash Deal Timer Pill */}
                          <span className="absolute left-2 bottom-2 bg-white/95 text-[#27272a] text-[8.5px] font-bold px-1.5 py-0.5 rounded-md flex items-center gap-1 border border-gray-200/80 shadow-2xs pointer-events-none">
                            <svg className="w-2.5 h-2.5 text-rose-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.2">
                              <circle cx="12" cy="12" r="10" />
                              <polyline points="12 6 12 12 16 14" />
                            </svg>
                            <span>11D 14:47</span>
                          </span>
                          {/* Wishlist icon at top-right */}
                          <span className="absolute right-2 top-2 p-1 rounded-full bg-white/90 shadow-2xs text-gray-400 border border-gray-100 pointer-events-none">
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
                            </svg>
                          </span>
                        </div>
                        <div>
                          <div className="h-[2.4rem] min-[360px]:h-[2.6rem] mb-1 flex items-start overflow-hidden">
                            <p className="font-bold text-xs leading-[1.25] line-clamp-2">বিসর্জন স্পেশাল টি-শার্ট</p>
                          </div>
                          <div className="flex items-baseline gap-1.5 mt-0.5">
                            <span className="font-extrabold text-sm text-[#e11d48]">৳৩৫০</span>
                            <span className="text-[10px] text-gray-400 line-through">৳৪৫০</span>
                          </div>
                          {/* Urgency Bar */}
                          <div className="mt-2 mb-1">
                            <div className="flex justify-between text-[8px] min-[360px]:text-[8.5px] font-extrabold uppercase tracking-tight">
                              <span className="text-gray-500">100 LEFT</span>
                              <span className="text-[#e11d48] animate-pulse">SELLING FAST</span>
                            </div>
                            <div className="w-full h-1.5 bg-rose-100 rounded-full mt-0.5 overflow-hidden">
                              <div className="h-full bg-gradient-to-r from-rose-400 to-[#e11d48] w-3/4 rounded-full" />
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-1.5 pt-1">
                          <button
                            type="button"
                            style={{
                              backgroundColor: data.product_card_btn_bg_color || '#ffffff',
                              color: data.product_card_btn_text_color || '#1e293b',
                              borderColor: data.product_card_btn_bg_color !== '#f15a24' ? data.product_card_btn_bg_color : '#cbd5e1',
                            }}
                            className="flex-1 min-w-0 h-8.5 rounded-full border text-[11px] font-bold px-2 shadow-2xs flex items-center justify-center truncate"
                          >
                            <span className="truncate">{data.product_card_buy_text || 'অর্ডার করুন'}</span>
                          </button>
                          <div className="h-8.5 w-8.5 rounded-full border border-gray-200 bg-white flex items-center justify-center text-gray-700 shrink-0 shadow-2xs">
                            <svg className="w-3.5 h-3.5 text-gray-700" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                              <circle cx="9" cy="21" r="1" />
                              <circle cx="20" cy="21" r="1" />
                              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
                            </svg>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* PRESET 3 LIVE PREVIEW (Dual CTA) */}
                    {data.product_card_preset === 'preset-3' && (
                      <div
                        style={{
                          backgroundColor: data.product_card_bg_color || '#FFFFFF',
                          color: data.product_card_text_color || '#111827',
                          borderColor: data.product_card_border_color !== '#f1f5f9' ? data.product_card_border_color : '#f1d0ea',
                          boxShadow: getCardBoxShadow(data.product_card_shadow_style, data.product_card_shadow_color, false),
                        }}
                        className={`${getCardRadiusClass(data.product_card_border_radius, 'rounded-[10px]')} border overflow-hidden p-3 space-y-2.5 transition-all text-center`}
                      >
                        <div className="relative h-36 bg-gray-50/60 rounded-[6px] overflow-hidden flex items-center justify-center text-gray-400 text-xs font-medium">
                          <span className="text-gray-400">Cosmetic Image</span>
                          <span className="absolute left-2 top-2 bg-neutral-900 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-[4px]">
                            New
                          </span>
                        </div>
                        <div>
                          <p className="font-bold text-xs truncate">Ruposhi Velvet Matte Red Lipstick</p>
                          <div className="flex items-center justify-center gap-0.5 my-1 text-amber-500">
                            {[1, 2, 3, 4, 5].map(s => (
                              <svg key={s} className="w-3 h-3 fill-amber-400" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                            ))}
                          </div>
                          <div className="flex items-baseline justify-center gap-1.5">
                            <span className="text-[10px] text-gray-400 line-through">850৳</span>
                            <span className="font-black text-sm text-[#ff007f]">650৳</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-1.5 pt-1">
                          <button
                            type="button"
                            style={{
                              backgroundColor: data.product_card_secondary_btn_bg_color || '#e11d48',
                              color: data.product_card_secondary_btn_text_color || '#ffffff',
                            }}
                            className="flex-1 min-w-0 h-9 rounded-[6px] text-[10.5px] font-bold px-1.5 shadow-2xs flex items-center justify-center gap-1 truncate"
                          >
                            <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                            <span className="truncate">{data.product_card_view_text || 'View Details'}</span>
                          </button>
                          <button
                            type="button"
                            style={{
                              backgroundColor: data.product_card_btn_bg_color || '#18181b',
                              color: data.product_card_btn_text_color || '#ffffff',
                            }}
                            className="flex-1 min-w-0 h-9 rounded-[6px] text-[10.5px] font-bold px-1.5 shadow-2xs flex items-center justify-center gap-1 truncate"
                          >
                            <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <circle cx="9" cy="21" r="1" />
                              <circle cx="20" cy="21" r="1" />
                              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
                            </svg>
                            <span className="truncate">{data.product_card_buy_text || 'Buy Now'}</span>
                          </button>
                        </div>
                      </div>
                    )}

                    {/* PRESET 4 LIVE PREVIEW (Minimal Tech Clean) */}
                    {data.product_card_preset === 'preset-4' && (
                      <div
                        style={{
                          backgroundColor: data.product_card_bg_color || '#FFFFFF',
                          color: data.product_card_text_color || '#111827',
                          borderColor: data.product_card_border_color || '#f1f5f9',
                          boxShadow: getCardBoxShadow(data.product_card_shadow_style, data.product_card_shadow_color, false),
                        }}
                        className={`${getCardRadiusClass(data.product_card_border_radius, 'rounded-[18px]')} border overflow-hidden p-3 space-y-2.5 transition-all`}
                      >
                        <div className="relative h-36 bg-slate-50 rounded-xl overflow-hidden flex items-center justify-center text-gray-400 text-xs font-medium">
                          <span className="text-gray-400">Tech Device Image</span>
                          <span className="absolute right-2 top-2 bg-white text-slate-700 border border-slate-200 text-[9px] font-bold px-1.5 py-0.5 rounded-md flex items-center gap-1 shadow-2xs">
                            <svg className="w-2.5 h-2.5 text-amber-500 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M17.707 9.293a1 1 0 010 1.414l-7 7a1 1 0 01-1.414 0l-7-7A.997.997 0 012 10V5a3 3 0 013-3h5c.256 0 .512.098.707.293l7 7zM5 6a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                            </svg>
                            <span>Save ৳1,049</span>
                          </span>
                        </div>
                        <div>
                          <p className="font-bold text-xs truncate">Cudy M3000 Dual Band</p>
                          <div className="flex items-baseline gap-1.5 mt-1">
                            <span className="font-extrabold text-sm text-slate-900">৳15,001</span>
                            <span className="text-[10px] text-slate-400 line-through">৳16,050</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-1.5 pt-1">
                          <button
                            type="button"
                            style={{
                              backgroundColor: data.product_card_btn_bg_color !== '#f15a24' ? data.product_card_btn_bg_color : '#ffffff',
                              color: data.product_card_btn_text_color !== '#ffffff' ? data.product_card_btn_text_color : '#0f172a',
                              borderColor: '#cbd5e1',
                            }}
                            className="flex-1 min-w-0 h-9 rounded-full border text-xs font-bold px-2 shadow-2xs flex items-center justify-center truncate"
                          >
                            <span className="truncate">{data.product_card_buy_text || 'Order Now'}</span>
                          </button>
                          <div className="h-9 w-9 rounded-full border border-slate-200 bg-white flex items-center justify-center text-slate-700 shrink-0 shadow-2xs">
                            <svg className="w-4 h-4 text-slate-700" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                              <circle cx="9" cy="21" r="1" />
                              <circle cx="20" cy="21" r="1" />
                              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
                            </svg>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* PRESET 5 LIVE PREVIEW (Soft Pastel & Floating Image Quick-Cart - Unique Distinct Design) */}
                    {data.product_card_preset === 'preset-5' && (
                      <div
                        style={{
                          backgroundColor: data.product_card_bg_color || '#FFFFFF',
                          color: data.product_card_text_color || '#111827',
                          borderColor: data.product_card_border_color || '#f1f5f9',
                          boxShadow: getCardBoxShadow(data.product_card_shadow_style, data.product_card_shadow_color, false),
                        }}
                        className={`${getCardRadiusClass(data.product_card_border_radius, 'rounded-[24px]')} border overflow-hidden p-2.5 space-y-2.5 transition-all`}
                      >
                        <div className="relative h-36 bg-rose-50/40 rounded-[18px] overflow-hidden flex items-center justify-center text-gray-400 text-xs font-medium">
                          <span className="text-gray-400">T-Shirt Image</span>
                          {/* Soft pink savings badge top-left */}
                          <span className="absolute left-2 top-2 bg-[#fff1f2] text-[#e11d48] border border-[#fecdd3] text-[9px] font-extrabold px-1.5 py-0.5 rounded-lg shadow-2xs">
                            সেভ করুন ৳৫০
                          </span>

                          {/* Floating Circular Quick-Add Cart Button on bottom-right of image */}
                          <div className="absolute right-2 bottom-2 h-8.5 w-8.5 rounded-full border border-gray-100 bg-white shadow-md flex items-center justify-center text-gray-800">
                            <svg className="w-3.5 h-3.5 text-gray-700" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <circle cx="9" cy="21" r="1" />
                              <circle cx="20" cy="21" r="1" />
                              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
                            </svg>
                          </div>
                        </div>

                        <div>
                          <p className="font-bold text-xs truncate">জগন্নাথ মন্দির টি শার্ট</p>
                          <div className="flex items-baseline gap-1.5 mt-1">
                            <span className="font-black text-sm text-[#e11d48]">৳৪০০</span>
                            <span className="text-[10px] text-gray-400 line-through">৳৪৫০</span>
                          </div>
                        </div>

                        {/* Full-width prominent order button */}
                        <div className="pt-0.5">
                          <button
                            type="button"
                            style={{
                              backgroundColor: data.product_card_btn_bg_color || '#f15a24',
                              color: data.product_card_btn_text_color || '#ffffff',
                            }}
                            className="w-full h-9 rounded-xl text-xs font-bold px-2 shadow-2xs flex items-center justify-center gap-1.5 truncate"
                          >
                            <svg className="w-3.5 h-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.2">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                            <span className="truncate">{data.product_card_buy_text || 'অর্ডার করুন'}</span>
                          </button>
                        </div>
                      </div>
                    )}

                    {/* PRESET 1 LIVE PREVIEW (Default Modern Compact) */}
                    {(!data.product_card_preset || data.product_card_preset === 'preset-1') && (
                      <div
                        style={{
                          backgroundColor: data.product_card_bg_color || '#FFFFFF',
                          color: data.product_card_text_color || '#111827',
                          borderColor: data.product_card_border_color || '#f1f5f9',
                          boxShadow: getCardBoxShadow(data.product_card_shadow_style, data.product_card_shadow_color, false),
                        }}
                        className={`${getCardRadiusClass(data.product_card_border_radius, 'rounded-2xl')} border overflow-hidden p-3 space-y-2.5 transition-all`}
                      >
                        <div className="relative h-32 bg-gray-100 rounded-xl flex items-center justify-center text-gray-400 text-xs font-medium">
                          <span className="text-gray-400">Product Image</span>
                          <span className="absolute left-2 top-2 bg-amber-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded shadow-2xs">
                            Best Seller
                          </span>
                        </div>
                        <div>
                          <p className="font-bold text-xs truncate">Sample Product</p>
                          <p className="font-extrabold text-sm text-orange-600 mt-0.5">৳1,450</p>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <div className="h-9 w-9 rounded-xl border border-gray-200 bg-white flex items-center justify-center text-gray-700 shrink-0 shadow-2xs">
                            <svg className="w-4 h-4 text-gray-700" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                              <circle cx="9" cy="21" r="1" />
                              <circle cx="20" cy="21" r="1" />
                              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
                            </svg>
                          </div>
                          <button
                            type="button"
                            style={{
                              backgroundColor: data.product_card_btn_bg_color || '#f15a24',
                              color: data.product_card_btn_text_color || '#ffffff',
                            }}
                            className="flex-1 min-w-0 h-9 rounded-lg sm:rounded-xl text-[10px] min-[360px]:text-[11px] sm:text-[13px] font-bold px-1.5 sm:px-3 shadow-sm transition-all hover:brightness-95 flex items-center justify-center gap-1 sm:gap-1.5 leading-none"
                          >
                            <svg className="w-3 h-3 sm:w-3.5 sm:h-3.5 shrink-0" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                            <span className="truncate whitespace-nowrap tracking-tight">{data.product_card_buy_text || 'অর্ডার করুন'}</span>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="button"
                    onClick={submit}
                    disabled={processing}
                    className="w-full py-3 bg-orange-500 hover:bg-orange-600 disabled:opacity-60 text-white text-sm font-bold rounded-xl transition-all shadow-sm shadow-orange-200"
                  >
                    {processing ? 'Saving...' : 'Save All Changes'}
                  </button>
                </div>
              </div>
            </div>

          </form>
        </div>
      </AdminLayout>
    </>
  );
}