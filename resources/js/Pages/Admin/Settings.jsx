import AdminLayout from '@/Layouts/AdminLayout';
import { Head, useForm, router } from '@inertiajs/react';
import { useState } from 'react';
import { fileToBase64 } from '@/lib/utils';
import {
  ADMIN_THEME_PRESETS,
  LINK_COLOR_PRESETS,
  HEADER_TEMPLATES,
  HEADER_NAV_COLOR_PRESETS,
  generateThemePalette,
  applyAdminTheme,
  applyHeaderNavTheme,
  setLocalAdminTheme,
} from '@/lib/adminTheme';

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

export default function Settings({ settings }) {
  const [activeTab, setActiveTab] = useState(() => {
    if (typeof window !== 'undefined') {
      const tab = new URLSearchParams(window.location.search).get('tab');
      if (tab) return tab;
    }
    return 'brand';
  });
  const [testEmail, setTestEmail] = useState('');
  const [testingMail, setTestingMail] = useState(false);
  const [mailTestResult, setMailTestResult] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [testingCapi, setTestingCapi] = useState(false);
  const [capiTestResult, setCapiTestResult] = useState(null);
  const [showCapiToken, setShowCapiToken] = useState(false);
  const [trackingSubTab, setTrackingSubTab] = useState('all');
  const [copiedSeed, setCopiedSeed] = useState(false);
  const [testingTelegram, setTestingTelegram] = useState(false);
  const [telegramTestResult, setTelegramTestResult] = useState(null);
  const [detectingTelegram, setDetectingTelegram] = useState(false);
  const [detectedChats, setDetectedChats] = useState(null);
  const [showBotToken, setShowBotToken] = useState(false);
  const [testingAdminAlert, setTestingAdminAlert] = useState(false);
  const [adminAlertTestResult, setAdminAlertTestResult] = useState(null);
  const [testingPathao, setTestingPathao] = useState(false);
  const [pathaoTestResult, setPathaoTestResult] = useState(null);

  const { data, setData, errors, setError, clearErrors } = useForm({
    // Brand
    site_name: settings.site_name || '', tagline: settings.tagline || '', footer_text: settings.footer_text || '',
    contact_phone: settings.contact_phone || '', contact_email: settings.contact_email || '', contact_address: settings.contact_address || '',
    contact_hours: settings.contact_hours || '', contact_title: settings.contact_title || '', contact_intro: settings.contact_intro || '',
    facebook_url: settings.facebook_url || '', instagram_url: settings.instagram_url || '', twitter_url: settings.twitter_url || '', search_placeholder: settings.search_placeholder || '',
    logo_file: null, favicon_file: null, remove_logo: false, remove_favicon: false,
    footer_credit_enabled: settings.footer_credit_enabled !== '0',
    footer_credit_prefix: settings.footer_credit_prefix || 'DESIGNED BY',
    footer_credit_name: settings.footer_credit_name || 'PROJOSS',
    footer_credit_url: settings.footer_credit_url || 'https://projoss.com/',
    verification_code: '',
    
    // Chat
    chat_enabled: settings.chat_enabled === '1' || settings.chat_enabled === true,
    whatsapp_number: settings.whatsapp_number || '', messenger_page: settings.messenger_page || '',
    call_number: settings.call_number || '',
    
    // Homepage
    show_brands_marquee: settings.show_brands_marquee === '1', brands_marquee: settings.brands_marquee || '',
    header_promo_text: settings.header_promo_text || '', header_promo_link: settings.header_promo_link || '', shop_subtitle: settings.shop_subtitle || '',
    deal_ends_at: settings.deal_ends_at ? settings.deal_ends_at.slice(0, 16) : '', delivery_eta_text: settings.delivery_eta_text || '',
    homepage_tab_count: settings.homepage_tab_count || '4', home_categories_title: settings.home_categories_title || '', home_hot_deal_title: settings.home_hot_deal_title || '',
    home_featured_title: settings.home_featured_title || '', home_deal_week_title: settings.home_deal_week_title || '', home_tabs_title: settings.home_tabs_title || '',
    home_brands_label: settings.home_brands_label || '', home_view_more_label: settings.home_view_more_label || '', default_cta_text: settings.default_cta_text || '',
    product_cta_action: settings.product_cta_action || 'checkout', hero_fallback_badge: settings.hero_fallback_badge || '', hero_fallback_title: settings.hero_fallback_title || '',
    hero_fallback_subtitle: settings.hero_fallback_subtitle || '',

    // Storefront UI
    product_card_bg_color: settings.product_card_bg_color || '#FFFFFF',
    product_card_text_color: settings.product_card_text_color || '#111827',
    product_card_btn_bg_color: settings.product_card_btn_bg_color || '#f15a24',
    product_card_btn_text_color: settings.product_card_btn_text_color || '#ffffff',
    product_card_buy_text: settings.product_card_buy_text || 'অর্ডার করুন',
    product_card_options_text: settings.product_card_options_text || 'অর্ডার করুন',
    product_page_add_cart_text: settings.product_page_add_cart_text || 'ADD TO CART',
    product_page_add_cart_bg_color: settings.product_page_add_cart_bg_color || '#f15a24',
    product_page_add_cart_text_color: settings.product_page_add_cart_text_color || '#ffffff',
    product_page_buy_text: settings.product_page_buy_text || 'ORDER NOW',
    product_page_buy_bg_color: settings.product_page_buy_bg_color || '#0b1c21',
    product_page_buy_text_color: settings.product_page_buy_text_color || '#ffffff',

    // COD Quick Order Button
    product_page_cod_enabled: settings.product_page_cod_enabled !== '0',
    product_page_cod_text: settings.product_page_cod_text || 'ক্যাশ অন ডেলিভারিতে অর্ডার করুন',
    product_page_cod_bg_color: settings.product_page_cod_bg_color || '#16a34a',
    product_page_cod_text_color: settings.product_page_cod_text_color || '#ffffff',

    // WhatsApp Order Button
    product_page_whatsapp_enabled: settings.product_page_whatsapp_enabled !== '0',
    product_page_whatsapp_text: settings.product_page_whatsapp_text || 'WhatsApp Order',
    product_page_whatsapp_number: settings.product_page_whatsapp_number || settings.whatsapp_number || '',
    product_page_whatsapp_bg_color: settings.product_page_whatsapp_bg_color || '#25D366',
    product_page_whatsapp_text_color: settings.product_page_whatsapp_text_color || '#ffffff',

    // Call For Order Button
    product_page_call_enabled: settings.product_page_call_enabled !== '0',
    product_page_call_text: settings.product_page_call_text || 'Call For Order',
    product_page_call_number: settings.product_page_call_number || settings.call_number || settings.contact_phone || '',
    product_page_call_bg_color: settings.product_page_call_bg_color || '#294294',
    product_page_call_text_color: settings.product_page_call_text_color || '#ffffff',

    // Payments
    bkash_number: settings.bkash_number || '', nagad_number: settings.nagad_number || '', rocket_number: settings.rocket_number || '',
    pay_cod_enabled: settings.pay_cod_enabled === '1', pay_bkash_enabled: settings.pay_bkash_enabled === '1', pay_nagad_enabled: settings.pay_nagad_enabled === '1', pay_rocket_enabled: settings.pay_rocket_enabled === '1',
    show_cards_in_footer: settings.show_cards_in_footer === '1',
    cod_delivery_upfront: settings.cod_delivery_upfront !== '0',
    
    // Shipping
    shipping_inside_dhaka: settings.shipping_inside_dhaka || '0', shipping_outside_dhaka: settings.shipping_outside_dhaka || '0', tax_percent: settings.tax_percent || '0',
    fraud_order_time_limit_minutes: settings.fraud_order_time_limit_minutes || '10',
    shipping_inside_label: settings.shipping_inside_label || '', shipping_outside_label: settings.shipping_outside_label || '', currency_symbol: settings.currency_symbol || '৳', currency_code: settings.currency_code || 'BDT',
    checkout_delivery_note_enabled: settings.checkout_delivery_note_enabled !== '0',
    checkout_delivery_note_label: settings.checkout_delivery_note_label || 'ডেলিভারি সংক্রান্ত বিশেষ নোট (ঐচ্ছিক)',
    
    // Mail & Notifications
    otp_enabled: settings.otp_enabled === '1',
    mail_mailer: settings.mail_mailer || 'log',
    mail_host: settings.mail_host || '',
    mail_port: settings.mail_port || '',
    mail_username: settings.mail_username || '',
    mail_password: '',
    mail_encryption: settings.mail_encryption || 'none',
    mail_from_address: settings.mail_from_address || '',
    mail_from_name: settings.mail_from_name || '',
    mail_admin_order_recipients: settings.mail_admin_order_recipients || '',
    mail_notify_customer_order_placed: settings.mail_notify_customer_order_placed !== '0',
    mail_notify_customer_order_verified: settings.mail_notify_customer_order_verified !== '0',
    mail_notify_admin_new_order: settings.mail_notify_admin_new_order !== '0',
    mail_notify_password_reset: settings.mail_notify_password_reset !== '0',
    mail_notify_contact_message: settings.mail_notify_contact_message !== '0',
    
    // SEO
    default_meta_title: settings.default_meta_title || '', default_meta_description: settings.default_meta_description || '', default_meta_keywords: settings.default_meta_keywords || '',
    
    // Tracking
    tracking_gtm_id: settings.tracking_gtm_id || '',
    tracking_ga4_id: settings.tracking_ga4_id || '',
    tracking_ga4_api_secret: settings.tracking_ga4_api_secret || '',
    tracking_meta_pixel_id: settings.tracking_meta_pixel_id || '',
    tracking_meta_capi_enabled: settings.tracking_meta_capi_enabled === '1',
    tracking_meta_capi_token: settings.tracking_meta_capi_token || '',
    tracking_meta_test_event_code: settings.tracking_meta_test_event_code || '',
    meta_domain_verification: settings.meta_domain_verification || '',
    tracking_google_ads_id: settings.tracking_google_ads_id || '',
    tracking_google_ads_label: settings.tracking_google_ads_label || '',
    tracking_tiktok_pixel_id: settings.tracking_tiktok_pixel_id || '',
    custom_header_scripts: settings.custom_header_scripts || '',
    custom_body_scripts: settings.custom_body_scripts || '',
    
    // Legal
    terms_content: settings.terms_content || '', privacy_content: settings.privacy_content || '', refund_content: settings.refund_content || '',

    // Courier APIs
    courier_default:      settings.courier_default      || 'steadfast',
    steadfast_api_key:    settings.steadfast_api_key    || '',
    steadfast_secret_key: settings.steadfast_secret_key || '',
    pathao_environment:   settings.pathao_environment   || 'live',
    pathao_client_id:     settings.pathao_client_id     || '',
    pathao_client_secret: settings.pathao_client_secret || '',
    pathao_username:      settings.pathao_username      || '',
    pathao_password:      settings.pathao_password      || '',
    pathao_store_id:      settings.pathao_store_id      || '',
    redx_api_token:       settings.redx_api_token       || '',

    // Fake Order Guard
    fog_enabled:                      settings.fog_enabled                      === '1',
    fog_ip_block_enabled:             settings.fog_ip_block_enabled             === '1',
    fog_device_block_enabled:         settings.fog_device_block_enabled         === '1',
    fog_phone_block_enabled:          settings.fog_phone_block_enabled          === '1',
    fog_fake_number_block_enabled:    settings.fog_fake_number_block_enabled    === '1',
    fog_auto_block_ip_on_cancel:      settings.fog_auto_block_ip_on_cancel      === '1',
    fog_bdcourier_enabled:            settings.fog_bdcourier_enabled            === '1',
    fog_bdcourier_auto_check_checkout:settings.fog_bdcourier_auto_check_checkout=== '1',
    fog_bdcourier_api_key:            settings.fog_bdcourier_api_key            || '',
    fog_bdcourier_min_success_rate:   settings.fog_bdcourier_min_success_rate   || '0',
    fog_bdcourier_block_risk_levels:  settings.fog_bdcourier_block_risk_levels  || 'danger,high',
    fog_ip_cooldown_minutes:          settings.fog_ip_cooldown_minutes          || '0',
    fog_phone_cooldown_minutes:       settings.fog_phone_cooldown_minutes       || '0',
    fog_max_orders_per_phone:         settings.fog_max_orders_per_phone         || '0',

    // Popup Notification
    popup_enabled:        settings.popup_enabled        === '1',
    popup_text:           settings.popup_text           || '',
    popup_link:           settings.popup_link           || '',
    popup_btn_label:      settings.popup_btn_label      || 'Shop Now',
    popup_delay_seconds:  settings.popup_delay_seconds  || '3',
    popup_image_file:     null,
    popup_remove_image:   false,

    // Admin Theme & Appearance
    admin_theme_preset:   settings.admin_theme_preset   || 'orange',
    admin_primary_color:  settings.admin_primary_color  || '#f97316',
    admin_link_color:     settings.admin_link_color     || '',
    admin_sidebar_style:  settings.admin_sidebar_style  || 'light',
    header_template:      settings.header_template      || 'modern_tabbed',
    header_nav_bg:        settings.header_nav_bg        || '',
    header_nav_text:      settings.header_nav_text      || '',
    header_nav_hover:     settings.header_nav_hover     || '',

    // Telegram Order Notifications
    telegram_enabled:               settings.telegram_enabled === '1' || settings.telegram_enabled === true,
    telegram_bot_token:             settings.telegram_bot_token || '',
    telegram_chat_id:               settings.telegram_chat_id || '',
    telegram_notify_order_placed:   settings.telegram_notify_order_placed !== '0',
    telegram_notify_order_verified: settings.telegram_notify_order_verified !== '0',
    telegram_include_items:         settings.telegram_include_items !== '0',
    telegram_custom_header:         settings.telegram_custom_header || 'New Order Received!',
  });

  const submitSection = async (e, section) => {
    e.preventDefault();
    clearErrors();
    setProcessing(true);
    try {
      const formData = new FormData();
      for (const [k, v] of Object.entries(data)) {
        if (v === null || v === undefined) continue;
        if (v instanceof File) {
          const b64 = await fileToBase64(v);
          formData.append(k + '_b64', b64);
          formData.append(k + '_name', v.name || `${k}.jpg`);
        } else if (typeof v === 'boolean') {
          formData.append(k, v ? '1' : '0');
        } else {
          formData.append(k, v);
        }
      }
      formData.append('_method', 'PUT');
      router.post(`/admin/settings/${section}`, formData, {
        forceFormData: true,
        preserveScroll: true,
        onSuccess: () => {
          if (section === 'mail') setData('mail_password', '');
          if (section === 'brand') {
            setData(prev => ({
              ...prev,
              verification_code: '',
              logo_file: null,
              favicon_file: null,
              remove_logo: false,
              remove_favicon: false,
            }));
          }
        },
        onError: (errs) => setError(errs),
        onFinish: () => setProcessing(false),
      });
    } catch (err) {
      setProcessing(false);
      console.error(err);
    }
  };

  const handleTestMail = async () => {
    if (!testEmail) {
      alert('Please enter a recipient email address to test.');
      return;
    }
    setTestingMail(true);
    setMailTestResult(null);

    try {
      const res = await fetch('/admin/settings/test-mail', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
        },
        body: JSON.stringify({
          test_email: testEmail,
          mail_mailer: data.mail_mailer,
          mail_host: data.mail_host,
          mail_port: data.mail_port,
          mail_username: data.mail_username,
          mail_password: data.mail_password,
          mail_encryption: data.mail_encryption,
          mail_from_address: data.mail_from_address,
          mail_from_name: data.mail_from_name,
        }),
      });

      const json = await res.json().catch(() => ({}));
      if (res.ok && json.success) {
        setMailTestResult({
          success: true,
          message: json.message || `Test email sent successfully to ${testEmail}!`,
        });
      } else {
        setMailTestResult({
          success: false,
          message: json.message || json.error || 'Connection failed: Unable to send test email. Please check your SMTP credentials and port settings.',
        });
      }
    } catch (err) {
      setMailTestResult({
        success: false,
        message: 'Network connection error: ' + (err.message || 'Unknown error'),
      });
    } finally {
      setTestingMail(false);
    }
  };

  const handleTestAdminOrderAlert = async () => {
    const targetEmail = data.mail_admin_order_recipients || data.contact_email;
    if (!targetEmail) {
      alert('Please enter at least one Admin Order Alert Recipient email address.');
      return;
    }
    setTestingAdminAlert(true);
    setAdminAlertTestResult(null);

    try {
      const res = await fetch('/admin/settings/test-admin-order-alert', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
        },
        body: JSON.stringify({
          recipient: targetEmail,
        }),
      });

      const json = await res.json().catch(() => ({}));
      if (res.ok && json.success) {
        setAdminAlertTestResult({
          success: true,
          message: json.message || `Test order alert sent successfully to ${targetEmail}!`,
        });
      } else {
        setAdminAlertTestResult({
          success: false,
          message: json.message || 'Failed to send test order alert. Please check your SMTP settings.',
        });
      }
    } catch (err) {
      setAdminAlertTestResult({
        success: false,
        message: 'Network error: ' + (err.message || 'Unknown error'),
      });
    } finally {
      setTestingAdminAlert(false);
    }
  };

  const handleTestCapi = async () => {
    if (!data.tracking_meta_pixel_id || !data.tracking_meta_capi_token) {
      alert('Please enter both Meta Pixel ID and Conversions API Access Token first.');
      return;
    }
    setTestingCapi(true);
    setCapiTestResult(null);
    try {
      const res = await fetch('/admin/settings/test-capi', {
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

  const handleTestTelegram = async () => {
    if (!data.telegram_bot_token || !data.telegram_chat_id) {
      alert('Please enter both Telegram Bot Token and Chat ID first.');
      return;
    }
    setTestingTelegram(true);
    setTelegramTestResult(null);
    try {
      const res = await fetch('/admin/settings/test-telegram', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
        },
        body: JSON.stringify({
          telegram_bot_token: data.telegram_bot_token,
          telegram_chat_id: data.telegram_chat_id,
        }),
      });
      const json = await res.json().catch(() => ({}));
      setTelegramTestResult({
        success: Boolean(res.ok && json.success),
        message: json.message || (res.ok ? 'Test notification sent to Telegram!' : 'Failed to send notification.'),
      });
    } catch (err) {
      setTelegramTestResult({
        success: false,
        message: 'Network error: ' + (err.message || 'Unknown error'),
      });
    } finally {
      setTestingTelegram(false);
    }
  };

  const handleDetectChatId = async () => {
    if (!data.telegram_bot_token) {
      alert('Please enter your Telegram Bot Token first to detect chats.');
      return;
    }
    setDetectingTelegram(true);
    setDetectedChats(null);
    try {
      const res = await fetch(`/admin/settings/telegram-detect?token=${encodeURIComponent(data.telegram_bot_token)}`, {
        headers: {
          'Accept': 'application/json',
          'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
        }
      });
      const json = await res.json().catch(() => ({}));
      if (res.ok && json.success) {
        setDetectedChats(json.chats || []);
        if (json.chats && json.chats.length === 1) {
          setData('telegram_chat_id', String(json.chats[0].id));
        }
      } else {
        alert(json.message || 'Could not detect chats. Make sure you sent a message to the bot or added it to your group!');
      }
    } catch (err) {
      alert('Error detecting chats: ' + err.message);
    } finally {
      setDetectingTelegram(false);
    }
  };

  const handleTestPathao = async () => {
    if (!data.pathao_client_id || !data.pathao_client_secret || !data.pathao_username || !data.pathao_password) {
      alert('Please fill in Pathao Client ID, Client Secret, Username, and Password first.');
      return;
    }
    setTestingPathao(true);
    setPathaoTestResult(null);

    try {
      const csrf = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '';
      const res = await fetch('/admin/courier/test-pathao', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'X-CSRF-TOKEN': csrf,
        },
        body: JSON.stringify({
          client_id: data.pathao_client_id,
          client_secret: data.pathao_client_secret,
          username: data.pathao_username,
          password: data.pathao_password,
          environment: data.pathao_environment || 'live',
        }),
      });

      const json = await res.json().catch(() => ({}));
      if (res.ok && json.success) {
        setPathaoTestResult({
          success: true,
          message: json.message || 'Connected successfully! Access token issued.',
          stores: json.stores || [],
        });
        if (json.stores && json.stores.length > 0 && !data.pathao_store_id) {
          const firstStore = json.stores.find(s => s.is_default_store) || json.stores[0];
          if (firstStore?.store_id) {
            setData('pathao_store_id', String(firstStore.store_id));
          }
        }
      } else {
        setPathaoTestResult({
          success: false,
          message: json.message || 'Pathao authentication failed. Please verify credentials.',
        });
      }
    } catch (err) {
      setPathaoTestResult({
        success: false,
        message: 'Network request error: ' + (err.message || 'Unknown error'),
      });
    } finally {
      setTestingPathao(false);
    }
  };

  const tabs = [
    {
      id: 'brand', label: 'Brand & General',
      icon: <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z"/><circle cx="7" cy="7" r="1.5" fill="currentColor" stroke="none"/></svg>
    },
    {
      id: 'theme', label: 'Admin Appearance',
      icon: <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="m4.93 4.93 4.24 4.24"/><path d="m14.83 9.17 4.24-4.24"/><path d="m14.83 14.83 4.24 4.24"/><path d="m9.17 14.83-4.24 4.24"/></svg>
    },
    {
      id: 'chat', label: 'Live Chat',
      icon: <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>
    },
    {
      id: 'homepage', label: 'Homepage Config',
      icon: <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
    },
    {
      id: 'payments', label: 'Payments',
      icon: <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>
    },
    {
      id: 'shipping', label: 'Shipping & Currency',
      icon: <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="3" width="15" height="13" rx="1"/><path d="M16 8h4l3 5v3h-7V8z"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>
    },
    {
      id: 'mail', label: 'Email & OTP',
      icon: <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
    },
    {
      id: 'email_templates', label: 'Email Templates',
      icon: <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>,
      href: '/admin/email-templates',
    },
    {
      id: 'telegram', label: 'Telegram Alerts',
      icon: <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
    },
    {
      id: 'seo', label: 'SEO',
      icon: <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
    },
    {
      id: 'legal', label: 'Legal Pages',
      icon: <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
    },
    {
      id: 'courier', label: 'Courier APIs',
      icon: <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 17H3a2 2 0 01-2-2V5a2 2 0 012-2h11a2 2 0 012 2v3"/><rect x="9" y="11" width="14" height="10" rx="2"/><circle cx="12" cy="16" r="1"/></svg>
    },
    {
      id: 'fog', label: 'Fake Order Guard',
      icon: <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
    },
  ];

  return (
    <>
      <Head title="Settings" />
      <AdminLayout title="Settings">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Sidebar Tabs */}
          <div className="w-full md:w-64 shrink-0">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden sticky top-20">
              <nav className="flex flex-col p-2 space-y-1">
                {tabs.map(t => (
                  t.href ? (
                    <a key={t.id} href={t.href}
                      className="flex items-center gap-2.5 px-4 py-2.5 text-sm font-medium rounded-xl text-left transition-colors text-gray-500 hover:bg-gray-50 hover:text-gray-700">
                      <span className="flex-shrink-0 text-gray-400">{t.icon}</span>
                      {t.label}
                      <span className="ml-auto text-xs text-orange-500">&rarr;</span>
                    </a>
                  ) : (
                    <button key={t.id} onClick={() => setActiveTab(t.id)}
                      className={`flex items-center gap-2.5 px-4 py-2.5 text-sm font-medium rounded-xl text-left transition-colors ${activeTab === t.id ? 'bg-orange-50 text-orange-600' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700'}`}>
                      <span className={`flex-shrink-0 ${activeTab === t.id ? 'text-orange-500' : 'text-gray-400'}`}>{t.icon}</span>
                      {t.label}
                    </button>
                  )
                ))}
              </nav>
            </div>
          </div>

          {/* Form Area */}
          <div className="flex-1 max-w-4xl">
            {activeTab === 'theme' && (
              <form onSubmit={e => {
                submitSection(e, 'admin_theme');
                setLocalAdminTheme({
                  preset: data.admin_theme_preset,
                  primary_color: data.admin_primary_color,
                  sidebar_style: data.admin_sidebar_style,
                });
              }} className="space-y-6">
                {/* Ready-made Presets */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-5">
                  <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                    <div>
                      <h3 className="font-bold text-gray-900 text-base">Ready-made Color Schemes</h3>
                      <p className="text-xs text-gray-500 mt-0.5">Select from 8 curated color palettes tailored for ecommerce admin panels.</p>
                    </div>
                    <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-orange-50 text-orange-600 border border-orange-200/60">
                      8 Presets
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                    {ADMIN_THEME_PRESETS.map(preset => {
                      const isSelected = data.admin_theme_preset === preset.id;
                      return (
                        <div
                          key={preset.id}
                          onClick={() => {
                            setData(prev => ({
                              ...prev,
                              admin_theme_preset: preset.id,
                              admin_primary_color: preset.primary,
                            }));
                            applyAdminTheme(preset);
                            setLocalAdminTheme({
                              preset: preset.id,
                              primary_color: preset.primary,
                              sidebar_style: data.admin_sidebar_style,
                            });
                          }}
                          className={`p-4 rounded-2xl border-2 transition-all cursor-pointer relative flex flex-col justify-between ${
                            isSelected
                              ? 'border-gray-900 bg-gray-50/70 shadow-sm'
                              : 'border-gray-100 hover:border-gray-300 hover:bg-gray-50/40'
                          }`}
                        >
                          {isSelected && (
                            <div className="absolute top-3 right-3 w-5 h-5 rounded-full bg-gray-900 text-white flex items-center justify-center shadow-xs">
                              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="20 6 9 17 4 12" />
                              </svg>
                            </div>
                          )}

                          <div>
                            <div className="flex items-center gap-2 mb-3">
                              <span className="w-6 h-6 rounded-full shadow-xs ring-2 ring-white" style={{ backgroundColor: preset.primary }} />
                              <span className="w-4 h-4 rounded-full" style={{ backgroundColor: preset.hover }} />
                              <span className="w-4 h-4 rounded-full border border-gray-200" style={{ backgroundColor: preset.light }} />
                            </div>
                            <h4 className="font-bold text-sm text-gray-900">{preset.name}</h4>
                            <p className="text-[11px] text-gray-400 mt-0.5">{preset.badge}</p>
                          </div>

                          <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between">
                            <span className="font-mono text-xs text-gray-500 font-semibold">{preset.primary}</span>
                            <span
                              className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                              style={{ backgroundColor: preset.light, color: preset.primary }}
                            >
                              {isSelected ? 'Selected' : 'Preview'}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Custom Color Studio */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-5">
                  <div className="pb-3 border-b border-gray-100">
                    <h3 className="font-bold text-gray-900 text-base">Custom Brand Color</h3>
                    <p className="text-xs text-gray-500 mt-0.5">Define your brand's unique HEX color. Harmonic shades (hover, subtle tints, borders, and shadows) will be calculated automatically.</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-center">
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Pick Hex Color</label>
                      <div className="flex items-center gap-3">
                        <div className="relative w-12 h-12 rounded-2xl border border-gray-200 overflow-hidden shadow-xs shrink-0 cursor-pointer">
                          <input
                            type="color"
                            value={data.admin_primary_color}
                            onChange={(e) => {
                              const hex = e.target.value;
                              setData(prev => ({
                                ...prev,
                                admin_theme_preset: 'custom',
                                admin_primary_color: hex,
                              }));
                              const pal = generateThemePalette(hex, 'custom');
                              applyAdminTheme(pal);
                              setLocalAdminTheme({
                                preset: 'custom',
                                primary_color: hex,
                                sidebar_style: data.admin_sidebar_style,
                              });
                            }}
                            className="absolute inset-0 w-[150%] h-[150%] -top-1/4 -left-1/4 cursor-pointer"
                          />
                        </div>
                        <div className="flex-1 relative">
                          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-mono text-gray-400 font-bold">#</span>
                          <input
                            type="text"
                            value={data.admin_primary_color.replace('#', '')}
                            onChange={(e) => {
                              const val = e.target.value.replace(/[^0-9A-Fa-f]/g, '').slice(0, 6);
                              const hex = '#' + val;
                              setData(prev => ({
                                ...prev,
                                admin_theme_preset: 'custom',
                                admin_primary_color: hex,
                              }));
                              if (val.length === 6 || val.length === 3) {
                                const pal = generateThemePalette(hex, 'custom');
                                applyAdminTheme(pal);
                                setLocalAdminTheme({
                                  preset: 'custom',
                                  primary_color: hex,
                                  sidebar_style: data.admin_sidebar_style,
                                });
                              }
                            }}
                            maxLength={6}
                            className="w-full pl-8 pr-4 py-2.5 text-sm font-mono font-bold border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-300"
                            placeholder="f97316"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Live Preview Tokens */}
                    <div className="p-4 rounded-2xl bg-gray-50/80 border border-gray-100">
                      <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2">Live Generated Tokens</p>
                      <div className="flex items-center gap-2 flex-wrap">
                        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-white shadow-xs" style={{ backgroundColor: data.admin_primary_color }}>
                          <span>Primary</span>
                        </div>
                        <div
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border"
                          style={{
                            backgroundColor: generateThemePalette(data.admin_primary_color).light,
                            color: data.admin_primary_color,
                            borderColor: generateThemePalette(data.admin_primary_color).border
                          }}
                        >
                          <span>Subtle Tint</span>
                        </div>
                        <div
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-white"
                          style={{ backgroundColor: generateThemePalette(data.admin_primary_color).hover }}
                        >
                          <span>Hover Shade</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Link & Text Accent Color Section */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-5">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-gray-100">
                    <div>
                      <h3 className="font-bold text-gray-900 text-base flex items-center gap-2">
                        <span>Link Text & Hover Accent Color</span>
                        {data.admin_link_color ? (
                          <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-600 border border-blue-100">
                            Custom Link Color Active
                          </span>
                        ) : (
                          <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">
                            Matching Primary Theme
                          </span>
                        )}
                      </h3>
                      <p className="text-xs text-gray-500 mt-0.5">
                        Customize the color for hyperlinked text, navigation hover states, and interactive links across the storefront and user dashboard.
                      </p>
                    </div>

                    {data.admin_link_color && (
                      <button
                        type="button"
                        onClick={() => {
                          setData(prev => ({
                            ...prev,
                            admin_link_color: '',
                          }));
                          const pal = generateThemePalette(data.admin_primary_color, data.admin_theme_preset, '');
                          applyAdminTheme(pal);
                          setLocalAdminTheme({
                            preset: data.admin_theme_preset,
                            primary_color: data.admin_primary_color,
                            link_color: '',
                            sidebar_style: data.admin_sidebar_style,
                          });
                        }}
                        className="text-xs font-semibold text-gray-500 hover:text-gray-800 underline self-start sm:self-auto cursor-pointer"
                      >
                        Reset to Match Theme
                      </button>
                    )}
                  </div>

                  {/* Ready-made Link Presets */}
                  <div>
                    <p className="text-xs font-semibold text-gray-700 mb-2.5">Choose Link Color Preset or Custom:</p>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2.5">
                      {LINK_COLOR_PRESETS.map((lp) => {
                        const isSelected = lp.hex === null 
                          ? (!data.admin_link_color || data.admin_link_color === '')
                          : (data.admin_link_color?.toLowerCase() === lp.hex.toLowerCase());
                        const displayColor = lp.hex || data.admin_primary_color;

                        return (
                          <button
                            key={lp.id}
                            type="button"
                            onClick={() => {
                              const newLinkHex = lp.hex || '';
                              setData(prev => ({
                                ...prev,
                                admin_link_color: newLinkHex,
                              }));
                              const pal = generateThemePalette(data.admin_primary_color, data.admin_theme_preset, newLinkHex);
                              applyAdminTheme(pal);
                              setLocalAdminTheme({
                                preset: data.admin_theme_preset,
                                primary_color: data.admin_primary_color,
                                link_color: newLinkHex,
                                sidebar_style: data.admin_sidebar_style,
                              });
                            }}
                            className={`flex items-center gap-2 p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                              isSelected
                                ? 'border-gray-900 bg-gray-50 shadow-xs font-bold'
                                : 'border-gray-100 hover:border-gray-200 hover:bg-gray-50/50'
                            }`}
                          >
                            <span
                              className="w-4 h-4 rounded-full shrink-0 shadow-xs border border-white"
                              style={{ backgroundColor: displayColor }}
                            />
                            <span className="text-xs text-gray-800 truncate">{lp.name}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Custom Link HEX Color Picker */}
                  <div className="p-4 bg-gray-50/80 rounded-xl border border-gray-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="relative w-10 h-10 rounded-xl border border-gray-200 overflow-hidden shrink-0 shadow-xs">
                        <input
                          type="color"
                          value={data.admin_link_color || data.admin_primary_color}
                          onChange={(e) => {
                            const hex = e.target.value;
                            setData(prev => ({
                              ...prev,
                              admin_link_color: hex,
                            }));
                            const pal = generateThemePalette(data.admin_primary_color, data.admin_theme_preset, hex);
                            applyAdminTheme(pal);
                            setLocalAdminTheme({
                              preset: data.admin_theme_preset,
                              primary_color: data.admin_primary_color,
                              link_color: hex,
                              sidebar_style: data.admin_sidebar_style,
                            });
                          }}
                          className="absolute inset-0 w-[150%] h-[150%] -top-1/4 -left-1/4 cursor-pointer"
                        />
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-bold text-gray-500 font-mono">#</span>
                          <input
                            type="text"
                            value={(data.admin_link_color || '').replace('#', '')}
                            onChange={(e) => {
                              const val = e.target.value.replace(/[^0-9A-Fa-f]/g, '').slice(0, 6);
                              const hex = val ? '#' + val : '';
                              setData(prev => ({
                                ...prev,
                                admin_link_color: hex,
                              }));
                              const pal = generateThemePalette(data.admin_primary_color, data.admin_theme_preset, hex);
                              applyAdminTheme(pal);
                              setLocalAdminTheme({
                                preset: data.admin_theme_preset,
                                primary_color: data.admin_primary_color,
                                link_color: hex,
                                sidebar_style: data.admin_sidebar_style,
                              });
                            }}
                            placeholder="e.g. 2563eb"
                            className="w-32 px-2.5 py-1 text-xs font-mono font-semibold border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-gray-300"
                            maxLength={6}
                          />
                        </div>
                        <p className="text-[11px] text-gray-400 mt-1">Pick a color or leave empty to match primary theme</p>
                      </div>
                    </div>

                    {/* Live Link Preview */}
                    <div className="px-4 py-2.5 bg-white rounded-xl border border-gray-200 text-xs text-gray-600 flex items-center gap-2 shadow-xs">
                      <span>Live link sample:</span>
                      <a
                        href="#preview"
                        onClick={(e) => e.preventDefault()}
                        style={{ color: data.admin_link_color || data.admin_primary_color }}
                        className="font-bold underline cursor-pointer hover:opacity-80 transition-opacity"
                      >
                        Explore Products & Offers →
                      </a>
                    </div>
                  </div>
                </div>

                {/* Desktop Header Navigation Template */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-5">
                  <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                    <div>
                      <h3 className="font-bold text-gray-900 text-base flex items-center gap-2">
                        <span>Desktop Header Navigation Template</span>
                        <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-orange-50 text-orange-600 border border-orange-200/60">
                          2 Designs Available
                        </span>
                      </h3>
                      <p className="text-xs text-gray-500 mt-0.5">
                        Choose which header design template to display for desktop storefront visitors.
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {/* Template 1: Modern Tabbed */}
                    <div
                      onClick={() => setData('header_template', 'modern_tabbed')}
                      className={`p-5 rounded-2xl border-2 transition-all cursor-pointer relative flex flex-col justify-between ${
                        (data.header_template || 'modern_tabbed') === 'modern_tabbed'
                          ? 'border-gray-900 bg-gray-50/70 shadow-sm'
                          : 'border-gray-100 hover:border-gray-300 hover:bg-gray-50/30'
                      }`}
                    >
                      {(data.header_template || 'modern_tabbed') === 'modern_tabbed' && (
                        <div className="absolute top-3 right-3 w-5 h-5 rounded-full bg-gray-900 text-white flex items-center justify-center shadow-xs z-10">
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                        </div>
                      )}

                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                            Design 1 (Recommended)
                          </span>
                          <span className="text-sm font-bold text-gray-900">Modern Tabbed Bar</span>
                        </div>
                        <p className="text-xs text-gray-500 mb-4">
                          Clean white background with left Categories dropdown tab and uppercase navigation links (HOME, SHOP, BEST SELLING, NEW ARRIVALS, BRANDS, 🔥 HOT OFFER, BLOG).
                        </p>

                        {/* Visual Mockup 1 */}
                        <div className="w-full bg-white rounded-xl border border-gray-200 p-2.5 shadow-xs select-none space-y-1.5">
                          <div className="flex items-center gap-2 text-[11px]">
                            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-t-md bg-gray-100 font-bold text-gray-800 border-b-2 border-orange-500">
                              <span className="text-[10px]">☰</span>
                              <span>CATEGORIES ⌵</span>
                            </div>
                            <div className="flex items-center gap-2 text-gray-500 font-semibold text-[10px] overflow-hidden whitespace-nowrap">
                              <span>HOME</span>
                              <span className="text-gray-300">|</span>
                              <span>SHOP</span>
                              <span className="text-gray-300">|</span>
                              <span>BEST SELLING</span>
                              <span className="text-gray-300">|</span>
                              <span className="text-rose-600 font-bold flex items-center gap-1">
                                <span className="w-3.5 h-3.5 rounded-full bg-rose-500 text-white inline-flex items-center justify-center text-[8px]">
                                  <svg className="w-2.5 h-2.5 fill-current" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.527.82-1.173 1.559-1.874 2.257C6.808 6.74 5 8.788 5 11.5 5 15.09 7.91 18 11.5 18s6.5-2.91 6.5-6.5c0-2.433-1.071-4.225-2.316-5.592a17.65 17.65 0 01-1.789-2.28 1 1 0 00-1.5-.075zm-3.056 9.043c-.07-.35-.297-.68-.6-.88-.415-.27-.923-.27-1.33 0-.41.27-.61.73-.55 1.22.12 1.05 1.02 1.87 2.1 1.87.21 0 .42-.03.62-.09.33-.1.59-.34.7-.66.11-.32.06-.67-.14-.94-.23-.31-.56-.47-.8-.52z" clipRule="evenodd" />
                                  </svg>
                                </span>
                                HOT OFFER
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-xs">
                        <span className="text-gray-400 font-medium">Layout: Clean White + Category Dropdown</span>
                        <span className={`font-bold ${(data.header_template || 'modern_tabbed') === 'modern_tabbed' ? 'text-gray-900' : 'text-gray-400'}`}>
                          {(data.header_template || 'modern_tabbed') === 'modern_tabbed' ? '● Active Template' : 'Click to Select'}
                        </span>
                      </div>
                    </div>

                    {/* Template 2: Classic Dark Green Strip */}
                    <div
                      onClick={() => setData('header_template', 'classic_dark')}
                      className={`p-5 rounded-2xl border-2 transition-all cursor-pointer relative flex flex-col justify-between ${
                        data.header_template === 'classic_dark'
                          ? 'border-gray-900 bg-gray-50/70 shadow-sm'
                          : 'border-gray-100 hover:border-gray-300 hover:bg-gray-50/30'
                      }`}
                    >
                      {data.header_template === 'classic_dark' && (
                        <div className="absolute top-3 right-3 w-5 h-5 rounded-full bg-gray-900 text-white flex items-center justify-center shadow-xs z-10">
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                        </div>
                      )}

                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-slate-100 text-slate-700 border border-slate-300">
                            Design 2
                          </span>
                          <span className="text-sm font-bold text-gray-900">Classic Category Strip</span>
                        </div>
                        <p className="text-xs text-gray-500 mb-4">
                          Rich dark green horizontal strip showing direct category links (Fashion, Health & Beauty, Phones, etc.) across the header with Offer Zone on the right.
                        </p>

                        {/* Visual Mockup 2 */}
                        <div className="w-full bg-[#0A2A22] rounded-xl p-2.5 shadow-xs select-none">
                          <div className="flex items-center justify-between text-[10px] text-white">
                            <div className="flex items-center gap-2.5 font-medium overflow-hidden whitespace-nowrap">
                              <span>Fashion</span>
                              <span>Health & Beauty</span>
                              <span>Babies & Toys</span>
                              <span>Sports ⌵</span>
                              <span>Phones</span>
                            </div>
                            <div className="text-white font-bold shrink-0 ml-2 flex items-center gap-1">
                              <svg className="w-3 h-3 text-amber-300" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                              </svg>
                              <span>Offer Zone</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-xs">
                        <span className="text-gray-400 font-medium">Layout: Full Width Dark Green Bar</span>
                        <span className={`font-bold ${data.header_template === 'classic_dark' ? 'text-gray-900' : 'text-gray-400'}`}>
                          {data.header_template === 'classic_dark' ? '● Active Template' : 'Click to Select'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Header Navigation Bar Colors & Styling */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-5">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-gray-100">
                    <div>
                      <h3 className="font-bold text-gray-900 text-base flex items-center gap-2">
                        <span>Header Navigation Bar Colors & Styling</span>
                        <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                          Contrast Protected
                        </span>
                      </h3>
                      <p className="text-xs text-gray-500 mt-0.5">
                        Customize the background, link text, and hover accent colors for the desktop header navigation bar. These styles are isolated so choosing a black or dark link color never causes navigation text to blend in or disappear.
                      </p>
                    </div>

                    {(data.header_nav_bg || data.header_nav_text || data.header_nav_hover) && (
                      <button
                        type="button"
                        onClick={() => {
                          setData(prev => ({
                            ...prev,
                            header_nav_bg: '',
                            header_nav_text: '',
                            header_nav_hover: '',
                          }));
                          applyHeaderNavTheme(
                            data.header_template === 'classic_dark' ? '#0A2A22' : '#ffffff',
                            data.header_template === 'classic_dark' ? '#ffffff' : '#374151',
                            data.header_template === 'classic_dark' ? '#fbbf24' : (data.admin_primary_color || '#f15a24')
                          );
                        }}
                        className="text-xs font-semibold text-gray-500 hover:text-gray-800 underline self-start sm:self-auto cursor-pointer"
                      >
                        Reset to Template Defaults
                      </button>
                    )}
                  </div>

                  {/* Header Nav Presets */}
                  <div>
                    <p className="text-xs font-semibold text-gray-700 mb-2.5">Ready-made Navigation Color Palettes:</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
                      {HEADER_NAV_COLOR_PRESETS.map((np) => {
                        const isSelected =
                          (data.header_nav_bg?.toLowerCase() === np.bg.toLowerCase()) &&
                          (data.header_nav_text?.toLowerCase() === np.text.toLowerCase());

                        return (
                          <div
                            key={np.id}
                            onClick={() => {
                              setData(prev => ({
                                ...prev,
                                header_nav_bg: np.bg,
                                header_nav_text: np.text,
                                header_nav_hover: np.hover,
                              }));
                              applyHeaderNavTheme(np.bg, np.text, np.hover);
                            }}
                            className={`p-3 rounded-xl border-2 transition-all cursor-pointer relative flex flex-col justify-between ${
                              isSelected
                                ? 'border-gray-900 bg-gray-50 shadow-xs'
                                : 'border-gray-100 hover:border-gray-300 hover:bg-gray-50/40'
                            }`}
                          >
                            <div>
                              <div className="flex items-center gap-1.5 mb-2">
                                <span className="w-5 h-5 rounded-md shadow-xs border border-gray-200" style={{ backgroundColor: np.bg }} />
                                <span className="w-4 h-4 rounded-full border border-gray-200" style={{ backgroundColor: np.text }} />
                                <span className="w-3.5 h-3.5 rounded-full" style={{ backgroundColor: np.hover }} />
                              </div>
                              <h4 className="font-bold text-xs text-gray-900">{np.name}</h4>
                              <p className="text-[10px] text-gray-400 mt-0.5">{np.badge}</p>
                            </div>
                            <div className="mt-2.5 pt-2 border-t border-gray-100 flex items-center justify-between text-[10px]">
                              <span className="font-mono text-gray-400 font-semibold">{np.bg}</span>
                              <span className={`font-bold ${isSelected ? 'text-gray-900' : 'text-gray-400'}`}>
                                {isSelected ? 'Active' : 'Select'}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Custom Header Nav Color Pickers */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                    {/* Background Color */}
                    <div className="p-3.5 rounded-xl border border-gray-100 bg-gray-50/60 space-y-2">
                      <label className="block text-xs font-bold text-gray-600">Bar Background Color</label>
                      <div className="flex items-center gap-2.5">
                        <div className="relative w-9 h-9 rounded-lg border border-gray-200 overflow-hidden shadow-xs shrink-0 cursor-pointer">
                          <input
                            type="color"
                            value={data.header_nav_bg || (data.header_template === 'classic_dark' ? '#0A2A22' : '#ffffff')}
                            onChange={(e) => {
                              const hex = e.target.value;
                              setData(prev => ({ ...prev, header_nav_bg: hex }));
                              applyHeaderNavTheme(hex, data.header_nav_text, data.header_nav_hover);
                            }}
                            className="absolute inset-0 w-[150%] h-[150%] -top-1/4 -left-1/4 cursor-pointer"
                          />
                        </div>
                        <input
                          type="text"
                          value={(data.header_nav_bg || (data.header_template === 'classic_dark' ? '#0A2A22' : '#ffffff')).replace('#', '')}
                          onChange={(e) => {
                            const val = e.target.value.replace(/[^0-9A-Fa-f]/g, '').slice(0, 6);
                            const hex = val ? '#' + val : '';
                            setData(prev => ({ ...prev, header_nav_bg: hex }));
                            if (val.length === 6 || val.length === 3) applyHeaderNavTheme(hex, data.header_nav_text, data.header_nav_hover);
                          }}
                          placeholder="0A2A22"
                          maxLength={6}
                          className="w-full px-2.5 py-1.5 text-xs font-mono font-bold border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-gray-300"
                        />
                      </div>
                      <p className="text-[10px] text-gray-400">Header strip background</p>
                    </div>

                    {/* Nav Text Color */}
                    <div className="p-3.5 rounded-xl border border-gray-100 bg-gray-50/60 space-y-2">
                      <label className="block text-xs font-bold text-gray-600">Nav Text Color</label>
                      <div className="flex items-center gap-2.5">
                        <div className="relative w-9 h-9 rounded-lg border border-gray-200 overflow-hidden shadow-xs shrink-0 cursor-pointer">
                          <input
                            type="color"
                            value={data.header_nav_text || (data.header_template === 'classic_dark' ? '#ffffff' : '#374151')}
                            onChange={(e) => {
                              const hex = e.target.value;
                              setData(prev => ({ ...prev, header_nav_text: hex }));
                              applyHeaderNavTheme(data.header_nav_bg, hex, data.header_nav_hover);
                            }}
                            className="absolute inset-0 w-[150%] h-[150%] -top-1/4 -left-1/4 cursor-pointer"
                          />
                        </div>
                        <input
                          type="text"
                          value={(data.header_nav_text || (data.header_template === 'classic_dark' ? '#ffffff' : '#374151')).replace('#', '')}
                          onChange={(e) => {
                            const val = e.target.value.replace(/[^0-9A-Fa-f]/g, '').slice(0, 6);
                            const hex = val ? '#' + val : '';
                            setData(prev => ({ ...prev, header_nav_text: hex }));
                            if (val.length === 6 || val.length === 3) applyHeaderNavTheme(data.header_nav_bg, hex, data.header_nav_hover);
                          }}
                          placeholder="ffffff"
                          maxLength={6}
                          className="w-full px-2.5 py-1.5 text-xs font-mono font-bold border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-gray-300"
                        />
                      </div>
                      <p className="text-[10px] text-gray-400">Link label text color</p>
                    </div>

                    {/* Nav Hover & Accent Color */}
                    <div className="p-3.5 rounded-xl border border-gray-100 bg-gray-50/60 space-y-2">
                      <label className="block text-xs font-bold text-gray-600">Hover & Accent Color</label>
                      <div className="flex items-center gap-2.5">
                        <div className="relative w-9 h-9 rounded-lg border border-gray-200 overflow-hidden shadow-xs shrink-0 cursor-pointer">
                          <input
                            type="color"
                            value={data.header_nav_hover || (data.header_template === 'classic_dark' ? '#fbbf24' : (data.admin_primary_color || '#f15a24'))}
                            onChange={(e) => {
                              const hex = e.target.value;
                              setData(prev => ({ ...prev, header_nav_hover: hex }));
                              applyHeaderNavTheme(data.header_nav_bg, data.header_nav_text, hex);
                            }}
                            className="absolute inset-0 w-[150%] h-[150%] -top-1/4 -left-1/4 cursor-pointer"
                          />
                        </div>
                        <input
                          type="text"
                          value={(data.header_nav_hover || (data.header_template === 'classic_dark' ? '#fbbf24' : (data.admin_primary_color || '#f15a24'))).replace('#', '')}
                          onChange={(e) => {
                            const val = e.target.value.replace(/[^0-9A-Fa-f]/g, '').slice(0, 6);
                            const hex = val ? '#' + val : '';
                            setData(prev => ({ ...prev, header_nav_hover: hex }));
                            if (val.length === 6 || val.length === 3) applyHeaderNavTheme(data.header_nav_bg, data.header_nav_text, hex);
                          }}
                          placeholder="fbbf24"
                          maxLength={6}
                          className="w-full px-2.5 py-1.5 text-xs font-mono font-bold border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-gray-300"
                        />
                      </div>
                      <p className="text-[10px] text-gray-400">Hover & active highlights</p>
                    </div>
                  </div>

                  {/* Live Contrast Preview Bar */}
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <p className="text-xs font-semibold text-gray-600 mb-2">Live Header Navigation Bar Preview:</p>
                    <div
                      className="w-full rounded-xl px-4 py-3 shadow-xs flex items-center justify-between transition-colors border"
                      style={{
                        backgroundColor: data.header_nav_bg || (data.header_template === 'classic_dark' ? '#0A2A22' : '#ffffff'),
                        borderColor: (data.header_nav_bg || (data.header_template === 'classic_dark' ? '#0A2A22' : '#ffffff')).toLowerCase() === '#ffffff' ? '#e5e7eb' : 'transparent',
                      }}
                    >
                      <div className="flex items-center gap-4 text-xs font-semibold overflow-hidden">
                        <span
                          style={{
                            color: data.header_nav_hover || (data.header_template === 'classic_dark' ? '#fbbf24' : (data.admin_primary_color || '#f15a24'))
                          }}
                          className="font-bold underline decoration-2 underline-offset-4"
                        >
                          Fashion (Active)
                        </span>
                        <span style={{ color: data.header_nav_text || (data.header_template === 'classic_dark' ? '#ffffff' : '#374151') }}>
                          Health & Beauty
                        </span>
                        <span style={{ color: data.header_nav_text || (data.header_template === 'classic_dark' ? '#ffffff' : '#374151') }}>
                          Babies & Toys
                        </span>
                        <span style={{ color: data.header_nav_text || (data.header_template === 'classic_dark' ? '#ffffff' : '#374151') }}>
                          Sports ⌵
                        </span>
                        <span style={{ color: data.header_nav_text || (data.header_template === 'classic_dark' ? '#ffffff' : '#374151') }}>
                          Phones
                        </span>
                      </div>
                      <div
                        style={{
                          color: data.header_nav_text || (data.header_template === 'classic_dark' ? '#ffffff' : '#374151')
                        }}
                        className="text-xs font-bold shrink-0 ml-3 flex items-center gap-1"
                      >
                        <svg className="w-3.5 h-3.5 text-amber-300" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                        <span>Offer Zone</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Sidebar Style Mode */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-4">
                  <div className="pb-3 border-b border-gray-100">
                    <h3 className="font-bold text-gray-900 text-base">Sidebar Style</h3>
                    <p className="text-xs text-gray-500 mt-0.5">Choose between a bright light sidebar or a modern dark slate sidebar.</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div
                      onClick={() => {
                        setData('admin_sidebar_style', 'light');
                        setLocalAdminTheme({
                          preset: data.admin_theme_preset,
                          primary_color: data.admin_primary_color,
                          sidebar_style: 'light',
                        });
                      }}
                      className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex items-center gap-3 ${
                        data.admin_sidebar_style !== 'dark'
                          ? 'border-gray-900 bg-gray-50/70 shadow-xs'
                          : 'border-gray-100 hover:border-gray-300'
                      }`}
                    >
                      <div className="w-10 h-10 rounded-xl bg-white border border-gray-200 flex items-center justify-center shrink-0 shadow-xs">
                        <span className="w-4 h-4 rounded-full bg-gray-300" />
                      </div>
                      <div>
                        <p className="font-bold text-sm text-gray-900">Light Sidebar</p>
                        <p className="text-xs text-gray-400">Clean white navigation panel</p>
                      </div>
                    </div>

                    <div
                      onClick={() => {
                        setData('admin_sidebar_style', 'dark');
                        setLocalAdminTheme({
                          preset: data.admin_theme_preset,
                          primary_color: data.admin_primary_color,
                          sidebar_style: 'dark',
                        });
                      }}
                      className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex items-center gap-3 ${
                        data.admin_sidebar_style === 'dark'
                          ? 'border-gray-900 bg-slate-900 text-white shadow-xs'
                          : 'border-gray-100 hover:border-gray-300'
                      }`}
                    >
                      <div className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center shrink-0 shadow-xs">
                        <span className="w-4 h-4 rounded-full bg-slate-600" />
                      </div>
                      <div>
                        <p className={`font-bold text-sm ${data.admin_sidebar_style === 'dark' ? 'text-white' : 'text-gray-900'}`}>Dark Slate Sidebar</p>
                        <p className={`text-xs ${data.admin_sidebar_style === 'dark' ? 'text-slate-400' : 'text-gray-400'}`}>Sleek high-contrast navigation</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Submit button */}
                <div className="flex gap-3">
                  <button
                    type="submit"
                    disabled={processing}
                    style={{ backgroundColor: data.admin_primary_color }}
                    className="px-6 py-3 hover:opacity-90 disabled:opacity-60 text-white font-semibold rounded-xl flex items-center gap-2 shadow-sm cursor-pointer transition-all"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/></svg>
                    {processing ? 'Saving...' : 'Save Admin Appearance'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setData(prev => ({
                        ...prev,
                        admin_theme_preset: 'orange',
                        admin_primary_color: '#f97316',
                        admin_link_color: '',
                        admin_sidebar_style: 'light',
                      }));
                      applyAdminTheme(generateThemePalette('#f97316', 'orange', ''));
                      setLocalAdminTheme({ preset: 'orange', primary_color: '#f97316', link_color: '', sidebar_style: 'light' });
                    }}
                    className="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-xl text-sm transition-colors cursor-pointer"
                  >
                    Reset to Defaults
                  </button>
                </div>
              </form>
            )}

            {activeTab === 'brand' && (
              <form onSubmit={e => submitSection(e, 'brand')} className="space-y-5">
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-5">
                  <h3 className="font-bold text-gray-900 pb-3 border-b border-gray-50">Brand & Identity</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <Field label="Site Name" error={errors.site_name}><input value={data.site_name} onChange={e => setData('site_name', e.target.value)} className={inputClass} required /></Field>
                    <Field label="Search Placeholder" error={errors.search_placeholder}><input value={data.search_placeholder} onChange={e => setData('search_placeholder', e.target.value)} className={inputClass} /></Field>
                  </div>
                  <Field label="Tagline" error={errors.tagline}><input value={data.tagline} onChange={e => setData('tagline', e.target.value)} className={inputClass} /></Field>
                  <Field label="Footer Marketplace Description (About Us Text)" error={errors.footer_text}>
                    <textarea 
                      value={data.footer_text} 
                      onChange={e => setData('footer_text', e.target.value)} 
                      rows={3} 
                      className={inputClass} 
                      placeholder="e.g. Your everyday online marketplace - millions of products, flash deals and vouchers, delivered across the country." 
                    />
                    <p className="text-xs text-gray-400 mt-1">This text appears directly under the store logo in the website footer across all pages.</p>
                  </Field>
                  
                  <div className="grid grid-cols-2 gap-6 pt-4 border-t border-gray-50">
                    <div>
                      <Field label="Logo" error={errors.logo_file}><input type="file" accept="image/*" onChange={e => setData('logo_file', e.target.files[0])} className={inputClass} /></Field>
                      {settings.logo && !data.remove_logo && (
                        <div className="mt-2 flex items-center gap-3">
                          <img src={`/${settings.logo}`} alt="Logo" className="h-10 object-contain border border-gray-200 rounded p-1" />
                          <label className="flex items-center gap-1.5 text-xs text-red-500 cursor-pointer"><input type="checkbox" onChange={e => setData('remove_logo', e.target.checked)} className={checkboxClass} /> Remove</label>
                        </div>
                      )}
                    </div>
                    <div>
                      <Field label="Favicon" error={errors.favicon_file}><input type="file" accept="image/*" onChange={e => setData('favicon_file', e.target.files[0])} className={inputClass} /></Field>
                      {settings.favicon && !data.remove_favicon && (
                        <div className="mt-2 flex items-center gap-3">
                          <img src={`/${settings.favicon}`} alt="Favicon" className="h-10 w-10 object-contain border border-gray-200 rounded p-1" />
                          <label className="flex items-center gap-1.5 text-xs text-red-500 cursor-pointer"><input type="checkbox" onChange={e => setData('remove_favicon', e.target.checked)} className={checkboxClass} /> Remove</label>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-5">
                  <h3 className="font-bold text-gray-900 pb-3 border-b border-gray-50">Contact Information</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <Field label="Phone" error={errors.contact_phone}><input value={data.contact_phone} onChange={e => setData('contact_phone', e.target.value)} className={inputClass} /></Field>
                    <Field label="Email" error={errors.contact_email}><input value={data.contact_email} onChange={e => setData('contact_email', e.target.value)} className={inputClass} /></Field>
                    <Field label="Address" error={errors.contact_address}><input value={data.contact_address} onChange={e => setData('contact_address', e.target.value)} className={inputClass} /></Field>
                    <Field label="Business Hours" error={errors.contact_hours}><input value={data.contact_hours} onChange={e => setData('contact_hours', e.target.value)} className={inputClass} /></Field>
                    <Field label="Contact Page Title" error={errors.contact_title}><input value={data.contact_title} onChange={e => setData('contact_title', e.target.value)} className={inputClass} /></Field>
                    <Field label="Contact Page Intro" error={errors.contact_intro}><input value={data.contact_intro} onChange={e => setData('contact_intro', e.target.value)} className={inputClass} /></Field>
                  </div>
                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-5">
                  <h3 className="font-bold text-gray-900 pb-3 border-b border-gray-50">Social Links</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <Field label="Facebook URL" error={errors.facebook_url}><input value={data.facebook_url} onChange={e => setData('facebook_url', e.target.value)} className={inputClass} placeholder="https://facebook.com/yourpage" /></Field>
                    <Field label="Instagram URL" error={errors.instagram_url}><input value={data.instagram_url} onChange={e => setData('instagram_url', e.target.value)} className={inputClass} placeholder="https://instagram.com/yourpage" /></Field>
                    <Field label="Twitter / X URL" error={errors.twitter_url}><input value={data.twitter_url} onChange={e => setData('twitter_url', e.target.value)} className={inputClass} placeholder="https://x.com/yourpage" /></Field>
                  </div>
                </div>

                {/* Footer Developer Credit & Whitelabel Security Card */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-5">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-gray-50">
                    <div>
                      <h3 className="font-bold text-gray-900 text-base flex items-center gap-2">
                        <span>Footer Developer Credit & Whitelabel</span>
                        <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${data.footer_credit_enabled ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-gray-100 text-gray-600'}`}>
                          {data.footer_credit_enabled ? 'Active Credit Badge' : 'Badge Hidden'}
                        </span>
                      </h3>
                      <p className="text-xs text-gray-400 mt-0.5">
                        স্টোরফ্রন্টের ফুটার ক্রেডিট ব্যাজ কাস্টমাইজ বা নিয়ন্ত্রণ করুন। পরিবর্তনের জন্য Projoss-এর ওয়ান-টাইম সিকিউরিটি কোড আবশ্যক।
                      </p>
                    </div>
                  </div>

                  {/* Real-time Badge Preview */}
                  <div className="p-4 bg-slate-900 rounded-xl border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-inner">
                    <div className="flex items-center gap-2 text-xs text-slate-400">
                      <svg className="w-4 h-4 text-orange-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                      <span>Storefront Live Preview:</span>
                    </div>
                    <div>
                      {data.footer_credit_enabled ? (
                        <div className="inline-flex items-center gap-2 border border-gray-100 bg-white rounded-full px-3 py-1.5 shadow-sm">
                          <span className="text-[11px] font-extrabold text-slate-500 tracking-wider">
                            {data.footer_credit_prefix || 'DESIGNED BY'}
                          </span>
                          <span className="bg-[#f15a24] text-white text-[11px] font-extrabold px-3 py-1 rounded-full tracking-wider">
                            {data.footer_credit_name || 'PROJOSS'}
                          </span>
                        </div>
                      ) : (
                        <span className="text-xs text-red-400 font-semibold italic bg-red-950/40 px-3 py-1 rounded-full border border-red-800/40">
                          [ Credit Badge Hidden / Removed ]
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Toggle Enable/Disable */}
                  <div className="bg-gray-50/70 border border-gray-100 rounded-xl p-4 flex items-start gap-3">
                    <input
                      type="checkbox"
                      id="footer_credit_enabled"
                      checked={Boolean(data.footer_credit_enabled)}
                      onChange={e => setData('footer_credit_enabled', e.target.checked)}
                      className={`${checkboxClass} mt-0.5`}
                    />
                    <label htmlFor="footer_credit_enabled" className="text-sm font-medium text-gray-800 cursor-pointer select-none">
                      <div>Show Developer Credit Badge in Storefront Footer</div>
                      <p className="text-xs text-gray-500 font-normal mt-0.5">
                        আনচেক করলে স্টোরফ্রন্টের ফুটার থেকে ক্রেডিট ব্যাজটি সম্পূর্ণভাবে লুকিয়ে ফেলা হবে।
                      </p>
                    </label>
                  </div>

                  {/* Custom Text and URL Inputs */}
                  <div className={`grid grid-cols-1 md:grid-cols-3 gap-4 transition-opacity ${!data.footer_credit_enabled ? 'opacity-50' : ''}`}>
                    <Field label="Credit Prefix (e.g. DESIGNED BY)" error={errors.footer_credit_prefix}>
                      <input
                        value={data.footer_credit_prefix}
                        onChange={e => setData('footer_credit_prefix', e.target.value)}
                        className={inputClass}
                        placeholder="DESIGNED BY"
                        disabled={!data.footer_credit_enabled}
                      />
                    </Field>
                    <Field label="Brand / Developer Name (e.g. PROJOSS)" error={errors.footer_credit_name}>
                      <input
                        value={data.footer_credit_name}
                        onChange={e => setData('footer_credit_name', e.target.value)}
                        className={inputClass}
                        placeholder="PROJOSS"
                        disabled={!data.footer_credit_enabled}
                      />
                    </Field>
                    <Field label="Target Link URL" error={errors.footer_credit_url}>
                      <input
                        value={data.footer_credit_url}
                        onChange={e => setData('footer_credit_url', e.target.value)}
                        className={inputClass}
                        placeholder="https://projoss.com/"
                        disabled={!data.footer_credit_enabled}
                      />
                    </Field>
                  </div>

                  {/* Security Verification Box (Challenge-Response OTP) */}
                  <div className="bg-gradient-to-br from-amber-50/80 via-orange-50/40 to-slate-50 border border-amber-200/80 rounded-2xl p-5 space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-xl bg-amber-500 text-white flex items-center justify-center font-bold shadow-sm shadow-amber-500/20">
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                          </svg>
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-gray-900">Agency Security Verification (একবার ব্যবহারযোগ্য কোড)</h4>
                          <p className="text-[11px] text-gray-500">ফুটার ক্রেডিটে কোনো পরিবর্তন সেভ করতে হলে Projoss-এর অথরাইজেশন কোড দেওয়া বাধ্যতামূলক।</p>
                        </div>
                      </div>
                      <span className="hidden sm:inline-flex text-[10px] font-extrabold uppercase px-2 py-1 rounded bg-amber-200/70 text-amber-900">
                        Single-Use OTP
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start pt-1">
                      {/* Left side: Dynamic Seed Token */}
                      <div className="bg-white p-3.5 rounded-xl border border-amber-200 shadow-xs space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-semibold text-gray-700">Security Request Token:</span>
                          <span className="text-[10px] text-gray-400">প্রতি সফল পরিবর্তনে স্বয়ংক্রিয়ভাবে বদলাবে</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-base font-black tracking-widest text-gray-900 bg-amber-50 border border-amber-200 px-3 py-1.5 rounded-lg select-all">
                            {settings.footer_credit_seed || 'PJ-INIT'}
                          </span>
                          <button
                            type="button"
                            onClick={() => {
                              if (navigator.clipboard) {
                                navigator.clipboard.writeText(settings.footer_credit_seed || '');
                                setCopiedSeed(true);
                                setTimeout(() => setCopiedSeed(false), 2000);
                              }
                            }}
                            className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 active:scale-95 text-xs font-medium text-gray-700 rounded-lg transition-all flex items-center gap-1"
                          >
                            {copiedSeed ? (
                              <>
                                <svg className="w-3.5 h-3.5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/></svg>
                                <span className="text-emerald-700 font-semibold">Copied!</span>
                              </>
                            ) : (
                              <>
                                <svg className="w-3.5 h-3.5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
                                <span>Copy</span>
                              </>
                            )}
                          </button>
                        </div>
                        <p className="text-[11px] text-gray-500 leading-relaxed">
                          👉 এই টোকেনটি Projoss টিমকে দিলে তারা আপনাকে একটি ওয়ান-টাইম কোড দেবে। সেভ সফল হওয়ার পর টোকেন ও কোড স্বয়ংক্রিয়ভাবে বার্ন হয়ে যাবে, ফলে পুরোনো কোড দ্বিতীয়বার কাজ করবে না।
                        </p>
                      </div>

                      {/* Right side: Verification Code Input */}
                      <div className="space-y-1.5">
                        <label className="block text-xs font-bold text-gray-800">
                          Enter Verification Code (ভেরিফিকেশন কোড)
                        </label>
                        <div className="relative">
                          <input
                            type="text"
                            value={data.verification_code}
                            onChange={e => setData('verification_code', e.target.value.toUpperCase().trim())}
                            placeholder="e.g. 8X4K29 or purchase-projoss-..."
                            maxLength={80}
                            className={`w-full font-mono font-bold tracking-wider uppercase border rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 ${errors.verification_code ? 'border-red-400 focus:ring-red-200 bg-red-50/20 text-red-900' : 'border-amber-300 focus:ring-amber-300 bg-white text-gray-900'}`}
                          />
                        </div>
                        {errors.verification_code ? (
                          <p className="text-xs font-semibold text-red-600 mt-1 flex items-start gap-1">
                            <svg className="w-3.5 h-3.5 text-red-500 shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                            <span>{errors.verification_code}</span>
                          </p>
                        ) : (
                          <p className="text-[11px] text-gray-500">
                            * আপনি যদি ফুটার ক্রেডিট পরিবর্তন না করেন, তবে সাধারণ ব্র্যান্ড সেটিংস সেভ করতে কোনো কোড লাগবে না।
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Quick Links */}
                <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4">
                  <p className="text-xs font-semibold text-blue-700 mb-3 uppercase tracking-wide flex items-center gap-1.5">
                    <svg className="w-3.5 h-3.5 text-blue-600 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"/></svg>
                    <span>Quick Links</span>
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {[
                      { label: 'Visit Homepage', href: '/', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
                      { label: 'Contact Page', href: '/contact', icon: 'M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z' },
                      { label: 'Shop', href: '/shop', icon: 'M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z' },
                      { label: 'Terms', href: '/terms', icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' },
                      { label: 'Privacy', href: '/privacy', icon: 'M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z' },
                    ].map(l => (
                      <a key={l.href} href={l.href} target="_blank" rel="noreferrer"
                        className="px-3 py-1.5 bg-white border border-blue-200 text-blue-600 text-xs font-semibold rounded-lg hover:bg-blue-100 transition-colors inline-flex items-center gap-1.5">
                        <svg className="w-3.5 h-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d={l.icon}/></svg>
                        <span>{l.label}</span>
                        <span className="text-[10px] opacity-60">↗</span>
                      </a>
                    ))}
                  </div>
                </div>

                <button type="submit" disabled={processing} className="px-6 py-3 bg-orange-500 hover:bg-orange-600 disabled:opacity-60 text-white font-semibold rounded-xl flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/></svg>
                  Save Brand Settings
                </button>
              </form>
            )}

            {activeTab === 'chat' && (
              <form onSubmit={e => submitSection(e, 'chat')} className="space-y-5">
                {/* Header preview */}
                <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl p-5 text-white">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {/* Live Chat SVG Icon */}
                      <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                        <svg viewBox="0 0 24 24" className="w-6 h-6" fill="white" xmlns="http://www.w3.org/2000/svg">
                          <path d="M20 2H4C2.9 2 2 2.9 2 4v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM9 11H7V9h2v2zm4 0h-2V9h2v2zm4 0h-2V9h2v2z"/>
                        </svg>
                      </div>
                      <div>
                        <h3 className="font-bold text-lg">Live Chat Widget</h3>
                        <p className="text-green-100 text-sm">Floating chat button on all storefront pages</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 bg-white/20 rounded-xl px-4 py-2">
                      <span className="text-sm font-semibold">{data.chat_enabled ? 'Enabled' : 'Disabled'}</span>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" checked={data.chat_enabled} onChange={e => setData('chat_enabled', e.target.checked)} className="sr-only peer" />
                        <div className="w-11 h-6 bg-white/30 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-white/60"></div>
                      </label>
                    </div>
                  </div>
                  {/* Live preview */}
                  <div className="mt-4 flex items-center gap-3">
                    <span className="text-green-100 text-xs font-semibold uppercase tracking-wide">Widget Preview:</span>
                    <div className="flex gap-2">
                      {data.whatsapp_number && (
                        <div className="w-9 h-9 rounded-full flex items-center justify-center shadow-lg" style={{background:'linear-gradient(135deg,#25D366,#128C7E)'}}>
                          <svg viewBox="0 0 32 32" className="w-5 h-5" fill="white"><path d="M16 2C8.28 2 2 8.28 2 16c0 2.44.65 4.73 1.78 6.72L2 30l7.52-1.74A13.93 13.93 0 0016 30c7.72 0 14-6.28 14-14S23.72 2 16 2zm0 25.5a11.43 11.43 0 01-5.86-1.62l-.42-.25-4.46 1.03 1.06-4.35-.28-.45A11.47 11.47 0 014.5 16C4.5 9.6 9.6 4.5 16 4.5S27.5 9.6 27.5 16 22.4 27.5 16 27.5zm6.29-8.56c-.34-.17-2.03-1-2.35-1.11-.32-.12-.55-.17-.78.17-.23.34-.9 1.11-1.1 1.34-.2.23-.4.26-.74.09-.34-.17-1.44-.53-2.74-1.69-1.01-.9-1.7-2.02-1.9-2.36-.2-.34-.02-.52.15-.69.15-.15.34-.4.51-.6.17-.2.23-.34.34-.57.12-.23.06-.43-.03-.6-.09-.17-.78-1.88-1.07-2.57-.28-.68-.57-.58-.78-.59h-.66c-.23 0-.6.09-.91.43-.31.34-1.2 1.17-1.2 2.86s1.23 3.32 1.4 3.55c.17.23 2.42 3.7 5.87 5.19.82.35 1.46.56 1.96.72.82.26 1.57.22 2.16.13.66-.1 2.03-.83 2.32-1.63.29-.8.29-1.49.2-1.63-.09-.14-.32-.23-.66-.4z"/></svg>
                        </div>
                      )}
                      {data.call_number && (
                        <div className="w-9 h-9 rounded-full flex items-center justify-center shadow-lg" style={{background:'linear-gradient(135deg,#34d399,#059669)'}}>
                          <svg viewBox="0 0 24 24" className="w-5 h-5" fill="white"><path d="M6.62 10.79a15.05 15.05 0 006.59 6.59l2.2-2.2a1 1 0 011.01-.24c1.12.37 2.33.57 3.58.57a1 1 0 011 1V20a1 1 0 01-1 1C9.61 21 3 14.39 3 6.5a1 1 0 011-1h3.5a1 1 0 011 1c0 1.25.2 2.45.57 3.58a1 1 0 01-.25 1.01l-2.2 2.2z"/></svg>
                        </div>
                      )}
                      {data.messenger_page && (
                        <div className="w-9 h-9 rounded-full flex items-center justify-center shadow-lg" style={{background:'linear-gradient(135deg,#0084ff,#a033ff)'}}>
                          <svg viewBox="0 0 32 32" className="w-5 h-5" fill="white"><path d="M16 2C8.27 2 2 7.8 2 14.93c0 3.9 1.85 7.38 4.76 9.76V30l4.59-2.52A14.86 14.86 0 0016 27.86c7.73 0 14-5.8 14-12.93C30 7.8 23.73 2 16 2zm1.41 17.41l-3.57-3.8-6.97 3.8 7.66-8.13 3.66 3.8 6.88-3.8-7.66 8.13z"/></svg>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-5">
                  {/* WhatsApp */}
                  <div className="flex items-start gap-4 p-4 rounded-xl border-2 border-green-100 bg-green-50">
                    <div className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-md flex-shrink-0" style={{background:'linear-gradient(135deg,#25D366,#128C7E)'}}>
                      <svg viewBox="0 0 32 32" className="w-7 h-7" fill="white"><path d="M16 2C8.28 2 2 8.28 2 16c0 2.44.65 4.73 1.78 6.72L2 30l7.52-1.74A13.93 13.93 0 0016 30c7.72 0 14-6.28 14-14S23.72 2 16 2zm0 25.5a11.43 11.43 0 01-5.86-1.62l-.42-.25-4.46 1.03 1.06-4.35-.28-.45A11.47 11.47 0 014.5 16C4.5 9.6 9.6 4.5 16 4.5S27.5 9.6 27.5 16 22.4 27.5 16 27.5zm6.29-8.56c-.34-.17-2.03-1-2.35-1.11-.32-.12-.55-.17-.78.17-.23.34-.9 1.11-1.1 1.34-.2.23-.4.26-.74.09-.34-.17-1.44-.53-2.74-1.69-1.01-.9-1.7-2.02-1.9-2.36-.2-.34-.02-.52.15-.69.15-.15.34-.4.51-.6.17-.2.23-.34.34-.57.12-.23.06-.43-.03-.6-.09-.17-.78-1.88-1.07-2.57-.28-.68-.57-.58-.78-.59h-.66c-.23 0-.6.09-.91.43-.31.34-1.2 1.17-1.2 2.86s1.23 3.32 1.4 3.55c.17.23 2.42 3.7 5.87 5.19.82.35 1.46.56 1.96.72.82.26 1.57.22 2.16.13.66-.1 2.03-.83 2.32-1.63.29-.8.29-1.49.2-1.63-.09-.14-.32-.23-.66-.4z"/></svg>
                    </div>
                    <div className="flex-1">
                      <label className="block text-sm font-bold text-gray-800 mb-1">WhatsApp</label>
                      <p className="text-xs text-gray-500 mb-2">Customer taps this icon → opens WhatsApp chat with your number</p>
                      <Field label="WhatsApp Number (with country code)" error={errors.whatsapp_number}>
                        <input value={data.whatsapp_number} onChange={e => setData('whatsapp_number', e.target.value)} className={inputClass} placeholder="e.g. 8801712345678" />
                      </Field>
                    </div>
                  </div>

                  {/* Call */}
                  <div className="flex items-start gap-4 p-4 rounded-xl border-2 border-emerald-100 bg-emerald-50">
                    <div className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-md flex-shrink-0" style={{background:'linear-gradient(135deg,#34d399,#059669)'}}>
                      <svg viewBox="0 0 24 24" className="w-7 h-7" fill="white"><path d="M6.62 10.79a15.05 15.05 0 006.59 6.59l2.2-2.2a1 1 0 011.01-.24c1.12.37 2.33.57 3.58.57a1 1 0 011 1V20a1 1 0 01-1 1C9.61 21 3 14.39 3 6.5a1 1 0 011-1h3.5a1 1 0 011 1c0 1.25.2 2.45.57 3.58a1 1 0 01-.25 1.01l-2.2 2.2z"/></svg>
                    </div>
                    <div className="flex-1">
                      <label className="block text-sm font-bold text-gray-800 mb-1">Phone Call</label>
                      <p className="text-xs text-gray-500 mb-2">Customer taps this icon → initiates a phone call directly</p>
                      <Field label="Call Number" error={errors.call_number}>
                        <input value={data.call_number} onChange={e => setData('call_number', e.target.value)} className={inputClass} placeholder="e.g. +8801712345678" />
                      </Field>
                    </div>
                  </div>

                  {/* Messenger/Facebook */}
                  <div className="flex items-start gap-4 p-4 rounded-xl border-2 border-blue-100 bg-blue-50">
                    <div className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-md flex-shrink-0" style={{background:'linear-gradient(135deg,#0084ff,#a033ff)'}}>
                      <svg viewBox="0 0 32 32" className="w-7 h-7" fill="white"><path d="M16 2C8.27 2 2 7.8 2 14.93c0 3.9 1.85 7.38 4.76 9.76V30l4.59-2.52A14.86 14.86 0 0016 27.86c7.73 0 14-5.8 14-12.93C30 7.8 23.73 2 16 2zm1.41 17.41l-3.57-3.8-6.97 3.8 7.66-8.13 3.66 3.8 6.88-3.8-7.66 8.13z"/></svg>
                    </div>
                    <div className="flex-1">
                      <label className="block text-sm font-bold text-gray-800 mb-1">Facebook Messenger</label>
                      <p className="text-xs text-gray-500 mb-2">Customer taps this icon → opens Facebook Messenger chat</p>
                      <Field label="Messenger Page URL or Username" error={errors.messenger_page}>
                        <input value={data.messenger_page} onChange={e => setData('messenger_page', e.target.value)} className={inputClass} placeholder="e.g. https://m.me/yourpage or yourpagename" />
                      </Field>
                    </div>
                  </div>

                  {/* Info box */}
                  <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-xs text-amber-700">
                    <strong>Tip:</strong> Leave any field blank to hide that icon. At least one must be filled for the widget to appear on the storefront.
                  </div>
                </div>

                <button type="submit" disabled={processing} className="px-6 py-3 bg-green-500 hover:bg-green-600 disabled:opacity-60 text-white font-semibold rounded-xl">Save Chat Settings</button>
              </form>
            )}

            {activeTab === 'homepage' && (
              <form onSubmit={e => submitSection(e, 'homepage')} className="space-y-5">

                {/* Quick Links */}
                <div className="bg-orange-50 border border-orange-100 rounded-2xl p-4">
                  <p className="text-xs font-semibold text-orange-700 mb-3 uppercase tracking-wide flex items-center gap-1.5">
                    <svg className="w-3.5 h-3.5 text-orange-600 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"/></svg>
                    <span>Quick Preview Links</span>
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {[
                      { label: 'Homepage', href: '/', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
                      { label: 'Shop', href: '/shop', icon: 'M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z' },
                      { label: 'Categories', href: '/shop', icon: 'M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z' },
                      { label: 'Banners (Admin)', href: '/admin/banners', icon: 'M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z' },
                      { label: 'Features (Admin)', href: '/admin/features', icon: 'M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z' },
                      { label: 'Flash Sale', href: '/admin/flash-sale', icon: 'M13 10V3L4 14h7v7l9-11h-7z' },
                    ].map(l => (
                      <a key={l.label} href={l.href} target="_blank" rel="noreferrer"
                        className="px-3 py-1.5 bg-white border border-orange-200 text-orange-600 text-xs font-semibold rounded-lg hover:bg-orange-100 transition-colors inline-flex items-center gap-1.5">
                        <svg className="w-3.5 h-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d={l.icon}/></svg>
                        <span>{l.label}</span>
                        <span className="text-[10px] opacity-70">↗</span>
                      </a>
                    ))}
                  </div>
                </div>

                {/* Announcement Bar */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-gray-50">
                    <h3 className="font-bold text-gray-900"><svg className="w-4 h-4 text-orange-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z"/></svg> Announcement Bar</h3>
                    <a href="/" target="_blank" rel="noreferrer" className="text-xs text-orange-500 hover:underline">Preview ↗</a>
                  </div>
                  <p className="text-xs text-gray-400">The promo bar shown at the very top of every page.</p>
                  <div className="grid grid-cols-2 gap-4">
                    <Field label="Promo Text" error={errors.header_promo_text}>
                      <input value={data.header_promo_text} onChange={e => setData('header_promo_text', e.target.value)} className={inputClass} placeholder="e.g. Free shipping on orders over ৳500!" />
                    </Field>
                    <Field label="Promo Link (URL)" error={errors.header_promo_link}>
                      <input value={data.header_promo_link} onChange={e => setData('header_promo_link', e.target.value)} className={inputClass} placeholder="/shop or https://..." />
                    </Field>
                  </div>
                </div>

                {/* Hero / Banners */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-gray-50">
                    <h3 className="font-bold text-gray-900"><svg className="w-4 h-4 text-orange-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg> Hero Banners (Fallback)</h3>
                    <div className="flex items-center gap-3">
                      <a href="/admin/banners" target="_blank" rel="noreferrer" className="text-xs text-orange-500 hover:underline">Manage Banners ↗</a>
                      <a href="/" target="_blank" rel="noreferrer" className="text-xs text-gray-400 hover:underline">Preview ↗</a>
                    </div>
                  </div>
                  <p className="text-xs text-gray-400">Shown when no banner images are uploaded. Upload real banners via <a href="/admin/banners" target="_blank" className="text-orange-500 hover:underline">Admin → Banners</a>.</p>
                  <div className="grid grid-cols-2 gap-4">
                    <Field label="Fallback Badge" error={errors.hero_fallback_badge}>
                      <input value={data.hero_fallback_badge} onChange={e => setData('hero_fallback_badge', e.target.value)} className={inputClass} placeholder="e.g. New Arrival" />
                    </Field>
                    <Field label="Fallback Title" error={errors.hero_fallback_title}>
                      <input value={data.hero_fallback_title} onChange={e => setData('hero_fallback_title', e.target.value)} className={inputClass} placeholder="e.g. Shop the Best Deals" />
                    </Field>
                    <Field label="Fallback Subtitle" error={errors.hero_fallback_subtitle}>
                      <input value={data.hero_fallback_subtitle} onChange={e => setData('hero_fallback_subtitle', e.target.value)} className={inputClass} placeholder="e.g. Discover amazing products" />
                    </Field>
                  </div>
                </div>

                {/* Brands Marquee */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-gray-50">
                    <h3 className="font-bold text-gray-900"><svg className="w-4 h-4 text-orange-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"/></svg> Brands Marquee</h3>
                    <a href="/" target="_blank" rel="noreferrer" className="text-xs text-orange-500 hover:underline">Preview ↗</a>
                  </div>
                  <label className="flex items-center gap-3">
                    <input type="checkbox" checked={data.show_brands_marquee} onChange={e => setData('show_brands_marquee', e.target.checked)} className={checkboxClass} />
                    <span className="text-sm font-medium">Show scrolling brands marquee on homepage</span>
                  </label>
                  <Field label="Brand Names (comma-separated)" error={errors.brands_marquee}>
                    <textarea value={data.brands_marquee} onChange={e => setData('brands_marquee', e.target.value)} className={inputClass} rows={2} placeholder="Nike, Adidas, Samsung, Apple, Sony" />
                  </Field>
                </div>

                {/* Section Labels */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-gray-50">
                    <h3 className="font-bold text-gray-900"><svg className="w-4 h-4 text-orange-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg> Section Labels & Titles</h3>
                    <a href="/" target="_blank" rel="noreferrer" className="text-xs text-orange-500 hover:underline">Preview Homepage ↗</a>
                  </div>
                  <p className="text-xs text-gray-400">Customize the heading text for each homepage section.</p>
                  <div className="grid grid-cols-2 gap-4">
                    <Field label="View More Button Label" error={errors.home_view_more_label}>
                      <input value={data.home_view_more_label} onChange={e => setData('home_view_more_label', e.target.value)} className={inputClass} placeholder="View all" />
                    </Field>
                    <Field label="Default CTA Button Text" error={errors.default_cta_text}>
                      <input value={data.default_cta_text} onChange={e => setData('default_cta_text', e.target.value)} className={inputClass} placeholder="Shop now" />
                    </Field>
                    <Field label="Categories Section Title" error={errors.home_categories_title}>
                      <input value={data.home_categories_title} onChange={e => setData('home_categories_title', e.target.value)} className={inputClass} placeholder="Featured Categories" />
                    </Field>
                    <Field label="Hot Deals Title" error={errors.home_hot_deal_title}>
                      <input value={data.home_hot_deal_title} onChange={e => setData('home_hot_deal_title', e.target.value)} className={inputClass} placeholder="Hot Deals" />
                    </Field>
                    <Field label="Featured Products Title" error={errors.home_featured_title}>
                      <input value={data.home_featured_title} onChange={e => setData('home_featured_title', e.target.value)} className={inputClass} placeholder="Featured" />
                    </Field>
                    <Field label="Deal of the Week Title" error={errors.home_deal_week_title}>
                      <input value={data.home_deal_week_title} onChange={e => setData('home_deal_week_title', e.target.value)} className={inputClass} placeholder="Deal of the Week" />
                    </Field>
                    <Field label="Shop Subtitle (Shop page)" error={errors.shop_subtitle}>
                      <input value={data.shop_subtitle} onChange={e => setData('shop_subtitle', e.target.value)} className={inputClass} placeholder="Browse all products" />
                    </Field>
                    <Field label="Delivery ETA Text" error={errors.delivery_eta_text}>
                      <input value={data.delivery_eta_text} onChange={e => setData('delivery_eta_text', e.target.value)} className={inputClass} placeholder="Delivered within 2-3 days" />
                    </Field>
                  </div>
                </div>

                {/* Flash Sale Countdown */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-gray-50">
                    <h3 className="font-bold text-gray-900"><svg className="w-4 h-4 text-amber-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg> Flash Sale Countdown</h3>
                    <div className="flex items-center gap-3">
                      <a href="/admin/flash-sale" target="_blank" rel="noreferrer" className="text-xs text-orange-500 hover:underline">Manage Flash Sale ↗</a>
                      <a href="/" target="_blank" rel="noreferrer" className="text-xs text-gray-400 hover:underline">Preview ↗</a>
                    </div>
                  </div>
                  <Field label="Deal Ends At (countdown timer)" error={errors.deal_ends_at}>
                    <input type="datetime-local" value={data.deal_ends_at} onChange={e => setData('deal_ends_at', e.target.value)} className={inputClass} />
                  </Field>
                  <p className="text-xs text-gray-400">⚠ This sets a global countdown shown on flash sale sections. Leave blank to hide the timer.</p>
                </div>

                {/* Footer Marketplace Description */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-gray-50">
                    <h3 className="font-bold text-gray-900"><svg className="w-4 h-4 text-orange-500 shrink-0 inline-block mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>Footer Marketplace Description</h3>
                    <a href="/" target="_blank" rel="noreferrer" className="text-xs text-orange-500 hover:underline">Preview Footer ↗</a>
                  </div>
                  <p className="text-xs text-gray-400">The description text displayed under the brand logo in the website footer.</p>
                  <Field label="Footer Text" error={errors.footer_text}>
                    <textarea 
                      value={data.footer_text} 
                      onChange={e => setData('footer_text', e.target.value)} 
                      rows={3} 
                      className={inputClass} 
                      placeholder="Your everyday online marketplace - millions of products, flash deals and vouchers, delivered across the country." 
                    />
                  </Field>
                </div>

                <button type="submit" disabled={processing} className="px-6 py-3 bg-orange-500 hover:bg-orange-600 disabled:opacity-60 text-white font-semibold rounded-xl flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/></svg>
                  Save Homepage Settings
                </button>
              </form>
            )}

            {activeTab === 'payments' && (
              <form onSubmit={e => submitSection(e, 'payments')} className="space-y-5">
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-5">
                  <h3 className="font-bold text-gray-900 pb-3 border-b border-gray-50">Payment Gateways</h3>
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <label className="flex items-center gap-3 mb-2"><input type="checkbox" checked={data.pay_bkash_enabled} onChange={e => setData('pay_bkash_enabled', e.target.checked)} className={checkboxClass} /> <span className="font-medium text-pink-600">bKash</span></label>
                      <Field error={errors.bkash_number}><input value={data.bkash_number} onChange={e => setData('bkash_number', e.target.value)} className={inputClass} placeholder="bKash Number" /></Field>
                    </div>
                    <div>
                      <label className="flex items-center gap-3 mb-2"><input type="checkbox" checked={data.pay_nagad_enabled} onChange={e => setData('pay_nagad_enabled', e.target.checked)} className={checkboxClass} /> <span className="font-medium text-orange-500">Nagad</span></label>
                      <Field error={errors.nagad_number}><input value={data.nagad_number} onChange={e => setData('nagad_number', e.target.value)} className={inputClass} placeholder="Nagad Number" /></Field>
                    </div>
                    <div>
                      <label className="flex items-center gap-3 mb-2"><input type="checkbox" checked={data.pay_rocket_enabled} onChange={e => setData('pay_rocket_enabled', e.target.checked)} className={checkboxClass} /> <span className="font-medium text-purple-600">Rocket</span></label>
                      <Field error={errors.rocket_number}><input value={data.rocket_number} onChange={e => setData('rocket_number', e.target.value)} className={inputClass} placeholder="Rocket Number" /></Field>
                    </div>
                    <div>
                      <label className="flex items-center gap-3 mb-2"><input type="checkbox" checked={data.pay_cod_enabled} onChange={e => setData('pay_cod_enabled', e.target.checked)} className={checkboxClass} /> <span className="font-medium text-gray-800">Cash on Delivery</span></label>
                    </div>
                  </div>
                  <div className="pt-4 border-t border-gray-50">
                    <label className="flex items-center gap-3">
                      <input type="checkbox" checked={data.show_cards_in_footer} onChange={e => setData('show_cards_in_footer', e.target.checked)} className={checkboxClass} />
                      <span className="text-sm font-medium">Show Payment Icons in Footer</span>
                    </label>
                  </div>

                  {/* COD Delivery Upfront Toggle */}
                  <div className="pt-4 border-t border-gray-50 space-y-2">
                    <h4 className="font-semibold text-gray-800 text-sm">Cash on Delivery — Thank You Page</h4>
                    <label className="flex items-start gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={data.cod_delivery_upfront}
                        onChange={e => setData('cod_delivery_upfront', e.target.checked)}
                        className={checkboxClass}
                      />
                      <div>
                        <span className="font-medium text-gray-800 text-sm block">"Pay now (delivery)" ব্রেকডাউন দেখাও</span>
                        <span className="text-xs text-gray-500 leading-snug">
                          চালু থাকলে: Thank You পেজে ডেলিভারি চার্জ আলাদাভাবে <b>Pay now</b> এবং বাকি টাকা <b>Pay after delivery</b> হিসেবে দেখাবে।<br />
                          বন্ধ থাকলে: শুধু Order Total দেখাবে, আলাদা ব্রেকডাউন থাকবে না।
                        </span>
                      </div>
                    </label>
                  </div>
                </div>
                <button type="submit" disabled={processing} className="px-6 py-3 bg-orange-500 hover:bg-orange-600 disabled:opacity-60 text-white font-semibold rounded-xl">Save Payment Settings</button>
              </form>
            )}

            {activeTab === 'shipping' && (
              <form onSubmit={e => submitSection(e, 'shipping')} className="space-y-5">
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-5">
                  <h3 className="font-bold text-gray-900 pb-3 border-b border-gray-50">Shipping & Currency</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Field label="Shipping Fee (Inside Dhaka)" error={errors.shipping_inside_dhaka}><input type="number" min="0" step="0.01" value={data.shipping_inside_dhaka} onChange={e => setData('shipping_inside_dhaka', e.target.value)} className={inputClass} required /></Field>
                    <Field label="Inside Label" error={errors.shipping_inside_label}><input value={data.shipping_inside_label} onChange={e => setData('shipping_inside_label', e.target.value)} className={inputClass} /></Field>
                    <Field label="Shipping Fee (Outside Dhaka)" error={errors.shipping_outside_dhaka}><input type="number" min="0" step="0.01" value={data.shipping_outside_dhaka} onChange={e => setData('shipping_outside_dhaka', e.target.value)} className={inputClass} required /></Field>
                    <Field label="Outside Label" error={errors.shipping_outside_label}><input value={data.shipping_outside_label} onChange={e => setData('shipping_outside_label', e.target.value)} className={inputClass} /></Field>
                    <Field label="Tax Percent (%)" error={errors.tax_percent}><input type="number" min="0" max="100" step="0.01" value={data.tax_percent} onChange={e => setData('tax_percent', e.target.value)} className={inputClass} required /></Field>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                    <Field label="Currency Symbol" error={errors.currency_symbol}><input type="text" value={data.currency_symbol} onChange={e => setData('currency_symbol', e.target.value)} className={inputClass} placeholder="e.g. ৳" /></Field>
                    <Field label="Currency Code" error={errors.currency_code}><input type="text" value={data.currency_code} onChange={e => setData('currency_code', e.target.value)} className={inputClass} placeholder="e.g. BDT" /></Field>
                  </div>
                  <div className="grid grid-cols-1 gap-4 mt-6 pt-6 border-t border-gray-100">
                    <div>
                      <h3 className="font-bold text-gray-900">Checkout &amp; Popup Delivery Note (ডেলিভারি নোট অপশন)</h3>
                      <p className="text-xs text-gray-400 mt-0.5">Allow customers to provide special delivery notes or instructions during checkout and COD quick order popup.</p>
                    </div>
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={data.checkout_delivery_note_enabled} 
                        onChange={e => setData('checkout_delivery_note_enabled', e.target.checked)} 
                        className={checkboxClass} 
                      />
                      <span className="text-sm font-semibold text-gray-800">
                        Enable Delivery Note field on Checkout &amp; Quick Order Popup (চেকআউট পেজ এবং পপআপে ডেলিভারি নোট চালু রাখুন)
                      </span>
                    </label>
                    {data.checkout_delivery_note_enabled && (
                      <Field label="Delivery Note Field Label (ফিল্ড লেবেল)" error={errors.checkout_delivery_note_label}>
                        <input 
                          value={data.checkout_delivery_note_label} 
                          onChange={e => setData('checkout_delivery_note_label', e.target.value)} 
                          className={inputClass} 
                          placeholder="ডেলিভারি সংক্রান্ত বিশেষ নোট (ঐচ্ছিক)" 
                        />
                      </Field>
                    )}
                  </div>

                  <div className="grid grid-cols-1 gap-6 mt-6 pt-6 border-t border-gray-100">
                    <h3 className="font-bold text-gray-900">Security & Fraud Prevention</h3>
                    <Field label="Order Cooldown (Minutes)" error={errors.fraud_order_time_limit_minutes} help="Time before the same IP can place another order. (Set to 0 to disable)">
                        <input type="number" min="0" max="1440" value={data.fraud_order_time_limit_minutes} onChange={e => setData('fraud_order_time_limit_minutes', e.target.value)} className={inputClass} />
                    </Field>
                  </div>
                </div>
                <button type="submit" disabled={processing} className="px-6 py-3 bg-orange-500 hover:bg-orange-600 disabled:opacity-60 text-white font-semibold rounded-xl">Save Shipping Settings</button>
              </form>
            )}

            {activeTab === 'mail' && (
              <form onSubmit={e => submitSection(e, 'mail')} className="space-y-6">
                {/* Email Templates Banner */}
                <div className="p-4 bg-orange-50/70 border border-orange-200/80 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-xl bg-orange-500 text-white flex items-center justify-center shrink-0 shadow-xs mt-0.5">
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-orange-950">
                        Email Templates &amp; Design (ইমেইল ডিজাইন পরিবর্তন)
                      </h4>
                      <p className="text-xs text-orange-900/80 mt-0.5">
                        Customize customer order confirmation, OTP code, admin alert text, and colors with live preview.
                      </p>
                    </div>
                  </div>
                  <a
                    href="/admin/email-templates"
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white text-xs font-semibold rounded-xl transition-all shadow-xs shrink-0 self-start sm:self-auto"
                  >
                    <span>Manage Email Templates</span>
                    <span>&rarr;</span>
                  </a>
                </div>

                {/* Email Notification Events & Toggles (কোন কোন ইমেইল চালু/বন্ধ থাকবে) */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-4">
                  <div className="pb-3 border-b border-gray-100 flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-gray-100 text-gray-700 flex items-center justify-center shrink-0">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900 text-base">
                          Email Notification Triggers (ইমেইল চালু / বন্ধ নিয়ন্ত্রণ)
                        </h3>
                        <p className="text-xs text-gray-500 mt-0.5">
                          ওয়েবসাইটের কোন কোন ইভেন্টে অটোমেটিক ইমেইল পাঠানো হবে তা এখান থেকে নিয়ন্ত্রণ করুন।
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3 pt-1">
                    {/* Customer Order Confirmation */}
                    <div className="flex items-center justify-between p-3.5 rounded-xl border border-gray-100 hover:border-orange-100 hover:bg-orange-50/20 transition-all">
                      <div className="flex items-start gap-3 pr-4">
                        <div className="w-8 h-8 rounded-lg bg-orange-50 text-orange-600 flex items-center justify-center shrink-0 mt-0.5">
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                          </svg>
                        </div>
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-semibold text-gray-800">Customer: Order Placed Confirmation</span>
                            {data.mail_notify_customer_order_placed ? (
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-green-100 text-green-700">ON / চালু</span>
                            ) : (
                              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-gray-100 text-gray-500">OFF / বন্ধ</span>
                            )}
                          </div>
                          <p className="text-xs text-gray-500">
                            কাস্টমার ওয়েবসাইটে অর্ডার সাবমিট করলে ইনভয়েস ও ট্র্যাকিং লিংক সহ ইমেইল পাঠানো।
                          </p>
                        </div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer shrink-0">
                        <input
                          type="checkbox"
                          checked={data.mail_notify_customer_order_placed}
                          onChange={e => setData('mail_notify_customer_order_placed', e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-500"></div>
                      </label>
                    </div>

                    {/* Customer Order Verified / Payment Confirmed */}
                    <div className="flex items-center justify-between p-3.5 rounded-xl border border-gray-100 hover:border-orange-100 hover:bg-orange-50/20 transition-all">
                      <div className="flex items-start gap-3 pr-4">
                        <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5">
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-semibold text-gray-800">Customer: Order Confirmed &amp; Verified</span>
                            {data.mail_notify_customer_order_verified ? (
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-green-100 text-green-700">ON / চালু</span>
                            ) : (
                              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-gray-100 text-gray-500">OFF / বন্ধ</span>
                            )}
                          </div>
                          <p className="text-xs text-gray-500">
                            অর্ডার কনফার্ম বা পেমেন্ট ভেরিফাই হলে কাস্টমারকে প্যাকেজ ট্র্যাকিং নোটিফিকেশন পাঠানো।
                          </p>
                        </div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer shrink-0">
                        <input
                          type="checkbox"
                          checked={data.mail_notify_customer_order_verified}
                          onChange={e => setData('mail_notify_customer_order_verified', e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-500"></div>
                      </label>
                    </div>

                    {/* Admin Order Alert */}
                    <div className="flex items-center justify-between p-3.5 rounded-xl border border-gray-100 hover:border-orange-100 hover:bg-orange-50/20 transition-all">
                      <div className="flex items-start gap-3 pr-4">
                        <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 mt-0.5">
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 10a3 3 0 00-3-3m0 0a3 3 0 00-3 3m3 3a3 3 0 003-3m0 6a6 6 0 01-6-6" />
                          </svg>
                        </div>
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-semibold text-gray-800">Admin: New Order Alert Email</span>
                            {data.mail_notify_admin_new_order ? (
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-green-100 text-green-700">ON / চালু</span>
                            ) : (
                              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-gray-100 text-gray-500">OFF / বন্ধ</span>
                            )}
                          </div>
                          <p className="text-xs text-gray-500">
                            ওয়েবসাইটে নতুন কোনো অর্ডার আসলে এডমিন বা ম্যানেজমেন্ট ইমেইলে অর্ডারের সম্পূর্ণ বিবরণসহ অ্যালার্ট পাঠানো।
                          </p>
                        </div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer shrink-0">
                        <input
                          type="checkbox"
                          checked={data.mail_notify_admin_new_order}
                          onChange={e => setData('mail_notify_admin_new_order', e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-500"></div>
                      </label>
                    </div>

                    {/* Login / Verification OTP */}
                    <div className="flex items-center justify-between p-3.5 rounded-xl border border-gray-100 hover:border-orange-100 hover:bg-orange-50/20 transition-all">
                      <div className="flex items-start gap-3 pr-4">
                        <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center shrink-0 mt-0.5">
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                          </svg>
                        </div>
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-semibold text-gray-800">Security: Login &amp; Verification OTP</span>
                            {data.otp_enabled ? (
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-green-100 text-green-700">ON / চালু</span>
                            ) : (
                              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-gray-100 text-gray-500">OFF / বন্ধ</span>
                            )}
                          </div>
                          <p className="text-xs text-gray-500">
                            কাস্টমার লগইন বা একাউন্ট ভেরিফিকেশনের জন্য ইমেইলে ওয়ান-টাইম ওটিপি কোড পাঠানো।
                          </p>
                        </div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer shrink-0">
                        <input
                          type="checkbox"
                          checked={data.otp_enabled}
                          onChange={e => setData('otp_enabled', e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-500"></div>
                      </label>
                    </div>

                    {/* Forgot Password Reset Code */}
                    <div className="flex items-center justify-between p-3.5 rounded-xl border border-gray-100 hover:border-orange-100 hover:bg-orange-50/20 transition-all">
                      <div className="flex items-start gap-3 pr-4">
                        <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center shrink-0 mt-0.5">
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                          </svg>
                        </div>
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-semibold text-gray-800">Security: Forgot Password Reset Code</span>
                            {data.mail_notify_password_reset ? (
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-green-100 text-green-700">ON / চালু</span>
                            ) : (
                              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-gray-100 text-gray-500">OFF / বন্ধ</span>
                            )}
                          </div>
                          <p className="text-xs text-gray-500">
                            কাস্টমার পাসওয়ার্ড ভুলে গেলে একাউন্ট পুনরুদ্ধারের জন্য ইমেইলে রিসেট সিকিউরিটি ওটিপি কোড পাঠানো।
                          </p>
                        </div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer shrink-0">
                        <input
                          type="checkbox"
                          checked={data.mail_notify_password_reset}
                          onChange={e => setData('mail_notify_password_reset', e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-500"></div>
                      </label>
                    </div>

                    {/* Contact Message */}
                    <div className="flex items-center justify-between p-3.5 rounded-xl border border-gray-100 hover:border-orange-100 hover:bg-orange-50/20 transition-all">
                      <div className="flex items-start gap-3 pr-4">
                        <div className="w-8 h-8 rounded-lg bg-sky-50 text-sky-600 flex items-center justify-center shrink-0 mt-0.5">
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                          </svg>
                        </div>
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-semibold text-gray-800">Support: Contact Us Form Messages</span>
                            {data.mail_notify_contact_message ? (
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-green-100 text-green-700">ON / চালু</span>
                            ) : (
                              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-gray-100 text-gray-500">OFF / বন্ধ</span>
                            )}
                          </div>
                          <p className="text-xs text-gray-500">
                            ওয়েবসাইটের Contact Us পেজ থেকে কোনো ভিজিটর মেসেজ পাঠালে এডমিনকে ইমেইল পাঠানো।
                          </p>
                        </div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer shrink-0">
                        <input
                          type="checkbox"
                          checked={data.mail_notify_contact_message}
                          onChange={e => setData('mail_notify_contact_message', e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-500"></div>
                      </label>
                    </div>
                  </div>
                </div>

                {/* Admin Order Alert Recipients (অর্ডার আসলে যে ইমেইলে যাবে) */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-4">
                  <div className="pb-3 border-b border-gray-100 flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-gray-100 text-gray-700 flex items-center justify-center shrink-0">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 text-base">
                        Admin Order Alert Recipient(s) (অর্ডার আসলে যে ইমেইলে নোটিফিকেশন যাবে)
                      </h3>
                      <p className="text-xs text-gray-500 mt-0.5">
                        ওয়েবসাইটে নতুন যেকোনো অর্ডার আসলে কাস্টমার বিবরণ সহ স্বয়ংক্রিয়ভাবে এই ইমেইলগুলোতে অ্যালার্ট পাঠানো হবে।
                      </p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Field label="Admin Order Alert Recipient Email(s)" error={errors.mail_admin_order_recipients}>
                      <input
                        type="text"
                        value={data.mail_admin_order_recipients}
                        onChange={e => setData('mail_admin_order_recipients', e.target.value)}
                        placeholder="e.g. orders@myshop.com, admin@myshop.com"
                        className={inputClass + ' font-mono text-xs'}
                      />
                      <p className="text-[11px] text-gray-400 mt-1">
                        একাধিক ইমেইল দিতে কমা (,) ব্যবহার করুন। ফাঁকা রাখলে সাইটের ডিফল্ট ইমেইলে (<code className="text-gray-600">{data.contact_email || 'contact_email'}</code>) নোটিফিকেশন যাবে।
                      </p>
                    </Field>

                    {/* Test Admin Order Alert Button */}
                    <div className="pt-2 flex flex-col sm:flex-row items-start sm:items-center gap-3">
                      <button
                        type="button"
                        onClick={handleTestAdminOrderAlert}
                        disabled={testingAdminAlert}
                        className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-xs font-bold rounded-xl transition-all shadow-sm flex items-center justify-center gap-2"
                      >
                        {testingAdminAlert ? (
                          <>
                            <svg className="animate-spin h-3.5 w-3.5 text-white" viewBox="0 0 24 24" fill="none">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            <span>Sending Test Alert...</span>
                          </>
                        ) : (
                          <>
                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                            </svg>
                            <span>Send Test Admin Order Alert (টেস্ট অর্ডার অ্যালার্ট পাঠান)</span>
                          </>
                        )}
                      </button>
                    </div>

                    {adminAlertTestResult && (
                      <div className={`p-3.5 rounded-xl text-xs border ${
                        adminAlertTestResult.success
                          ? 'bg-green-50 border-green-200 text-green-900'
                          : 'bg-red-50 border-red-200 text-red-900'
                      }`}>
                        <div className="flex items-start gap-2.5">
                          {adminAlertTestResult.success ? (
                            <svg className="w-4 h-4 text-green-600 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                          ) : (
                            <svg className="w-4 h-4 text-red-600 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          )}
                          <div>
                            <p className="font-semibold">{adminAlertTestResult.message}</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* SMTP Server Configuration */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-5">
                  <h3 className="font-bold text-gray-900 pb-3 border-b border-gray-50 text-base">
                    SMTP Server Configuration (সার্ভার সেটিংস)
                  </h3>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <Field label="Mailer" error={errors.mail_mailer}>
                      <select value={data.mail_mailer} onChange={e => setData('mail_mailer', e.target.value)} className={inputClass}>
                        <option value="log">Log (Testing — logs to laravel.log)</option>
                        <option value="smtp">SMTP (Production — sends real emails)</option>
                      </select>
                    </Field>
                    <Field label="Encryption" error={errors.mail_encryption}>
                      <select value={data.mail_encryption} onChange={e => setData('mail_encryption', e.target.value)} className={inputClass}>
                        <option value="none">None</option>
                        <option value="tls">TLS (Port 587)</option>
                        <option value="ssl">SSL (Port 465)</option>
                      </select>
                    </Field>
                    <Field label="Host" error={errors.mail_host}><input value={data.mail_host} onChange={e => setData('mail_host', e.target.value)} className={inputClass} placeholder="e.g. smtp.gmail.com" /></Field>
                    <Field label="Port" error={errors.mail_port}><input value={data.mail_port} onChange={e => setData('mail_port', e.target.value)} className={inputClass} placeholder="465 or 587" /></Field>
                    <Field label="Username" error={errors.mail_username}><input value={data.mail_username} onChange={e => setData('mail_username', e.target.value)} className={inputClass} placeholder="e.g. mail@example.com" /></Field>
                    <Field label="Password" error={errors.mail_password}><input type="password" value={data.mail_password} onChange={e => setData('mail_password', e.target.value)} className={inputClass} placeholder="Leave blank to keep unchanged" /></Field>
                    <Field label="From Address" error={errors.mail_from_address}><input value={data.mail_from_address} onChange={e => setData('mail_from_address', e.target.value)} className={inputClass} placeholder="e.g. no-reply@example.com" /></Field>
                    <Field label="From Name" error={errors.mail_from_name}><input value={data.mail_from_name} onChange={e => setData('mail_from_name', e.target.value)} className={inputClass} placeholder="e.g. My Shop" /></Field>
                  </div>

                  {/* General SMTP Test */}
                  <div className="pt-4 border-t border-gray-100 space-y-3">
                    <div>
                      <h4 className="text-xs font-bold uppercase tracking-wider text-gray-700">Test General SMTP Connection (টেস্ট মেইল পাঠান)</h4>
                      <p className="text-xs text-gray-400 mt-0.5">Send a test email to verify that your SMTP host, port, username, password and SSL/TLS encryption are working properly.</p>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-2 max-w-md">
                      <input
                        type="email"
                        value={testEmail}
                        onChange={e => setTestEmail(e.target.value)}
                        placeholder="Enter email to receive test..."
                        className={inputClass}
                      />
                      <button
                        type="button"
                        onClick={handleTestMail}
                        disabled={testingMail}
                        className="px-5 py-2.5 bg-gray-800 hover:bg-gray-900 disabled:opacity-50 text-white text-xs font-bold rounded-xl whitespace-nowrap transition-all shadow-sm flex items-center justify-center gap-1.5"
                      >
                        {testingMail ? (
                          <>
                            <svg className="animate-spin h-3.5 w-3.5 text-white" viewBox="0 0 24 24" fill="none">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            <span>Sending...</span>
                          </>
                        ) : (
                          <>
                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                            <span>Send Test Mail</span>
                          </>
                        )}
                      </button>
                    </div>

                    {mailTestResult && (
                      <div className={`p-3.5 rounded-xl text-xs border ${
                        mailTestResult.success
                          ? 'bg-green-50 border-green-200 text-green-900'
                          : 'bg-red-50 border-red-200 text-red-900'
                      }`}>
                        <div className="flex items-start gap-2.5">
                          {mailTestResult.success ? (
                            <svg className="w-4 h-4 text-green-600 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                          ) : (
                            <svg className="w-4 h-4 text-red-600 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          )}
                          <div className="space-y-1">
                            <p className="font-semibold">{mailTestResult.message}</p>
                            {!mailTestResult.success && (
                              <ul className="list-disc list-inside text-gray-600 mt-1 space-y-0.5 text-[11px]">
                                <li>Port <strong>465</strong> usually requires <strong>SSL</strong> encryption.</li>
                                <li>Port <strong>587</strong> usually requires <strong>TLS</strong> encryption.</li>
                                <li>For Gmail, enable 2-Step Verification and use a 16-character <strong>App Password</strong> instead of your regular password.</li>
                                <li>Ensure your hosting provider allows outbound connections on your SMTP port.</li>
                              </ul>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <button type="submit" disabled={processing} className="px-6 py-3 bg-orange-500 hover:bg-orange-600 disabled:opacity-60 text-white font-semibold rounded-xl shadow-sm transition-all">
                  Save Mail Settings
                </button>
              </form>
            )}

            {activeTab === 'seo' && (
              <form onSubmit={e => submitSection(e, 'seo')} className="space-y-5">
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-5">
                  <h3 className="font-bold text-gray-900 pb-3 border-b border-gray-50">Default SEO Setup</h3>
                  <Field label="Default Meta Title" error={errors.default_meta_title}><input value={data.default_meta_title} onChange={e => setData('default_meta_title', e.target.value)} className={inputClass} /></Field>
                  <Field label="Default Meta Description" error={errors.default_meta_description}><textarea value={data.default_meta_description} onChange={e => setData('default_meta_description', e.target.value)} rows={3} className={inputClass} /></Field>
                  <Field label="Default Meta Keywords" error={errors.default_meta_keywords}><textarea value={data.default_meta_keywords} onChange={e => setData('default_meta_keywords', e.target.value)} rows={2} className={inputClass} placeholder="store, shop, etc..." /></Field>
                </div>
                <button type="submit" disabled={processing} className="px-6 py-3 bg-orange-500 hover:bg-orange-600 disabled:opacity-60 text-white font-semibold rounded-xl">Save SEO Settings</button>
              </form>
            )}

            {activeTab === 'tracking' && (
              <form onSubmit={e => submitSection(e, 'tracking')} className="space-y-6">
                {/* Channel Switcher Pills */}
                <div className="flex flex-wrap items-center gap-2 p-1.5 bg-gray-100/90 rounded-2xl">
                  <button
                    type="button"
                    onClick={() => setTrackingSubTab('all')}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${trackingSubTab === 'all' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-800'}`}
                  >
                    View All Tracking
                  </button>
                  <button
                    type="button"
                    onClick={() => setTrackingSubTab('google')}
                    className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${trackingSubTab === 'google' ? 'bg-emerald-600 text-white shadow-sm' : 'text-emerald-800 bg-emerald-50 hover:bg-emerald-100'}`}
                  >
                    <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                    Google Analytics (GA4) & Ads
                  </button>
                  <button
                    type="button"
                    onClick={() => setTrackingSubTab('meta')}
                    className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${trackingSubTab === 'meta' ? 'bg-blue-600 text-white shadow-sm' : 'text-blue-800 bg-blue-50 hover:bg-blue-100'}`}
                  >
                    <span className="w-2 h-2 rounded-full bg-blue-400"></span>
                    Meta (Facebook & CAPI)
                  </button>
                  <button
                    type="button"
                    onClick={() => setTrackingSubTab('tiktok')}
                    className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${trackingSubTab === 'tiktok' ? 'bg-black text-white shadow-sm' : 'text-gray-700 bg-gray-200 hover:bg-gray-300'}`}
                  >
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

                {/* Quick Status Bar */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div onClick={() => setTrackingSubTab('google')} className="cursor-pointer bg-white border border-gray-100 rounded-xl p-3 hover:border-emerald-300 transition-colors shadow-xs">
                    <p className="text-[11px] text-gray-500 font-medium">Google Analytics</p>
                    <p className="text-xs font-bold text-gray-900 truncate mt-0.5">{data.tracking_ga4_id || 'Not Connected'}</p>
                    <span className={`inline-block w-2 h-2 rounded-full mt-1.5 ${data.tracking_ga4_id ? 'bg-emerald-500' : 'bg-gray-300'}`}></span>
                  </div>
                  <div onClick={() => setTrackingSubTab('meta')} className="cursor-pointer bg-white border border-gray-100 rounded-xl p-3 hover:border-blue-300 transition-colors shadow-xs">
                    <p className="text-[11px] text-gray-500 font-medium">Meta Pixel / CAPI</p>
                    <p className="text-xs font-bold text-gray-900 truncate mt-0.5">{data.tracking_meta_pixel_id || 'Not Connected'}</p>
                    <span className={`inline-block w-2 h-2 rounded-full mt-1.5 ${data.tracking_meta_pixel_id ? 'bg-blue-500' : 'bg-gray-300'}`}></span>
                  </div>
                  <div onClick={() => setTrackingSubTab('google')} className="cursor-pointer bg-white border border-gray-100 rounded-xl p-3 hover:border-emerald-300 transition-colors shadow-xs">
                    <p className="text-[11px] text-gray-500 font-medium">Google Ads</p>
                    <p className="text-xs font-bold text-gray-900 truncate mt-0.5">{data.tracking_google_ads_id || 'Not Connected'}</p>
                    <span className={`inline-block w-2 h-2 rounded-full mt-1.5 ${data.tracking_google_ads_id ? 'bg-emerald-500' : 'bg-gray-300'}`}></span>
                  </div>
                  <div onClick={() => setTrackingSubTab('tiktok')} className="cursor-pointer bg-white border border-gray-100 rounded-xl p-3 hover:border-gray-400 transition-colors shadow-xs">
                    <p className="text-[11px] text-gray-500 font-medium">TikTok Pixel</p>
                    <p className="text-xs font-bold text-gray-900 truncate mt-0.5">{data.tracking_tiktok_pixel_id || 'Not Connected'}</p>
                    <span className={`inline-block w-2 h-2 rounded-full mt-1.5 ${data.tracking_tiktok_pixel_id ? 'bg-gray-800' : 'bg-gray-300'}`}></span>
                  </div>
                </div>

                {/* 1. Meta (Facebook) Suite */}
                {(trackingSubTab === 'all' || trackingSubTab === 'meta') && (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-5">
                  <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold text-base shadow-sm">
                        f
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900 leading-tight">Meta (Facebook) Pixel & Conversions API (CAPI)</h3>
                        <p className="text-xs text-gray-500">Browser pixel & server-side conversion tracking with deduplication</p>
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

                {/* 2. Google Marketing Suite */}
                {(trackingSubTab === 'all' || trackingSubTab === 'google') && (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-5">
                  <div className="flex items-center gap-2.5 pb-3 border-b border-gray-100">
                    <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-bold text-sm shadow-sm">
                      G
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 leading-tight">Google Marketing Suite</h3>
                      <p className="text-xs text-gray-500">Google Analytics 4 (GA4), Tag Manager & Google Ads Conversions</p>
                    </div>
                  </div>

                  {/* Highlighted GA4 Section */}
                  <div className="bg-gradient-to-br from-emerald-50/60 via-teal-50/30 to-slate-50 border border-emerald-100 rounded-xl p-5 space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-sm font-bold text-emerald-950">Google Analytics 4 (GA4)</span>
                        <p className="text-xs text-gray-600">Track visitors, product views, add to cart, and e-commerce conversions directly in GA4.</p>
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
                          placeholder="API Secret for server-side events" 
                        />
                        <p className="text-[11px] text-gray-500 mt-1">Found in GA4 Data Stream &gt; Measurement Protocol API secrets</p>
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

                {/* 3. TikTok Marketing */}
                {(trackingSubTab === 'all' || trackingSubTab === 'tiktok') && (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-5">
                  <div className="flex items-center gap-2.5 pb-3 border-b border-gray-100">
                    <div className="w-8 h-8 rounded-lg bg-black text-white flex items-center justify-center font-bold text-xs shadow-sm">
                      TT
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 leading-tight">TikTok Marketing</h3>
                      <p className="text-xs text-gray-500">TikTok Pixel for tracking TikTok Ads performance</p>
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
                    <h3 className="font-bold text-gray-900 leading-tight">Custom Tracking & Header/Body Scripts</h3>
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

                <div className="flex items-center gap-4">
                  <button type="submit" disabled={processing} className="px-7 py-3 bg-orange-500 hover:bg-orange-600 disabled:opacity-60 text-white font-semibold rounded-xl shadow-sm transition-colors">
                    {processing ? 'Saving...' : 'Save Tracking Settings'}
                  </button>
                </div>
              </form>
            )}

            {activeTab === 'legal' && (
              <form onSubmit={e => submitSection(e, 'legal')} className="space-y-5">
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-5">
                  <h3 className="font-bold text-gray-900 pb-3 border-b border-gray-50">Legal Pages</h3>
                  <Field label="Terms & Conditions (HTML/Text)" error={errors.terms_content}><textarea value={data.terms_content} onChange={e => setData('terms_content', e.target.value)} rows={10} className={inputClass} /></Field>
                  <Field label="Privacy Policy (HTML/Text)" error={errors.privacy_content}><textarea value={data.privacy_content} onChange={e => setData('privacy_content', e.target.value)} rows={10} className={inputClass} /></Field>
                  <Field label="Refund Policy (HTML/Text)" error={errors.refund_content}><textarea value={data.refund_content} onChange={e => setData('refund_content', e.target.value)} rows={10} className={inputClass} /></Field>
                </div>
                <button type="submit" disabled={processing} className="px-6 py-3 bg-orange-500 hover:bg-orange-600 disabled:opacity-60 text-white font-semibold rounded-xl">Save Legal Pages</button>
              </form>
            )}

            {activeTab === 'courier' && (
              <form onSubmit={e => submitSection(e, 'courier')} className="space-y-5">

                {/* Default Courier */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-4">
                  <h3 className="font-bold text-gray-900 pb-3 border-b border-gray-50 flex items-center gap-2">
                    <svg className="w-5 h-5 text-orange-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z"/><path strokeLinecap="round" strokeLinejoin="round" d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0"/></svg> Courier Integration
                  </h3>
                  <Field label="Default Courier" error={errors.courier_default}>
                    <select value={data.courier_default} onChange={e => setData('courier_default', e.target.value)} className={inputClass}>
                      <option value="steadfast">Steadfast Courier</option>
                      <option value="pathao">Pathao Courier</option>
                      <option value="redx">RedX Courier</option>
                    </select>
                  </Field>
                  <p className="text-xs text-gray-400 bg-gray-50 rounded-xl p-3">
                    ✅ Keys entered here are saved in the database and override any <code>.env</code> values. Fields left blank will fall back to <code>.env</code> values.
                  </p>
                </div>

                {/* Steadfast */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-4">
                  <div className="flex items-center gap-2 pb-3 border-b border-gray-50">
                    <span className="inline-block w-3 h-3 rounded-full bg-green-500"></span>
                    <h3 className="font-bold text-gray-900">Steadfast Courier</h3>
                    <a href="https://steadfast.com.bd/dashboard" target="_blank" rel="noreferrer" className="ml-auto text-xs text-orange-500 hover:underline">Open Dashboard ↗</a>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <Field label="API Key" error={errors.steadfast_api_key}>
                      <input value={data.steadfast_api_key} onChange={e => setData('steadfast_api_key', e.target.value)} className={inputClass} placeholder="Get from Steadfast merchant portal" />
                    </Field>
                    <Field label="Secret Key" error={errors.steadfast_secret_key}>
                      <input type="password" value={data.steadfast_secret_key} onChange={e => setData('steadfast_secret_key', e.target.value)} className={inputClass} placeholder="••••••••••••" />
                    </Field>
                  </div>
                </div>

                {/* Pathao */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-4">
                  <div className="flex items-center gap-2 pb-3 border-b border-gray-50">
                    <span className="inline-block w-3 h-3 rounded-full bg-blue-500"></span>
                    <h3 className="font-bold text-gray-900">Pathao Courier</h3>
                    <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700">OAuth 2.0</span>
                    <a href="https://pathao.com/courier/" target="_blank" rel="noreferrer" className="ml-auto text-xs text-orange-500 hover:underline">Open Dashboard ↗</a>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="sm:col-span-2">
                      <Field label="Environment" error={errors.pathao_environment}>
                        <select
                          value={data.pathao_environment || 'live'}
                          onChange={e => setData('pathao_environment', e.target.value)}
                          className={inputClass}
                        >
                          <option value="live">Live / Production (https://api-hermes.pathao.com)</option>
                          <option value="sandbox">Sandbox / Test (https://courier-api-sandbox.pathao.com)</option>
                        </select>
                      </Field>
                    </div>

                    <Field label="Client ID" error={errors.pathao_client_id}>
                      <input value={data.pathao_client_id} onChange={e => setData('pathao_client_id', e.target.value)} className={inputClass} placeholder="e.g. y1aKB6ReQG" />
                    </Field>
                    <Field label="Client Secret" error={errors.pathao_client_secret}>
                      <input type="password" value={data.pathao_client_secret} onChange={e => setData('pathao_client_secret', e.target.value)} className={inputClass} placeholder="••••••••••••" />
                    </Field>
                    <Field label="Username (Email)" error={errors.pathao_username}>
                      <input value={data.pathao_username} onChange={e => setData('pathao_username', e.target.value)} className={inputClass} placeholder="merchant@email.com" />
                    </Field>
                    <Field label="Password" error={errors.pathao_password}>
                      <input type="password" value={data.pathao_password} onChange={e => setData('pathao_password', e.target.value)} className={inputClass} placeholder="••••••••••••" />
                    </Field>

                    <div className="sm:col-span-2">
                      <Field label="Store ID" error={errors.pathao_store_id}>
                        <div className="flex gap-2">
                          <input value={data.pathao_store_id} onChange={e => setData('pathao_store_id', e.target.value)} className={inputClass} placeholder="Numeric store ID (e.g. 12345)" />
                          <button
                            type="button"
                            onClick={handleTestPathao}
                            disabled={testingPathao}
                            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-semibold text-xs rounded-xl flex items-center gap-1.5 shrink-0 transition-colors shadow-2xs cursor-pointer"
                          >
                            {testingPathao ? (
                              <>
                                <svg className="animate-spin w-3.5 h-3.5" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/></svg>
                                <span>Testing...</span>
                              </>
                            ) : (
                              <>
                                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                                <span>Test &amp; Fetch Stores</span>
                              </>
                            )}
                          </button>
                        </div>
                      </Field>
                    </div>
                  </div>

                  {/* Test Result Message */}
                  {pathaoTestResult && (
                    <div className={`p-4 rounded-xl text-xs space-y-2 border ${pathaoTestResult.success ? 'bg-emerald-50 text-emerald-800 border-emerald-200' : 'bg-red-50 text-red-800 border-red-200'}`}>
                      <div className="flex items-center gap-2 font-semibold">
                        <span>{pathaoTestResult.success ? '✅' : '❌'}</span>
                        <span>{pathaoTestResult.message}</span>
                      </div>
                      {pathaoTestResult.stores && pathaoTestResult.stores.length > 0 && (
                        <div className="pt-2 border-t border-emerald-200/60">
                          <p className="font-semibold text-emerald-900 mb-1.5">Available Stores found in your Pathao account:</p>
                          <div className="space-y-1">
                            {pathaoTestResult.stores.map((s, idx) => (
                              <div key={idx} className="flex items-center justify-between bg-white/80 p-2 rounded-lg border border-emerald-100">
                                <div>
                                  <span className="font-bold text-gray-800">{s.store_name}</span>
                                  <span className="text-[11px] text-gray-500 ml-2">(ID: {s.store_id})</span>
                                  {s.is_default_store ? <span className="ml-2 text-[10px] bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded font-bold">Default</span> : null}
                                </div>
                                <button
                                  type="button"
                                  onClick={() => setData('pathao_store_id', String(s.store_id))}
                                  className="text-[11px] font-bold text-blue-600 hover:text-blue-800 underline cursor-pointer"
                                >
                                  Use this Store
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* RedX */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-4">
                  <div className="flex items-center gap-2 pb-3 border-b border-gray-50">
                    <span className="inline-block w-3 h-3 rounded-full bg-red-500"></span>
                    <h3 className="font-bold text-gray-900">RedX Courier</h3>
                    <a href="https://redx.com.bd/" target="_blank" rel="noreferrer" className="ml-auto text-xs text-orange-500 hover:underline">Open Dashboard ↗</a>
                  </div>
                  <Field label="API Access Token" error={errors.redx_api_token}>
                    <input type="password" value={data.redx_api_token} onChange={e => setData('redx_api_token', e.target.value)} className={inputClass} placeholder="Bearer token from RedX merchant portal" />
                  </Field>
                </div>

                <button type="submit" disabled={processing} className="px-6 py-3 bg-orange-500 hover:bg-orange-600 disabled:opacity-60 text-white font-semibold rounded-xl flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/></svg>
                  Save Courier Settings
                </button>
              </form>
            )}

            {activeTab === 'fog' && (
              <form onSubmit={e => submitSection(e, 'fake_order_guard')} className="space-y-5">
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-5">
                  <div className="flex items-center justify-between pb-3 border-b border-gray-50">
                    <h3 className="font-bold text-gray-900"><svg className="w-4 h-4 text-orange-500 shrink-0 inline-block mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/></svg>Fake Order Guard</h3>
                    <a href="/admin/fake-order-guard" target="_blank" rel="noreferrer" className="text-xs text-orange-500 hover:underline">Open FOG Dashboard ↗</a>
                  </div>
                  <p className="text-xs text-gray-400 bg-amber-50 border border-amber-200 rounded-xl p-3">
                    ⚠ Fake Order Guard blocks suspicious checkouts based on IP, device fingerprint, phone number, and BD Courier delivery history.
                  </p>

                  {/* Master Switches */}
                  <div className="space-y-3">
                    <p className="text-sm font-semibold text-gray-700">Master Switches</p>
                    <label className="flex items-center gap-3"><input type="checkbox" checked={data.fog_enabled ?? (settings.fog_enabled === '1')} onChange={e => setData('fog_enabled', e.target.checked)} className={checkboxClass} /> <span className="text-sm font-medium">Enable Fake Order Guard</span></label>
                    <label className="flex items-center gap-3"><input type="checkbox" checked={data.fog_ip_block_enabled ?? (settings.fog_ip_block_enabled === '1')} onChange={e => setData('fog_ip_block_enabled', e.target.checked)} className={checkboxClass} /> <span className="text-sm">Block by IP Address</span></label>
                    <label className="flex items-center gap-3"><input type="checkbox" checked={data.fog_device_block_enabled ?? (settings.fog_device_block_enabled === '1')} onChange={e => setData('fog_device_block_enabled', e.target.checked)} className={checkboxClass} /> <span className="text-sm">Block by Device Fingerprint</span></label>
                    <label className="flex items-center gap-3"><input type="checkbox" checked={data.fog_phone_block_enabled ?? (settings.fog_phone_block_enabled === '1')} onChange={e => setData('fog_phone_block_enabled', e.target.checked)} className={checkboxClass} /> <span className="text-sm">Block by Phone Number</span></label>
                    <label className="flex items-center gap-3"><input type="checkbox" checked={data.fog_fake_number_block_enabled ?? (settings.fog_fake_number_block_enabled === '1')} onChange={e => setData('fog_fake_number_block_enabled', e.target.checked)} className={checkboxClass} /> <span className="text-sm">Block Fake/Sequential Phone Numbers</span></label>
                    <label className="flex items-center gap-3"><input type="checkbox" checked={data.fog_auto_block_ip_on_cancel ?? (settings.fog_auto_block_ip_on_cancel === '1')} onChange={e => setData('fog_auto_block_ip_on_cancel', e.target.checked)} className={checkboxClass} /> <span className="text-sm">Auto-Block IP When Order Cancelled</span></label>
                  </div>

                  {/* Cooldown settings */}
                  <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-50">
                    <Field label="IP Cooldown (minutes)" error={errors.fog_ip_cooldown_minutes}>
                      <input type="number" min="0" max="1440" value={data.fog_ip_cooldown_minutes ?? (settings.fog_ip_cooldown_minutes || '0')} onChange={e => setData('fog_ip_cooldown_minutes', e.target.value)} className={inputClass} placeholder="0 = disabled" />
                    </Field>
                    <Field label="Phone Cooldown (minutes)" error={errors.fog_phone_cooldown_minutes}>
                      <input type="number" min="0" max="1440" value={data.fog_phone_cooldown_minutes ?? (settings.fog_phone_cooldown_minutes || '0')} onChange={e => setData('fog_phone_cooldown_minutes', e.target.value)} className={inputClass} placeholder="0 = disabled" />
                    </Field>
                    <Field label="Max Orders per Phone" error={errors.fog_max_orders_per_phone}>
                      <input type="number" min="0" max="100" value={data.fog_max_orders_per_phone ?? (settings.fog_max_orders_per_phone || '0')} onChange={e => setData('fog_max_orders_per_phone', e.target.value)} className={inputClass} placeholder="0 = unlimited" />
                    </Field>
                  </div>
                </div>

                {/* BD Courier */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-5">
                  <div className="flex items-center gap-2 pb-3 border-b border-gray-50">
                    <span className="inline-block w-3 h-3 rounded-full bg-indigo-500"></span>
                    <h3 className="font-bold text-gray-900">BD Courier Fraud Check</h3>
                    <a href="https://bdcourier.com" target="_blank" rel="noreferrer" className="ml-auto text-xs text-orange-500 hover:underline">BD Courier ↗</a>
                  </div>
                  <label className="flex items-center gap-3"><input type="checkbox" checked={data.fog_bdcourier_enabled ?? (settings.fog_bdcourier_enabled === '1')} onChange={e => setData('fog_bdcourier_enabled', e.target.checked)} className={checkboxClass} /> <span className="text-sm font-medium">Enable BD Courier phone check at checkout</span></label>
                  <label className="flex items-center gap-3"><input type="checkbox" checked={data.fog_bdcourier_auto_check_checkout ?? (settings.fog_bdcourier_auto_check_checkout === '1')} onChange={e => setData('fog_bdcourier_auto_check_checkout', e.target.checked)} className={checkboxClass} /> <span className="text-sm">Auto-check phone at checkout (block if risky)</span></label>
                  <div className="grid grid-cols-2 gap-4">
                    <Field label="BD Courier API Key" error={errors.fog_bdcourier_api_key}>
                      <input type="password" value={data.fog_bdcourier_api_key ?? (settings.fog_bdcourier_api_key || '')} onChange={e => setData('fog_bdcourier_api_key', e.target.value)} className={inputClass} placeholder="Your BD Courier API key" />
                    </Field>
                    <Field label="Minimum Success Rate to Allow (%)" error={errors.fog_bdcourier_min_success_rate}>
                      <input type="number" min="0" max="100" value={data.fog_bdcourier_min_success_rate ?? (settings.fog_bdcourier_min_success_rate || '0')} onChange={e => setData('fog_bdcourier_min_success_rate', e.target.value)} className={inputClass} placeholder="0 = no minimum" />
                    </Field>
                    <Field label="Block Risk Levels (comma-separated)" error={errors.fog_bdcourier_block_risk_levels}>
                      <input value={data.fog_bdcourier_block_risk_levels ?? (settings.fog_bdcourier_block_risk_levels || 'danger,high')} onChange={e => setData('fog_bdcourier_block_risk_levels', e.target.value)} className={inputClass} placeholder="danger,high" />
                    </Field>
                  </div>
                  <p className="text-xs text-gray-400">Risk levels: <code>safe</code>, <code>low</code>, <code>medium</code>, <code>high</code>, <code>danger</code></p>
                </div>

                <div className="flex gap-3 flex-wrap">
                  <button type="submit" disabled={processing} className="px-6 py-3 bg-orange-500 hover:bg-orange-600 disabled:opacity-60 text-white font-semibold rounded-xl flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/></svg>
                    Save FOG Settings
                  </button>
                  <a href="/admin/fake-order-guard" className="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-xl text-sm flex items-center gap-2">
                    <svg className="w-4 h-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/></svg>
                    <span>Open FOG Dashboard</span>
                    <span>&rarr;</span>
                  </a>
                  <a href="/admin/blocked-ips" className="px-6 py-3 bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 font-semibold rounded-xl text-sm flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"/></svg>
                    <span>Blocked IPs</span>
                  </a>
                  <a href="/admin/blocked-phones" className="px-6 py-3 bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 font-semibold rounded-xl text-sm flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"/></svg>
                    <span>Blocked Phones</span>
                  </a>
                </div>
              </form>
            )}

            {activeTab === 'telegram' && (
              <form onSubmit={e => submitSection(e, 'telegram')} className="space-y-6">
                {/* Telegram Header Card */}
                <div className="bg-gradient-to-r from-sky-500/10 via-blue-500/5 to-transparent border border-sky-200/80 rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-start sm:items-center gap-3.5">
                    <div className="w-12 h-12 rounded-2xl bg-sky-500 text-white flex items-center justify-center shrink-0 shadow-sm shadow-sky-500/20">
                      <svg viewBox="0 0 24 24" className="w-6 h-6 fill-none stroke-current" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="22" y1="2" x2="11" y2="13" />
                        <polygon points="22 2 15 22 11 13 2 9 22 2" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
                        Telegram Order Notifications
                        {data.telegram_enabled ? (
                          <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-green-100 text-green-700 border border-green-200">
                            Active / চালু
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-gray-100 text-gray-600">
                            Disabled / বন্ধ
                          </span>
                        )}
                      </h3>
                      <p className="text-xs text-gray-500 mt-0.5">
                        ওয়েবসাইটে কেউ অর্ডার করলেই সঙ্গে সঙ্গে টেলিগ্রাম অ্যাপে কাস্টমার ও পণ্যের পূর্ণ বিবরণসহ ইনস্ট্যান্ট নোটিফিকেশন যাবে।
                      </p>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer shrink-0">
                    <input
                      type="checkbox"
                      checked={data.telegram_enabled}
                      onChange={e => setData('telegram_enabled', e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-sky-500"></div>
                    <span className="ml-2.5 text-xs font-bold text-gray-700">
                      {data.telegram_enabled ? 'Notifications ON' : 'Notifications OFF'}
                    </span>
                  </label>
                </div>

                {/* Setup Guide Card (সহজ কানেকশন গাইড) */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-sky-100 text-sky-600 flex items-center justify-center shrink-0">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                        </svg>
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-900 text-sm">টেলিগ্রাম বট কানেকশন গাইড (Quick Step-by-Step Guide)</h4>
                        <p className="text-xs text-gray-400">খুব সহজে ২ মিনিটে আপনার টেলিগ্রাম বট ও গ্রুপ কানেক্ট করুন</p>
                      </div>
                    </div>
                    <a
                      href="https://t.me/BotFather"
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 text-xs font-semibold text-sky-600 hover:text-sky-700 bg-sky-50 px-3 py-1.5 rounded-xl transition-colors"
                    >
                      <span>Open @BotFather</span>
                      <span className="text-xs">↗</span>
                    </a>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 text-xs">
                    <div className="p-3.5 rounded-xl bg-gray-50/80 border border-gray-100 flex gap-3">
                      <div className="w-6 h-6 rounded-full bg-sky-500 text-white font-bold text-xs flex items-center justify-center shrink-0">1</div>
                      <div className="space-y-1">
                        <p className="font-semibold text-gray-800">বট তৈরি করুন (@BotFather)</p>
                        <p className="text-gray-500 leading-relaxed">
                          টেলিগ্রাম অ্যাপে <a href="https://t.me/BotFather" target="_blank" rel="noreferrer" className="text-sky-600 font-bold underline">@BotFather</a> সার্চ করে <code className="bg-white px-1 py-0.5 rounded border text-gray-700">/newbot</code> লিখে পাঠান। বটের একটি নাম ও ইউজারনেম দিন (যেমন: <code>myshop_order_bot</code>)।
                        </p>
                      </div>
                    </div>

                    <div className="p-3.5 rounded-xl bg-gray-50/80 border border-gray-100 flex gap-3">
                      <div className="w-6 h-6 rounded-full bg-sky-500 text-white font-bold text-xs flex items-center justify-center shrink-0">2</div>
                      <div className="space-y-1">
                        <p className="font-semibold text-gray-800">বট টোকেন কপি ও পেস্ট করুন</p>
                        <p className="text-gray-500 leading-relaxed">
                          BotFather আপনাকে একটি <span className="font-medium text-gray-700">HTTP API Token</span> দেবে (যেমন: <code className="bg-white px-1 py-0.5 rounded border text-gray-700">7123456789:AAH...</code>)। সেটা কপি করে নিচে <strong>Bot Token</strong> বক্সে দিন।
                        </p>
                      </div>
                    </div>

                    <div className="p-3.5 rounded-xl bg-gray-50/80 border border-gray-100 flex gap-3">
                      <div className="w-6 h-6 rounded-full bg-sky-500 text-white font-bold text-xs flex items-center justify-center shrink-0">3</div>
                      <div className="space-y-1">
                        <p className="font-semibold text-gray-800">বট চালু করুন / গ্রুপে যোগ করুন</p>
                        <p className="text-gray-500 leading-relaxed">
                          <strong>ব্যক্তিগত আইডি:</strong> আপনার বট সার্চ করে <code>/start</code> দিন।<br/>
                          <strong>গ্রুপ বা টিম:</strong> আপনার টেলিগ্রাম গ্রুপে বটটিকে <strong>Admin</strong> হিসেবে অ্যাড করুন এবং গ্রুপে একটি মেসেজ (যেমন: "hi") পাঠান।
                        </p>
                      </div>
                    </div>

                    <div className="p-3.5 rounded-xl bg-gray-50/80 border border-gray-100 flex gap-3">
                      <div className="w-6 h-6 rounded-full bg-sky-500 text-white font-bold text-xs flex items-center justify-center shrink-0">4</div>
                      <div className="space-y-1">
                        <p className="font-semibold text-gray-800">অটো-ডিটেক্ট বা চ্যাট আইডি দিন</p>
                        <p className="text-gray-500 leading-relaxed">
                          নিচের <strong>"Auto-Detect Chat ID"</strong> বাটনে ক্লিক করলেই বট আপনার চ্যাট বা গ্রুপ আইডি নিজে থেকেই খুঁজে নেবে! (অথবা <a href="https://t.me/userinfobot" target="_blank" rel="noreferrer" className="text-sky-600 underline">@userinfobot</a> থেকে আপনার আইডি নিতে পারেন)।
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Configuration Form Card */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-5">
                  <h4 className="font-bold text-gray-900 pb-3 border-b border-gray-100 text-sm">
                    API Credentials &amp; Chat Target
                  </h4>

                  <div className="space-y-4">
                    {/* Bot Token */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        Telegram Bot Token <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <input
                          type={showBotToken ? 'text' : 'password'}
                          value={data.telegram_bot_token}
                          onChange={e => setData('telegram_bot_token', e.target.value)}
                          placeholder="e.g. 7123456789:AAHxyz_your_bot_token_here"
                          className={inputClass + ' pr-20 font-mono text-xs'}
                        />
                        <button
                          type="button"
                          onClick={() => setShowBotToken(!showBotToken)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-gray-500 hover:text-gray-800"
                        >
                          {showBotToken ? 'Hide' : 'Show'}
                        </button>
                      </div>
                      <p className="text-[11px] text-gray-400 mt-1">
                        Obtained from @BotFather when creating your Telegram bot.
                      </p>
                    </div>

                    {/* Chat ID + Auto Detect */}
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <label className="block text-sm font-medium text-gray-700">
                          Telegram Chat ID / Group ID <span className="text-red-500">*</span>
                        </label>
                        <button
                          type="button"
                          onClick={handleDetectChatId}
                          disabled={detectingTelegram || !data.telegram_bot_token}
                          className="inline-flex items-center gap-1.5 text-xs font-semibold text-sky-600 hover:text-sky-700 bg-sky-50 hover:bg-sky-100/80 px-2.5 py-1 rounded-lg transition-all disabled:opacity-50"
                        >
                          {detectingTelegram ? (
                            <>
                              <svg className="animate-spin h-3 w-3 text-sky-600" viewBox="0 0 24 24" fill="none">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                              </svg>
                              <span>Detecting...</span>
                            </>
                          ) : (
                            <>
                              <svg className="w-3.5 h-3.5 text-sky-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                              </svg>
                              <span>Auto-Detect Chat ID</span>
                            </>
                          )}
                        </button>
                      </div>
                      <input
                        type="text"
                        value={data.telegram_chat_id}
                        onChange={e => setData('telegram_chat_id', e.target.value)}
                        placeholder="e.g. 123456789 (User) or -1001234567890 (Group/Channel)"
                        className={inputClass + ' font-mono text-xs'}
                      />
                      <p className="text-[11px] text-gray-400 mt-1">
                        Personal Chat ID (positive integer) or Group/Supergroup ID (starts with negative like -100...).
                      </p>

                      {/* Detected chats list if available */}
                      {detectedChats && (
                        <div className="mt-3 p-3.5 rounded-xl bg-sky-50/80 border border-sky-100 space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-sky-950">
                              Detected Recent Conversations ({detectedChats.length}):
                            </span>
                            <span className="text-[11px] text-sky-700">Click to use</span>
                          </div>
                          {detectedChats.length === 0 ? (
                            <p className="text-xs text-sky-800">
                              No recent messages found. Please send any text message to your bot or write in your group, then click Auto-Detect again!
                            </p>
                          ) : (
                            <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                              {detectedChats.map(chat => (
                                <div
                                  key={chat.id}
                                  onClick={() => setData('telegram_chat_id', String(chat.id))}
                                  className="p-2 bg-white rounded-lg border border-sky-100 flex items-center justify-between text-xs cursor-pointer hover:border-sky-300 hover:shadow-xs transition-all"
                                >
                                  <div>
                                    <span className="font-semibold text-gray-800">{chat.title || 'Private Chat'}</span>
                                    {chat.username && <span className="text-gray-400 ml-1.5">(@{chat.username})</span>}
                                    <span className="ml-2 px-1.5 py-0.5 rounded text-[10px] bg-gray-100 text-gray-600 capitalize">{chat.type}</span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <code className="text-[11px] text-sky-700 bg-sky-50 px-1.5 py-0.5 rounded">{chat.id}</code>
                                    <span className="text-[11px] font-bold text-sky-600">Select &rarr;</span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Custom Header Text */}
                    <Field label="Notification Header Title (মেসেজের শিরোনাম)">
                      <input
                        type="text"
                        value={data.telegram_custom_header}
                        onChange={e => setData('telegram_custom_header', e.target.value)}
                        placeholder="New Order Received!"
                        className={inputClass}
                      />
                    </Field>
                  </div>

                  {/* Notification Preferences */}
                  <div className="pt-4 border-t border-gray-100 space-y-3">
                    <p className="text-xs font-bold uppercase tracking-wider text-gray-700">Notification Triggers &amp; Detail</p>
                    
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={data.telegram_notify_order_placed}
                        onChange={e => setData('telegram_notify_order_placed', e.target.checked)}
                        className={checkboxClass}
                      />
                      <div>
                        <span className="text-sm font-medium text-gray-800">Send notification immediately when order is placed</span>
                        <p className="text-xs text-gray-400">Fires on Standard Checkout, Quick Order popup, and Landing Pages.</p>
                      </div>
                    </label>

                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={data.telegram_notify_order_verified}
                        onChange={e => setData('telegram_notify_order_verified', e.target.checked)}
                        className={checkboxClass}
                      />
                      <div>
                        <span className="text-sm font-medium text-gray-800">Send notification when order is verified / confirmed</span>
                        <p className="text-xs text-gray-400">Fires when order passes OTP verification or is verified by staff.</p>
                      </div>
                    </label>

                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={data.telegram_include_items}
                        onChange={e => setData('telegram_include_items', e.target.checked)}
                        className={checkboxClass}
                      />
                      <div>
                        <span className="text-sm font-medium text-gray-800">Include full list of ordered items &amp; variations</span>
                        <p className="text-xs text-gray-400">Shows product title, size/color variant, unit price, and item quantity.</p>
                      </div>
                    </label>
                  </div>

                  {/* Test Notification Section */}
                  <div className="pt-4 border-t border-gray-100 space-y-3">
                    <div>
                      <h4 className="text-xs font-bold uppercase tracking-wider text-gray-700">
                        Test Telegram Connection (টেস্ট মেসেজ পাঠান)
                      </h4>
                      <p className="text-xs text-gray-400 mt-0.5">
                        Click to send an instant test notification to your bot/group to verify everything is working properly.
                      </p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-2 max-w-md">
                      <button
                        type="button"
                        onClick={handleTestTelegram}
                        disabled={testingTelegram || !data.telegram_bot_token || !data.telegram_chat_id}
                        className="px-5 py-2.5 bg-sky-600 hover:bg-sky-700 disabled:opacity-50 text-white text-xs font-bold rounded-xl whitespace-nowrap transition-all shadow-sm flex items-center justify-center gap-2"
                      >
                        {testingTelegram ? (
                          <>
                            <svg className="animate-spin h-3.5 w-3.5 text-white" viewBox="0 0 24 24" fill="none">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            <span>Sending Test...</span>
                          </>
                        ) : (
                          <>
                            <svg viewBox="0 0 24 24" className="w-4 h-4 fill-none stroke-current" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <line x1="22" y1="2" x2="11" y2="13" />
                              <polygon points="22 2 15 22 11 13 2 9 22 2" />
                            </svg>
                            <span>Send Test Notification</span>
                          </>
                        )}
                      </button>
                    </div>

                    {telegramTestResult && (
                      <div className={`p-3.5 rounded-xl text-xs border ${
                        telegramTestResult.success
                          ? 'bg-green-50 border-green-200 text-green-900'
                          : 'bg-red-50 border-red-200 text-red-900'
                      }`}>
                        <div className="flex items-start gap-2.5">
                          {telegramTestResult.success ? (
                            <svg className="w-4 h-4 text-green-600 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                          ) : (
                            <svg className="w-4 h-4 text-red-600 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          )}
                          <div className="space-y-1">
                            <p className="font-semibold">{telegramTestResult.message}</p>
                            {!telegramTestResult.success && (
                              <ul className="list-disc list-inside text-gray-600 mt-1 space-y-0.5 text-[11px]">
                                <li>Ensure your <strong>Bot Token</strong> was copied completely from @BotFather.</li>
                                <li>Ensure you clicked <strong>/start</strong> on the bot or added it as an administrator to your group.</li>
                                <li>If notifying a group, make sure the group ID starts with a minus sign (e.g. <code>-100...</code>).</li>
                              </ul>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={processing}
                  className="px-6 py-3 bg-sky-600 hover:bg-sky-700 disabled:opacity-60 text-white font-semibold rounded-xl flex items-center gap-2 shadow-sm transition-all"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/></svg>
                  Save Telegram Settings
                </button>
              </form>
            )}
          </div>

        </div>
      </AdminLayout>
    </>
  );
}