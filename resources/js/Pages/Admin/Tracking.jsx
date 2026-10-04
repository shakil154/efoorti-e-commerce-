import AdminLayout from '@/Layouts/AdminLayout';
import { Head, useForm, usePage } from '@inertiajs/react';
import { useState } from 'react';

const inputClass = "w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300";
const checkboxClass = "h-4 w-4 accent-orange-500 rounded";

function Field({ label, error, children }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1.5">{label}</label>
      {children}
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
}

/* ─── Official Brand SVG Icons ──────────────────────────────────────── */
function GoogleIcon({ className = "w-4 h-4" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
      <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"/>
      <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"/>
      <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z"/>
      <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"/>
    </svg>
  );
}

function FacebookIcon({ className = "w-4 h-4", fill = "#1877F2" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill={fill} aria-hidden="true">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
    </svg>
  );
}

function TikTokIcon({ className = "w-4 h-4" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.61c.35 0 .68.05.99.15V9.44a6.37 6.37 0 0 0-1-.08A6.34 6.34 0 0 0 3 15.7a6.34 6.34 0 0 0 10.82 4.48 6.3 6.3 0 0 0 1.86-4.48V8.58a8.18 8.18 0 0 0 4.77 1.5v-3.4a4.85 4.85 0 0 1-.86.01z"/>
    </svg>
  );
}

function GoogleLogoBadge({ size = 36 }) {
  return (
    <div
      className="rounded-xl flex items-center justify-center bg-white border border-gray-200 shadow-sm shrink-0"
      style={{ width: size, height: size }}
    >
      <GoogleIcon className="w-5 h-5" />
    </div>
  );
}

function FacebookLogoBadge({ size = 36 }) {
  return (
    <div
      className="rounded-xl flex items-center justify-center bg-[#1877F2] text-white shadow-sm shrink-0"
      style={{ width: size, height: size }}
    >
      <FacebookIcon className="w-5 h-5" fill="#FFFFFF" />
    </div>
  );
}

function TikTokColorBadge({ size = 36 }) {
  return (
    <div
      className="rounded-xl flex items-center justify-center bg-black shadow-sm shrink-0 relative overflow-hidden"
      style={{ width: size, height: size }}
    >
      <svg width={size * 0.58} height={size * 0.58} viewBox="0 0 24 24" fill="none">
        <path
          d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.61c.35 0 .68.05.99.15V9.44a6.37 6.37 0 0 0-1-.08A6.34 6.34 0 0 0 3 15.7a6.34 6.34 0 0 0 10.82 4.48 6.3 6.3 0 0 0 1.86-4.48V8.58a8.18 8.18 0 0 0 4.77 1.5v-3.4a4.85 4.85 0 0 1-.86.01z"
          fill="#25F4EE"
          transform="translate(-0.6, -0.6)"
        />
        <path
          d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.61c.35 0 .68.05.99.15V9.44a6.37 6.37 0 0 0-1-.08A6.34 6.34 0 0 0 3 15.7a6.34 6.34 0 0 0 10.82 4.48 6.3 6.3 0 0 0 1.86-4.48V8.58a8.18 8.18 0 0 0 4.77 1.5v-3.4a4.85 4.85 0 0 1-.86.01z"
          fill="#FE2C55"
          transform="translate(0.6, 0.6)"
        />
        <path
          d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.61c.35 0 .68.05.99.15V9.44a6.37 6.37 0 0 0-1-.08A6.34 6.34 0 0 0 3 15.7a6.34 6.34 0 0 0 10.82 4.48 6.3 6.3 0 0 0 1.86-4.48V8.58a8.18 8.18 0 0 0 4.77 1.5v-3.4a4.85 4.85 0 0 1-.86.01z"
          fill="#FFFFFF"
        />
      </svg>
    </div>
  );
}

export default function Tracking({ settings = {} }) {
  const { flash } = usePage().props;
  const [testingCapi, setTestingCapi] = useState(false);
  const [capiTestResult, setCapiTestResult] = useState(null);
  const [showCapiToken, setShowCapiToken] = useState(false);
  const [trackingSubTab, setTrackingSubTab] = useState('all');

  const { data, setData, post, processing, errors } = useForm({
    tracking_gtm_id:               settings.tracking_gtm_id || '',
    tracking_ga4_id:               settings.tracking_ga4_id || '',
    tracking_ga4_api_secret:       settings.tracking_ga4_api_secret || '',
    tracking_meta_pixel_id:        settings.tracking_meta_pixel_id || '',
    tracking_meta_capi_enabled:    settings.tracking_meta_capi_enabled === '1',
    tracking_meta_capi_token:      settings.tracking_meta_capi_token || '',
    tracking_meta_test_event_code: settings.tracking_meta_test_event_code || '',
    meta_domain_verification:      settings.meta_domain_verification || '',
    tracking_google_ads_id:        settings.tracking_google_ads_id || '',
    tracking_google_ads_label:     settings.tracking_google_ads_label || '',
    tracking_tiktok_pixel_id:      settings.tracking_tiktok_pixel_id || '',
    custom_header_scripts:         settings.custom_header_scripts || '',
    custom_body_scripts:           settings.custom_body_scripts || '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    post('/admin/tracking', {
      preserveScroll: true,
    });
  };

  const handleTestCapi = async () => {
    if (!data.tracking_meta_pixel_id || !data.tracking_meta_capi_token) {
      alert('Please enter both Meta Pixel ID and Conversions API Access Token first.');
      return;
    }
    setTestingCapi(true);
    setCapiTestResult(null);
    try {
      const res = await fetch('/admin/tracking/test-capi', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
        },
        body: JSON.stringify({
          pixel_id: data.tracking_meta_pixel_id,
          access_token: data.tracking_meta_capi_token,
          test_event_code: data.tracking_meta_test_event_code,
        }),
      });
      const json = await res.json();
      setCapiTestResult({
        success: Boolean(res.ok && json.success),
        message: json.message || (res.ok ? 'Connection successful!' : 'Connection failed'),
      });
    } catch (err) {
      setCapiTestResult({
        success: false,
        message: 'Error testing CAPI connection: ' + err.message,
      });
    } finally {
      setTestingCapi(false);
    }
  };

  return (
    <AdminLayout>
      <Head title="Marketing & Pixel Tracking" />

      <div className="max-w-5xl mx-auto space-y-6 pb-12">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <div className="flex items-center -space-x-2 shrink-0">
                <FacebookLogoBadge size={34} />
                <GoogleLogoBadge size={34} />
                <TikTokColorBadge size={34} />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Pixel & Marketing Tracking</h1>
                <p className="text-xs text-gray-500">Configure Facebook Pixel, CAPI, Google Analytics 4, Tag Manager, Google Ads & TikTok Pixel</p>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={handleSubmit}
            disabled={processing}
            className="px-6 py-2.5 bg-orange-500 hover:bg-orange-600 disabled:opacity-60 text-white text-sm font-semibold rounded-xl shadow-sm transition-colors"
          >
            {processing ? 'Saving...' : 'Save All Settings'}
          </button>
        </div>

        {/* Status Toast / Alert */}
        {flash?.status && (
          <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm font-medium rounded-xl flex items-center gap-2.5 shadow-xs">
            <svg className="w-4 h-4 text-emerald-500 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
            {flash.status}
          </div>
        )}

        {/* Channel Switcher Navigation */}
        <div className="flex flex-wrap items-center gap-2 p-1.5 bg-gray-100/90 rounded-2xl">
          <button
            type="button"
            onClick={() => setTrackingSubTab('all')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${trackingSubTab === 'all' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-800'}`}
          >
            View All Channels
          </button>
          <button
            type="button"
            onClick={() => setTrackingSubTab('google')}
            className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${trackingSubTab === 'google' ? 'bg-emerald-600 text-white shadow-sm' : 'text-emerald-800 bg-emerald-50 hover:bg-emerald-100'}`}
          >
            <GoogleIcon className="w-3.5 h-3.5 shrink-0" />
            Google (GA4 & Ads)
          </button>
          <button
            type="button"
            onClick={() => setTrackingSubTab('meta')}
            className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${trackingSubTab === 'meta' ? 'bg-[#1877F2] text-white shadow-sm' : 'text-blue-800 bg-blue-50 hover:bg-blue-100'}`}
          >
            <FacebookIcon className="w-3.5 h-3.5 shrink-0" fill={trackingSubTab === 'meta' ? '#FFFFFF' : '#1877F2'} />
            Facebook (Pixel & CAPI)
          </button>
          <button
            type="button"
            onClick={() => setTrackingSubTab('tiktok')}
            className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${trackingSubTab === 'tiktok' ? 'bg-black text-white shadow-sm' : 'text-gray-700 bg-gray-200 hover:bg-gray-300'}`}
          >
            <TikTokIcon className="w-3.5 h-3.5 shrink-0" />
            TikTok Pixel
          </button>
          <button
            type="button"
            onClick={() => setTrackingSubTab('custom')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${trackingSubTab === 'custom' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-800'}`}
          >
            Custom Scripts
          </button>
        </div>

        {/* Quick Status Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div onClick={() => setTrackingSubTab('google')} className="cursor-pointer bg-white border border-gray-100 rounded-xl p-3 hover:border-emerald-300 transition-colors shadow-xs">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <GoogleIcon className="w-3.5 h-3.5" />
                <p className="text-[11px] text-gray-600 font-semibold">Google GA4</p>
              </div>
              <span className={`inline-block w-2 h-2 rounded-full ${data.tracking_ga4_id ? 'bg-emerald-500' : 'bg-gray-300'}`}></span>
            </div>
            <p className="text-xs font-bold text-gray-900 truncate mt-1.5">{data.tracking_ga4_id || 'Not Connected'}</p>
          </div>

          <div onClick={() => setTrackingSubTab('meta')} className="cursor-pointer bg-white border border-gray-100 rounded-xl p-3 hover:border-blue-300 transition-colors shadow-xs">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <FacebookIcon className="w-3.5 h-3.5" fill="#1877F2" />
                <p className="text-[11px] text-gray-600 font-semibold">Facebook Pixel</p>
              </div>
              <span className={`inline-block w-2 h-2 rounded-full ${data.tracking_meta_pixel_id ? 'bg-blue-500' : 'bg-gray-300'}`}></span>
            </div>
            <p className="text-xs font-bold text-gray-900 truncate mt-1.5">{data.tracking_meta_pixel_id || 'Not Connected'}</p>
          </div>

          <div onClick={() => setTrackingSubTab('google')} className="cursor-pointer bg-white border border-gray-100 rounded-xl p-3 hover:border-emerald-300 transition-colors shadow-xs">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <GoogleIcon className="w-3.5 h-3.5" />
                <p className="text-[11px] text-gray-600 font-semibold">Google Ads</p>
              </div>
              <span className={`inline-block w-2 h-2 rounded-full ${data.tracking_google_ads_id ? 'bg-emerald-500' : 'bg-gray-300'}`}></span>
            </div>
            <p className="text-xs font-bold text-gray-900 truncate mt-1.5">{data.tracking_google_ads_id || 'Not Connected'}</p>
          </div>

          <div onClick={() => setTrackingSubTab('tiktok')} className="cursor-pointer bg-white border border-gray-100 rounded-xl p-3 hover:border-gray-400 transition-colors shadow-xs">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <TikTokIcon className="w-3.5 h-3.5 text-black" />
                <p className="text-[11px] text-gray-600 font-semibold">TikTok Pixel</p>
              </div>
              <span className={`inline-block w-2 h-2 rounded-full ${data.tracking_tiktok_pixel_id ? 'bg-gray-800' : 'bg-gray-300'}`}></span>
            </div>
            <p className="text-xs font-bold text-gray-900 truncate mt-1.5">{data.tracking_tiktok_pixel_id || 'Not Connected'}</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* 1. Google Marketing Suite */}
          {(trackingSubTab === 'all' || trackingSubTab === 'google') && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                <div className="flex items-center gap-3">
                  <GoogleLogoBadge size={38} />
                  <div>
                    <h2 className="font-bold text-gray-900 leading-tight">Google Marketing Suite</h2>
                    <p className="text-xs text-gray-500">Google Analytics 4 (GA4), Tag Manager & Google Ads Conversions</p>
                  </div>
                </div>
                <span className="text-xs font-semibold px-2.5 py-1 bg-emerald-50 text-emerald-700 rounded-full border border-emerald-100">
                  GA4 Active
                </span>
              </div>

              {/* Highlighted GA4 Section */}
              <div className="bg-gradient-to-br from-emerald-50/60 via-teal-50/30 to-slate-50 border border-emerald-100 rounded-xl p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-sm font-bold text-emerald-950">Google Analytics 4 (GA4)</span>
                    <p className="text-xs text-gray-600">Track visitors, product views, add to cart, and e-commerce purchases directly in GA4.</p>
                  </div>
                  <span className="text-xs font-semibold px-2.5 py-1 bg-emerald-100 text-emerald-800 rounded-full border border-emerald-200">
                    GA4 Standard
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-3 border-t border-emerald-100/70">
                  <Field label="Google Analytics 4 (GA4) Measurement ID" error={errors.tracking_ga4_id}>
                    <input 
                      value={data.tracking_ga4_id} 
                      onChange={e => setData('tracking_ga4_id', e.target.value)} 
                      className={inputClass} 
                      placeholder="G-XXXXXXXXXX" 
                    />
                    <p className="text-[11px] text-gray-500 mt-1">Found in Google Analytics &gt; Admin &gt; Data Streams &gt; Measurement ID</p>
                  </Field>

                  <Field label="GA4 Measurement Protocol API Secret (Optional)" error={errors.tracking_ga4_api_secret}>
                    <input 
                      value={data.tracking_ga4_api_secret} 
                      onChange={e => setData('tracking_ga4_api_secret', e.target.value)} 
                      className={inputClass} 
                      placeholder="API Secret for server measurement" 
                    />
                    <p className="text-[11px] text-gray-500 mt-1">From GA4 Data Streams &gt; Measurement Protocol API secrets</p>
                  </Field>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                <Field label="Google Tag Manager (GTM) Container ID" error={errors.tracking_gtm_id}>
                  <input value={data.tracking_gtm_id} onChange={e => setData('tracking_gtm_id', e.target.value)} className={inputClass} placeholder="GTM-XXXXXXX" />
                  <p className="text-[11px] text-gray-400 mt-1">Optional container ID if you manage tags through GTM</p>
                </Field>

                <Field label="Google Ads Conversion ID (Tag ID)" error={errors.tracking_google_ads_id}>
                  <input value={data.tracking_google_ads_id} onChange={e => setData('tracking_google_ads_id', e.target.value)} className={inputClass} placeholder="e.g. AW-123456789" />
                  <p className="text-[11px] text-gray-400 mt-1">Google Ads account conversion tracking tag ID</p>
                </Field>

                <div className="md:col-span-2">
                  <Field label="Google Ads Purchase Conversion Label" error={errors.tracking_google_ads_label}>
                    <input value={data.tracking_google_ads_label} onChange={e => setData('tracking_google_ads_label', e.target.value)} className={inputClass} placeholder="e.g. AbC-D_efG-h123" />
                    <p className="text-[11px] text-gray-400 mt-1">Fires conversion event when customers complete an order</p>
                  </Field>
                </div>
              </div>
            </div>
          )}

          {/* 2. Meta (Facebook) Suite */}
          {(trackingSubTab === 'all' || trackingSubTab === 'meta') && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                <div className="flex items-center gap-3">
                  <FacebookLogoBadge size={38} />
                  <div>
                    <h2 className="font-bold text-gray-900 leading-tight">Facebook Pixel & Conversions API (CAPI)</h2>
                    <p className="text-xs text-gray-500">Official Meta browser pixel & server-side conversion tracking with deduplication</p>
                  </div>
                </div>
                <span className="text-xs font-semibold px-2.5 py-1 bg-blue-50 text-blue-700 rounded-full border border-blue-100">
                  CAPI & iOS 14.5+ Ready
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Field label="Meta Pixel / Dataset ID" error={errors.tracking_meta_pixel_id}>
                  <input 
                    value={data.tracking_meta_pixel_id} 
                    onChange={e => setData('tracking_meta_pixel_id', e.target.value)} 
                    className={inputClass} 
                    placeholder="e.g. 45654645645646" 
                  />
                  <p className="text-[11px] text-gray-400 mt-1">Found in Meta Events Manager &gt; Data Sources</p>
                </Field>

                <Field label="Facebook Domain Verification" error={errors.meta_domain_verification}>
                  <input 
                    value={data.meta_domain_verification} 
                    onChange={e => setData('meta_domain_verification', e.target.value)} 
                    className={inputClass} 
                    placeholder="Verification code or <meta ... />" 
                  />
                  <p className="text-[11px] text-gray-400 mt-1">From Business Settings &gt; Brand Safety &gt; Domains</p>
                </Field>
              </div>

              {/* CAPI Card */}
              <div className="bg-gradient-to-br from-blue-50/60 via-indigo-50/30 to-slate-50 border border-blue-100 rounded-xl p-5 space-y-4">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={data.tracking_meta_capi_enabled} 
                    onChange={e => setData('tracking_meta_capi_enabled', e.target.checked)} 
                    className={`${checkboxClass} mt-0.5`} 
                  />
                  <div>
                    <span className="text-sm font-bold text-gray-900">Enable Meta Conversions API (Server-Side Tracking)</span>
                    <p className="text-xs text-gray-600 mt-0.5">Sends purchase events directly from server to Meta's Graph API with customer data (hashed phone, email, IP, browser cookies). Bypasses ad-blockers and Safari/iOS tracking limits.</p>
                  </div>
                </label>

                <div className="space-y-3 pt-3 border-t border-blue-100/80">
                  <Field label="Conversions API Access Token" error={errors.tracking_meta_capi_token}>
                    <div className="relative">
                      <input 
                        type={showCapiToken ? "text" : "password"}
                        value={data.tracking_meta_capi_token} 
                        onChange={e => setData('tracking_meta_capi_token', e.target.value)} 
                        className={`${inputClass} pr-20 font-mono text-xs`} 
                        placeholder="EAAGm..." 
                      />
                      <button
                        type="button"
                        onClick={() => setShowCapiToken(!showCapiToken)}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs font-semibold text-gray-500 hover:text-gray-800 px-2 py-1 bg-gray-100 hover:bg-gray-200 rounded"
                      >
                        {showCapiToken ? 'Hide' : 'Show'}
                      </button>
                    </div>
                    <p className="text-[11px] text-gray-500 mt-1">Generate in Meta Events Manager &gt; Settings &gt; Conversions API &gt; "Generate access token".</p>
                  </Field>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
                    <Field label="Test Event Code (Optional)" error={errors.tracking_meta_test_event_code}>
                      <input 
                        value={data.tracking_meta_test_event_code} 
                        onChange={e => setData('tracking_meta_test_event_code', e.target.value)} 
                        className={inputClass} 
                        placeholder="e.g. TEST12345" 
                      />
                      <p className="text-[11px] text-gray-500 mt-1">From Meta Events Manager &gt; Test Events tab. Leave blank for production.</p>
                    </Field>

                    <div>
                      <button
                        type="button"
                        onClick={handleTestCapi}
                        disabled={testingCapi || !data.tracking_meta_pixel_id || !data.tracking_meta_capi_token}
                        className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-sm font-semibold rounded-xl shadow-sm transition-colors"
                      >
                        {testingCapi ? (
                          <>
                            <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                            </svg>
                            Testing CAPI...
                          </>
                        ) : (
                          <>
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                            Test Meta CAPI Connection
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                  {capiTestResult && (
                    <div className={`p-3.5 rounded-xl text-xs font-medium flex items-start gap-2.5 ${capiTestResult.success ? 'bg-green-100 border border-green-200 text-green-800' : 'bg-red-50 border border-red-200 text-red-700'}`}>
                      {capiTestResult.success ? (
                        <svg className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                      ) : (
                        <svg className="w-4 h-4 text-red-600 shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                      )}
                      <div className="flex-1">
                        <p className="font-bold">{capiTestResult.success ? 'CAPI Verified Successfully' : 'CAPI Test Failed'}</p>
                        <p className="mt-0.5 opacity-90">{capiTestResult.message}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* 3. TikTok Marketing */}
          {(trackingSubTab === 'all' || trackingSubTab === 'tiktok') && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-5">
              <div className="flex items-center gap-3 pb-3 border-b border-gray-100">
                <TikTokColorBadge size={38} />
                <div>
                  <h2 className="font-bold text-gray-900 leading-tight">TikTok Marketing</h2>
                  <p className="text-xs text-gray-500">Official TikTok Pixel for tracking TikTok Ads performance & conversions</p>
                </div>
              </div>

              <Field label="TikTok Pixel ID" error={errors.tracking_tiktok_pixel_id}>
                <input value={data.tracking_tiktok_pixel_id} onChange={e => setData('tracking_tiktok_pixel_id', e.target.value)} className={inputClass} placeholder="e.g. CXXXXXXXXXXXXXXX" />
                <p className="text-[11px] text-gray-400 mt-1">Found in TikTok Ads Manager &gt; Assets &gt; Events</p>
              </Field>
            </div>
          )}

          {/* 4. Custom Scripts */}
          {(trackingSubTab === 'all' || trackingSubTab === 'custom') && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-5">
              <div className="pb-3 border-b border-gray-100">
                <h2 className="font-bold text-gray-900 leading-tight">Custom Tracking & Header/Body Scripts</h2>
                <p className="text-xs text-gray-500">Inject custom HTML or JavaScript snippets (Pinterest, Snapchat, Microsoft Clarity, Hotjar, etc.)</p>
              </div>

              <Field label="Custom Header Scripts (Injected inside <head>)" error={errors.custom_header_scripts}>
                <textarea 
                  value={data.custom_header_scripts} 
                  onChange={e => setData('custom_header_scripts', e.target.value)} 
                  rows={4} 
                  className={`${inputClass} font-mono text-xs`} 
                  placeholder="<!-- Custom <script> or <meta> tags here -->" 
                />
                <p className="text-[11px] text-gray-400 mt-1">Injected into all pages right before the closing &lt;/head&gt; tag</p>
              </Field>

              <Field label="Custom Body Scripts (Injected right after <body>)" error={errors.custom_body_scripts}>
                <textarea 
                  value={data.custom_body_scripts} 
                  onChange={e => setData('custom_body_scripts', e.target.value)} 
                  rows={4} 
                  className={`${inputClass} font-mono text-xs`} 
                  placeholder="<!-- Custom <body> noscript or tracking tags here -->" 
                />
                <p className="text-[11px] text-gray-400 mt-1">Injected right after the opening &lt;body&gt; tag on all pages</p>
              </Field>
            </div>
          )}

          {/* Save Button */}
          <div className="flex items-center gap-4 pt-2">
            <button
              type="submit"
              disabled={processing}
              className="px-8 py-3.5 bg-orange-500 hover:bg-orange-600 disabled:opacity-60 text-white font-bold rounded-xl shadow-sm transition-colors text-sm"
            >
              {processing ? 'Saving Changes...' : 'Save Tracking Settings'}
            </button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
}
