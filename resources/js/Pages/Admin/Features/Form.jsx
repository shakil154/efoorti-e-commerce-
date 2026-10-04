import AdminLayout from '@/Layouts/AdminLayout';
import { Head, useForm, router } from '@inertiajs/react';

const inputClass = "w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300";

function FeatureIcon({ icon }) {
  if (!icon) return null;
  const str = icon.trim();
  if (str.startsWith('<svg')) {
    return (
      <div
        className="w-10 h-10 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center shrink-0 [&>svg]:w-6 [&>svg]:h-6"
        dangerouslySetInnerHTML={{ __html: str }}
      />
    );
  }
  if (str.startsWith('M') || str.startsWith('m') || (str.length > 5 && /[0-9]/.test(str))) {
    return (
      <div className="w-10 h-10 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center shrink-0">
        <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d={str} />
        </svg>
      </div>
    );
  }
  return (
    <div className="w-10 h-10 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center text-2xl shrink-0">
      {str}
    </div>
  );
}

const PRESET_ICONS = [
  { label: '🚚 Delivery', icon: 'M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2 M15 18H9 M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.624l-3.48-4.35A1 1 0 0 0 17.52 8H14 M17 18a2 2 0 1 0 4 0 2 2 0 0 0-4 0 M5 18a2 2 0 1 0 4 0 2 2 0 0 0-4 0' },
  { label: '🏷️ Voucher', icon: 'M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v2z M13 5v2 M13 11v2 M13 17v2' },
  { label: '🔄 Returns', icon: 'M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8 M3 3v5h5' },
  { label: '🛡️ Authentic', icon: 'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z M9 12l2 2 4-4' },
  { label: '⚡ Fast Support', icon: 'M13 10V3L4 14h7v7l9-11h-7z' },
  { label: '💳 Payment', icon: 'M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z' },
];

export default function FeatureForm({ feature = {} }) {
  const isEdit = !!feature.id;
  const { data, setData, post, put, processing, errors } = useForm({
    title: feature.title || '',
    subtitle: feature.subtitle || '',
    icon: feature.icon || '',
    position: feature.position || 0,
    is_active: feature.is_active ?? true,
  });

  const submit = (e) => {
    e.preventDefault();
    const payload = { ...data, is_active: data.is_active ? '1' : '0' };
    if (isEdit) put(`/admin/features/${feature.id}`, { data: payload });
    else post('/admin/features', { data: payload });
  };

  return (
    <>
      <Head title={isEdit ? `Edit: ${feature.title}` : 'Add Feature'} />
      <AdminLayout title={isEdit ? 'Edit Feature' : 'Add Feature'}>
        <form onSubmit={submit} className="max-w-2xl space-y-5">
          <a href="/admin/features" className="text-sm text-gray-500 hover:text-gray-700 flex items-center gap-1 w-fit">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
            Features
          </a>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-5">
            <h3 className="font-semibold text-gray-900 pb-3 border-b border-gray-50">Feature Badge Details</h3>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Title <span className="text-red-400">*</span></label>
              <input value={data.title} onChange={e => setData('title', e.target.value)} className={inputClass} placeholder="e.g. Free Delivery" required />
              {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Subtitle</label>
              <input value={data.subtitle} onChange={e => setData('subtitle', e.target.value)} className={inputClass} placeholder="e.g. Orders over ৳2,000" />
              {errors.subtitle && <p className="text-red-500 text-xs mt-1">{errors.subtitle}</p>}
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Icon</label>
              
              {/* Presets */}
              <div className="flex flex-wrap gap-2 pb-1">
                {PRESET_ICONS.map((p) => (
                  <button
                    type="button"
                    key={p.label}
                    onClick={() => setData('icon', p.icon)}
                    className="px-2.5 py-1 text-xs bg-gray-100 hover:bg-orange-50 hover:text-orange-600 rounded-lg font-medium transition-colors border border-gray-200/60"
                  >
                    {p.label}
                  </button>
                ))}
              </div>

              <textarea
                value={data.icon}
                onChange={e => setData('icon', e.target.value)}
                rows={2}
                className={inputClass}
                placeholder="SVG path string (e.g. M3 7h11...), full <svg>, or emoji 🚚"
              />
              
              {data.icon && (
                <div className="p-3 bg-gray-50 rounded-xl border border-gray-100 flex items-center gap-3">
                  <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Icon Preview:</span>
                  <FeatureIcon icon={data.icon} />
                </div>
              )}
              {errors.icon && <p className="text-red-500 text-xs mt-1">{errors.icon}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4 pt-1">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Position</label>
                <input type="number" min="0" value={data.position} onChange={e => setData('position', e.target.value)} className={inputClass} />
              </div>
              <div className="flex items-end pb-2">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" checked={data.is_active} onChange={e => setData('is_active', e.target.checked)} className="h-4 w-4 accent-orange-500 rounded" />
                  <span className="text-sm font-medium text-gray-700">Active</span>
                </label>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button type="submit" disabled={processing} className="px-6 py-3 bg-orange-500 hover:bg-orange-600 disabled:opacity-60 text-white font-semibold rounded-xl transition-colors shadow-sm shadow-orange-200">
              {processing ? 'Saving…' : (isEdit ? 'Update Feature' : 'Create Feature')}
            </button>
            {isEdit && (
              <button type="button" onClick={() => { window.showConfirm(`Delete "${feature.title}"?`, () => router.delete(`/admin/features/${feature.id}`)); }}
                className="px-4 py-2.5 bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 text-sm font-medium rounded-xl transition-colors">Delete</button>
            )}
          </div>
        </form>
      </AdminLayout>
    </>
  );
}