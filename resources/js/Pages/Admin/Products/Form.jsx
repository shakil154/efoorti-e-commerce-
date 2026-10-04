import AdminLayout from '@/Layouts/AdminLayout';
import { Head, useForm, router } from '@inertiajs/react';
import { useState, useMemo, useEffect } from 'react';
import { fileToBase64, imageUrl } from '@/lib/utils';
import RichTextEditor from '@/Components/Admin/RichTextEditor';

function FormCard({ title, icon, subtitle, children, action, className = "" }) {
  return (
    <div className={`bg-white rounded-2xl shadow-xs border border-gray-200/80 p-5 sm:p-6 transition-all ${className}`}>
      {(title || action) && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-5 pb-3.5 border-b border-gray-100">
          <div className="flex items-center gap-2.5">
            {icon && (
              <div className="w-8 h-8 rounded-lg bg-orange-50 text-[#f15a24] flex items-center justify-center shrink-0">
                {icon}
              </div>
            )}
            <div>
              <h3 className="font-bold text-gray-900 text-[15px] sm:text-base leading-tight">{title}</h3>
              {subtitle && <p className="text-xs text-gray-500 mt-0.5">{subtitle}</p>}
            </div>
          </div>
          {action && <div className="shrink-0">{action}</div>}
        </div>
      )}
      {children}
    </div>
  );
}

function Field({ label, error, children, required, hint, className = "" }) {
  return (
    <div className={className}>
      <div className="flex items-center justify-between mb-1.5">
        <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">
          {label}{required && <span className="text-rose-500 ml-0.5">*</span>}
        </label>
        {hint && <span className="text-[11px] text-gray-400 font-normal">{hint}</span>}
      </div>
      {children}
      {error && <p className="text-rose-500 text-xs mt-1.5 font-medium flex items-center gap-1">
        <svg className="w-3.5 h-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
        {error}
      </p>}
    </div>
  );
}

const inputClass = "w-full bg-white border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-400/30 focus:border-[#f15a24] transition-all";

const COLOR_PRESETS = [
  { name: 'Black', hex: '#000000' },
  { name: 'White', hex: '#ffffff' },
  { name: 'Red', hex: '#ef4444' },
  { name: 'Blue', hex: '#3b82f6' },
  { name: 'Navy', hex: '#1e3a8a' },
  { name: 'Green', hex: '#10b981' },
  { name: 'Pink', hex: '#ec4899' },
  { name: 'Purple', hex: '#8b5cf6' },
  { name: 'Yellow', hex: '#f59e0b' },
  { name: 'Orange', hex: '#f97316' },
  { name: 'Grey', hex: '#64748b' },
];

const SIZE_PRESETS = ['S', 'M', 'L', 'XL', 'XXL', '3XL', '28', '30', '32', '34', '36', '38', '40'];

export default function ProductForm({ product, categories = [], brands = [] }) {
  const isEdit = !!product.id;
  const [submitting, setSubmitting] = useState(false);

  // Brand quick create modal state
  const [brandList, setBrandList] = useState(brands || []);
  const [showBrandModal, setShowBrandModal] = useState(false);
  const [newBrandName, setNewBrandName] = useState('');
  const [newBrandFile, setNewBrandFile] = useState(null);
  const [newBrandPreview, setNewBrandPreview] = useState('');
  const [savingBrand, setSavingBrand] = useState(false);
  const [brandError, setBrandError] = useState('');

  const existingVariants = product.variants || [];
  const existingCustomGroups = product.custom_variant_groups || [];

  const [productType, setProductType] = useState(
    existingVariants.length > 0 || existingCustomGroups.length > 0 ? 'variable' : 'simple'
  );

  const { data, setData, processing, errors } = useForm({
    category_id: product.category_id || '',
    brand_id: product.brand_id || '',
    name: product.name || '',
    slug: product.slug || '',
    sku: product.sku || '',
    brand: product.brand || '',
    brand_image: product.brand_image || '',
    brand_image_file: null,
    brand_image_preview: product.brand_image ? (product.brand_image.startsWith('http') ? product.brand_image : `/${product.brand_image}`) : '',
    brand_image_remove: false,
    short_description: product.short_description || '',
    description: product.description || '',
    regular_price: product.regular_price && parseFloat(product.regular_price) !== 0 ? product.regular_price : '',
    sale_price: product.sale_price && parseFloat(product.sale_price) !== 0 ? product.sale_price : '',
    stock_quantity: product.stock_quantity && parseInt(product.stock_quantity) !== 0 ? product.stock_quantity : '',
    unit: product.unit || '',
    is_published: product.is_published ?? true,
    is_featured: product.is_featured ?? false,
    is_new_arrival: product.is_new_arrival ?? false,
    is_best_seller: product.is_best_seller ?? false,
    is_flash_sale: product.is_flash_sale ?? false,
    is_free_shipping: product.is_free_shipping ?? false,
    meta_title: product.meta_title || '',
    meta_description: product.meta_description || '',
    meta_keywords: product.meta_keywords || '',
    images: [],
  });

  const [colors, setColors] = useState(
    existingVariants.filter(v => v.type === 'Color').map(v => ({
      id: v.id,
      value: v.value || '',
      color_code: v.color_code || '#000000',
      regular_price: v.regular_price !== null && v.regular_price !== undefined ? v.regular_price : '',
      sale_price: v.sale_price !== null && v.sale_price !== undefined ? v.sale_price : '',
      price_delta: v.price_delta || 0,
      stock: v.stock !== undefined ? v.stock : 0,
      image_path: v.image_path || '',
      image_file: null,
      image_preview: v.image_path ? (v.image_path.startsWith('http') ? v.image_path : `/${v.image_path}`) : '',
    }))
  );

  const [sizes, setSizes] = useState(
    existingVariants.filter(v => v.type === 'Size').map(v => ({
      id: v.id,
      value: v.value || '',
      regular_price: v.regular_price !== null && v.regular_price !== undefined ? v.regular_price : '',
      sale_price: v.sale_price !== null && v.sale_price !== undefined ? v.sale_price : '',
      price_delta: v.price_delta || 0,
      stock: v.stock !== undefined ? v.stock : 0,
      image_path: v.image_path || '',
      image_file: null,
      image_preview: v.image_path ? (v.image_path.startsWith('http') ? v.image_path : `/${v.image_path}`) : '',
    }))
  );

  const [customGroups, setCustomGroups] = useState(
    existingCustomGroups.map(g => ({
      name: g.name || '',
      options: (g.options || []).map(opt => ({
        id: opt.id,
        value: opt.value || '',
        regular_price: opt.regular_price !== null && opt.regular_price !== undefined ? opt.regular_price : '',
        sale_price: opt.sale_price !== null && opt.sale_price !== undefined ? opt.sale_price : '',
        price_delta: opt.price_delta || 0,
        stock: opt.stock !== undefined ? opt.stock : 0,
        image_path: opt.image_path || '',
        image_file: null,
        image_preview: opt.image_path ? (opt.image_path.startsWith('http') ? opt.image_path : `/${opt.image_path}`) : '',
      })),
    }))
  );

  const [specs, setSpecs] = useState(Array.isArray(product.specifications) ? product.specifications : []);

  // Keyboard shortcut: Cmd/Ctrl + S to save
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 's') {
        e.preventDefault();
        const form = document.getElementById('product-form');
        if (form) form.requestSubmit();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Calculations for variable stock summary
  const variantMetrics = useMemo(() => {
    let totalOptions = 0;
    let totalStock = 0;
    let outOfStockCount = 0;

    colors.forEach(c => {
      if (c.value) {
        totalOptions++;
        const s = parseInt(c.stock, 10) || 0;
        totalStock += s;
        if (s <= 0) outOfStockCount++;
      }
    });

    sizes.forEach(s => {
      if (s.value) {
        totalOptions++;
        const st = parseInt(s.stock, 10) || 0;
        totalStock += st;
        if (st <= 0) outOfStockCount++;
      }
    });

    customGroups.forEach(g => {
      (g.options || []).forEach(opt => {
        if (opt.value) {
          totalOptions++;
          const st = parseInt(opt.stock, 10) || 0;
          totalStock += st;
          if (st <= 0) outOfStockCount++;
        }
      });
    });

    return {
      totalOptions,
      totalStock,
      outOfStockCount,
      inStockCount: totalOptions - outOfStockCount,
    };
  }, [colors, sizes, customGroups]);

  // Selected Brand object
  const selectedBrand = useMemo(() => {
    if (!data.brand_id) return null;
    return brandList.find(b => String(b.id) === String(data.brand_id)) || null;
  }, [data.brand_id, brandList]);

  // Handle Quick Add Brand
  const handleCreateBrand = async (e) => {
    e.preventDefault();
    if (!newBrandName.trim()) {
      setBrandError('Please enter a brand name');
      return;
    }
    setSavingBrand(true);
    setBrandError('');

    try {
      const fd = new FormData();
      fd.append('name', newBrandName.trim());
      fd.append('is_active', '1');
      if (newBrandFile) {
        fd.append('logo', newBrandFile);
      }

      const res = await fetch('/admin/brands', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'X-Requested-With': 'XMLHttpRequest',
          'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
        },
        body: fd,
      });

      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.message || 'Failed to create brand');
      }

      if (json.brand) {
        setBrandList(prev => [...prev, json.brand]);
        setData(prev => ({
          ...prev,
          brand_id: json.brand.id,
          brand: json.brand.name,
          brand_image_preview: json.brand.logo_path ? imageUrl(json.brand.logo_path) : '',
        }));
      }

      setShowBrandModal(false);
      setNewBrandName('');
      setNewBrandFile(null);
      setNewBrandPreview('');
    } catch (err) {
      setBrandError(err.message || 'Could not save brand');
    } finally {
      setSavingBrand(false);
    }
  };

  const submit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const formData = new FormData();
      Object.entries(data).forEach(([k, v]) => {
        if (k === 'images' || k === 'brand_image_file' || k === 'brand_image_preview') return;
        if (typeof v === 'boolean') formData.append(k, v ? '1' : '0');
        else formData.append(k, v ?? '');
      });

      formData.append('product_type', productType);

      // Handle brand image file
      if (data.brand_image_file) {
        const b64 = await fileToBase64(data.brand_image_file);
        formData.append('brand_image_b64', b64);
        formData.append('brand_image_name', data.brand_image_file.name || 'brand_logo.jpg');
      }
      if (data.brand_image_remove) {
        formData.append('brand_image_remove', '1');
      }

      // Encode product gallery images to base64
      if (data.images && data.images.length > 0) {
        const imageFiles = Array.from(data.images);
        for (let i = 0; i < imageFiles.length; i++) {
          const file = imageFiles[i];
          const b64 = await fileToBase64(file);
          formData.append('images_b64[]', b64);
          formData.append('images_name[]', file.name || `image_${i}.jpg`);
        }
      }

      if (productType === 'variable') {
        // Color variants
        for (let i = 0; i < colors.length; i++) {
          const c = colors[i];
          formData.append(`color_variants[${i}][value]`, c.value || '');
          formData.append(`color_variants[${i}][color_code]`, c.color_code || '');
          if (c.regular_price !== undefined && c.regular_price !== '') {
            formData.append(`color_variants[${i}][regular_price]`, c.regular_price);
          }
          if (c.sale_price !== undefined && c.sale_price !== '') {
            formData.append(`color_variants[${i}][sale_price]`, c.sale_price);
          }
          formData.append(`color_variants[${i}][price_delta]`, c.price_delta || 0);
          formData.append(`color_variants[${i}][stock]`, c.stock || 0);
          if (c.image_file) {
            const b64 = await fileToBase64(c.image_file);
            formData.append(`color_variants[${i}][image_b64]`, b64);
            formData.append(`color_variants[${i}][image_name]`, c.image_file.name || `color_${i}.jpg`);
          } else if (c.image_path) {
            formData.append(`color_variants[${i}][image_path]`, c.image_path);
          }
        }

        // Size variants
        for (let i = 0; i < sizes.length; i++) {
          const s = sizes[i];
          formData.append(`size_variants[${i}][value]`, s.value || '');
          if (s.regular_price !== undefined && s.regular_price !== '') {
            formData.append(`size_variants[${i}][regular_price]`, s.regular_price);
          }
          if (s.sale_price !== undefined && s.sale_price !== '') {
            formData.append(`size_variants[${i}][sale_price]`, s.sale_price);
          }
          formData.append(`size_variants[${i}][price_delta]`, s.price_delta || 0);
          formData.append(`size_variants[${i}][stock]`, s.stock || 0);
          if (s.image_file) {
            const b64 = await fileToBase64(s.image_file);
            formData.append(`size_variants[${i}][image_b64]`, b64);
            formData.append(`size_variants[${i}][image_name]`, s.image_file.name || `size_${i}.jpg`);
          } else if (s.image_path) {
            formData.append(`size_variants[${i}][image_path]`, s.image_path);
          }
        }

        // Custom variant groups
        for (let g = 0; g < customGroups.length; g++) {
          const grp = customGroups[g];
          formData.append(`custom_variant_groups[${g}][name]`, grp.name || '');
          const opts = grp.options || [];
          for (let o = 0; o < opts.length; o++) {
            const opt = opts[o];
            formData.append(`custom_variant_groups[${g}][options][${o}][value]`, opt.value || '');
            if (opt.regular_price !== undefined && opt.regular_price !== '') {
              formData.append(`custom_variant_groups[${g}][options][${o}][regular_price]`, opt.regular_price);
            }
            if (opt.sale_price !== undefined && opt.sale_price !== '') {
              formData.append(`custom_variant_groups[${g}][options][${o}][sale_price]`, opt.sale_price);
            }
            formData.append(`custom_variant_groups[${g}][options][${o}][price_delta]`, opt.price_delta || 0);
            formData.append(`custom_variant_groups[${g}][options][${o}][stock]`, opt.stock || 0);
            if (opt.image_file) {
              const b64 = await fileToBase64(opt.image_file);
              formData.append(`custom_variant_groups[${g}][options][${o}][image_b64]`, b64);
              formData.append(`custom_variant_groups[${g}][options][${o}][image_name]`, opt.image_file.name || `custom_${g}_${o}.jpg`);
            } else if (opt.image_path) {
              formData.append(`custom_variant_groups[${g}][options][${o}][image_path]`, opt.image_path);
            }
          }
        }
      }

      // Specifications
      specs.forEach((s, i) => {
        formData.append(`spec_labels[${i}]`, s.label || '');
        formData.append(`spec_values[${i}]`, s.value || '');
      });

      const options = {
        forceFormData: true,
        onFinish: () => setSubmitting(false),
        onError: () => setSubmitting(false),
      };

      if (isEdit) {
        formData.append('_method', 'PUT');
        router.post(`/admin/products/${product.id}`, formData, options);
      } else {
        router.post('/admin/products', formData, options);
      }
    } catch (err) {
      setSubmitting(false);
      console.error(err);
    }
  };

  // Color Variant Handlers
  const addColor = (presetName = '', presetHex = '#000000') => {
    if (presetName && colors.some(c => c.value.toLowerCase() === presetName.toLowerCase())) return;
    setColors(prev => [
      ...prev,
      {
        value: presetName,
        color_code: presetHex,
        regular_price: '',
        sale_price: '',
        price_delta: 0,
        stock: 10,
        image_path: '',
        image_file: null,
        image_preview: ''
      }
    ]);
  };
  const removeColor = (i) => setColors(prev => prev.filter((_, idx) => idx !== i));
  const updateColor = (i, field, val) => setColors(prev => prev.map((c, idx) => idx === i ? { ...c, [field]: val } : c));
  const handleColorImageChange = (i, file) => {
    if (!file) return;
    const preview = URL.createObjectURL(file);
    setColors(prev => prev.map((c, idx) => idx === i ? { ...c, image_file: file, image_preview: preview } : c));
  };
  const removeColorImage = (i) => {
    setColors(prev => prev.map((c, idx) => idx === i ? { ...c, image_path: '', image_file: null, image_preview: '' } : c));
  };

  // Size Variant Handlers
  const addSize = (val = '') => {
    if (val && sizes.some(s => s.value.toLowerCase() === val.toLowerCase())) return;
    setSizes(prev => [
      ...prev,
      {
        value: val,
        regular_price: '',
        sale_price: '',
        price_delta: 0,
        stock: 10,
        image_path: '',
        image_file: null,
        image_preview: ''
      }
    ]);
  };
  const removeSize = (i) => setSizes(prev => prev.filter((_, idx) => idx !== i));
  const updateSize = (i, field, val) => setSizes(prev => prev.map((s, idx) => idx === i ? { ...s, [field]: val } : s));
  const handleSizeImageChange = (i, file) => {
    if (!file) return;
    const preview = URL.createObjectURL(file);
    setSizes(prev => prev.map((s, idx) => idx === i ? { ...s, image_file: file, image_preview: preview } : s));
  };
  const removeSizeImage = (i) => {
    setSizes(prev => prev.map((c, idx) => idx === i ? { ...c, image_path: '', image_file: null, image_preview: '' } : c));
  };

  // Custom Variant Groups
  const addCustomGroup = () => {
    setCustomGroups(prev => [
      ...prev,
      {
        name: '',
        options: [{
          value: '',
          regular_price: '',
          sale_price: '',
          price_delta: 0,
          stock: 10,
          image_path: '',
          image_file: null,
          image_preview: ''
        }]
      }
    ]);
  };
  const removeCustomGroup = (gIdx) => setCustomGroups(prev => prev.filter((_, idx) => idx !== gIdx));
  const updateCustomGroupName = (gIdx, name) => setCustomGroups(prev => prev.map((g, idx) => idx === gIdx ? { ...g, name } : g));

  const addCustomOption = (gIdx) => {
    setCustomGroups(prev => prev.map((g, idx) => idx === gIdx ? {
      ...g,
      options: [...g.options, {
        value: '',
        regular_price: '',
        sale_price: '',
        price_delta: 0,
        stock: 10,
        image_path: '',
        image_file: null,
        image_preview: ''
      }]
    } : g));
  };
  const removeCustomOption = (gIdx, optIdx) => {
    setCustomGroups(prev => prev.map((g, idx) => idx === gIdx ? {
      ...g,
      options: g.options.filter((_, i) => i !== optIdx)
    } : g));
  };
  const updateCustomOption = (gIdx, optIdx, field, val) => {
    setCustomGroups(prev => prev.map((g, idx) => idx === gIdx ? {
      ...g,
      options: g.options.map((opt, i) => i === optIdx ? { ...opt, [field]: val } : opt)
    } : g));
  };
  const handleCustomOptionImageChange = (gIdx, optIdx, file) => {
    if (!file) return;
    const preview = URL.createObjectURL(file);
    setCustomGroups(prev => prev.map((g, idx) => idx === gIdx ? {
      ...g,
      options: g.options.map((opt, i) => i === optIdx ? { ...opt, image_file: file, image_preview: preview } : opt)
    } : g));
  };
  const removeCustomOptionImage = (gIdx, optIdx) => {
    setCustomGroups(prev => prev.map((g, idx) => idx === gIdx ? {
      ...g,
      options: g.options.map((opt, i) => i === optIdx ? { ...opt, image_path: '', image_file: null, image_preview: '' } : opt)
    } : g));
  };

  // Specs Handlers
  const addSpec = () => setSpecs(prev => [...prev, { label: '', value: '' }]);
  const removeSpec = (i) => setSpecs(prev => prev.filter((_, idx) => idx !== i));
  const updateSpec = (i, field, val) => setSpecs(prev => prev.map((s, idx) => idx === i ? { ...s, [field]: val } : s));

  const handleDeleteImage = (imageId) => {
    if (confirm('Are you sure you want to remove this image?')) {
      router.delete(`/admin/products/${product.id}/images/${imageId}`, { preserveScroll: true });
    }
  };

  return (
    <>
      <Head title={isEdit ? `Edit: ${product.name}` : 'Add New Product'} />
      <AdminLayout title={isEdit ? 'Edit Product' : 'Add New Product'}>
        <form id="product-form" onSubmit={submit} className="max-w-6xl mx-auto space-y-6 pb-24 sm:pb-16">
          
          {/* Top Bar / Navigation & Quick Actions */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white border border-gray-200/80 rounded-2xl p-4 shadow-xs">
            <div className="flex items-center gap-3">
              <a
                href="/admin/products"
                className="w-9 h-9 rounded-xl bg-gray-50 border border-gray-200 hover:bg-gray-100 flex items-center justify-center text-gray-600 transition-colors shrink-0"
                title="Back to products list"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.2"><path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
              </a>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-lg sm:text-xl font-extrabold text-gray-900 tracking-tight">
                    {isEdit ? 'পণ্য এডিট করুন' : 'নতুন পণ্য যুক্ত করুন'}
                  </h1>
                  <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full border ${
                    data.is_published ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-amber-50 text-amber-700 border-amber-200'
                  }`}>
                    {data.is_published ? 'Live / Active' : 'Draft / Inactive'}
                  </span>
                </div>
                <p className="text-xs text-gray-500 mt-0.5">
                  {isEdit ? `ID: #${product.id} • SKU: ${product.sku || 'N/A'}` : 'পণ্যটির বিস্তারিত তথ্য, মূল্য, স্টক ও ছবি পূরণ করুন'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2.5 self-end sm:self-auto">
              {isEdit && product.slug && (
                <a
                  href={`/product/${product.slug}`}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3.5 py-2 rounded-xl text-xs font-bold text-gray-700 bg-gray-50 hover:bg-gray-100 border border-gray-200 transition-colors flex items-center gap-1.5"
                >
                  <svg className="w-3.5 h-3.5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                  <span>View in Store</span>
                </a>
              )}
              <button
                type="submit"
                disabled={processing || submitting}
                className="px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold text-white bg-[#f15a24] hover:bg-[#d94a1a] shadow-sm shadow-[#f15a24]/30 disabled:opacity-60 transition-all flex items-center gap-2 cursor-pointer"
              >
                {(processing || submitting) && (
                  <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>
                )}
                <span>{processing || submitting ? 'সংরক্ষণ হচ্ছে...' : (isEdit ? 'আপডেট করুন (Save)' : 'পণ্য প্রকাশ করুন')}</span>
              </button>
            </div>
          </div>

          {/* Main Grid: 2 Columns on desktop */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* Left Main Content (8 cols) */}
            <div className="lg:col-span-8 space-y-6">

              {/* 1. Basic Information */}
              <FormCard
                title="Basic Information (মূল তথ্য)"
                subtitle="পণ্যের নাম, ক্যাটাগরি ও ব্র্যান্ড নির্ধারণ করুন"
                icon={<svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>}
              >
                <div className="space-y-4">
                  <Field label="Product Name (পণ্যের নাম)" required error={errors.name}>
                    <input
                      value={data.name}
                      onChange={e => setData('name', e.target.value)}
                      className={inputClass}
                      required
                      placeholder="যেমন: প্রিমিয়াম ফুল স্লিভ ক্যাজুয়াল শার্ট"
                    />
                  </Field>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Field label="Category (ক্যাটাগরি)" required error={errors.category_id}>
                      <select
                        value={data.category_id}
                        onChange={e => setData('category_id', e.target.value)}
                        className={inputClass}
                        required
                      >
                        <option value="">ক্যাটাগরি নির্বাচন করুন…</option>
                        {categories.map(c => (
                          <option key={c.id} value={c.id}>{c.name}</option>
                        ))}
                      </select>
                    </Field>

                    {/* Brand Selector with Quick Add */}
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">
                          Brand (ব্র্যান্ড)
                        </label>
                        <button
                          type="button"
                          onClick={() => setShowBrandModal(true)}
                          className="text-[11px] font-bold text-[#f15a24] hover:underline cursor-pointer flex items-center gap-1"
                        >
                          + Quick Add Brand
                        </button>
                      </div>
                      <select
                        value={data.brand_id || ''}
                        onChange={e => {
                          const val = e.target.value;
                          const b = brandList.find(x => String(x.id) === String(val));
                          setData(prev => ({
                            ...prev,
                            brand_id: val,
                            brand: b ? b.name : prev.brand,
                            brand_image_preview: b?.logo_path ? imageUrl(b.logo_path) : prev.brand_image_preview,
                          }));
                        }}
                        className={inputClass}
                      >
                        <option value="">ব্র্যান্ড নির্বাচন করুন (অথবা নো-ব্র্যান্ড)…</option>
                        {brandList.map(b => (
                          <option key={b.id} value={b.id}>{b.name}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Brand Preview Card if selected */}
                  {selectedBrand && (
                    <div className="flex items-center justify-between p-3 rounded-xl bg-orange-50/50 border border-orange-200/70">
                      <div className="flex items-center gap-3">
                        {selectedBrand.logo_path ? (
                          <img
                            src={imageUrl(selectedBrand.logo_path)}
                            alt={selectedBrand.name}
                            className="w-9 h-9 object-contain rounded-lg bg-white border border-orange-200 p-1 shrink-0"
                          />
                        ) : (
                          <div className="w-9 h-9 rounded-lg bg-orange-500 text-white font-bold flex items-center justify-center text-sm">
                            {selectedBrand.name.charAt(0)}
                          </div>
                        )}
                        <div>
                          <p className="text-xs font-bold text-gray-900">{selectedBrand.name}</p>
                          <p className="text-[11px] text-gray-500">সংযুক্ত ব্র্যান্ডের লোগো ও নাম স্টোরে প্রদর্শিত হবে</p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => setData(prev => ({ ...prev, brand_id: '', brand: '' }))}
                        className="text-xs text-red-500 hover:text-red-700 font-semibold cursor-pointer"
                      >
                        Clear
                      </button>
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Field label="SKU (প্রোডাক্ট কোড)" error={errors.sku} hint="Stock Keeping Unit">
                      <input
                        value={data.sku}
                        onChange={e => setData('sku', e.target.value)}
                        className={inputClass}
                        placeholder="যেমন: SHT-BLK-01"
                      />
                    </Field>
                    <Field label="Slug (URL)" error={errors.slug} hint="খালি রাখলে নাম থেকে তৈরি হবে">
                      <input
                        value={data.slug}
                        onChange={e => setData('slug', e.target.value)}
                        className={inputClass}
                        placeholder="auto-generated-from-name"
                      />
                    </Field>
                  </div>

                  <Field label="Short Highlights / সারসংক্ষেপ" error={errors.short_description}>
                    <RichTextEditor
                      value={data.short_description}
                      onChange={val => setData('short_description', val)}
                      placeholder="পণ্যটির বিশেষ বৈশিষ্ট্য ও সংক্ষেপ লিখুন..."
                      minHeight="100px"
                    />
                  </Field>

                  <Field label="Full Description / বিস্তারিত বিবরণ" error={errors.description}>
                    <RichTextEditor
                      value={data.description}
                      onChange={val => setData('description', val)}
                      placeholder="পণ্যটির সম্পূর্ণ বিবরণ, ব্যবহারের নিয়ম ইত্যাদি..."
                      minHeight="200px"
                    />
                  </Field>
                </div>
              </FormCard>

              {/* 2. Pricing & Variations System */}
              <FormCard
                title="Pricing & Variations (মূল্য ও ভ্যারিয়েন্ট স্টক)"
                subtitle="একক পণ্য অথবা সাইজ ও কালার ভিত্তিক ভ্যারিয়েন্ট নির্বাচন করুন"
                icon={<svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M7 7h.01M7 3h5a1.99 1.99 0 011.414.586l7 7a2 2 0 010 2.828l-5 5a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 10V5a2 2 0 012-2z" /></svg>}
                action={
                  <div className="inline-flex p-1 bg-gray-100 rounded-xl">
                    <button
                      type="button"
                      onClick={() => setProductType('simple')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        productType === 'simple'
                          ? 'bg-white text-gray-900 shadow-xs'
                          : 'text-gray-500 hover:text-gray-900'
                      }`}
                    >
                      Simple (একক)
                    </button>
                    <button
                      type="button"
                      onClick={() => setProductType('variable')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        productType === 'variable'
                          ? 'bg-[#f15a24] text-white shadow-xs'
                          : 'text-gray-500 hover:text-gray-900'
                      }`}
                    >
                      Variable (ভ্যারিয়েন্ট)
                    </button>
                  </div>
                }
              >
                {/* ── CASE A: SIMPLE PRODUCT ── */}
                {productType === 'simple' ? (
                  <div className="space-y-4 pt-1">
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                      <Field label="Regular Price (৳)" required error={errors.regular_price} hint="মূল দাম">
                        <input
                          type="number"
                          min="0"
                          step="0.01"
                          value={data.regular_price}
                          onChange={e => setData('regular_price', e.target.value)}
                          onFocus={e => e.target.select()}
                          className={inputClass}
                          required
                          placeholder="0.00"
                        />
                      </Field>
                      <Field label="Sale Price (৳)" error={errors.sale_price} hint="অফার মূল্য (ঐচ্ছিক)">
                        <input
                          type="number"
                          min="0"
                          step="0.01"
                          value={data.sale_price}
                          onChange={e => setData('sale_price', e.target.value)}
                          onFocus={e => e.target.select()}
                          className={inputClass}
                          placeholder="Optional"
                        />
                      </Field>
                      <Field label="Stock Qty" required error={errors.stock_quantity} hint="মজুদ পরিমাণ">
                        <input
                          type="number"
                          min="0"
                          value={data.stock_quantity}
                          onChange={e => setData('stock_quantity', e.target.value)}
                          onFocus={e => e.target.select()}
                          className={inputClass}
                          required
                          placeholder="0"
                        />
                      </Field>
                      <Field label="Unit (একক)" error={errors.unit} hint="যেমন: pcs, kg">
                        <input
                          value={data.unit}
                          onChange={e => setData('unit', e.target.value)}
                          className={inputClass}
                          placeholder="pcs, box, kg"
                        />
                      </Field>
                    </div>

                    {/* Live Stock Pill for Simple Product */}
                    <div className="flex items-center gap-2 pt-2">
                      <span className="text-xs text-gray-500">স্টক অবস্থা:</span>
                      {parseInt(data.stock_quantity, 10) > 0 ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                          In Stock ({data.stock_quantity} টি উপলব্ধ)
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-50 text-rose-700 border border-rose-200">
                          <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
                          Out of Stock (স্টক নেই / শূন্য)
                        </span>
                      )}
                    </div>
                  </div>
                ) : (
                  /* ── CASE B: VARIABLE PRODUCT ── */
                  <div className="space-y-6 pt-1">
                    {/* Catalog Starting Price Bar */}
                    <div className="p-4 bg-orange-50/40 border border-orange-100 rounded-xl">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-3">
                        <span className="text-xs font-bold text-gray-900">Catalog Base Price (প্রদর্শনীয় প্রারম্ভিক মূল্য)</span>
                        <span className="text-[11px] text-gray-500">ক্যাটালগ লিস্টে যে মূল্যে পণ্যটি শুরু হবে</span>
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        <div>
                          <label className="block text-[11px] font-semibold text-gray-600 mb-1">Base Regular (৳)</label>
                          <input
                            type="number"
                            min="0"
                            step="0.01"
                            value={data.regular_price}
                            onChange={e => setData('regular_price', e.target.value)}
                            onFocus={e => e.target.select()}
                            className={inputClass}
                            placeholder="0.00"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-semibold text-gray-600 mb-1">Base Sale (৳, optional)</label>
                          <input
                            type="number"
                            min="0"
                            step="0.01"
                            value={data.sale_price}
                            onChange={e => setData('sale_price', e.target.value)}
                            onFocus={e => e.target.select()}
                            className={inputClass}
                            placeholder="Optional"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-semibold text-gray-600 mb-1">Unit (একক)</label>
                          <input
                            value={data.unit}
                            onChange={e => setData('unit', e.target.value)}
                            className={inputClass}
                            placeholder="pcs, pair"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Variant Inventory Summary Bar */}
                    <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-xs">
                      <div className="flex items-center gap-4">
                        <span className="font-semibold text-slate-700">মোট অপশন: <strong>{variantMetrics.totalOptions}</strong></span>
                        <span className="text-slate-300">|</span>
                        <span className="font-semibold text-emerald-700">স্টকে আছে: <strong>{variantMetrics.inStockCount}</strong></span>
                        <span className="text-slate-300">|</span>
                        <span className="font-semibold text-rose-600">স্টক শেষ: <strong>{variantMetrics.outOfStockCount}</strong></span>
                      </div>
                      <div className="font-bold text-slate-900 bg-white px-2.5 py-1 rounded-lg border border-slate-200 shadow-2xs">
                        মোট ভ্যারিয়েন্ট স্টক: {variantMetrics.totalStock} pcs
                      </div>
                    </div>

                    {/* 1. Color Variants */}
                    <div className="border border-gray-200/90 rounded-2xl p-4 sm:p-5 bg-white space-y-4">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-gray-100">
                        <div>
                          <h4 className="font-bold text-gray-900 text-sm flex items-center gap-2">
                            <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
                            Color Variations (কালার অপশন)
                          </h4>
                          <p className="text-[11px] text-gray-500 mt-0.5">কালার নির্বাচন করুন, স্টক ও আলাদা ছবি যুক্ত করুন।</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => addColor()}
                          className="px-3 py-1.5 bg-orange-50 hover:bg-orange-100 text-[#f15a24] text-xs font-bold rounded-xl transition-all cursor-pointer self-start sm:self-auto"
                        >
                          + Add Color
                        </button>
                      </div>

                      {/* Quick Add Presets */}
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="text-[11px] text-gray-400 font-medium">Quick Presets:</span>
                        {COLOR_PRESETS.map(p => (
                          <button
                            key={p.name}
                            type="button"
                            onClick={() => addColor(p.name, p.hex)}
                            className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-lg text-xs font-semibold text-gray-700 transition-colors cursor-pointer"
                          >
                            <span className="w-2.5 h-2.5 rounded-full border border-black/20 shrink-0" style={{ backgroundColor: p.hex }} />
                            {p.name}
                          </button>
                        ))}
                      </div>

                      {/* Colors List */}
                      <div className="space-y-3 pt-1">
                        {colors.map((c, i) => {
                          const stockNum = Math.max(0, parseInt(c.stock, 10) || 0);
                          const isOut = stockNum === 0;

                          return (
                            <div key={i} className="flex flex-wrap sm:flex-nowrap gap-3 items-center p-3 bg-gray-50/70 hover:bg-gray-50 rounded-xl border border-gray-200/80 transition-colors">
                              {/* Swatch */}
                              <div className="flex items-center gap-1.5 shrink-0" title="Click to change color swatch">
                                <input
                                  type="color"
                                  value={c.color_code || '#000000'}
                                  onChange={e => updateColor(i, 'color_code', e.target.value)}
                                  className="w-8 h-8 p-0 rounded-lg border border-gray-300 cursor-pointer overflow-hidden shrink-0"
                                />
                              </div>

                              {/* Thumbnail */}
                              <div className="relative shrink-0">
                                {c.image_preview ? (
                                  <div className="relative group w-8 h-8 rounded-lg overflow-hidden border border-orange-300 bg-white">
                                    <img src={c.image_preview} alt="Color" className="w-full h-full object-cover" />
                                    <button
                                      type="button"
                                      onClick={() => removeColorImage(i)}
                                      className="absolute inset-0 bg-red-600/80 text-white opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity cursor-pointer"
                                      title="Remove"
                                    >
                                      <svg className="w-3.5 h-3.5 stroke-current" viewBox="0 0 24 24" fill="none" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                                    </button>
                                  </div>
                                ) : (
                                  <label className="w-8 h-8 rounded-lg border border-dashed border-gray-300 hover:border-[#f15a24] bg-white flex flex-col items-center justify-center cursor-pointer transition-colors" title="Upload image for this color">
                                    <svg className="w-3.5 h-3.5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"/></svg>
                                    <input type="file" accept="image/*" className="hidden" onChange={e => handleColorImageChange(i, e.target.files[0])} />
                                  </label>
                                )}
                              </div>

                              {/* Color Name */}
                              <div className="flex-1 min-w-[120px]">
                                <input
                                  value={c.value}
                                  onChange={e => updateColor(i, 'value', e.target.value)}
                                  placeholder="Color name (e.g. Royal Blue)"
                                  className="w-full bg-white border border-gray-200 rounded-lg px-3 py-1.5 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-[#f15a24]"
                                />
                              </div>

                              {/* Regular Price */}
                              <div className="flex items-center gap-1 bg-white border border-gray-200 rounded-lg px-2.5 py-1.5 w-28 sm:w-32 shrink-0" title="Regular Price for this color">
                                <span className="text-[10px] font-bold text-gray-500 shrink-0">Reg: ৳</span>
                                <input
                                  type="number"
                                  min="0"
                                  step="any"
                                  value={c.regular_price}
                                  onChange={e => updateColor(i, 'regular_price', e.target.value)}
                                  placeholder={data.regular_price || "0"}
                                  className="w-full text-xs font-bold text-gray-900 bg-transparent border-0 p-0 focus:ring-0 focus:outline-none"
                                />
                              </div>

                              {/* Sale / Discount Price */}
                              <div className="flex items-center gap-1 bg-white border border-gray-200 rounded-lg px-2.5 py-1.5 w-28 sm:w-32 shrink-0" title="Sale / Discount Price (Optional)">
                                <span className="text-[10px] font-bold text-emerald-600 shrink-0">Sale: ৳</span>
                                <input
                                  type="number"
                                  min="0"
                                  step="any"
                                  value={c.sale_price}
                                  onChange={e => updateColor(i, 'sale_price', e.target.value)}
                                  placeholder="Optional"
                                  className="w-full text-xs font-bold text-emerald-700 bg-transparent border-0 p-0 focus:ring-0 focus:outline-none placeholder:text-gray-300 placeholder:font-normal"
                                />
                              </div>

                              {/* Discount Badge if sale price is active */}
                              {Boolean(c.sale_price && c.regular_price && parseFloat(c.sale_price) > 0 && parseFloat(c.sale_price) < parseFloat(c.regular_price)) && (
                                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded shrink-0 hidden md:inline-block" title="Discount percentage">
                                  -{Math.round(((parseFloat(c.regular_price) - parseFloat(c.sale_price)) / parseFloat(c.regular_price)) * 100)}%
                                </span>
                              )}

                              {/* Stock Input & Status Pill */}
                              <div className="flex items-center gap-2 shrink-0">
                                <div className="flex items-center gap-1 bg-white border border-gray-200 rounded-lg px-2 py-1.5 w-24" title="Stock quantity for this color">
                                  <span className="text-[10px] text-gray-400 font-medium">Qty:</span>
                                  <input
                                    type="number"
                                    min="0"
                                    value={c.stock}
                                    onChange={e => updateColor(i, 'stock', e.target.value)}
                                    placeholder="0"
                                    className="w-full text-xs font-bold text-gray-900 bg-transparent border-0 p-0 focus:ring-0 focus:outline-none"
                                  />
                                </div>
                                <span className={`text-[10px] font-bold px-2 py-1 rounded-md border shrink-0 ${
                                  isOut ? 'bg-rose-50 text-rose-600 border-rose-200' : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                }`}>
                                  {isOut ? 'স্টক শেষ' : 'In Stock'}
                                </span>
                              </div>

                              {/* Delete */}
                              <button
                                type="button"
                                onClick={() => removeColor(i)}
                                className="w-8 h-8 rounded-lg text-gray-400 hover:text-rose-600 hover:bg-rose-50 flex items-center justify-center transition-colors shrink-0 cursor-pointer"
                                title="Remove color"
                              >
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                              </button>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* 2. Size Variants */}
                    <div className="border border-gray-200/90 rounded-2xl p-4 sm:p-5 bg-white space-y-4">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-gray-100">
                        <div>
                          <h4 className="font-bold text-gray-900 text-sm flex items-center gap-2">
                            <span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span>
                            Size Variations (সাইজ অপশন)
                          </h4>
                          <p className="text-[11px] text-gray-500 mt-0.5">সাইজ (M, L, XL, 32, 42 ইত্যাদি) যুক্ত করুন এবং মজুদ নির্ধারণ করুন।</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => addSize()}
                          className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-bold rounded-xl transition-all cursor-pointer self-start sm:self-auto"
                        >
                          + Add Size
                        </button>
                      </div>

                      {/* Quick Add Presets */}
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="text-[11px] text-gray-400 font-medium">Quick Presets:</span>
                        {SIZE_PRESETS.map(sz => (
                          <button
                            key={sz}
                            type="button"
                            onClick={() => addSize(sz)}
                            className="px-2.5 py-1 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-lg text-xs font-semibold text-gray-700 transition-colors cursor-pointer"
                          >
                            {sz}
                          </button>
                        ))}
                      </div>

                      {/* Sizes List */}
                      <div className="space-y-3 pt-1">
                        {sizes.map((s, i) => {
                          const stockNum = Math.max(0, parseInt(s.stock, 10) || 0);
                          const isOut = stockNum === 0;

                          return (
                            <div key={i} className="flex flex-wrap sm:flex-nowrap gap-3 items-center p-3 bg-gray-50/70 hover:bg-gray-50 rounded-xl border border-gray-200/80 transition-colors">
                              {/* Thumbnail */}
                              <div className="relative shrink-0">
                                {s.image_preview ? (
                                  <div className="relative group w-8 h-8 rounded-lg overflow-hidden border border-blue-300 bg-white">
                                    <img src={s.image_preview} alt="Size" className="w-full h-full object-cover" />
                                    <button
                                      type="button"
                                      onClick={() => removeSizeImage(i)}
                                      className="absolute inset-0 bg-red-600/80 text-white opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity cursor-pointer"
                                      title="Remove"
                                    >
                                      <svg className="w-3.5 h-3.5 stroke-current" viewBox="0 0 24 24" fill="none" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                                    </button>
                                  </div>
                                ) : (
                                  <label className="w-8 h-8 rounded-lg border border-dashed border-gray-300 hover:border-blue-400 bg-white flex flex-col items-center justify-center cursor-pointer transition-colors" title="Upload image for this size">
                                    <svg className="w-3.5 h-3.5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"/></svg>
                                    <input type="file" accept="image/*" className="hidden" onChange={e => handleSizeImageChange(i, e.target.files[0])} />
                                  </label>
                                )}
                              </div>

                              {/* Size Value */}
                              <div className="flex-1 min-w-[120px]">
                                <input
                                  value={s.value}
                                  onChange={e => updateSize(i, 'value', e.target.value)}
                                  placeholder="Size (e.g. M, XL, 34)"
                                  className="w-full bg-white border border-gray-200 rounded-lg px-3 py-1.5 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-blue-500"
                                />
                              </div>

                              {/* Regular Price */}
                              <div className="flex items-center gap-1 bg-white border border-gray-200 rounded-lg px-2.5 py-1.5 w-28 sm:w-32 shrink-0" title="Regular Price (৳)">
                                <span className="text-[10px] font-bold text-gray-400 shrink-0">Reg: ৳</span>
                                <input
                                  type="number"
                                  min="0"
                                  step="any"
                                  value={s.regular_price}
                                  onChange={e => updateSize(i, 'regular_price', e.target.value)}
                                  placeholder={data.regular_price || "0"}
                                  className="w-full text-xs font-bold text-gray-900 bg-transparent border-0 p-0 focus:ring-0 focus:outline-none"
                                />
                              </div>

                              {/* Sale / Discount Price */}
                              <div className="flex items-center gap-1 bg-white border border-gray-200 rounded-lg px-2.5 py-1.5 w-28 sm:w-32 shrink-0" title="Sale / Discount Price (Optional)">
                                <span className="text-[10px] font-bold text-emerald-600 shrink-0">Sale: ৳</span>
                                <input
                                  type="number"
                                  min="0"
                                  step="any"
                                  value={s.sale_price}
                                  onChange={e => updateSize(i, 'sale_price', e.target.value)}
                                  placeholder="Optional"
                                  className="w-full text-xs font-bold text-emerald-700 bg-transparent border-0 p-0 focus:ring-0 focus:outline-none placeholder:text-gray-300 placeholder:font-normal"
                                />
                              </div>

                              {/* Discount Badge if sale price is active */}
                              {Boolean(s.sale_price && s.regular_price && parseFloat(s.sale_price) > 0 && parseFloat(s.sale_price) < parseFloat(s.regular_price)) && (
                                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded shrink-0 hidden md:inline-block" title="Discount percentage">
                                  -{Math.round(((parseFloat(s.regular_price) - parseFloat(s.sale_price)) / parseFloat(s.regular_price)) * 100)}%
                                </span>
                              )}

                              {/* Stock Input & Status Pill */}
                              <div className="flex items-center gap-2 shrink-0">
                                <div className="flex items-center gap-1 bg-white border border-gray-200 rounded-lg px-2 py-1.5 w-24" title="Stock quantity for this size">
                                  <span className="text-[10px] text-gray-400 font-medium">Qty:</span>
                                  <input
                                    type="number"
                                    min="0"
                                    value={s.stock}
                                    onChange={e => updateSize(i, 'stock', e.target.value)}
                                    placeholder="0"
                                    className="w-full text-xs font-bold text-gray-900 bg-transparent border-0 p-0 focus:ring-0 focus:outline-none"
                                  />
                                </div>
                                <span className={`text-[10px] font-bold px-2 py-1 rounded-md border shrink-0 ${
                                  isOut ? 'bg-rose-50 text-rose-600 border-rose-200' : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                }`}>
                                  {isOut ? 'স্টক শেষ' : 'In Stock'}
                                </span>
                              </div>

                              {/* Delete */}
                              <button
                                type="button"
                                onClick={() => removeSize(i)}
                                className="w-8 h-8 rounded-lg text-gray-400 hover:text-rose-600 hover:bg-rose-50 flex items-center justify-center transition-colors shrink-0 cursor-pointer"
                                title="Remove size"
                              >
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                              </button>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* 3. Custom Variant Groups */}
                    <div className="space-y-4">
                      {customGroups.map((group, gIdx) => (
                        <div key={gIdx} className="border border-purple-200 rounded-2xl p-4 sm:p-5 bg-white space-y-4">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-purple-100">
                            <div className="flex items-center gap-2 flex-1 max-w-sm">
                              <span className="w-2.5 h-2.5 rounded-full bg-purple-500 shrink-0"></span>
                              <input
                                value={group.name}
                                onChange={e => updateCustomGroupName(gIdx, e.target.value)}
                                placeholder="Group Name (e.g. Storage, Pack, Material)"
                                className="w-full bg-purple-50/50 border border-purple-200 rounded-xl px-3 py-1.5 text-xs font-bold text-purple-950 focus:outline-none focus:ring-1 focus:ring-purple-400"
                              />
                            </div>
                            <div className="flex items-center gap-2">
                              <button
                                type="button"
                                onClick={() => addCustomOption(gIdx)}
                                className="px-3 py-1 bg-purple-50 hover:bg-purple-100 text-purple-700 text-xs font-bold rounded-lg transition-colors cursor-pointer"
                              >
                                + Add Option
                              </button>
                              <button
                                type="button"
                                onClick={() => removeCustomGroup(gIdx)}
                                className="text-xs text-rose-500 hover:text-rose-700 font-semibold px-2 py-1 rounded hover:bg-rose-50 transition-colors cursor-pointer"
                              >
                                Delete Group
                              </button>
                            </div>
                          </div>

                          <div className="space-y-3">
                            {group.options.map((opt, optIdx) => {
                              const stockNum = Math.max(0, parseInt(opt.stock, 10) || 0);
                              const isOut = stockNum === 0;

                              return (
                                <div key={optIdx} className="flex flex-wrap sm:flex-nowrap gap-3 items-center p-3 bg-purple-50/30 rounded-xl border border-purple-100">
                                  <div className="flex-1 min-w-[120px]">
                                    <input
                                      value={opt.value}
                                      onChange={e => updateCustomOption(gIdx, optIdx, 'value', e.target.value)}
                                      placeholder="Option Value (e.g. 128GB, Pack of 3)"
                                      className="w-full bg-white border border-gray-200 rounded-lg px-3 py-1.5 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-purple-400"
                                    />
                                  </div>

                                  {/* Regular Price */}
                                  <div className="flex items-center gap-1 bg-white border border-purple-200 rounded-lg px-2.5 py-1.5 w-28 sm:w-32 shrink-0" title="Regular Price (৳)">
                                    <span className="text-[10px] font-bold text-gray-400 shrink-0">Reg: ৳</span>
                                    <input
                                      type="number"
                                      min="0"
                                      step="any"
                                      value={opt.regular_price}
                                      onChange={e => updateCustomOption(gIdx, optIdx, 'regular_price', e.target.value)}
                                      placeholder={data.regular_price || "0"}
                                      className="w-full text-xs font-bold text-gray-900 bg-transparent border-0 p-0 focus:ring-0 focus:outline-none"
                                    />
                                  </div>

                                  {/* Sale / Discount Price */}
                                  <div className="flex items-center gap-1 bg-white border border-purple-200 rounded-lg px-2.5 py-1.5 w-28 sm:w-32 shrink-0" title="Sale / Discount Price (Optional)">
                                    <span className="text-[10px] font-bold text-emerald-600 shrink-0">Sale: ৳</span>
                                    <input
                                      type="number"
                                      min="0"
                                      step="any"
                                      value={opt.sale_price}
                                      onChange={e => updateCustomOption(gIdx, optIdx, 'sale_price', e.target.value)}
                                      placeholder="Optional"
                                      className="w-full text-xs font-bold text-emerald-700 bg-transparent border-0 p-0 focus:ring-0 focus:outline-none placeholder:text-gray-300 placeholder:font-normal"
                                    />
                                  </div>

                                  {/* Discount Badge if sale price is active */}
                                  {Boolean(opt.sale_price && opt.regular_price && parseFloat(opt.sale_price) > 0 && parseFloat(opt.sale_price) < parseFloat(opt.regular_price)) && (
                                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded shrink-0 hidden md:inline-block" title="Discount percentage">
                                      -{Math.round(((parseFloat(opt.regular_price) - parseFloat(opt.sale_price)) / parseFloat(opt.regular_price)) * 100)}%
                                    </span>
                                  )}

                                  <div className="flex items-center gap-2 shrink-0">
                                    <div className="flex items-center gap-1 bg-white border border-gray-200 rounded-lg px-2 py-1.5 w-24" title="Stock quantity">
                                      <span className="text-[10px] text-gray-400 font-medium">Qty:</span>
                                      <input
                                        type="number"
                                        min="0"
                                        value={opt.stock}
                                        onChange={e => updateCustomOption(gIdx, optIdx, 'stock', e.target.value)}
                                        placeholder="0"
                                        className="w-full text-xs font-bold text-gray-900 bg-transparent border-0 p-0 focus:ring-0 focus:outline-none"
                                      />
                                    </div>
                                    <span className={`text-[10px] font-bold px-2 py-1 rounded-md border shrink-0 ${
                                      isOut ? 'bg-rose-50 text-rose-600 border-rose-200' : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                    }`}>
                                      {isOut ? 'স্টক শেষ' : 'In Stock'}
                                    </span>
                                  </div>

                                  <button
                                    type="button"
                                    onClick={() => removeCustomOption(gIdx, optIdx)}
                                    className="w-8 h-8 rounded-lg text-gray-400 hover:text-rose-600 hover:bg-rose-50 flex items-center justify-center transition-colors shrink-0 cursor-pointer"
                                  >
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>
                                  </button>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      ))}

                      <button
                        type="button"
                        onClick={addCustomGroup}
                        className="w-full py-3.5 border-2 border-dashed border-gray-200 hover:border-[#f15a24] text-gray-600 hover:text-[#f15a24] rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer bg-gray-50/50 hover:bg-orange-50/30"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4"/></svg>
                        <span>+ Add Custom Variant Type (যেমন: Storage, Edition, Pack, Material)</span>
                      </button>
                    </div>
                  </div>
                )}
              </FormCard>

              {/* 3. Product Gallery Images */}
              <FormCard
                title="Product Media Gallery (পণ্যের ছবি)"
                subtitle="উচ্চমানের ছবি আপলোড করুন। প্রথম ছবিটি কভার/প্রাইমারি হিসেবে প্রদর্শিত হবে।"
                icon={<svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>}
              >
                {/* Existing Images */}
                {(product.images || []).length > 0 && (
                  <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-6 gap-3 mb-4">
                    {product.images.map(img => (
                      <div key={img.id} className="relative group rounded-xl overflow-hidden border border-gray-200 aspect-square bg-gray-50">
                        <img src={imageUrl(img.path, product.name)} alt="" className="w-full h-full object-cover" />
                        {img.is_primary && (
                          <span className="absolute top-1.5 left-1.5 bg-[#f15a24] text-white text-[9px] font-black px-1.5 py-0.5 rounded shadow-xs">
                            Primary
                          </span>
                        )}
                        <button
                          type="button"
                          onClick={() => handleDeleteImage(img.id)}
                          className="absolute top-1.5 right-1.5 h-6 w-6 bg-red-600 text-white rounded-lg opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity cursor-pointer shadow-xs"
                          title="Delete image"
                        >
                          <svg className="w-3 h-3 stroke-current" viewBox="0 0 24 24" fill="none" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                <label className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-gray-200 hover:border-[#f15a24] rounded-2xl cursor-pointer transition-colors bg-gray-50/50 hover:bg-orange-50/20 group">
                  <div className="w-10 h-10 rounded-full bg-orange-50 text-[#f15a24] flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"/></svg>
                  </div>
                  <span className="text-sm font-bold text-gray-700">Click to upload product gallery images</span>
                  <span className="text-xs text-gray-400 mt-0.5">PNG, JPG, WebP up to 5MB (multiple files allowed)</span>
                  <input type="file" multiple accept="image/*" className="hidden" onChange={e => setData('images', e.target.files)} />
                </label>

                {/* Selected Files Preview List */}
                {data.images && data.images.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-3">
                    {Array.from(data.images).map((file, i) => (
                      <div key={i} className="text-xs font-semibold bg-orange-50 text-orange-700 px-3 py-1.5 rounded-lg border border-orange-200 flex items-center gap-1.5">
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
                        <span className="truncate max-w-[140px]">{file.name}</span>
                      </div>
                    ))}
                  </div>
                )}
              </FormCard>

              {/* 4. Specifications */}
              <FormCard
                title="Specifications (টেকনিক্যাল স্পেসিফিকেশন)"
                subtitle="যেমন: Material, Warranty, Weight, Dimensions ইত্যাদি তথ্য যুক্ত করুন"
                icon={<svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"/></svg>}
              >
                <div className="space-y-3">
                  {specs.map((s, i) => (
                    <div key={i} className="flex gap-2.5 items-center">
                      <input
                        value={s.label}
                        onChange={e => updateSpec(i, 'label', e.target.value)}
                        placeholder="Label (e.g. Material, Warranty)"
                        className="flex-1 bg-white border border-gray-200 rounded-xl px-3.5 py-2 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-[#f15a24]"
                      />
                      <input
                        value={s.value}
                        onChange={e => updateSpec(i, 'value', e.target.value)}
                        placeholder="Value (e.g. 100% Cotton, 1 Year)"
                        className="flex-1 bg-white border border-gray-200 rounded-xl px-3.5 py-2 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-[#f15a24]"
                      />
                      <button
                        type="button"
                        onClick={() => removeSpec(i)}
                        className="h-9 w-9 rounded-xl text-gray-400 hover:text-rose-600 hover:bg-rose-50 flex items-center justify-center transition-colors shrink-0 cursor-pointer"
                        title="Delete specification row"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={addSpec}
                    className="text-xs text-[#f15a24] hover:underline font-bold flex items-center gap-1.5 cursor-pointer pt-1"
                  >
                    + Add Specification Row
                  </button>
                </div>
              </FormCard>

            </div>

            {/* Right Sidebar (4 cols) */}
            <div className="lg:col-span-4 space-y-6">

              {/* Status & Visibility */}
              <div className="bg-white rounded-2xl shadow-xs border border-gray-200/80 p-5 space-y-4">
                <h3 className="font-bold text-gray-900 text-sm pb-3 border-b border-gray-100 flex items-center justify-between">
                  <span>Publishing & Status</span>
                  <span className="text-[11px] text-gray-400 font-normal">স্ট্যাটাস</span>
                </h3>

                <label className="flex items-center justify-between p-3.5 rounded-xl bg-gray-50 border border-gray-200 cursor-pointer hover:bg-gray-100/70 transition-colors">
                  <div>
                    <span className="text-xs font-bold text-gray-900 block">Published on Store</span>
                    <span className="text-[11px] text-gray-500 block mt-0.5">টিক দিলে পণ্যটি স্টোরে লাইভ থাকবে</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={!!data.is_published}
                    onChange={e => setData('is_published', e.target.checked)}
                    className="h-4 w-4 accent-[#f15a24] rounded cursor-pointer"
                  />
                </label>

                <button
                  type="submit"
                  disabled={processing || submitting}
                  className="w-full py-3 bg-[#f15a24] hover:bg-[#d94a1a] disabled:opacity-60 text-white font-bold rounded-xl text-sm transition-colors cursor-pointer shadow-sm shadow-[#f15a24]/30"
                >
                  {processing || submitting ? 'Saving Product...' : (isEdit ? 'Save Changes' : 'Publish Product')}
                </button>

                {isEdit && (
                  <button
                    type="button"
                    onClick={() => {
                      if (confirm(`Are you sure you want to delete "${product.name}"?`)) {
                        router.delete(`/admin/products/${product.id}`);
                      }
                    }}
                    className="w-full py-2.5 bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 text-xs font-bold rounded-xl transition-colors cursor-pointer"
                  >
                    Delete Product
                  </button>
                )}
              </div>

              {/* Single Badge Selector */}
              <div className="bg-white rounded-2xl shadow-xs border border-gray-200/80 p-5 space-y-3.5">
                <h3 className="font-bold text-gray-900 text-sm pb-3 border-b border-gray-100 flex items-center justify-between">
                  <span>Product Badge (লেবেল)</span>
                  <span className="text-[11px] text-gray-400 font-normal">একটি লেবেল</span>
                </h3>

                <div className="space-y-2">
                  {[
                    {
                      key: 'none',
                      title: 'Standard (কোনো লেবেল নেই)',
                      desc: 'No promotional badge',
                      active: !data.is_best_seller && !data.is_new_arrival && !data.is_featured && !data.is_flash_sale,
                      colorClass: 'border-gray-300 bg-gray-50 text-gray-800',
                      icon: <span className="w-2.5 h-2.5 rounded-full bg-gray-400"></span>,
                    },
                    {
                      key: 'is_best_seller',
                      title: 'Best Seller (বেস্ট সেলার)',
                      desc: 'Shows on /best-selling page',
                      active: !!data.is_best_seller,
                      colorClass: 'border-amber-400 bg-amber-50/80 text-amber-900 ring-1 ring-amber-400',
                      icon: (
                        <svg className="w-3.5 h-3.5 text-amber-600 shrink-0" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M12 2c.5 2.5 2 4.5 4 6 2.5 2 3 5 2 8a7 7 0 1 1-13.8-3.5C4.5 11 6 8.5 7.5 7c.5 1.5 1.5 2.5 2.5 3 0-2.5 1-5.5 2-8z"/>
                        </svg>
                      ),
                    },
                    {
                      key: 'is_flash_sale',
                      title: 'Hot Offer / Flash Sale (হট অফার)',
                      desc: 'Shows in flash sale lists',
                      active: !!data.is_flash_sale,
                      colorClass: 'border-rose-400 bg-rose-50/80 text-rose-900 ring-1 ring-rose-400',
                      icon: (
                        <svg className="w-3.5 h-3.5 text-rose-600 shrink-0" viewBox="0 0 24 24" fill="currentColor">
                          <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
                        </svg>
                      ),
                    },
                    {
                      key: 'is_new_arrival',
                      title: 'New Arrival (নতুন আগমন)',
                      desc: 'Shows on /new-arrivals page',
                      active: !!data.is_new_arrival,
                      colorClass: 'border-blue-400 bg-blue-50/80 text-blue-900 ring-1 ring-blue-400',
                      icon: (
                        <svg className="w-3.5 h-3.5 text-blue-600 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                          <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/>
                        </svg>
                      ),
                    },
                    {
                      key: 'is_featured',
                      title: 'Featured (ফিচার্ড)',
                      desc: 'Featured on homepage',
                      active: !!data.is_featured,
                      colorClass: 'border-purple-400 bg-purple-50/80 text-purple-900 ring-1 ring-purple-400',
                      icon: (
                        <svg className="w-3.5 h-3.5 text-purple-600 shrink-0" viewBox="0 0 24 24" fill="currentColor">
                          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                        </svg>
                      ),
                    },
                  ].map(({ key, title, desc, active, colorClass, icon }) => (
                    <label
                      key={key}
                      onClick={() => {
                        setData(prev => ({
                          ...prev,
                          is_best_seller: key === 'is_best_seller',
                          is_new_arrival: key === 'is_new_arrival',
                          is_featured: key === 'is_featured',
                          is_flash_sale: key === 'is_flash_sale',
                        }));
                      }}
                      className={`flex items-start gap-2.5 p-3 rounded-xl border cursor-pointer transition-all ${
                        active ? colorClass : 'border-gray-200 bg-white hover:bg-gray-50'
                      }`}
                    >
                      <input
                        type="radio"
                        name="product_badge"
                        checked={active}
                        onChange={() => {}}
                        className="mt-0.5 h-3.5 w-3.5 accent-[#f15a24]"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5">
                          {icon}
                          <span className="text-xs font-bold text-gray-900 truncate">{title}</span>
                        </div>
                        <span className="text-[11px] text-gray-500 block mt-0.5">{desc}</span>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Shipping & Delivery */}
              <div className="bg-white rounded-2xl shadow-xs border border-gray-200/80 p-5">
                <h3 className="font-bold text-gray-900 text-sm pb-3 border-b border-gray-100 flex items-center justify-between">
                  <span>Shipping & Delivery</span>
                  <span className="text-[11px] text-gray-400 font-normal">ডেলিভারি</span>
                </h3>

                <label className="flex items-start gap-3 p-3.5 mt-3 rounded-xl bg-emerald-50/70 border border-emerald-200 cursor-pointer hover:bg-emerald-50 transition-colors">
                  <input
                    type="checkbox"
                    checked={!!data.is_free_shipping}
                    onChange={e => setData('is_free_shipping', e.target.checked)}
                    className="h-4 w-4 accent-emerald-600 rounded mt-0.5"
                  />
                  <div>
                    <span className="text-xs font-bold text-emerald-950 block">Free Home Delivery (ফ্রি ডেলিভারি)</span>
                    <span className="text-[11px] text-emerald-700 block mt-0.5 leading-relaxed">
                      টিক দিলে এই পণ্যে কোনো ডেলিভারি চার্জ যোগ হবে না।
                    </span>
                  </div>
                </label>
              </div>

              {/* SEO Meta Tags (Collapsible) */}
              <div className="bg-white rounded-2xl shadow-xs border border-gray-200/80 p-5 space-y-3">
                <h3 className="font-bold text-gray-900 text-sm pb-2 border-b border-gray-100 flex items-center justify-between">
                  <span>SEO Settings</span>
                  <span className="text-[11px] text-gray-400 font-normal">সার্চ ইঞ্জিন অপটিমাইজেশন</span>
                </h3>

                <Field label="Meta Title" error={errors.meta_title}>
                  <input
                    value={data.meta_title}
                    onChange={e => setData('meta_title', e.target.value)}
                    className={inputClass}
                    placeholder="Custom SEO Title"
                  />
                </Field>

                <Field label="Meta Description" error={errors.meta_description}>
                  <textarea
                    rows={2}
                    value={data.meta_description}
                    onChange={e => setData('meta_description', e.target.value)}
                    className={inputClass}
                    placeholder="Short SEO description for search engines"
                  />
                </Field>

                <Field label="Meta Keywords" error={errors.meta_keywords}>
                  <input
                    value={data.meta_keywords}
                    onChange={e => setData('meta_keywords', e.target.value)}
                    className={inputClass}
                    placeholder="shoes, sneaker, stylish shoes"
                  />
                </Field>
              </div>

            </div>
          </div>
        </form>

        {/* ── Quick Add Brand Modal ── */}
        {showBrandModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
            <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-gray-200 animate-scale-up">
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-100">
                <h3 className="font-bold text-gray-900 text-base flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#f15a24]"></span>
                  + Quick Add New Brand
                </h3>
                <button
                  type="button"
                  onClick={() => setShowBrandModal(false)}
                  className="w-7 h-7 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 flex items-center justify-center cursor-pointer"
                >
                  <svg className="w-4 h-4 stroke-current" viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                </button>
              </div>

              {brandError && (
                <div className="p-3 mb-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold">
                  {brandError}
                </div>
              )}

              <form onSubmit={handleCreateBrand} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Brand Name *</label>
                  <input
                    type="text"
                    required
                    value={newBrandName}
                    onChange={e => setNewBrandName(e.target.value)}
                    placeholder="e.g. Adidas, Apex, Walton"
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Brand Logo (Optional)</label>
                  <div className="flex items-center gap-3">
                    {newBrandPreview ? (
                      <div className="relative w-12 h-12 rounded-lg border border-gray-200 overflow-hidden shrink-0 bg-white p-1">
                        <img src={newBrandPreview} alt="Logo" className="w-full h-full object-contain" />
                        <button
                          type="button"
                          onClick={() => { setNewBrandFile(null); setNewBrandPreview(''); }}
                          className="absolute inset-0 bg-red-600/80 text-white flex items-center justify-center transition-opacity cursor-pointer"
                          title="Remove logo"
                        >
                          <svg className="w-3.5 h-3.5 stroke-current" viewBox="0 0 24 24" fill="none" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                        </button>
                      </div>
                    ) : (
                      <label className="h-10 px-3.5 rounded-xl border border-dashed border-gray-300 hover:border-[#f15a24] bg-gray-50 flex items-center justify-center text-xs font-semibold text-gray-600 cursor-pointer transition-colors">
                        <span>Upload Logo</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={e => {
                            const file = e.target.files?.[0];
                            if (file) {
                              setNewBrandFile(file);
                              setNewBrandPreview(URL.createObjectURL(file));
                            }
                          }}
                        />
                      </label>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2.5 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowBrandModal(false)}
                    className="px-4 py-2 rounded-xl text-xs font-bold text-gray-600 hover:bg-gray-100 transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={savingBrand}
                    className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-[#f15a24] hover:bg-[#d94a1a] shadow-xs disabled:opacity-60 transition-colors cursor-pointer"
                  >
                    {savingBrand ? 'Saving…' : 'Create & Select Brand'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </AdminLayout>
    </>
  );
}
