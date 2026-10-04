import AdminLayout from '@/Layouts/AdminLayout';
import { Head, router, useForm } from '@inertiajs/react';
import { useState, useRef } from 'react';
import { imageUrl, fileToBase64 } from '@/lib/utils';

export default function ReviewScreenshotsIndex({ screenshots = [], platforms = {}, settings = {}, counts = {} }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [zoomImage, setZoomImage] = useState(null);
  const [textSettingsOpen, setTextSettingsOpen] = useState(false);
  const fileInputRef = useRef(null);

  // Form for Add/Edit Screenshot
  const { data, setData, post, processing, errors, reset, clearErrors } = useForm({
    title: '',
    customer_name: '',
    review_text: '',
    platform: 'facebook',
    rating: 5,
    badge: 'Verified Buyer',
    position: 0,
    is_active: true,
    image_file: null,
    image_file_b64: '',
    image_file_name: '',
    image_url: '',
  });

  const [previewUrl, setPreviewUrl] = useState('');

  // Form for Homepage Section Title & Subtitle
  const {
    data: settingsData,
    setData: setSettingsData,
    post: postSettings,
    processing: settingsProcessing,
  } = useForm({
    enabled: settings.enabled ?? true,
    title: settings.title || 'Customer Reviews & Feedback',
    subtitle: settings.subtitle || 'আমাদের সম্মানিত কাস্টমারদের বাস্তব অভিজ্ঞতা ও রিভিউ',
    autoplay: settings.autoplay ?? true,
    speed: settings.speed || 'normal',
  });

  const openAddModal = () => {
    setEditingItem(null);
    clearErrors();
    reset();
    setData({
      title: '',
      customer_name: '',
      review_text: '',
      platform: 'facebook',
      rating: 5,
      badge: 'Verified Buyer',
      position: (screenshots.length > 0 ? Math.max(...screenshots.map(s => s.position || 0)) + 1 : 1),
      is_active: true,
      image_file: null,
      image_file_b64: '',
      image_file_name: '',
      image_url: '',
    });
    setPreviewUrl('');
    setModalOpen(true);
  };

  const openEditModal = (item) => {
    setEditingItem(item);
    clearErrors();
    setData({
      title: item.title || '',
      customer_name: item.customer_name || '',
      review_text: item.review_text || '',
      platform: item.platform || 'facebook',
      rating: item.rating ?? 5,
      badge: item.badge || '',
      position: item.position ?? 0,
      is_active: Boolean(item.is_active),
      image_file: null,
      image_file_b64: '',
      image_file_name: '',
      image_url: item.image || '',
    });
    setPreviewUrl(imageUrl(item.image));
    setModalOpen(true);
  };

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setData(prev => ({
      ...prev,
      image_file: file,
      image_file_name: file.name,
    }));

    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);

    try {
      const b64 = await fileToBase64(file);
      setData(prev => ({
        ...prev,
        image_file: file,
        image_file_b64: b64,
        image_file_name: file.name,
      }));
    } catch {
      // fallback
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (editingItem) {
      router.post(`/admin/review-screenshots/${editingItem.id}`, {
        _method: 'put',
        ...data,
      }, {
        onSuccess: () => {
          setModalOpen(false);
          reset();
        },
      });
    } else {
      post('/admin/review-screenshots', {
        onSuccess: () => {
          setModalOpen(false);
          reset();
        },
      });
    }
  };

  const handleToggle = (item) => {
    router.patch(`/admin/review-screenshots/${item.id}/toggle`, {}, {
      preserveScroll: true,
    });
  };

  const handleDelete = (item) => {
    window.showConfirm(`Delete review screenshot "${item.customer_name || item.title || 'Screenshot'}"?`, () => {
      router.delete(`/admin/review-screenshots/${item.id}`, {
        preserveScroll: true,
      });
    });
  };

  // One-click instant settings toggles
  const quickToggleAutoplay = () => {
    router.post('/admin/review-screenshots/settings', {
      autoplay: !settings.autoplay,
    }, {
      preserveScroll: true,
    });
  };

  const quickToggleEnabled = () => {
    router.post('/admin/review-screenshots/settings', {
      enabled: !settings.enabled,
    }, {
      preserveScroll: true,
    });
  };

  const quickChangeSpeed = (newSpeed) => {
    router.post('/admin/review-screenshots/settings', {
      speed: newSpeed,
    }, {
      preserveScroll: true,
    });
  };

  const handleSaveTextSettings = (e) => {
    e.preventDefault();
    postSettings('/admin/review-screenshots/settings', {
      preserveScroll: true,
      onSuccess: () => {
        setTextSettingsOpen(false);
      },
    });
  };

  const getPlatformBadge = (platform) => {
    switch (platform) {
      case 'facebook':
        return {
          label: 'Facebook / Messenger',
          bg: 'bg-blue-50 text-blue-700 border-blue-200',
          iconColor: 'text-[#0084ff]',
          icon: (
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.477 2 2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.879V14.89h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.989C18.343 21.129 22 16.99 22 12c0-5.523-4.477-10-10-10z"/>
            </svg>
          ),
        };
      case 'whatsapp':
        return {
          label: 'WhatsApp',
          bg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
          iconColor: 'text-[#25D366]',
          icon: (
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0012.04 2z"/>
            </svg>
          ),
        };
      case 'instagram':
        return {
          label: 'Instagram',
          bg: 'bg-fuchsia-50 text-fuchsia-700 border-fuchsia-200',
          iconColor: 'text-[#E1306C]',
          icon: (
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
            </svg>
          ),
        };
      default:
        return {
          label: 'Customer Review',
          bg: 'bg-purple-50 text-purple-700 border-purple-200',
          iconColor: 'text-purple-600',
          icon: (
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/>
            </svg>
          ),
        };
    }
  };

  return (
    <>
      <Head title="Customer Review Screenshots" />
      <AdminLayout title="Customer Review Screenshots">
        <div className="space-y-5 max-w-7xl mx-auto pb-10">
          
          {/* Top Header Row */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-5 sm:p-6 rounded-2xl border border-gray-100 shadow-2xs">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-8 h-8 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center text-base">
                  💬
                </span>
                <h1 className="text-xl font-black text-gray-900 tracking-tight">
                  কাস্টমার রিভিউ স্ক্রিনশট (Review Screenshots)
                </h1>
              </div>
              <p className="text-xs sm:text-sm text-gray-500 mt-1">
                ফেসবুক মেসেঞ্জার, হোয়াটসঅ্যাপ ও ইনস্টাগ্রাম চ্যাটের বাস্তব রিভিউ স্ক্রিনশট হোমপেজের ফুটারে প্রদর্শনের জন্য আপলোড ও নিয়ন্ত্রণ করুন।
              </p>
            </div>

            <div className="flex items-center gap-3 shrink-0 flex-wrap">
              <button
                type="button"
                onClick={openAddModal}
                className="px-4 py-2.5 bg-orange-500 hover:bg-orange-600 active:scale-95 text-white text-xs font-bold rounded-xl transition-all shadow-sm flex items-center gap-2 cursor-pointer"
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M12 5v14M5 12h14" />
                </svg>
                নতুন রিভিউ স্ক্রিনশট আপলোড করুন
              </button>
            </div>
          </div>

          {/* 1. MASTER ON/OFF SWITCH: HOMEPAGE VISIBILITY */}
          <div className={`rounded-2xl border p-4 sm:p-5 transition-all shadow-sm ${
            settings.enabled 
              ? 'bg-gradient-to-r from-emerald-50 via-white to-emerald-50/40 border-emerald-300' 
              : 'bg-gradient-to-r from-rose-50 via-white to-rose-50/40 border-rose-300'
          }`}>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-start sm:items-center gap-3.5">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-xs ${
                  settings.enabled ? 'bg-emerald-500 text-white' : 'bg-rose-500 text-white'
                }`}>
                  {settings.enabled ? (
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  ) : (
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  )}
                </div>

                <div>
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <h3 className="text-base font-black text-gray-900">
                      হোমপেজে রিভিউ স্ক্রিনশট প্রদর্শন (Homepage Visibility)
                    </h3>
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-black tracking-wide ${
                      settings.enabled 
                        ? 'bg-emerald-600 text-white shadow-xs' 
                        : 'bg-rose-600 text-white shadow-xs'
                    }`}>
                      {settings.enabled ? '🟢 চালু (ON) — লাইভ দৃশ্যমান' : '🔴 বন্ধ (OFF) — হোমপেজ থেকে লুকানো'}
                    </span>
                  </div>
                  <p className="text-xs text-gray-600 mt-1">
                    {settings.enabled 
                      ? 'হোমপেজে কাস্টমারদের বাস্তব রিভিউ স্ক্রিনশটগুলো এখন দেখানো হচ্ছে।' 
                      : 'হোমপেজ থেকে এই পুরো সেকশনটি বন্ধ ও লুকানো রয়েছে। কোনো কাস্টমার দেখতে পাবে না।'}
                  </p>
                </div>
              </div>

              {/* Big Action Button & Switch */}
              <div className="flex items-center gap-3 shrink-0">
                <button
                  type="button"
                  onClick={quickToggleEnabled}
                  className={`px-5 py-2.5 rounded-xl text-xs font-black transition-all shadow-sm flex items-center gap-2 cursor-pointer ${
                    settings.enabled
                      ? 'bg-rose-600 hover:bg-rose-700 text-white'
                      : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                  }`}
                >
                  {settings.enabled ? (
                    <>
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"/></svg>
                      বন্ধ করুন (Turn OFF)
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/></svg>
                      চালু করুন (Turn ON)
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={quickToggleEnabled}
                  className={`relative inline-flex h-7 w-12 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                    settings.enabled ? 'bg-emerald-500' : 'bg-gray-300'
                  }`}
                  aria-label="Toggle section on homepage"
                >
                  <span
                    className={`pointer-events-none inline-block h-6 w-6 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                      settings.enabled ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>

          {/* 2. Secondary Controls Banner (Auto-Scroll, Speed & Title Settings) */}
          <div className="bg-white rounded-2xl border border-gray-200 p-4 sm:p-5 shadow-2xs">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              
              {/* Auto Scroll Toggle */}
              <div className="flex items-center gap-3.5 bg-gray-50/80 p-3 rounded-xl border border-gray-200/70 shadow-2xs">
                <button
                  type="button"
                  onClick={quickToggleAutoplay}
                  className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                    settings.autoplay ? 'bg-orange-500' : 'bg-gray-300'
                  }`}
                  aria-label="Toggle auto scroll"
                >
                  <span
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                      settings.autoplay ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-black text-gray-900">অটো-স্ক্রোল (Auto Scroll)</span>
                    <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                      settings.autoplay ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-100 text-gray-600'
                    }`}>
                      {settings.autoplay ? '● চালু (ON)' : '○ বন্ধ (OFF)'}
                    </span>
                  </div>
                  <p className="text-[11px] text-gray-500 mt-0.5">
                    {settings.autoplay ? 'স্ক্রিনশটগুলো হোমপেজে স্বয়ংক্রিয়ভাবে স্লাইড হচ্ছে।' : 'অটো-স্ক্রোল বন্ধ আছে। কাস্টমার নিজে সোয়াইপ করবে।'}
                  </p>
                </div>
              </div>

              {/* Speed Control */}
              <div className="flex items-center gap-2 bg-gray-50/80 p-2.5 rounded-xl border border-gray-200/70 shadow-2xs">
                <span className="text-xs font-bold text-gray-700 ml-1">গতি (Speed):</span>
                <div className="flex items-center gap-1">
                  {[
                    { id: 'slow', label: '🐢 ধীর', tip: '4.5s' },
                    { id: 'normal', label: '⚡ স্বাভাবিক', tip: '3.2s' },
                    { id: 'fast', label: '🚀 দ্রুত', tip: '2.2s' },
                  ].map((s) => (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => quickChangeSpeed(s.id)}
                      className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                        (settings.speed || 'normal') === s.id
                          ? 'bg-orange-500 text-white shadow-xs'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Edit Texts Button */}
              <button
                type="button"
                onClick={() => setTextSettingsOpen(prev => !prev)}
                className="px-3.5 py-2.5 bg-white hover:bg-gray-50 border border-gray-200 text-gray-700 text-xs font-bold rounded-xl transition-all shadow-2xs flex items-center justify-center gap-1.5 cursor-pointer shrink-0"
              >
                <svg className="w-3.5 h-3.5 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"/>
                </svg>
                {textSettingsOpen ? 'টাইটেল বন্ধ করুন' : 'টাইটেল ও সাবটাইটেল পরিবর্তন'}
              </button>

            </div>

            {/* Expandable Title / Subtitle Form */}
            {textSettingsOpen && (
              <form onSubmit={handleSaveTextSettings} className="mt-4 pt-4 border-t border-gray-200/70 space-y-3">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">
                      সেকশন টাইটেল (Title)
                    </label>
                    <input
                      type="text"
                      value={settingsData.title}
                      onChange={e => setSettingsData('title', e.target.value)}
                      placeholder="e.g. Customer Reviews & Feedback"
                      className="w-full text-xs rounded-xl border border-gray-200 px-3.5 py-2 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">
                      সেকশন সাবটাইটেল (Subtitle)
                    </label>
                    <input
                      type="text"
                      value={settingsData.subtitle}
                      onChange={e => setSettingsData('subtitle', e.target.value)}
                      placeholder="e.g. আমাদের সম্মানিত কাস্টমারদের বাস্তব অভিজ্ঞতা ও রিভিউ"
                      className="w-full text-xs rounded-xl border border-gray-200 px-3.5 py-2 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none bg-white"
                    />
                  </div>
                </div>

                <div className="flex justify-end pt-1">
                  <button
                    type="submit"
                    disabled={settingsProcessing}
                    className="px-5 py-2 bg-gray-900 hover:bg-black text-white text-xs font-bold rounded-xl transition-colors cursor-pointer disabled:opacity-50"
                  >
                    {settingsProcessing ? 'সেভ হচ্ছে...' : 'টাইটেল সেভ করুন'}
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* Quick Metrics Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-white p-3.5 sm:p-4 rounded-xl border border-gray-100 shadow-2xs">
              <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">মোট স্ক্রিনশট</span>
              <p className="text-xl font-black text-gray-900 mt-1">{counts.total || 0}</p>
            </div>
            <div className="bg-white p-3.5 sm:p-4 rounded-xl border border-gray-100 shadow-2xs">
              <span className="text-[11px] font-bold text-emerald-600 uppercase tracking-wider">সক্রিয় (Active)</span>
              <p className="text-xl font-black text-emerald-600 mt-1">{counts.active || 0}</p>
            </div>
            <div className="bg-white p-3.5 sm:p-4 rounded-xl border border-gray-100 shadow-2xs">
              <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">লুকানো (Hidden)</span>
              <p className="text-xl font-black text-gray-500 mt-1">{counts.inactive || 0}</p>
            </div>
            <div className="bg-white p-3.5 sm:p-4 rounded-xl border border-gray-100 shadow-2xs">
              <span className="text-[11px] font-bold text-gray-700 uppercase tracking-wider">হোমপেজ প্রদর্শন স্ট্যাটাস</span>
              <p className="text-sm font-bold mt-1.5 flex items-center gap-1.5">
                <span className={`w-2 h-2 rounded-full ${settings.enabled ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'}`} />
                <span className={settings.enabled ? 'text-emerald-700 font-black' : 'text-rose-600 font-black'}>
                  {settings.enabled ? 'সচল / লাইভ (ON)' : 'বন্ধ / লুকানো (OFF)'}
                </span>
              </p>
            </div>
          </div>

          {/* Reviews Grid */}
          {screenshots.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {screenshots.map((item) => {
                const badge = getPlatformBadge(item.platform);
                return (
                  <div
                    key={item.id}
                    className={`bg-white rounded-2xl border transition-all duration-200 overflow-hidden shadow-2xs flex flex-col ${
                      item.is_active ? 'border-gray-200 hover:border-orange-300 hover:shadow-md' : 'border-gray-200/60 opacity-65 bg-gray-50/50'
                    }`}
                  >
                    {/* Top Screenshot Image Box */}
                    <div className="relative group bg-gray-100 aspect-[9/14] sm:aspect-[9/13] w-full overflow-hidden flex items-center justify-center cursor-pointer"
                      onClick={() => setZoomImage(imageUrl(item.image))}
                    >
                      <img
                        src={imageUrl(item.image)}
                        alt={item.customer_name || 'Review Screenshot'}
                        className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                      />
                      
                      {/* Hover Overlay with Zoom Icon */}
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                        <span className="px-3 py-1.5 bg-white/90 backdrop-blur-xs text-gray-900 rounded-full text-xs font-bold flex items-center gap-1.5 shadow-lg">
                          <svg className="w-3.5 h-3.5 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v6m3-3H7"/>
                          </svg>
                          ক্লিক করে বড় দেখুন
                        </span>
                      </div>

                      {/* Top Badges */}
                      <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold border backdrop-blur-md shadow-xs ${badge.bg}`}>
                          {badge.icon}
                          {badge.label}
                        </span>

                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-black/70 text-white backdrop-blur-xs">
                          #{item.position || 0}
                        </span>
                      </div>
                    </div>

                    {/* Details Box */}
                    <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                      <div>
                        {/* Rating stars & verified badge */}
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center text-amber-400 text-xs">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <svg
                                key={i}
                                className={`w-3.5 h-3.5 fill-current ${i < (item.rating || 5) ? 'text-amber-400' : 'text-gray-200'}`}
                                viewBox="0 0 20 20"
                              >
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                              </svg>
                            ))}
                          </div>

                          {item.badge && (
                            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 truncate">
                              ✓ {item.badge}
                            </span>
                          )}
                        </div>

                        {/* Customer Name */}
                        <h3 className="text-sm font-bold text-gray-900 mt-2 truncate">
                          {item.customer_name || item.title || 'Anonymous Customer'}
                        </h3>

                        {/* Caption / Quote */}
                        {item.review_text && (
                          <p className="text-xs text-gray-500 mt-1 line-clamp-2 leading-relaxed italic bg-gray-50 p-2 rounded-lg border border-gray-100">
                            “{item.review_text}”
                          </p>
                        )}
                      </div>

                      {/* Footer Actions */}
                      <div className="pt-3 border-t border-gray-100 flex items-center justify-between gap-2">
                        {/* Visibility Toggle Switch */}
                        <button
                          type="button"
                          onClick={() => handleToggle(item)}
                          className={`text-xs font-bold px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                            item.is_active
                              ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                          }`}
                        >
                          {item.is_active ? '● দৃশ্যমান' : '○ লুকানো'}
                        </button>

                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => openEditModal(item)}
                            className="p-1.5 text-gray-600 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors cursor-pointer"
                            title="Edit"
                          >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                            </svg>
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDelete(item)}
                            className="p-1.5 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                            title="Delete"
                          >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center max-w-lg mx-auto shadow-2xs">
              <div className="w-16 h-16 rounded-full bg-orange-50 text-orange-500 flex items-center justify-center mx-auto text-3xl mb-4">
                📸
              </div>
              <h3 className="text-base font-bold text-gray-900">কোনো রিভিউ স্ক্রিনশট পাওয়া যায়নি</h3>
              <p className="text-xs text-gray-500 mt-1 mb-6">
                ফেসবুক মেসেঞ্জার বা হোয়াটসঅ্যাপে কাস্টমাররা যেসব রিভিউ বা সুন্দর ছবি পাঠিয়েছে সেগুলোর স্ক্রিনশট আপলোড করুন।
              </p>
              <button
                type="button"
                onClick={openAddModal}
                className="px-5 py-2.5 bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold rounded-xl transition-all shadow-sm cursor-pointer"
              >
                প্রথম স্ক্রিনশট আপলোড করুন
              </button>
            </div>
          )}

          {/* Add / Edit Screenshot Modal */}
          {modalOpen && (
            <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
              <div className="bg-white rounded-3xl max-w-xl w-full overflow-hidden shadow-2xl border border-gray-100 animate-in fade-in zoom-in-95 duration-150">
                <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                  <div className="flex items-center gap-2">
                    <span className="w-7 h-7 rounded-lg bg-orange-100 text-orange-600 flex items-center justify-center text-sm font-bold">
                      📸
                    </span>
                    <h3 className="text-sm font-bold text-gray-900">
                      {editingItem ? 'রিভিউ স্ক্রিনশট সম্পাদনা করুন' : 'নতুন রিভিউ স্ক্রিনশট যুক্ত করুন'}
                    </h3>
                  </div>
                  <button
                    type="button"
                    onClick={() => setModalOpen(false)}
                    className="p-1.5 text-gray-400 hover:text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/>
                    </svg>
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
                  {/* Image Upload Area */}
                  <div>
                    <label className="block text-xs font-bold text-gray-800 mb-1.5">
                      স্ক্রিনশট ছবি <span className="text-rose-500">*</span>
                    </label>

                    <div
                      onClick={() => fileInputRef.current?.click()}
                      className="border-2 border-dashed border-gray-300 hover:border-orange-500 rounded-2xl p-4 text-center cursor-pointer transition-colors bg-gray-50/50 hover:bg-orange-50/20 group"
                    >
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/png,image/jpeg,image/webp,image/jpg"
                        onChange={handleFileChange}
                        className="hidden"
                      />

                      {previewUrl ? (
                        <div className="flex flex-col items-center">
                          <img
                            src={previewUrl}
                            alt="Preview"
                            className="max-h-56 object-contain rounded-xl shadow-md border border-gray-200 mb-2"
                          />
                          <span className="text-xs text-orange-600 font-bold group-hover:underline">
                            ছবি পরিবর্তন করতে ক্লিক করুন
                          </span>
                        </div>
                      ) : (
                        <div className="py-6">
                          <svg className="w-10 h-10 text-gray-400 mx-auto mb-2 group-hover:text-orange-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                          </svg>
                          <p className="text-xs font-bold text-gray-700">ক্লিক করে স্ক্রিনশট ফাইল নির্বাচন করুন</p>
                          <p className="text-[11px] text-gray-400 mt-1">PNG, JPG, WebP (Max 10MB)</p>
                        </div>
                      )}
                    </div>
                    {errors.image_file && (
                      <p className="text-[11px] text-rose-500 mt-1 font-medium">{errors.image_file}</p>
                    )}
                  </div>

                  {/* Customer Name & Platform */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">
                        কাস্টমার নাম (Customer Name)
                      </label>
                      <input
                        type="text"
                        value={data.customer_name}
                        onChange={e => setData('customer_name', e.target.value)}
                        placeholder="e.g. Juthy Khan"
                        className="w-full text-xs rounded-xl border border-gray-200 px-3.5 py-2.5 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">
                        প্ল্যাটফর্ম (Platform)
                      </label>
                      <select
                        value={data.platform}
                        onChange={e => setData('platform', e.target.value)}
                        className="w-full text-xs rounded-xl border border-gray-200 px-3.5 py-2.5 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none bg-white"
                      >
                        <option value="facebook">Facebook / Messenger</option>
                        <option value="whatsapp">WhatsApp</option>
                        <option value="instagram">Instagram</option>
                        <option value="other">Other / Direct Review</option>
                      </select>
                    </div>
                  </div>

                  {/* Review Text / Quote snippet */}
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">
                      কাস্টমারের মন্তব্য / ক্যাপশন (Review Quote / Caption)
                    </label>
                    <textarea
                      rows="2"
                      value={data.review_text}
                      onChange={e => setData('review_text', e.target.value)}
                      placeholder="e.g. apnder butterfly poncho. aj 1st time porlam. onk sundr🥰"
                      className="w-full text-xs rounded-xl border border-gray-200 p-3 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none"
                    />
                    <p className="text-[10px] text-gray-400 mt-0.5">ঐচ্ছিক — স্ক্রিনশটের মূল কথা বা প্রশংসনীয় অংশটি এখানে উল্লেখ করতে পারেন।</p>
                  </div>

                  {/* Rating & Badge */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">
                        রেটিং (Rating)
                      </label>
                      <div className="flex items-center gap-1.5 pt-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            onClick={() => setData('rating', star)}
                            className="p-1 focus:outline-none cursor-pointer"
                          >
                            <svg
                              className={`w-6 h-6 transition-colors ${
                                star <= data.rating ? 'text-amber-400 fill-amber-400' : 'text-gray-300'
                              }`}
                              viewBox="0 0 20 20"
                            >
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                            </svg>
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">
                        ব্যাজ (Badge Tag)
                      </label>
                      <input
                        type="text"
                        value={data.badge}
                        onChange={e => setData('badge', e.target.value)}
                        placeholder="e.g. Verified Buyer, হ্যাপি কাস্টমার"
                        className="w-full text-xs rounded-xl border border-gray-200 px-3.5 py-2.5 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none"
                      />
                    </div>
                  </div>

                  {/* Position & Visibility */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-1">
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">
                        সিরিয়াল / পজিশন (Position Order)
                      </label>
                      <input
                        type="number"
                        min="0"
                        value={data.position}
                        onChange={e => setData('position', e.target.value)}
                        className="w-full text-xs rounded-xl border border-gray-200 px-3.5 py-2.5 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none"
                      />
                    </div>

                    <div className="flex items-center gap-3 pt-6">
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={data.is_active}
                          onChange={e => setData('is_active', e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-10 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-orange-500" />
                      </label>
                      <span className="text-xs font-bold text-gray-700">হোমপেজে দৃশ্যমান রাখুন</span>
                    </div>
                  </div>

                  {/* Submit Buttons */}
                  <div className="pt-4 border-t border-gray-100 flex items-center justify-end gap-3">
                    <button
                      type="button"
                      onClick={() => setModalOpen(false)}
                      className="px-4 py-2.5 border border-gray-200 text-gray-600 hover:bg-gray-50 text-xs font-bold rounded-xl transition-colors cursor-pointer"
                    >
                      বাতিল
                    </button>
                    <button
                      type="submit"
                      disabled={processing}
                      className="px-6 py-2.5 bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold rounded-xl shadow-xs transition-colors cursor-pointer disabled:opacity-50"
                    >
                      {processing ? 'সংরক্ষণ হচ্ছে...' : editingItem ? 'আপডেট করুন' : 'আপলোড করুন'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Full Resolution Zoom Lightbox */}
          {zoomImage && (
            <div
              className="fixed inset-0 z-[100] bg-black/85 backdrop-blur-md flex items-center justify-center p-4"
              onClick={() => setZoomImage(null)}
            >
              <div className="relative max-w-2xl max-h-[90vh] flex flex-col items-center">
                <button
                  type="button"
                  onClick={() => setZoomImage(null)}
                  className="absolute -top-12 right-0 text-white hover:text-orange-400 p-2 text-sm font-bold flex items-center gap-1 cursor-pointer"
                >
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/>
                  </svg>
                  বন্ধ করুন
                </button>
                <img
                  src={zoomImage}
                  alt="Review Screenshot Preview"
                  className="max-w-full max-h-[85vh] object-contain rounded-2xl shadow-2xl border border-white/20"
                  onClick={e => e.stopPropagation()}
                />
              </div>
            </div>
          )}

        </div>
      </AdminLayout>
    </>
  );
}
