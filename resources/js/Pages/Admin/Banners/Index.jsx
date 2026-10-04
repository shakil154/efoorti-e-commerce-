import AdminLayout from '@/Layouts/AdminLayout';
import { Head, router } from '@inertiajs/react';
import { useState, useMemo } from 'react';

export default function BannersIndex({ banners = [], placements = {}, sizeGuides = {} }) {
  const [filterPlacement, setFilterPlacement] = useState('all');
  const [showGuide, setShowGuide] = useState(true);

  const handleToggle = (id) => router.patch(`/admin/banners/${id}/toggle`);
  const handleDelete = (banner) => {
    window.showConfirm(`Delete "${banner.title || 'this banner'}" permanently?`, () => {
      router.delete(`/admin/banners/${banner.id}`);
    });
  };

  const filteredBanners = useMemo(() => {
    if (filterPlacement === 'all') return banners;
    return banners.filter(b => b.placement === filterPlacement);
  }, [banners, filterPlacement]);

  const placementLabel = (key) => {
    if (key === 'hero') return 'Hero Main Slider';
    if (key === 'hero_side') return 'Hero Side Banner';
    if (key === 'middle') return 'Middle Promo Banner';
    return placements?.[key] || key;
  };

  const placementBadgeColor = (key) => {
    if (key === 'hero') return 'bg-blue-50 text-blue-700 border-blue-200';
    if (key === 'hero_side') return 'bg-amber-50 text-amber-800 border-amber-200';
    if (key === 'middle') return 'bg-purple-50 text-purple-700 border-purple-200';
    return 'bg-gray-50 text-gray-700 border-gray-200';
  };

  return (
    <>
      <Head title="Banners Management" />
      <AdminLayout title="Banners Management">
        <div className="space-y-6">
          {/* Header Row */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-extrabold text-gray-900 tracking-tight">ওয়েবসাইট ব্যানার ও স্লাইডার</h2>
              <p className="text-xs text-gray-500 mt-0.5">হোমপেজ মেইন স্লাইডার, সাইড ব্যানার এবং মিডল প্রমোশনাল ব্যানার পরিচালনা করুন।</p>
            </div>

            <div className="flex items-center gap-2.5">
              <button
                type="button"
                onClick={() => setShowGuide(prev => !prev)}
                className="px-3.5 py-2.5 bg-white hover:bg-gray-50 border border-gray-200 text-gray-700 text-xs font-bold rounded-xl transition-all shadow-2xs flex items-center gap-2 cursor-pointer"
              >
                <svg className="w-4 h-4 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {showGuide ? 'গাইড লুকান' : 'সাইজ গাইডলাইন দেখুন'}
              </button>

              <a
                href="/admin/banners/create"
                className="px-4 py-2.5 bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold rounded-xl transition-all shadow-sm flex items-center gap-2 cursor-pointer"
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 5v14M5 12h14"/></svg>
                Add New Banner
              </a>
            </div>
          </div>

          {/* Banner Dimensions Guide Card */}
          {showGuide && (
            <div className="bg-white rounded-2xl border border-orange-200/80 p-5 shadow-2xs space-y-4">
              <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                <div className="flex items-center gap-2.5">
                  <span className="w-7 h-7 rounded-lg bg-orange-100 text-orange-600 flex items-center justify-center font-bold text-xs">
                    📐
                  </span>
                  <div>
                    <h3 className="text-sm font-bold text-gray-900">ব্যানার সাইজ ও ডাইমেনশন গাইড (Recommended Dimensions)</h3>
                    <p className="text-[11px] text-gray-500">মোবাইল এবং কম্পিউটারে ব্যানার যাতে না কাটে সেজন্য এই সাইজগুলো অনুসরণ করুন:</p>
                  </div>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                  Mobile Responsive
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* 1. Hero Slider */}
                <div className="rounded-xl p-3.5 bg-blue-50/40 border border-blue-100 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-blue-900">1. Hero Main Slider</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 bg-blue-600 text-white rounded">1200 × 500 px</span>
                  </div>
                  <p className="text-xs text-blue-950/80 leading-relaxed">
                    হোমপেজের প্রধান স্লাইডার। এক বা একাধিক ব্যানার দিলে অটো-স্লাইড হয়।
                  </p>
                  <div className="pt-2 border-t border-blue-200/50 flex items-center justify-between text-[11px] text-blue-800">
                    <span>রেশিও: <strong>2.4 : 1 (Wide)</strong></span>
                    <span>মোবাইল: <strong>800 × 450 px</strong></span>
                  </div>
                </div>

                {/* 2. Hero Side Banner */}
                <div className="rounded-xl p-3.5 bg-amber-50/40 border border-amber-100 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-amber-900">2. Hero Side Banner</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 bg-amber-600 text-white rounded">480 × 500 px</span>
                  </div>
                  <p className="text-xs text-amber-950/80 leading-relaxed">
                    স্লাইডারের ঠিক পাশে (ডানপাশে) এবং মোবাইলে স্লাইডারের নিচে স্পেশাল অফার ব্যানার।
                  </p>
                  <div className="pt-2 border-t border-amber-200/50 flex items-center justify-between text-[11px] text-amber-800">
                    <span>রেশিও: <strong>1 : 1 বা 4 : 5</strong></span>
                    <span>মোবাইল: <strong>অটো রেসপনসিভ</strong></span>
                  </div>
                </div>

                {/* 3. Middle Promo Banner */}
                <div className="rounded-xl p-3.5 bg-purple-50/40 border border-purple-100 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-purple-900">3. Middle Promo Banner</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 bg-purple-600 text-white rounded">1200 × 300 px</span>
                  </div>
                  <p className="text-xs text-purple-950/80 leading-relaxed">
                    হোমপেজের মাঝের সেকশনে ফুল-উইডথ জুড়ে স্পেশাল ক্যাম্পেইন বা কুপন ব্যানার।
                  </p>
                  <div className="pt-2 border-t border-purple-200/50 flex items-center justify-between text-[11px] text-purple-800">
                    <span>রেশিও: <strong>4 : 1 (Ultra Wide)</strong></span>
                    <span>মোবাইল: <strong>800 × 250 px</strong></span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Filter Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            {[
              { id: 'all', label: 'All Banners', count: banners.length },
              { id: 'hero', label: 'Hero Main Slider', count: banners.filter(b => b.placement === 'hero').length },
              { id: 'hero_side', label: 'Hero Side Banner', count: banners.filter(b => b.placement === 'hero_side').length },
              { id: 'middle', label: 'Middle Promo Banner', count: banners.filter(b => b.placement === 'middle').length },
            ].map(tab => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setFilterPlacement(tab.id)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer flex items-center gap-1.5 border ${
                  filterPlacement === tab.id
                    ? 'bg-orange-500 text-white border-orange-500 shadow-2xs'
                    : 'bg-white hover:bg-gray-50 text-gray-700 border-gray-200'
                }`}
              >
                <span>{tab.label}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                  filterPlacement === tab.id ? 'bg-white/25 text-white' : 'bg-gray-100 text-gray-600'
                }`}>
                  {tab.count}
                </span>
              </button>
            ))}
          </div>

          {/* Banners Table */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200/90 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead>
                  <tr className="bg-gray-50/70 border-b border-gray-100">
                    <th className="px-5 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Banner Preview</th>
                    <th className="px-5 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Placement & Guide</th>
                    <th className="px-5 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Target Link</th>
                    <th className="px-5 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider text-center">Position</th>
                    <th className="px-5 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider text-center">Status</th>
                    <th className="px-5 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredBanners.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="px-5 py-14 text-center text-gray-400">
                        <div className="flex flex-col items-center justify-center gap-2">
                          <svg className="w-10 h-10 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          <p className="text-xs font-semibold">কোনো ব্যানার পাওয়া যায়নি</p>
                          <a href="/admin/banners/create" className="text-xs text-orange-600 font-bold hover:underline">
                            + নতুন ব্যানার যুক্ত করুন
                          </a>
                        </div>
                      </td>
                    </tr>
                  ) : filteredBanners.map(banner => {
                    const guide = sizeGuides?.[banner.placement];
                    const imgUrl = banner.image
                      ? (banner.image.startsWith('http') ? banner.image : `/${banner.image}`)
                      : null;

                    return (
                      <tr key={banner.id} className="hover:bg-gray-50/60 transition-colors">
                        {/* Image Preview & Title */}
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            {imgUrl ? (
                              <div className="h-12 w-24 rounded-xl overflow-hidden bg-gray-100 border border-gray-200 shrink-0 shadow-2xs">
                                <img src={imgUrl} alt="" className="w-full h-full object-cover object-center" />
                              </div>
                            ) : (
                              <div className="h-12 w-24 rounded-xl bg-gray-100 border border-dashed border-gray-300 shrink-0 flex items-center justify-center text-[10px] text-gray-400 font-bold">
                                No Image
                              </div>
                            )}
                            <div className="min-w-0">
                              <p className="font-bold text-gray-900 text-xs truncate max-w-[220px]">
                                {banner.title || 'শিরোনাম ছাড়া ব্যানার'}
                              </p>
                              {banner.subtitle && (
                                <p className="text-[11px] text-gray-400 truncate max-w-[220px] mt-0.5">
                                  {banner.subtitle}
                                </p>
                              )}
                              {banner.badge && (
                                <span className="inline-block mt-1 text-[9px] font-bold px-1.5 py-0.2 rounded bg-orange-100 text-orange-700">
                                  {banner.badge}
                                </span>
                              )}
                            </div>
                          </div>
                        </td>

                        {/* Placement with Recommended Size */}
                        <td className="px-5 py-4">
                          <div className="space-y-1">
                            <span className={`inline-block px-2.5 py-0.8 text-[11px] font-bold rounded-lg border ${placementBadgeColor(banner.placement)}`}>
                              {placementLabel(banner.placement)}
                            </span>
                            {guide && (
                              <p className="text-[10px] text-gray-400 font-medium">
                                সাইজ: <strong className="text-gray-600">{guide.recommended}</strong>
                              </p>
                            )}
                          </div>
                        </td>

                        {/* Target Link */}
                        <td className="px-5 py-4 text-xs font-medium text-gray-600">
                          {banner.link_url ? (
                            <a href={banner.link_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline truncate max-w-[150px] block font-mono text-[11px]">
                              {banner.link_url}
                            </a>
                          ) : (
                            <span className="text-gray-400 text-[11px]">ডিফল্ট (/shop)</span>
                          )}
                        </td>

                        {/* Position */}
                        <td className="px-5 py-4 text-center">
                          <span className="px-2 py-1 bg-gray-100 rounded-md text-xs font-bold text-gray-700">
                            #{banner.position ?? 0}
                          </span>
                        </td>

                        {/* Active Toggle Status */}
                        <td className="px-5 py-4 text-center">
                          <button
                            type="button"
                            onClick={() => handleToggle(banner.id)}
                            className={`px-3 py-1 text-[11px] font-bold rounded-full border transition-all cursor-pointer ${
                              banner.is_active
                                ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                                : 'bg-gray-100 text-gray-500 border-gray-200 hover:bg-gray-200'
                            }`}
                          >
                            {banner.is_active ? 'Active' : 'Hidden'}
                          </button>
                        </td>

                        {/* Actions */}
                        <td className="px-5 py-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <a
                              href={`/admin/banners/${banner.id}/edit`}
                              className="px-3 py-1.5 text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-bold transition-colors cursor-pointer"
                            >
                              Edit
                            </a>
                            <button
                              type="button"
                              onClick={() => handleDelete(banner)}
                              className="px-2.5 py-1.5 text-xs bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 rounded-lg font-bold transition-colors cursor-pointer"
                              title="Delete banner"
                            >
                              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </AdminLayout>
    </>
  );
}