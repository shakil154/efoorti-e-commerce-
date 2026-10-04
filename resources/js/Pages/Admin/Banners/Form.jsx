import AdminLayout from '@/Layouts/AdminLayout';
import { Head, useForm, router } from '@inertiajs/react';
import { useState, useMemo } from 'react';
import { fileToBase64 } from '@/lib/utils';

const inputClass = "w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm font-medium text-gray-800 focus:outline-none focus:ring-2 focus:ring-orange-300 focus:border-orange-400 bg-white transition-all";

function Field({ label, error, children, required, hint }) {
  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">
          {label}{required && <span className="text-red-500 ml-0.5">*</span>}
        </label>
        {hint && <span className="text-[11px] text-gray-400 font-medium">{hint}</span>}
      </div>
      {children}
      {error && <p className="text-red-500 text-xs mt-1 font-semibold">{error}</p>}
    </div>
  );
}

export default function BannerForm({ banner, placements, styles, sizeGuides }) {
  const isEdit = !!banner.id;
  const [submitting, setSubmitting] = useState(false);
  const [localPreview, setLocalPreview] = useState(null);
  const [removeExistingImage, setRemoveExistingImage] = useState(false);

  const { data, setData, processing, errors } = useForm({
    title: banner.title || '',
    subtitle: banner.subtitle || '',
    badge: banner.badge || '',
    link_url: banner.link_url || '',
    button_text: banner.button_text || '',
    placement: banner.placement || 'hero',
    style: banner.style || 'brand',
    position: banner.position || 0,
    is_active: banner.is_active ?? true,
    image_file: null,
    image_url: banner.image?.startsWith('http') ? banner.image : '',
  });

  const activeGuide = useMemo(() => {
    return sizeGuides?.[data.placement] || {
      name: 'Banner',
      recommended: '1200 × 500 px',
      aspect: '2.4 : 1',
      mobile: '800 × 450 px',
      description: 'হোমপেজে ব্যানার হিসেবে প্রদর্শিত হবে।',
      tip: 'উন্নত মানের ছবি আপলোড করুন যাতে কম্পিউটার ও মোবাইল উভয় স্ক্রিনেই নিখুঁত দেখায়।',
      badge: '1200x500',
    };
  }, [sizeGuides, data.placement]);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setData('image_file', file);
      setLocalPreview(URL.createObjectURL(file));
      setRemoveExistingImage(false);
    }
  };

  const clearSelectedFile = () => {
    setData('image_file', null);
    if (localPreview) {
      URL.revokeObjectURL(localPreview);
      setLocalPreview(null);
    }
  };

  const submit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const formData = new FormData();
      Object.entries(data).forEach(([k, v]) => {
        if (k === 'image_file') return;
        if (typeof v === 'boolean') formData.append(k, v ? '1' : '0');
        else formData.append(k, v ?? '');
      });

      if (removeExistingImage) {
        formData.append('remove_image', '1');
      }

      if (data.image_file) {
        const b64 = await fileToBase64(data.image_file);
        formData.append('image_file_b64', b64);
        formData.append('image_file_name', data.image_file.name || 'banner.jpg');
      }

      const options = {
        forceFormData: true,
        onFinish: () => setSubmitting(false),
        onError: () => setSubmitting(false),
      };

      if (isEdit) {
        formData.append('_method', 'PUT');
        router.post(`/admin/banners/${banner.id}`, formData, options);
      } else {
        router.post('/admin/banners', formData, options);
      }
    } catch (err) {
      setSubmitting(false);
      console.error(err);
    }
  };

  const existingImageUrl = banner.image
    ? (banner.image.startsWith('http') ? banner.image : `/${banner.image}`)
    : null;

  return (
    <>
      <Head title={isEdit ? 'Edit Banner' : 'Add Banner'} />
      <AdminLayout title={isEdit ? 'Edit Banner' : 'Add Banner'}>
        <div className="max-w-4xl space-y-6">
          {/* Header & Back Link */}
          <div className="flex items-center justify-between">
            <a href="/admin/banners" className="inline-flex items-center gap-2 text-xs font-bold text-gray-500 hover:text-orange-600 transition-colors uppercase tracking-wider">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 12H5M12 5l-7 7 7 7"/></svg>
              Back to Banners
            </a>
            <span className="text-xs font-semibold px-3 py-1 bg-orange-50 text-orange-700 rounded-full border border-orange-200">
              {isEdit ? `Editing: ${banner.title || '#' + banner.id}` : 'Create New Banner'}
            </span>
          </div>

          {/* Banner Size Guidelines Callout Card */}
          <div className="bg-gradient-to-br from-orange-50/80 via-amber-50/40 to-white rounded-2xl border border-orange-200/90 p-4 sm:p-5 shadow-xs">
            <div className="flex items-start gap-3.5">
              <div className="w-9 h-9 rounded-xl bg-orange-500 text-white flex items-center justify-center shrink-0 shadow-xs">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h4 className="text-sm font-bold text-gray-900">
                    {activeGuide.name} — সাইজ ও ডাইমেনশন গাইডলাইন
                  </h4>
                  <span className="text-[11px] font-bold px-2 py-0.5 bg-orange-500 text-white rounded-md">
                    সুপারিশকৃত: {activeGuide.recommended}
                  </span>
                </div>
                <p className="text-xs text-gray-600 mt-1 leading-relaxed">
                  {activeGuide.description}
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mt-3 pt-2.5 border-t border-orange-200/60 text-xs">
                  <div className="bg-white/80 rounded-lg p-2 border border-orange-100">
                    <span className="text-gray-400 text-[10px] block font-semibold uppercase">Desktop / Tablet</span>
                    <strong className="text-gray-800 font-bold">{activeGuide.recommended}</strong>
                    <span className="text-[10px] text-gray-500 block">({activeGuide.aspect})</span>
                  </div>
                  <div className="bg-white/80 rounded-lg p-2 border border-orange-100">
                    <span className="text-gray-400 text-[10px] block font-semibold uppercase">Mobile Friendly</span>
                    <strong className="text-gray-800 font-bold">{activeGuide.mobile}</strong>
                    <span className="text-[10px] text-gray-500 block">অটো স্কেল হবে</span>
                  </div>
                  <div className="bg-white/80 rounded-lg p-2 border border-orange-100">
                    <span className="text-gray-400 text-[10px] block font-semibold uppercase">Important Tip</span>
                    <span className="text-orange-950 font-medium text-[11px] leading-tight block">{activeGuide.tip}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <form onSubmit={submit} className="space-y-6">
            {/* 1. Placement & Appearance */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200/90 p-5 space-y-5">
              <div className="border-b border-gray-100 pb-3">
                <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-orange-500"></span>
                  ব্যানার লোকেশন ও পজিশন (Placement & Position)
                </h3>
                <p className="text-xs text-gray-500 mt-0.5">ব্যানারটি ওয়েবসাইটের কোথায় এবং কোন সাইজে প্রদর্শিত হবে নির্বাচন করুন।</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Field label="Placement (কোথায় দেখাবে)" required error={errors.placement} hint="Select location">
                  <select 
                    value={data.placement} 
                    onChange={e => setData('placement', e.target.value)} 
                    className={inputClass}
                  >
                    {placements && Object.entries(placements).map(([k, v]) => (
                      <option key={k} value={k}>{v}</option>
                    ))}
                  </select>
                </Field>

                <Field label="Position (সিরিয়াল ক্রম)" error={errors.position} hint="0 = সবার আগে">
                  <input 
                    type="number" 
                    min="0" 
                    value={data.position} 
                    onChange={e => setData('position', e.target.value)} 
                    className={inputClass} 
                    placeholder="0"
                  />
                </Field>

                <Field label="Style Color Theme" required error={errors.style}>
                  <select 
                    value={data.style} 
                    onChange={e => setData('style', e.target.value)} 
                    className={inputClass}
                  >
                    {styles && Object.entries(styles).map(([k, v]) => (
                      <option key={k} value={k}>{v}</option>
                    ))}
                  </select>
                </Field>
              </div>
            </div>

            {/* 2. Image Upload & Preview */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200/90 p-5 space-y-5">
              <div className="border-b border-gray-100 pb-3 flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span>
                    ব্যানার ইমেজ (Banner Image)
                  </h3>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {data.placement === 'hero' 
                      ? 'মেইন স্লাইডার ইমেজ: ১২০০ × ৫০০ পিক্সেল সুপারিশকৃত।'
                      : data.placement === 'hero_side'
                      ? 'সাইড ব্যানার ইমেজ: ৪৮০ × ৫০০ পিক্সেল সুপারিশকৃত।'
                      : 'মিডল ব্যানার ইমেজ: ১২০০ × ৩০০ পিক্সেল সুপারিশকৃত।'}
                  </p>
                </div>
                <span className="text-[11px] font-bold px-2.5 py-1 rounded-lg bg-gray-100 text-gray-600 border border-gray-200">
                  {activeGuide.recommended}
                </span>
              </div>

              {/* Current / New Image Preview */}
              {(localPreview || (existingImageUrl && !removeExistingImage)) ? (
                <div className="relative rounded-2xl overflow-hidden border border-gray-200 bg-gray-50 max-w-xl group">
                  <img 
                    src={localPreview || existingImageUrl} 
                    alt="Banner preview" 
                    className="w-full h-44 sm:h-56 object-cover object-center" 
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                    {localPreview ? (
                      <button
                        type="button"
                        onClick={clearSelectedFile}
                        className="px-3 py-1.5 bg-red-600 text-white text-xs font-bold rounded-lg shadow-sm hover:bg-red-700 transition-colors"
                      >
                        Cancel Upload
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setRemoveExistingImage(true)}
                        className="px-3 py-1.5 bg-red-600 text-white text-xs font-bold rounded-lg shadow-sm hover:bg-red-700 transition-colors"
                      >
                        Remove Image
                      </button>
                    )}
                  </div>
                  <div className="absolute bottom-2 left-2 px-2 py-0.5 bg-black/60 backdrop-blur-xs text-white text-[10px] font-medium rounded">
                    {localPreview ? 'New selected image preview' : 'Current active image'}
                  </div>
                </div>
              ) : (
                <div className="p-4 rounded-xl border border-dashed border-gray-300 bg-gray-50/50 text-center text-xs text-gray-500">
                  কোনো ছবি নির্বাচিত নেই। নিচের অপশন থেকে ছবি আপলোড করুন।
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                <Field label="Upload Image File" error={errors.image_file} hint="JPG, PNG, WebP (Max 5MB)">
                  <div className="relative">
                    <input 
                      type="file" 
                      accept="image/*" 
                      onChange={handleFileChange} 
                      className={`${inputClass} file:mr-3 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-orange-500 file:text-white hover:file:bg-orange-600 cursor-pointer`} 
                    />
                  </div>
                </Field>

                <Field label="Or External Image URL (অপশনাল)" error={errors.image_url} hint="https://...">
                  <input 
                    value={data.image_url} 
                    onChange={e => setData('image_url', e.target.value)} 
                    className={inputClass} 
                    placeholder="https://example.com/banner.jpg" 
                  />
                </Field>
              </div>
            </div>

            {/* 3. Banner Content & Action (Optional) */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200/90 p-5 space-y-4">
              <div className="border-b border-gray-100 pb-3">
                <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                  টেক্সট ও লিংক সেটিংস (Link & Details)
                </h3>
                <p className="text-xs text-gray-500 mt-0.5">ব্যানারে ক্লিক করলে কোন পেজে নিয়ে যাবে এবং অতিরিক্ত টেক্সট (যদি দরকার হয়)।</p>
              </div>

              <Field label="Link URL (অপশনাল — লিংক ছাড়াও সেভ হবে)" error={errors.link_url} hint="/shop অথবা লিংক ছাড়া খালি রাখতে পারেন">
                <input 
                  value={data.link_url} 
                  onChange={e => setData('link_url', e.target.value)} 
                  className={inputClass} 
                  placeholder="/shop অথবা https://... (লিংক না দিতে চাইলে খালি রাখুন)" 
                />
              </Field>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label="Title / Heading (অপশনাল)" error={errors.title}>
                  <input 
                    value={data.title} 
                    onChange={e => setData('title', e.target.value)} 
                    className={inputClass} 
                    placeholder="e.g. সরাসরি প্রকৃতি থেকে আপনার ঘরে"
                  />
                </Field>

                <Field label="Badge / Offer Tag (অপশনাল)" error={errors.badge} hint="না লাগলে খালি রাখুন">
                  <input 
                    value={data.badge} 
                    onChange={e => setData('badge', e.target.value)} 
                    className={inputClass} 
                    placeholder="e.g. 10% OFF, NEW (অপশনাল)" 
                  />
                </Field>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label="Subtitle / বিবরণ (অপশনাল)" error={errors.subtitle}>
                  <textarea 
                    value={data.subtitle} 
                    onChange={e => setData('subtitle', e.target.value)} 
                    rows={2} 
                    className={inputClass} 
                    placeholder="সংক্ষিপ্ত ডেসক্রিপশন..."
                  />
                </Field>

                <Field label="Button Text (অপশনাল)" error={errors.button_text}>
                  <input 
                    value={data.button_text} 
                    onChange={e => setData('button_text', e.target.value)} 
                    className={inputClass} 
                    placeholder="e.g. Shop Now" 
                  />
                </Field>
              </div>
            </div>

            {/* 4. Visibility Toggle */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200/90 p-4 flex items-center justify-between">
              <label className="flex items-center gap-3 cursor-pointer select-none">
                <input 
                  type="checkbox" 
                  checked={data.is_active} 
                  onChange={e => setData('is_active', e.target.checked)} 
                  className="h-5 w-5 accent-orange-500 rounded cursor-pointer" 
                />
                <div>
                  <span className="text-sm font-bold text-gray-800 block">ব্যানারটি স্টোরে সক্রিয় রাখুন (Active)</span>
                  <span className="text-xs text-gray-500">টিক চিহ্ন থাকলে এটি স্টোরফ্রন্টে লাইভ দেখাবে।</span>
                </div>
              </label>

              <span className={`text-xs font-bold px-3 py-1 rounded-full border ${
                data.is_active ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-gray-100 text-gray-500 border-gray-200'
              }`}>
                {data.is_active ? 'Visible on Store' : 'Hidden'}
              </span>
            </div>

            {/* Submit & Actions */}
            <div className="flex items-center justify-between pt-2">
              <div className="flex items-center gap-3">
                <button 
                  type="submit" 
                  disabled={processing || submitting} 
                  className="px-6 py-3 bg-orange-500 hover:bg-orange-600 disabled:opacity-60 text-white text-sm font-bold rounded-xl transition-all shadow-sm hover:shadow cursor-pointer flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/></svg>
                  {processing || submitting ? 'সংরক্ষণ হচ্ছে…' : (isEdit ? 'আপডেট করুন (Update Banner)' : 'ব্যানার সংরক্ষণ করুন (Save Banner)')}
                </button>

                <a 
                  href="/admin/banners" 
                  className="px-5 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-semibold rounded-xl transition-colors"
                >
                  বাতিল
                </a>
              </div>

              {isEdit && (
                <button 
                  type="button" 
                  onClick={() => { window.showConfirm('Delete this banner permanently?', () => router.delete(`/admin/banners/${banner.id}`)); }}
                  className="px-4 py-2.5 bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 text-xs font-bold rounded-xl transition-colors cursor-pointer"
                >
                  মুছে ফেলুন (Delete)
                </button>
              )}
            </div>
          </form>
        </div>
      </AdminLayout>
    </>
  );
}