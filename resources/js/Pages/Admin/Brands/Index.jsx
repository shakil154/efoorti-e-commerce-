import AdminLayout from '@/Layouts/AdminLayout';
import { Head, router } from '@inertiajs/react';
import { useState } from 'react';
import { imageUrl } from '@/lib/utils';

export default function BrandsIndex({ brands, filters, metrics }) {
  const [search, setSearch] = useState(filters?.q || '');
  const [statusFilter, setStatusFilter] = useState(filters?.status || '');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingBrand, setEditingBrand] = useState(null);
  const [deleteModal, setDeleteModal] = useState(null);
  const [loading, setLoading] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    website: '',
    is_active: true,
    is_featured: false,
    logo_file: null,
    logo_preview: null,
    remove_logo: false,
  });

  const openCreateModal = () => {
    setEditingBrand(null);
    setFormData({
      name: '',
      slug: '',
      description: '',
      website: '',
      is_active: true,
      is_featured: false,
      logo_file: null,
      logo_preview: null,
      remove_logo: false,
    });
    setModalOpen(true);
  };

  const openEditModal = (brand) => {
    setEditingBrand(brand);
    setFormData({
      name: brand.name || '',
      slug: brand.slug || '',
      description: brand.description || '',
      website: brand.website || '',
      is_active: !!brand.is_active,
      is_featured: !!brand.is_featured,
      logo_file: null,
      logo_preview: brand.logo_path ? imageUrl(brand.logo_path) : null,
      remove_logo: false,
    });
    setModalOpen(true);
  };

  const handleNameChange = (val) => {
    setFormData(prev => ({
      ...prev,
      name: val,
      // Auto-generate slug if not manually edited or when creating
      slug: !editingBrand ? val.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '') : prev.slug,
    }));
  };

  const handleSearch = (e) => {
    e.preventDefault();
    router.get('/admin/brands', { q: search, status: statusFilter }, { preserveState: true, replace: true });
  };

  const handleFilterChange = (val) => {
    setStatusFilter(val);
    router.get('/admin/brands', { q: search, status: val }, { preserveState: true, replace: true });
  };

  const handleLogoChange = (file) => {
    if (!file) return;
    setFormData(prev => ({
      ...prev,
      logo_file: file,
      logo_preview: URL.createObjectURL(file),
      remove_logo: false,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    const data = new FormData();
    data.append('name', formData.name);
    if (formData.slug) data.append('slug', formData.slug);
    if (formData.description) data.append('description', formData.description);
    if (formData.website) data.append('website', formData.website);
    data.append('is_active', formData.is_active ? '1' : '0');
    data.append('is_featured', formData.is_featured ? '1' : '0');

    if (formData.logo_file) {
      data.append('logo', formData.logo_file);
    }
    if (formData.remove_logo) {
      data.append('remove_logo', '1');
    }

    if (editingBrand) {
      data.append('_method', 'PUT');
      router.post(`/admin/brands/${editingBrand.id}`, data, {
        onSuccess: () => {
          setModalOpen(false);
          setLoading(false);
        },
        onError: () => setLoading(false),
      });
    } else {
      router.post('/admin/brands', data, {
        onSuccess: () => {
          setModalOpen(false);
          setLoading(false);
        },
        onError: () => setLoading(false),
      });
    }
  };

  const toggleBrandStatus = (brand) => {
    router.patch(`/admin/brands/${brand.id}/toggle`, {}, { preserveScroll: true });
  };

  const executeDelete = () => {
    if (!deleteModal) return;
    router.delete(`/admin/brands/${deleteModal.id}`, {
      onSuccess: () => setDeleteModal(null),
    });
  };

  const brandList = brands?.data || [];

  return (
    <>
      <Head title="Brands Management" />
      <AdminLayout title="Brands (ব্র্যান্ডস)">
        <div className="space-y-6">
          {/* Header & Metrics */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-xl font-extrabold text-gray-900 tracking-tight">Marketplace Brands</h1>
              <p className="text-xs text-gray-500 mt-0.5">
                Manage product manufacturers and brands. Products can be assigned to brands for easy filtering.
              </p>
            </div>
            <button
              type="button"
              onClick={openCreateModal}
              className="px-4 py-2.5 bg-orange-500 hover:bg-orange-600 active:scale-95 text-white text-xs sm:text-sm font-bold rounded-xl transition-all shadow-md shadow-orange-500/20 flex items-center gap-2 cursor-pointer shrink-0"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 5v14M5 12h14"/></svg>
              <span>Add New Brand</span>
            </button>
          </div>

          {/* Metrics Overview */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-2xs flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold text-gray-500 block">Total Brands</span>
                <span className="text-2xl font-black text-gray-900 mt-1 block">{metrics?.total || 0}</span>
              </div>
              <div className="w-10 h-10 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z"/>
                  <path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2"/>
                  <path d="M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2"/>
                  <path d="M10 6h4"/><path d="M10 10h4"/><path d="M10 14h4"/><path d="M10 18h4"/>
                </svg>
              </div>
            </div>
            <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-2xs flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold text-gray-500 block">Active Brands</span>
                <span className="text-2xl font-black text-emerald-600 mt-1 block">{metrics?.active || 0}</span>
              </div>
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
              </div>
            </div>
            <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-2xs flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold text-gray-500 block">Featured on Home</span>
                <span className="text-2xl font-black text-blue-600 mt-1 block">{metrics?.featured || 0}</span>
              </div>
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                </svg>
              </div>
            </div>
          </div>

          {/* Search and Filters Bar */}
          <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-3">
            <form onSubmit={handleSearch} className="relative w-full sm:max-w-md">
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search by brand name or slug..."
                className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-300 transition-all"
              />
              <svg className="w-4 h-4 text-gray-400 absolute left-3 top-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </form>

            <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
              <select
                value={statusFilter}
                onChange={e => handleFilterChange(e.target.value)}
                className="border border-gray-200 rounded-xl px-3 py-2 text-xs sm:text-sm bg-white focus:outline-none focus:ring-2 focus:ring-orange-300"
              >
                <option value="">All Statuses</option>
                <option value="active">Active Only</option>
                <option value="inactive">Inactive Only</option>
              </select>
            </div>
          </div>

          {/* Brands Table */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-gray-50/75 border-b border-gray-100 text-xs font-bold text-gray-600 uppercase tracking-wider">
                  <tr>
                    <th className="py-3.5 px-4 w-16">Logo</th>
                    <th className="py-3.5 px-4">Brand Name</th>
                    <th className="py-3.5 px-4">Slug (URL)</th>
                    <th className="py-3.5 px-4 text-center">Products</th>
                    <th className="py-3.5 px-4 text-center">Featured</th>
                    <th className="py-3.5 px-4 text-center">Status</th>
                    <th className="py-3.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {brandList.length === 0 ? (
                    <tr>
                      <td colSpan="7" className="py-12 text-center text-gray-400">
                        <div className="max-w-xs mx-auto">
                          <svg className="w-12 h-12 mx-auto text-gray-300 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/></svg>
                          <p className="font-semibold text-gray-700">No brands found</p>
                          <p className="text-xs text-gray-500 mt-1">Create your first brand to organize products.</p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    brandList.map(brand => (
                      <tr key={brand.id} className="hover:bg-gray-50/50 transition-colors">
                        {/* Logo */}
                        <td className="py-3 px-4">
                          <div className="w-10 h-10 rounded-xl bg-gray-50 border border-gray-200 flex items-center justify-center p-1 overflow-hidden shrink-0 shadow-2xs">
                            {brand.logo_path ? (
                              <img src={imageUrl(brand.logo_path)} alt={brand.name} className="w-full h-full object-contain" />
                            ) : (
                              <span className="text-sm font-bold text-gray-400 uppercase">{brand.name.substring(0, 2)}</span>
                            )}
                          </div>
                        </td>

                        {/* Name & Description */}
                        <td className="py-3 px-4">
                          <div>
                            <span className="font-bold text-gray-900 block">{brand.name}</span>
                            {brand.description && (
                              <span className="text-xs text-gray-400 truncate block max-w-xs mt-0.5">{brand.description}</span>
                            )}
                          </div>
                        </td>

                        {/* Slug */}
                        <td className="py-3 px-4 font-mono text-xs text-gray-500">
                          /shop?brand={brand.slug}
                        </td>

                        {/* Products Count */}
                        <td className="py-3 px-4 text-center">
                          <a
                            href={`/admin/products?brand=${encodeURIComponent(brand.name)}`}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-gray-100 hover:bg-orange-100 text-gray-700 hover:text-orange-700 text-xs font-bold transition-colors"
                            title="View products under this brand"
                          >
                            <span>{brand.products_count ?? 0}</span>
                            <span className="text-[10px] font-normal text-gray-400">items</span>
                          </a>
                        </td>

                        {/* Featured */}
                        <td className="py-3 px-4 text-center">
                          {brand.is_featured ? (
                            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200">
                              ★ Featured
                            </span>
                          ) : (
                            <span className="text-gray-300 text-xs">—</span>
                          )}
                        </td>

                        {/* Status Toggle */}
                        <td className="py-3 px-4 text-center">
                          <button
                            type="button"
                            onClick={() => toggleBrandStatus(brand)}
                            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold cursor-pointer transition-colors ${
                              brand.is_active
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100'
                                : 'bg-gray-100 text-gray-500 border border-gray-200 hover:bg-gray-200'
                            }`}
                          >
                            <span className={`w-1.5 h-1.5 rounded-full ${brand.is_active ? 'bg-emerald-500' : 'bg-gray-400'}`} />
                            {brand.is_active ? 'Active' : 'Inactive'}
                          </button>
                        </td>

                        {/* Actions */}
                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              type="button"
                              onClick={() => openEditModal(brand)}
                              className="p-1.5 text-gray-400 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors cursor-pointer"
                              title="Edit Brand"
                            >
                              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>
                            </button>
                            <button
                              type="button"
                              onClick={() => setDeleteModal(brand)}
                              className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                              title="Delete Brand"
                            >
                              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {brands?.links?.length > 3 && (
              <div className="p-4 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
                <span>Showing {brands.from || 0} to {brands.to || 0} of {brands.total} brands</span>
                <div className="flex items-center gap-1">
                  {brands.links.map((link, idx) => (
                    <button
                      key={idx}
                      disabled={!link.url || link.active}
                      onClick={() => link.url && router.get(link.url)}
                      dangerouslySetInnerHTML={{ __html: link.label }}
                      className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
                        link.active
                          ? 'bg-orange-500 text-white font-bold'
                          : link.url
                          ? 'hover:bg-gray-100 text-gray-700'
                          : 'opacity-40 cursor-not-allowed text-gray-400'
                      }`}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Create / Edit Brand Modal */}
        {modalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-fade-in">
            <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-gray-100 overflow-hidden space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                <div>
                  <h3 className="text-lg font-bold text-gray-900">
                    {editingBrand ? 'Edit Brand' : 'Create New Brand'}
                  </h3>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {editingBrand ? 'Update brand details, logo, and active visibility.' : 'Add a new brand to associate with your catalog.'}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 flex items-center justify-center transition-colors cursor-pointer"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Brand Name */}
                <div>
                  <label className="text-xs font-bold text-gray-700 block mb-1.5">Brand Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={e => handleNameChange(e.target.value)}
                    placeholder="e.g. Apple, Nike, Samsung"
                    className="w-full border border-gray-200 rounded-xl px-3.5 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300"
                  />
                </div>

                {/* Slug */}
                <div>
                  <label className="text-xs font-bold text-gray-700 block mb-1.5">Slug (URL identifier)</label>
                  <input
                    type="text"
                    value={formData.slug}
                    onChange={e => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                    placeholder="auto-generated-from-name"
                    className="w-full border border-gray-200 rounded-xl px-3.5 py-2 text-sm font-mono text-gray-600 focus:outline-none focus:ring-2 focus:ring-orange-300"
                  />
                </div>

                {/* Logo Image Upload */}
                <div>
                  <label className="text-xs font-bold text-gray-700 block mb-1.5">Brand Logo Image</label>
                  <div className="flex items-center gap-3">
                    {formData.logo_preview && !formData.remove_logo ? (
                      <div className="relative w-16 h-16 rounded-xl border border-gray-200 p-1.5 bg-gray-50 flex items-center justify-center shrink-0">
                        <img src={formData.logo_preview} alt="Preview" className="w-full h-full object-contain" />
                        <button
                          type="button"
                          onClick={() => setFormData(prev => ({ ...prev, remove_logo: true, logo_file: null }))}
                          className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center text-[10px] font-bold shadow-xs hover:bg-red-600 cursor-pointer"
                        >
                          ✕
                        </button>
                      </div>
                    ) : null}

                    <label className="flex-1 border-2 border-dashed border-gray-200 hover:border-orange-400 bg-gray-50/50 rounded-xl p-3 flex flex-col items-center justify-center cursor-pointer transition-colors">
                      <svg className="w-5 h-5 text-gray-400 mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
                      <span className="text-xs font-semibold text-gray-700">Click to upload brand logo</span>
                      <span className="text-[10px] text-gray-400">PNG, JPG, SVG or WEBP up to 3MB</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={e => handleLogoChange(e.target.files?.[0])}
                      />
                    </label>
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="text-xs font-bold text-gray-700 block mb-1.5">Description (Optional)</label>
                  <textarea
                    rows={2}
                    value={formData.description}
                    onChange={e => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Short summary about the brand..."
                    className="w-full border border-gray-200 rounded-xl px-3.5 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300"
                  />
                </div>

                {/* Toggles */}
                <div className="grid grid-cols-2 gap-3 pt-1">
                  <label className="flex items-center gap-2.5 p-3 rounded-xl border border-gray-200 cursor-pointer hover:bg-gray-50 transition-colors">
                    <input
                      type="checkbox"
                      checked={formData.is_active}
                      onChange={e => setFormData(prev => ({ ...prev, is_active: e.target.checked }))}
                      className="h-4 w-4 text-orange-600 rounded focus:ring-orange-500"
                    />
                    <div>
                      <span className="text-xs font-bold text-gray-900 block">Active Status</span>
                      <span className="text-[10px] text-gray-400 block">Visible in catalog</span>
                    </div>
                  </label>

                  <label className="flex items-center gap-2.5 p-3 rounded-xl border border-gray-200 cursor-pointer hover:bg-gray-50 transition-colors">
                    <input
                      type="checkbox"
                      checked={formData.is_featured}
                      onChange={e => setFormData(prev => ({ ...prev, is_featured: e.target.checked }))}
                      className="h-4 w-4 text-orange-600 rounded focus:ring-orange-500"
                    />
                    <div>
                      <span className="text-xs font-bold text-gray-900 block">Featured</span>
                      <span className="text-[10px] text-gray-400 block">Show in brands section</span>
                    </div>
                  </label>
                </div>

                {/* Footer Buttons */}
                <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-gray-100">
                  <button
                    type="button"
                    onClick={() => setModalOpen(false)}
                    className="px-4 py-2 border border-gray-200 rounded-xl text-xs font-semibold text-gray-600 hover:bg-gray-50 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-5 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-xl text-xs font-bold shadow-md shadow-orange-500/20 disabled:opacity-50 cursor-pointer"
                  >
                    {loading ? 'Saving...' : (editingBrand ? 'Update Brand' : 'Create Brand')}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {deleteModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
            <div className="bg-white rounded-2xl max-w-sm w-full p-5 shadow-xl space-y-4">
              <div className="w-10 h-10 rounded-full bg-red-100 text-red-600 flex items-center justify-center font-bold text-lg mx-auto">
                !
              </div>
              <div className="text-center">
                <h4 className="font-bold text-gray-900">Delete Brand "{deleteModal.name}"?</h4>
                <p className="text-xs text-gray-500 mt-1">
                  Products attached to this brand will remain intact without a brand. This action cannot be undone.
                </p>
              </div>
              <div className="flex items-center justify-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setDeleteModal(null)}
                  className="px-4 py-2 border border-gray-200 rounded-xl text-xs font-semibold text-gray-600 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={executeDelete}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold"
                >
                  Yes, Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </AdminLayout>
    </>
  );
}
