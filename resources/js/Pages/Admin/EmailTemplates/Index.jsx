import AdminLayout from '@/Layouts/AdminLayout';
import { Head, router } from '@inertiajs/react';
import { useState, useEffect, useMemo } from 'react';

const inputClass = "w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300 transition-colors";
const textareaClass = "w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300 transition-colors font-sans";

const COLOR_PRESETS = [
  { name: 'Brand Orange', hex: '#f15a24' },
  { name: 'Emerald Green', hex: '#16a34a' },
  { name: 'Dark Slate', hex: '#1e293b' },
  { name: 'Royal Blue', hex: '#2563eb' },
  { name: 'Ruby Crimson', hex: '#dc2626' },
  { name: 'Deep Purple', hex: '#7c3aed' },
  { name: 'Amber Gold', hex: '#d97706' },
  { name: 'Teal Cyan', hex: '#0d9488' },
];

const getTemplateIcon = (key, className = "w-4 h-4") => {
  switch (key) {
    case 'order_placed':
      return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
        </svg>
      );
    case 'order_verified':
      return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      );
    case 'admin_new_order':
      return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 10a3 3 0 00-3-3m0 0a3 3 0 00-3 3m3 3a3 3 0 003-3m0 6a6 6 0 01-6-6" />
        </svg>
      );
    case 'otp':
    case 'otp_code':
      return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
      );
    case 'password_reset':
      return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
        </svg>
      );
    case 'contact_message':
      return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
        </svg>
      );
    default:
      return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      );
  }
};

export default function EmailTemplatesIndex({ templates, activeKey: initialActiveKey, sampleVariables, adminEmail, adminOrderRecipients }) {
  const [selectedKey, setSelectedKey] = useState(initialActiveKey || 'order_placed');
  const currentTpl = templates[selectedKey] || Object.values(templates)[0];

  // Local form state
  const [formData, setFormData] = useState({
    is_enabled: currentTpl.is_enabled,
    admin_order_recipients: currentTpl.admin_order_recipients || adminOrderRecipients || '',
    subject: currentTpl.subject || '',
    heading: currentTpl.heading || '',
    greeting: currentTpl.greeting || '',
    body: currentTpl.body || '',
    accent_color: currentTpl.accent_color || '#f15a24',
    button_text: currentTpl.button_text || '',
    button_url: currentTpl.button_url || '',
    footer_text: currentTpl.footer_text || '',
  });

  // When selected template changes, re-populate formData
  useEffect(() => {
    if (templates[selectedKey]) {
      const t = templates[selectedKey];
      setFormData({
        is_enabled: t.is_enabled,
        admin_order_recipients: t.admin_order_recipients || adminOrderRecipients || '',
        subject: t.subject || '',
        heading: t.heading || '',
        greeting: t.greeting || '',
        body: t.body || '',
        accent_color: t.accent_color || '#f15a24',
        button_text: t.button_text || '',
        button_url: t.button_url || '',
        footer_text: t.footer_text || '',
      });
      setFeedback(null);
      setTestResult(null);
    }
  }, [selectedKey, templates]);

  const [previewMode, setPreviewMode] = useState('desktop'); // 'desktop' | 'mobile'
  const [saving, setSaving] = useState(false);
  const [resetting, setResetting] = useState(false);
  const [sendingTest, setSendingTest] = useState(false);
  const [testEmail, setTestEmail] = useState(adminEmail || '');
  const [feedback, setFeedback] = useState(null);
  const [testResult, setTestResult] = useState(null);
  const [copiedTag, setCopiedTag] = useState(null);

  const handleFieldChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleInsertTag = (targetField, tag) => {
    setFormData(prev => {
      const current = prev[targetField] || '';
      return {
        ...prev,
        [targetField]: current ? `${current} ${tag}` : tag,
      };
    });
    setCopiedTag(tag);
    setTimeout(() => setCopiedTag(null), 2000);
  };

  const copyToClipboard = (tag) => {
    navigator.clipboard.writeText(tag);
    setCopiedTag(tag);
    setTimeout(() => setCopiedTag(null), 2000);
  };

  // Save template
  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setFeedback(null);

    try {
      const res = await fetch(`/admin/email-templates/${selectedKey}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
        },
        body: JSON.stringify(formData),
      });

      const json = await res.json().catch(() => ({}));
      if (res.ok && json.success) {
        setFeedback({ type: 'success', message: 'Template saved successfully!' });
        // Refresh Inertia props so parent knows it's customized
        router.reload({ only: ['templates'] });
      } else {
        setFeedback({ type: 'error', message: json.message || 'Failed to save template.' });
      }
    } catch (err) {
      setFeedback({ type: 'error', message: err.message || 'Error occurred while saving.' });
    } finally {
      setSaving(false);
    }
  };

  // Reset to default
  const handleReset = async () => {
    if (!confirm(`Are you sure you want to reset "${currentTpl.name}" back to its factory default design?`)) {
      return;
    }
    setResetting(true);
    setFeedback(null);

    try {
      const res = await fetch(`/admin/email-templates/${selectedKey}/reset`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
        },
      });

      const json = await res.json().catch(() => ({}));
      if (res.ok && json.success) {
        setFeedback({ type: 'success', message: 'Template reset to factory default values.' });
        router.reload({ only: ['templates'] });
      } else {
        setFeedback({ type: 'error', message: json.message || 'Failed to reset template.' });
      }
    } catch (err) {
      setFeedback({ type: 'error', message: err.message || 'Error occurred while resetting.' });
    } finally {
      setResetting(false);
    }
  };

  // Send Test Email
  const handleSendTest = async () => {
    if (!testEmail) {
      alert('Please enter a recipient email address for the test preview.');
      return;
    }
    setSendingTest(true);
    setTestResult(null);

    try {
      const res = await fetch(`/admin/email-templates/${selectedKey}/test`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
        },
        body: JSON.stringify({
          test_email: testEmail,
          overrides: formData,
        }),
      });

      const json = await res.json().catch(() => ({}));
      if (res.ok && json.success) {
        setTestResult({
          success: true,
          message: json.message || `Test email sent to ${testEmail}! Check your inbox.`,
        });
      } else {
        setTestResult({
          success: false,
          message: json.message || 'Failed to send test email. Ensure SMTP settings are configured.',
        });
      }
    } catch (err) {
      setTestResult({
        success: false,
        message: 'Network error: ' + err.message,
      });
    } finally {
      setSendingTest(false);
    }
  };

  // Live preview query params
  const previewSrc = useMemo(() => {
    const params = new URLSearchParams();
    if (formData.subject) params.set('subject', formData.subject);
    if (formData.heading) params.set('heading', formData.heading);
    if (formData.greeting) params.set('greeting', formData.greeting);
    if (formData.body) params.set('body', formData.body);
    if (formData.accent_color) params.set('accent_color', formData.accent_color);
    if (formData.button_text) params.set('button_text', formData.button_text);
    if (formData.button_url) params.set('button_url', formData.button_url);
    if (formData.footer_text) params.set('footer_text', formData.footer_text);
    return `/admin/email-templates/${selectedKey}/preview?${params.toString()}`;
  }, [selectedKey, formData]);

  return (
    <>
      <Head title="Email Templates" />
      <AdminLayout title="Email Templates">
        <div className="space-y-6">

          {/* Header Banner */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center font-bold">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900">Email Templates (ইমেইল টেমপ্লেট ও ডিজাইন)</h1>
                  <p className="text-sm text-gray-500">
                    Customize the subject lines, messages, design colors, and placeholders for each email notification.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <a
                href="/admin/settings?tab=mail"
                className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-xl text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors"
              >
                <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                SMTP Settings
              </a>
            </div>
          </div>

          {/* Template Selection Tabs */}
          <div className="flex overflow-x-auto gap-2 pb-1 scrollbar-none">
            {Object.values(templates).map((tpl) => {
              const isSelected = tpl.key === selectedKey;
              return (
                <button
                  key={tpl.key}
                  type="button"
                  onClick={() => setSelectedKey(tpl.key)}
                  className={`flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-sm font-semibold whitespace-nowrap transition-all border ${
                    isSelected
                      ? 'bg-orange-500 text-white border-orange-500 shadow-sm'
                      : 'bg-white text-gray-700 hover:bg-gray-50 border-gray-200'
                  }`}
                >
                  <span
                    className={`w-2 h-2 rounded-full shrink-0 ${
                      tpl.is_enabled
                        ? (isSelected ? 'bg-white' : 'bg-green-500')
                        : (isSelected ? 'bg-orange-300' : 'bg-gray-300')
                    }`}
                    title={tpl.is_enabled ? 'Notification Active' : 'Notification Disabled'}
                  />
                  <span className={isSelected ? 'text-white' : 'text-gray-500'}>
                    {getTemplateIcon(tpl.key, "w-4 h-4")}
                  </span>
                  <span>{tpl.name}</span>
                  {tpl.is_customized ? (
                    <span className={`text-[10px] uppercase tracking-wider font-bold px-1.5 py-0.5 rounded-full ${
                      isSelected ? 'bg-orange-600 text-orange-100' : 'bg-purple-100 text-purple-700'
                    }`}>
                      Custom
                    </span>
                  ) : (
                    <span className={`text-[10px] uppercase tracking-wider font-semibold px-1.5 py-0.5 rounded-full ${
                      isSelected ? 'bg-orange-600 text-orange-100' : 'bg-gray-100 text-gray-500'
                    }`}>
                      Default
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Feedback Alert */}
          {feedback && (
            <div className={`p-4 rounded-xl text-sm border flex items-center justify-between ${
              feedback.type === 'success'
                ? 'bg-green-50 border-green-200 text-green-800'
                : 'bg-red-50 border-red-200 text-red-800'
            }`}>
              <span>{feedback.message}</span>
              <button type="button" onClick={() => setFeedback(null)} className="text-sm font-bold opacity-60 hover:opacity-100">&times;</button>
            </div>
          )}

          {/* Main 2-Column Workspace: Left = Form Editor, Right = Live Preview */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

            {/* Left Column: Form Editor (7 cols) */}
            <div className="lg:col-span-6 xl:col-span-6 space-y-6">
              <form onSubmit={handleSave} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-5">
                
                {/* Header & Toggle */}
                <div className="flex items-center justify-between pb-4 border-b border-gray-100">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center shrink-0">
                      {getTemplateIcon(selectedKey, "w-5 h-5")}
                    </div>
                    <div>
                      <h2 className="text-base font-bold text-gray-900">{currentTpl.name}</h2>
                      <p className="text-xs text-gray-500 mt-0.5">{currentTpl.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <span className={`px-2.5 py-0.5 text-xs font-semibold rounded-full border ${
                      formData.is_enabled
                        ? 'bg-green-50 border-green-200 text-green-700'
                        : 'bg-gray-100 border-gray-200 text-gray-500'
                    }`}>
                      {formData.is_enabled ? 'Active / চালু' : 'Disabled / বন্ধ'}
                    </span>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.is_enabled}
                        onChange={(e) => handleFieldChange('is_enabled', e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500"></div>
                    </label>
                  </div>
                </div>

                {/* Admin Order Alert Recipient (for admin_new_order) */}
                {selectedKey === 'admin_new_order' && (
                  <div className="p-4 bg-blue-50/70 border border-blue-200/80 rounded-2xl space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="block text-xs font-bold uppercase tracking-wider text-blue-950">
                        Admin Order Alert Recipient Email(s) (অর্ডার অ্যালার্ট যে ইমেইলে যাবে)
                      </label>
                      <span className="text-[11px] text-blue-700 font-medium">Multiple comma-separated</span>
                    </div>
                    <input
                      type="text"
                      value={formData.admin_order_recipients}
                      onChange={(e) => handleFieldChange('admin_order_recipients', e.target.value)}
                      placeholder="e.g. orders@myshop.com, admin@myshop.com"
                      className="w-full border border-blue-200 rounded-xl px-3.5 py-2 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white"
                    />
                    <p className="text-[11px] text-blue-800/80">
                      ওয়েবসাইটে নতুন অর্ডার সাবমিট হলে এই ইমেইলগুলোতে অর্ডারের ফুল বিবরণ সহ অ্যালার্ট মেইল যাবে। ফাঁকা রাখলে সাইটের ডিফল্ট ইমেইল ব্যবহৃত হবে।
                    </p>
                  </div>
                )}

                {/* Accent Color Picker */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-2">
                    Header & Accent Color (হেডার ও বাটন কালার)
                  </label>
                  <div className="flex flex-wrap items-center gap-2 mb-2.5">
                    {COLOR_PRESETS.map(preset => (
                      <button
                        key={preset.hex}
                        type="button"
                        onClick={() => handleFieldChange('accent_color', preset.hex)}
                        title={preset.name}
                        className={`w-7 h-7 rounded-lg border-2 transition-transform ${
                          formData.accent_color.toLowerCase() === preset.hex.toLowerCase()
                            ? 'scale-110 border-gray-900 ring-2 ring-orange-300'
                            : 'border-white hover:scale-105'
                        }`}
                        style={{ backgroundColor: preset.hex }}
                      />
                    ))}
                  </div>
                  <div className="flex items-center gap-2.5 max-w-xs">
                    <input
                      type="color"
                      value={formData.accent_color}
                      onChange={(e) => handleFieldChange('accent_color', e.target.value)}
                      className="w-10 h-10 rounded-xl border border-gray-200 cursor-pointer p-0.5 bg-white"
                    />
                    <input
                      type="text"
                      value={formData.accent_color}
                      onChange={(e) => handleFieldChange('accent_color', e.target.value)}
                      className={inputClass}
                      placeholder="#f15a24"
                    />
                  </div>
                </div>

                {/* Subject Line */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-gray-600">
                      Email Subject (ইমেইল সাবজেক্ট)
                    </label>
                  </div>
                  <input
                    type="text"
                    value={formData.subject}
                    onChange={(e) => handleFieldChange('subject', e.target.value)}
                    className={inputClass}
                    placeholder="e.g. Order Received — #{order_number}"
                    required
                  />
                  {/* Quick Tags for Subject */}
                  <div className="mt-2 flex flex-wrap gap-1.5 items-center">
                    <span className="text-[11px] text-gray-400 mr-1">Insert tag:</span>
                    {['{order_number}', '{customer_name}', '{site_name}', '{otp_code}', '{order_total}'].map(tag => (
                      currentTpl.allowed_tags.includes(tag) && (
                        <button
                          key={tag}
                          type="button"
                          onClick={() => handleInsertTag('subject', tag)}
                          className="px-2 py-0.5 rounded-md text-xs bg-gray-100 hover:bg-orange-50 hover:text-orange-600 text-gray-600 font-mono transition-colors"
                        >
                          + {tag}
                        </button>
                      )
                    ))}
                  </div>
                </div>

                {/* Heading / Title */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-1.5">
                    Card Heading / Title (প্রধান হেডিং)
                  </label>
                  <input
                    type="text"
                    value={formData.heading}
                    onChange={(e) => handleFieldChange('heading', e.target.value)}
                    className={inputClass}
                    placeholder="e.g. Thank you for your order!"
                    required
                  />
                </div>

                {/* Greeting */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-1.5">
                    Greeting (গ্রিটিংস / সম্ভাষণ)
                  </label>
                  <input
                    type="text"
                    value={formData.greeting}
                    onChange={(e) => handleFieldChange('greeting', e.target.value)}
                    className={inputClass}
                    placeholder="e.g. Hi {customer_name},"
                  />
                </div>

                {/* Body Message */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-gray-600">
                      Message Body (মূল মেসেজ ও বর্ণনা)
                    </label>
                  </div>
                  <textarea
                    rows={4}
                    value={formData.body}
                    onChange={(e) => handleFieldChange('body', e.target.value)}
                    className={textareaClass}
                    placeholder="Write your email body message here..."
                    required
                  />
                </div>

                {/* Action Button (Optional) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-1.5">
                      Button Text (ঐচ্ছিক বাটন টেক্সট)
                    </label>
                    <input
                      type="text"
                      value={formData.button_text}
                      onChange={(e) => handleFieldChange('button_text', e.target.value)}
                      className={inputClass}
                      placeholder="e.g. Track Your Order"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-1.5">
                      Button Link / URL (বাটন লিংক)
                    </label>
                    <input
                      type="text"
                      value={formData.button_url}
                      onChange={(e) => handleFieldChange('button_url', e.target.value)}
                      className={inputClass}
                      placeholder="e.g. {order_tracking_url}"
                    />
                  </div>
                </div>

                {/* Footer Note */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-1.5">
                    Footer Disclaimer / Support Note (ফুটার সাপোর্ট নোট)
                  </label>
                  <textarea
                    rows={2}
                    value={formData.footer_text}
                    onChange={(e) => handleFieldChange('footer_text', e.target.value)}
                    className={textareaClass}
                    placeholder="e.g. If you have any questions, call our support line at {contact_phone}."
                  />
                </div>

                {/* Shortcodes Reference Accordion / Pill Box */}
                <div className="p-4 bg-gray-50 border border-gray-100 rounded-xl space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-gray-700">Available Dynamic Tags (শর্টকোড)</span>
                    {copiedTag && <span className="text-xs text-orange-600 font-semibold">Copied {copiedTag}!</span>}
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {currentTpl.allowed_tags.map(tag => (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => copyToClipboard(tag)}
                        title="Click to copy"
                        className="px-2.5 py-1 text-xs bg-white hover:bg-orange-50 hover:text-orange-600 border border-gray-200 text-gray-700 font-mono rounded-lg transition-colors shadow-2xs"
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                  <p className="text-[11px] text-gray-400">
                    Click any tag to copy it, then paste it anywhere in your Subject, Heading, Body, or Footer.
                  </p>
                </div>

                {/* Save & Reset Buttons */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-gray-100">
                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    <button
                      type="submit"
                      disabled={saving}
                      className="w-full sm:w-auto px-6 py-2.5 bg-orange-500 hover:bg-orange-600 disabled:opacity-60 text-white text-sm font-semibold rounded-xl shadow-sm transition-all flex items-center justify-center gap-2"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                      <span>{saving ? 'Saving...' : 'Save Template (সংরক্ষণ করুন)'}</span>
                    </button>
                    {currentTpl.is_customized && (
                      <button
                        type="button"
                        onClick={handleReset}
                        disabled={resetting}
                        className="px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-600 hover:text-gray-900 text-sm font-medium rounded-xl transition-all flex items-center gap-1.5"
                      >
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                        <span>{resetting ? 'Resetting...' : 'Reset to Default'}</span>
                      </button>
                    )}
                  </div>
                </div>

              </form>

              {/* Send Test Email Card */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-gray-900">Send Preview Test Email (ইনবক্সে টেস্ট মেইল পাঠান)</h3>
                </div>
                <p className="text-xs text-gray-500">
                  Send a live test preview of this email with realistic order/customer data to verify how it appears in your inbox.
                </p>

                <div className="flex flex-col sm:flex-row gap-2">
                  <input
                    type="email"
                    value={testEmail}
                    onChange={(e) => setTestEmail(e.target.value)}
                    placeholder="Enter email to test..."
                    className={inputClass}
                  />
                  <button
                    type="button"
                    onClick={handleSendTest}
                    disabled={sendingTest}
                    className="px-5 py-2.5 bg-gray-900 hover:bg-black disabled:opacity-50 text-white text-sm font-semibold rounded-xl whitespace-nowrap transition-all shadow-sm flex items-center justify-center gap-2"
                  >
                    {sendingTest ? (
                      <>
                        <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24" fill="none">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <span>Sending...</span>
                      </>
                    ) : (
                      <>
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                        </svg>
                        <span>Send Test Mail</span>
                      </>
                    )}
                  </button>
                </div>

                {testResult && (
                  <div className={`p-3 rounded-xl text-xs border ${
                    testResult.success
                      ? 'bg-green-50 border-green-200 text-green-800'
                      : 'bg-red-50 border-red-200 text-red-800'
                  }`}>
                    {testResult.message}
                  </div>
                )}
              </div>

            </div>

            {/* Right Column: Live Interactive Preview (6 cols) */}
            <div className="lg:col-span-6 xl:col-span-6 space-y-3">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
                
                {/* Preview Toolbar */}
                <div className="flex items-center justify-between pb-3 mb-3 border-b border-gray-100">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse"></span>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-gray-700">Live Preview</h3>
                  </div>

                  {/* Desktop / Mobile Switcher */}
                  <div className="flex items-center bg-gray-100 p-1 rounded-xl">
                    <button
                      type="button"
                      onClick={() => setPreviewMode('desktop')}
                      className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all ${
                        previewMode === 'desktop' ? 'bg-white text-gray-900 shadow-2xs' : 'text-gray-500 hover:text-gray-800'
                      }`}
                    >
                      <svg className="w-3.5 h-3.5 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      Desktop
                    </button>
                    <button
                      type="button"
                      onClick={() => setPreviewMode('mobile')}
                      className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all ${
                        previewMode === 'mobile' ? 'bg-white text-gray-900 shadow-2xs' : 'text-gray-500 hover:text-gray-800'
                      }`}
                    >
                      <svg className="w-3.5 h-3.5 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                      </svg>
                      Mobile
                    </button>
                  </div>
                </div>

                {/* Simulated Subject Bar */}
                <div className="bg-gray-50 border border-gray-100 rounded-xl px-3 py-2 mb-3 text-xs text-gray-600 flex items-center gap-2">
                  <span className="font-semibold text-gray-400">Subject:</span>
                  <span className="font-medium text-gray-800 truncate">
                    {formData.subject
                      .replace('{order_number}', sampleVariables['{order_number}'] || 'ORD-10024')
                      .replace('{customer_name}', sampleVariables['{customer_name}'] || 'Rafiqul Islam')
                      .replace('{site_name}', sampleVariables['{site_name}'] || 'Shopzy')
                      .replace('{otp_code}', '489215')
                      .replace('{order_total}', '৳1,850')
                    }
                  </span>
                </div>

                {/* Preview Frame Container */}
                <div className="flex justify-center bg-gray-100/70 p-3 sm:p-5 rounded-xl border border-gray-200/60 overflow-hidden min-h-[640px]">
                  <div
                    className={`transition-all duration-300 w-full ${
                      previewMode === 'mobile'
                        ? 'max-w-[375px] bg-white rounded-3xl shadow-xl border-4 border-gray-800 overflow-hidden'
                        : 'max-w-full bg-white rounded-xl shadow-sm overflow-hidden'
                    }`}
                  >
                    <iframe
                      key={`${selectedKey}-${formData.accent_color}-${formData.heading}`}
                      src={previewSrc}
                      title="Email Preview"
                      className="w-full h-[620px] border-0 bg-white"
                    />
                  </div>
                </div>

              </div>
            </div>

          </div>

        </div>
      </AdminLayout>
    </>
  );
}
