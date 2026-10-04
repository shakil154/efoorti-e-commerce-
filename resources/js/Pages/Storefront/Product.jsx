import { useState, useMemo, useEffect } from 'react';
import StorefrontLayout from '@/Layouts/StorefrontLayout';
import { Head, Link, useForm, usePage, router } from '@inertiajs/react';
import ProductCard from '@/Components/Storefront/ProductCard';
import CodOrderModal from '@/Components/Storefront/CodOrderModal';
import { money, imageUrl } from '@/lib/utils';
import { trackViewItem, trackAddToCart } from '@/lib/tracking';

export default function ProductPage({ product, related, sizes, colors, weights, variantGroups = [], features, reviews, canReview, auth }) {
  const { app } = usePage().props;
  const settings = app?.settings || {};

  // Button customization settings
  const isCodEnabled = settings.product_page_cod_enabled !== false && settings.pay_cod_enabled !== false;
  const codText = settings.product_page_cod_text || 'ক্যাশ অন ডেলিভারিতে অর্ডার করুন';
  const codBgColor = settings.product_page_cod_bg_color || '#16a34a';
  const codTextColor = settings.product_page_cod_text_color || '#ffffff';

  const isWhatsappEnabled = settings.product_page_whatsapp_enabled !== false;
  const whatsappText = settings.product_page_whatsapp_text || 'WhatsApp Order';
  const whatsappNumber = settings.product_page_whatsapp_number || settings.whatsapp_number || settings.contact_phone || '';
  const whatsappBgColor = settings.product_page_whatsapp_bg_color || '#25D366';
  const whatsappTextColor = settings.product_page_whatsapp_text_color || '#ffffff';

  const isCallEnabled = settings.product_page_call_enabled !== false;
  const callText = settings.product_page_call_text || 'Call For Order';
  const callNumber = settings.product_page_call_number || settings.call_number || settings.contact_phone || '';
  const callBgColor = settings.product_page_call_bg_color || '#294294';
  const callTextColor = settings.product_page_call_text_color || '#ffffff';

  const addCartText = settings.product_page_add_cart_text || 'ADD TO CART';
  const rawAddCartBg = settings.product_page_add_cart_bg_color;
  const addCartBgColor = (rawAddCartBg && rawAddCartBg !== '#f15a24') ? rawAddCartBg : 'var(--brand-primary, #f15a24)';
  const addCartTextColor = settings.product_page_add_cart_text_color || '#ffffff';

  const buyText = settings.product_page_buy_text || 'ORDER NOW';
  const buyBgColor = settings.product_page_buy_bg_color || '#0b1c21';
  const buyTextColor = settings.product_page_buy_text_color || '#ffffff';

  // Mobile Sticky Bottom Bar Settings (from Admin)
  const isMobileStickyEnabled = settings.product_mobile_sticky_enabled !== false && settings.product_mobile_sticky_enabled !== '0';
  const stickyAddCartText = settings.product_mobile_sticky_add_cart_text || 'কার্টে রাখুন';
  const stickyAddCartBgColor = settings.product_mobile_sticky_add_cart_bg_color || '#ffffff';
  const stickyAddCartTextColor = settings.product_mobile_sticky_add_cart_text_color || '#f43f5e';
  const stickyAddCartBorderColor = settings.product_mobile_sticky_add_cart_border_color || '#f43f5e';
  const stickyBuyText = settings.product_mobile_sticky_buy_text || 'অর্ডার করুন';
  const stickyBuyBgColor = settings.product_mobile_sticky_buy_bg_color || '#f43f5e';
  const stickyBuyTextColor = settings.product_mobile_sticky_buy_text_color || '#ffffff';

  const [activeImage, setActiveImage] = useState(product.images?.[0]?.path);
  const [activeTab, setActiveTab] = useState('desc');
  
  // Dynamic variant state
  const [selectedVariants, setSelectedVariants] = useState(() => {
    const init = {};
    if (variantGroups && variantGroups.length > 0) {
      variantGroups.forEach(grp => {
        if (grp.options && grp.options.length > 0) {
          init[grp.name] = grp.options[0].value;
        }
      });
    } else {
      if (colors?.length > 0) init['Color'] = colors[0].value;
      if (sizes?.length > 0) init['Size'] = sizes[0].value;
      if (weights?.length > 0) init['Weight'] = weights[0].value;
    }
    return init;
  });

  const [qty, setQty] = useState(1);
  const [imageError, setImageError] = useState(false);
  const [showQuickOrder, setShowQuickOrder] = useState(false);

  const getVariantString = () => {
    if (variantGroups && variantGroups.length > 0) {
      return Object.entries(selectedVariants)
        .filter(([_, v]) => Boolean(v))
        .map(([k, v]) => `${k}: ${v}`)
        .join(', ');
    }
    const parts = [];
    if (selectedVariants['Color']) parts.push(`Color: ${selectedVariants['Color']}`);
    if (selectedVariants['Size']) parts.push(`Size: ${selectedVariants['Size']}`);
    if (selectedVariants['Weight']) parts.push(`Weight: ${selectedVariants['Weight']}`);
    return parts.join(', ');
  };

  const quickOrderForm = useForm({
    customer_name: auth?.user?.name || '',
    customer_phone: auth?.user?.phone || '',
    shipping_address: auth?.user?.address || '',
    city: 'Dhaka',
    shipping_zone: 'inside_dhaka',
    payment_method: 'cod',
  });

  const handleQuickOrderSubmit = async (e) => {
    e.preventDefault();
    try {
      const variant = getVariantString();

      const response = await fetch('/cart/buy-now', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'X-Requested-With': 'XMLHttpRequest',
          'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content')
        },
        body: JSON.stringify({
          product_id: product.id,
          qty: qty,
          variant: variant || null
        })
      });

      if (!response.ok) {
        throw new Error('Failed to prepare cart for quick order');
      }

      quickOrderForm.post('/checkout', {
        preserveScroll: true,
        onSuccess: () => setShowQuickOrder(false)
      });
    } catch (err) {
      console.error(err);
      alert('Failed to process order. Please try again.');
    }
  };

  // Parse specifications
  const specRows = useMemo(() => {
    if (!product.specifications) return [];
    return product.specifications.map(row => {
      if (typeof row === 'string') {
        if (!row.trim()) return null;
        if (row.includes(':')) {
          const [label, ...val] = row.split(':');
          return { label: label.trim(), value: val.join(':').trim() };
        }
        return { label: 'Detail', value: row.trim() };
      }
      const label = row.label?.trim();
      const value = row.value?.trim();
      if (!label && !value) return null;
      return { label: label || 'Detail', value };
    }).filter(Boolean);
  }, [product.specifications]);

  const bulletSpecs = useMemo(() => {
    return specRows.slice(0, 6).map(row => {
      if (row.label && row.label !== 'Detail' && row.value) return `${row.label}: ${row.value}`;
      return row.label && row.label !== 'Detail' ? row.label : row.value;
    });
  }, [specRows]);

  // Pricing Logic
  const priceData = useMemo(() => {
    let explicitRegular = null;
    let explicitSale = null;
    let delta = 0;

    const inspectOption = (opt) => {
      if (!opt) return;
      const hasSale = opt.sale_price !== null && opt.sale_price !== undefined && parseFloat(opt.sale_price) > 0;
      const hasReg = opt.regular_price !== null && opt.regular_price !== undefined && parseFloat(opt.regular_price) > 0;
      if (hasSale) {
        explicitSale = parseFloat(opt.sale_price);
      }
      if (hasReg) {
        explicitRegular = parseFloat(opt.regular_price);
      }
      // Only accumulate delta from options without explicit prices
      if (!hasSale && !hasReg) {
        delta += parseFloat(opt.price_delta) || 0;
      }
    };

    if (variantGroups && variantGroups.length > 0) {
      variantGroups.forEach(grp => {
        const val = selectedVariants[grp.name];
        if (val) {
          const opt = (grp.options || []).find(x => x.value === val);
          inspectOption(opt);
        }
      });
    } else {
      if (selectedVariants['Color']) {
        const c = colors?.find(x => x.value === selectedVariants['Color']);
        inspectOption(c);
      }
      if (selectedVariants['Size']) {
        const s = sizes?.find(x => x.value === selectedVariants['Size']);
        inspectOption(s);
      }
      if (selectedVariants['Weight']) {
        const w = weights?.find(x => x.value === selectedVariants['Weight']);
        inspectOption(w);
      }
    }

    const baseProductRegular = parseFloat(product.regular_price) || 0;
    const baseProductSale = product.sale_price ? parseFloat(product.sale_price) : null;

    let finalRegular = explicitRegular !== null ? Math.max(0, explicitRegular + delta) : Math.max(0, baseProductRegular + delta);
    let finalSelling = null;

    if (explicitSale !== null && explicitSale > 0) {
      finalSelling = Math.max(0, explicitSale + delta);
    } else if (explicitRegular !== null && explicitRegular > 0) {
      finalSelling = Math.max(0, explicitRegular + delta);
    } else if (baseProductSale !== null && baseProductSale > 0) {
      finalSelling = Math.max(0, baseProductSale + delta);
    } else {
      finalSelling = finalRegular;
    }

    const onSale = finalRegular > 0 && finalSelling < finalRegular;
    const discountPercent = onSale ? Math.round(((finalRegular - finalSelling) / finalRegular) * 100) : 0;

    return {
      price: finalSelling,
      comparePrice: onSale ? finalRegular : null,
      onSale,
      discountPercent
    };
  }, [product, selectedVariants, variantGroups, colors, sizes, weights]);

  // Review Form
  const reviewForm = useForm({
    author_name: auth?.user?.name || '',
    rating: 5,
    title: '',
    body: ''
  });

  const submitReview = (e) => {
    e.preventDefault();
    reviewForm.post(`/product/${product.slug || product.id}/reviews`, {
      preserveScroll: true,
      onSuccess: () => {
        reviewForm.reset('title', 'body');
        setActiveTab('rev');
      }
    });
  };

  const hasVariants = Boolean(
    (variantGroups && variantGroups.length > 0) ||
    (colors && colors.length > 0) ||
    (sizes && sizes.length > 0) ||
    (weights && weights.length > 0)
  );

  const activeVariantStock = useMemo(() => {
    if (!hasVariants) {
      return Math.max(0, parseInt(product.stock_quantity, 10) || 0);
    }

    let minStock = Infinity;
    let foundAny = false;

    if (variantGroups && variantGroups.length > 0) {
      variantGroups.forEach(grp => {
        const val = selectedVariants[grp.name];
        if (val) {
          const opt = (grp.options || []).find(x => x.value === val);
          if (opt) {
            foundAny = true;
            const s = Math.max(0, parseInt(opt.stock, 10) || 0);
            if (s < minStock) minStock = s;
          }
        }
      });
    } else {
      if (selectedVariants['Color']) {
        const c = colors?.find(x => x.value === selectedVariants['Color']);
        if (c) {
          foundAny = true;
          const s = Math.max(0, parseInt(c.stock, 10) || 0);
          if (s < minStock) minStock = s;
        }
      }
      if (selectedVariants['Size']) {
        const s = sizes?.find(x => x.value === selectedVariants['Size']);
        if (s) {
          foundAny = true;
          const st = Math.max(0, parseInt(s.stock, 10) || 0);
          if (st < minStock) minStock = st;
        }
      }
      if (selectedVariants['Weight']) {
        const w = weights?.find(x => x.value === selectedVariants['Weight']);
        if (w) {
          foundAny = true;
          const st = Math.max(0, parseInt(w.stock, 10) || 0);
          if (st < minStock) minStock = st;
        }
      }
    }

    return foundAny ? (minStock === Infinity ? 0 : minStock) : Math.max(0, parseInt(product.stock_quantity, 10) || 0);
  }, [hasVariants, variantGroups, colors, sizes, weights, selectedVariants, product.stock_quantity]);

  const inStock = hasVariants
    ? activeVariantStock > 0
    : (parseInt(product.stock_quantity, 10) || 0) > 0;
  const isOutOfStock = !inStock;

  const handleAddToCart = () => {
    if (isOutOfStock) return;
    const variant = getVariantString();

    trackAddToCart(
      { id: product.id, name: product.name, price: priceData.price, category: product.category?.name },
      qty,
      variant || null
    );

    router.post('/cart/add', {
      product_id: product.id,
      variant: variant || null,
      qty
    }, { preserveScroll: true });
  };

  const handleBuyNow = () => {
    if (isOutOfStock) return;
    const variant = getVariantString();

    trackAddToCart(
      { id: product.id, name: product.name, price: priceData.price, category: product.category?.name },
      qty,
      variant || null
    );

    router.post('/cart/buy-now', {
      product_id: product.id,
      variant: variant || null,
      qty
    });
  };

  const mainImageUrl = imageUrl(activeImage, product.name);
  const rating = Math.max(0, Math.min(5, Math.round(parseFloat(product.rating) || 0)));

  // Track product view once on mount
  useEffect(() => {
    trackViewItem({
      id: product.id,
      name: product.name,
      price: priceData.price,
      category: product.category?.name,
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [product.id]);

  return (
    <StorefrontLayout hideMobileBottomMenu={isMobileStickyEnabled}>
      <Head title={product.name} />
      
      <main className={`max-w-[1440px] mx-auto w-full px-4 sm:px-5 py-6 overflow-x-hidden ${isMobileStickyEnabled ? 'pb-20 md:pb-6' : ''}`}>
        {/* Breadcrumb */}
        <nav className="text-sm text-gray-500 mb-5 flex flex-wrap items-center gap-2">
          <Link href="/" className="hover:text-[#f15a24] transition-colors">Home</Link>
          <span className="text-gray-300">/</span>
          {product.category && (
            <>
              <Link href={`/category/${product.category.slug}`} className="hover:text-[#f15a24] transition-colors">{product.category.name}</Link>
              <span className="text-gray-300">/</span>
            </>
          )}
          <span className="text-gray-900 font-medium truncate max-w-[200px] sm:max-w-md">{product.name}</span>
        </nav>

        {/* Product Details Grid */}
        <div className="bg-white rounded-2xl border border-gray-100 p-4 sm:p-6 lg:p-8 grid lg:grid-cols-2 gap-8 lg:gap-12 shadow-sm mb-8">
          
          {/* Gallery */}
          <div className="flex flex-col-reverse md:flex-row gap-4 select-none min-w-0">
            
            {product.images?.length > 1 && (
              <div className="flex md:flex-col gap-3 overflow-x-auto md:overflow-y-auto pb-2 md:pb-0 md:pr-2 custom-scrollbar shrink-0 max-h-[500px] w-full md:w-auto min-w-0">
                {product.images.map(img => (
                  <button 
                    key={img.id}
                    type="button" 
                    onClick={() => { setActiveImage(img.path); setImageError(false); }}
                    className={`relative rounded-xl border-2 shrink-0 overflow-hidden w-20 h-20 bg-white transition-all ${activeImage === img.path ? 'border-[#f15a24]' : 'border-gray-100 hover:border-[#f15a24]/50'}`}
                  >
                    <img 
                      src={imageUrl(img.path, product.name)} 
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextElementSibling.style.display = 'flex';
                      }}
                      className="w-full h-full object-contain p-1" 
                      alt="" 
                    />
                    <div className="hidden absolute inset-0 flex items-center justify-center text-gray-300">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/></svg>
                    </div>
                  </button>
                ))}
              </div>
            )}

            <div className="flex-1 relative rounded-2xl border border-gray-100 bg-white aspect-square flex items-center justify-center p-6 overflow-hidden group">
              {priceData.onSale && (
                <span className="absolute top-4 left-4 z-10 bg-[#f15a24] text-white text-xs font-black px-2.5 py-1 rounded-md shadow-sm shadow-[#f15a24]/30">
                  -{priceData.discountPercent}% OFF
                </span>
              )}
              {mainImageUrl && !imageError ? (
                <img 
                  src={mainImageUrl} 
                  onError={() => setImageError(true)}
                  className="w-full h-full object-contain object-center transform group-hover:scale-105 transition-transform duration-500" 
                  alt={product.name} 
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-gray-300">
                  <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/></svg>
                  <span className="text-sm mt-3 font-medium text-gray-400">No Image Available</span>
                </div>
              )}
            </div>
          </div>

          {/* Info */}
          <div className="flex flex-col min-w-0">
            <div className="mb-2.5 flex flex-wrap items-center gap-2">
              {inStock ? (
                <span className="inline-flex items-center gap-1.5 bg-green-50 text-green-700 text-xs font-bold px-2.5 py-1 rounded-full border border-green-100">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                  In Stock
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 bg-red-50 text-red-600 text-xs font-bold px-2.5 py-1 rounded-full border border-red-100">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>
                  Out of Stock
                </span>
              )}
              {product.is_best_seller ? (
                <span className="inline-flex items-center gap-1.5 bg-amber-50 text-amber-800 text-xs font-bold px-2.5 py-1 rounded-full border border-amber-200 shadow-2xs">
                  <svg className="w-3.5 h-3.5 text-amber-600 shrink-0" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2c.5 2.5 2 4.5 4 6 2.5 2 3 5 2 8a7 7 0 1 1-13.8-3.5C4.5 11 6 8.5 7.5 7c.5 1.5 1.5 2.5 2.5 3 0-2.5 1-5.5 2-8z"/>
                  </svg>
                  Best Seller
                </span>
              ) : product.is_flash_sale ? (
                <span className="inline-flex items-center gap-1.5 bg-rose-50 text-rose-700 text-xs font-bold px-2.5 py-1 rounded-full border border-rose-200 shadow-2xs">
                  <svg className="w-3.5 h-3.5 text-rose-600 shrink-0" viewBox="0 0 24 24" fill="currentColor">
                    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
                  </svg>
                  Hot Offer
                </span>
              ) : product.is_new_arrival ? (
                <span className="inline-flex items-center gap-1.5 bg-blue-50 text-blue-800 text-xs font-bold px-2.5 py-1 rounded-full border border-blue-200 shadow-2xs">
                  <svg className="w-3.5 h-3.5 text-blue-600 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/>
                  </svg>
                  New Arrival
                </span>
              ) : product.is_featured ? (
                <span className="inline-flex items-center gap-1.5 bg-purple-50 text-purple-700 text-xs font-bold px-2.5 py-1 rounded-full border border-purple-200 shadow-2xs">
                  <svg className="w-3.5 h-3.5 text-purple-600 shrink-0" viewBox="0 0 24 24" fill="currentColor">
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                  </svg>
                  Featured
                </span>
              ) : product.is_free_shipping ? (
                <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 text-xs font-bold px-2.5 py-1 rounded-full border border-emerald-200 shadow-2xs">
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/></svg>
                  Free Delivery (ফ্রি ডেলিভারি)
                </span>
              ) : null}
            </div>

            {/* Brand display (Logo image or text) */}
            {(product.brand || product.brand_image) && (
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Brand:</span>
                <Link 
                  href={product.brand ? `/shop?brand=${encodeURIComponent(product.brand)}` : '/brands'}
                  className="inline-flex items-center gap-2 px-2.5 py-1 rounded-lg bg-gray-50 hover:bg-orange-50/70 border border-gray-200/80 transition-colors group/brand"
                >
                  {product.brand_image && (
                    <img 
                      src={imageUrl(product.brand_image)} 
                      alt={product.brand || 'Brand Logo'} 
                      className="h-5 w-auto max-w-[80px] object-contain" 
                    />
                  )}
                  {product.brand && (
                    <span className="text-xs font-bold text-gray-800 group-hover/brand:text-[#f15a24] transition-colors">
                      {product.brand}
                    </span>
                  )}
                </Link>
              </div>
            )}

            <h1 className="text-2xl sm:text-[28px] font-semibold text-gray-800 tracking-tight leading-tight mb-2">{product.name}</h1>
            
            <div className="flex flex-wrap items-center gap-4 mb-2">
              <div className="flex items-center gap-1">
                <div className="flex text-amber-400 text-lg">
                  {'★'.repeat(rating)}<span className="text-gray-200">{'★'.repeat(5 - rating)}</span>
                </div>
                <span className="text-sm text-gray-500 ml-1 font-medium">({product.reviews_count || 0})</span>
              </div>
              {product.sku && (
                <>
                  <span className="text-gray-300 hidden sm:inline">|</span>
                  <span className="text-sm text-gray-500">SKU: <span className="font-semibold text-gray-900">{product.sku}</span></span>
                </>
              )}
            </div>

            <div className="flex items-baseline gap-3 mb-5 mt-3">
              <span className="text-3xl font-bold text-[#f15a24]">{money(priceData.price)}</span>
              {priceData.comparePrice !== null && (
                <span className="text-base text-gray-400 font-medium line-through decoration-gray-300">{money(priceData.comparePrice)}</span>
              )}
            </div>
            
            <hr className="border-gray-100 mb-6" />

            {product.short_description && (
              <div 
                className="mt-2 mb-6 text-gray-700 leading-relaxed text-sm prose prose-sm max-w-none [&_p]:mb-2 [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:my-2 [&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:my-2 [&_strong]:text-gray-900 [&_blockquote]:border-l-4 [&_blockquote]:border-orange-400 [&_blockquote]:pl-3 [&_blockquote]:italic [&_h2]:text-lg [&_h2]:font-bold [&_h3]:text-base [&_h3]:font-bold"
                dangerouslySetInnerHTML={{ __html: product.short_description }}
              />
            )}

            {bulletSpecs.length > 0 && (
              <div className="bg-gray-50/50 rounded-xl p-5 border border-gray-100 mb-8">
                <ul className="text-sm text-gray-600 space-y-2">
                  {bulletSpecs.map((spec, i) => (
                    <li key={i} className="flex gap-2">
                      <span className="text-[#f15a24] mt-0.5">•</span>
                      <span>{spec}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Dynamic Variant Groups (Color with swatch/picker, Size, Custom options) */}
            {variantGroups && variantGroups.length > 0 ? (
              <div className="space-y-5 mt-auto border-t border-gray-100 pt-5">
                {variantGroups.map((grp) => {
                  const currentVal = selectedVariants[grp.name];
                  const isColor = grp.name.toLowerCase() === 'color';

                  return (
                    <div key={grp.name}>
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-sm font-bold text-gray-900">{grp.name}</p>
                        <span className="text-sm text-gray-500 font-medium">{currentVal}</span>
                      </div>
                      <div className="flex flex-wrap gap-2.5">
                        {(grp.options || []).map(opt => {
                          const isSelected = currentVal === opt.value;
                          const optStock = Math.max(0, parseInt(opt.stock, 10) || 0);
                          const isOptOutOfStock = optStock <= 0;

                          return (
                            <button
                              key={opt.id || opt.value}
                              type="button"
                              onClick={() => {
                                setSelectedVariants(prev => ({ ...prev, [grp.name]: opt.value }));
                                if (opt.image_path) {
                                  setActiveImage(opt.image_path);
                                }
                              }}
                              className={`px-3.5 py-2 rounded-xl text-sm font-semibold transition-all flex items-center gap-2 border cursor-pointer ${
                                isSelected
                                  ? isOptOutOfStock
                                    ? 'bg-red-600 text-white shadow-md shadow-red-600/20 border-red-600 ring-2 ring-red-200'
                                    : 'bg-[#f15a24] text-white shadow-md shadow-[#f15a24]/20 border-[#f15a24] ring-2 ring-orange-200'
                                  : isOptOutOfStock
                                    ? 'bg-gray-50 border-red-200 text-gray-400 hover:border-red-300'
                                    : 'bg-white border-gray-200 text-gray-700 hover:border-[#f15a24] hover:text-[#f15a24]'
                              }`}
                            >
                              {/* Color Swatch Circle for color attributes */}
                              {isColor && opt.color_code && (
                                <span
                                  className="w-3.5 h-3.5 rounded-full border border-black/15 shrink-0 shadow-2xs"
                                  style={{ backgroundColor: opt.color_code }}
                                />
                              )}
                              {/* Thumbnail image if available */}
                              {opt.image_path && (
                                <img
                                  src={imageUrl(opt.image_path, opt.value)}
                                  alt={opt.value}
                                  className="w-5 h-5 rounded-md object-cover border border-white/50 shrink-0"
                                />
                              )}
                              <span className={isOptOutOfStock && !isSelected ? 'line-through text-gray-400' : ''}>
                                {opt.value}
                              </span>
                              {/* Only show price badge if option has a differing custom price or a non-zero price delta */}
                              {(() => {
                                const baseProductSelling = parseFloat(product.sale_price && parseFloat(product.sale_price) > 0 ? product.sale_price : product.regular_price) || 0;
                                const optSelling = parseFloat(opt.sale_price && parseFloat(opt.sale_price) > 0 ? opt.sale_price : (opt.regular_price || 0));
                                const hasCustomPrice = optSelling > 0 && Math.abs(optSelling - baseProductSelling) >= 0.01;
                                const optDelta = parseFloat(opt.price_delta) || 0;

                                if (hasCustomPrice) {
                                  return (
                                    <span className={`text-[11px] font-bold px-1.5 py-0.5 rounded-md ${
                                      isSelected ? 'bg-white/20 text-white' : 'bg-emerald-50 text-emerald-700'
                                    }`}>
                                      {money(optSelling)}
                                    </span>
                                  );
                                }
                                if (optDelta !== 0) {
                                  return (
                                    <span className={`text-[11px] font-bold px-1.5 py-0.5 rounded-md ${
                                      isSelected ? 'bg-white/20 text-white' : optDelta > 0 ? 'bg-orange-50 text-orange-600' : 'bg-rose-50 text-rose-600'
                                    }`}>
                                      {optDelta > 0 ? `+${money(optDelta)}` : `-${money(Math.abs(optDelta))}`}
                                    </span>
                                  );
                                }
                                return null;
                              })()}
                              {isOptOutOfStock && (
                                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                                  isSelected ? 'bg-white/25 text-white' : 'bg-red-100 text-red-600'
                                }`}>
                                  স্টক শেষ
                                </span>
                              )}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}

                {/* Variant Stock Status Alert Banner / Counter */}
                {isOutOfStock ? (
                  <div className="flex items-center gap-2.5 p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs sm:text-sm font-semibold">
                    <svg className="w-5 h-5 shrink-0 text-rose-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    <span>দুঃখিত! আপনার নির্বাচিত অপশনটি বর্তমানে স্টকে নেই (Out of Stock)। অনুগ্রহ করে অন্য কালার বা সাইজ নির্বাচন করুন।</span>
                  </div>
                ) : hasVariants && activeVariantStock > 0 && activeVariantStock <= 10 ? (
                  <div className="flex items-center gap-2 text-xs font-bold text-amber-800 bg-amber-50/90 border border-amber-200 px-3.5 py-2 rounded-xl">
                    <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping"></span>
                    <span>তাড়াতাড়ি অর্ডার করুন! মাত্র {activeVariantStock}টি পণ্য স্টকে বাকি আছে</span>
                  </div>
                ) : hasVariants && activeVariantStock > 10 ? (
                  <div className="flex items-center gap-2 text-xs font-semibold text-emerald-800 bg-emerald-50/80 border border-emerald-200 px-3.5 py-2 rounded-xl">
                    <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                    <span>স্টকে আছে: <strong>{activeVariantStock}</strong>টি পণ্য স্টকে উপলব্ধ রয়েছে</span>
                  </div>
                ) : null}
              </div>
            ) : null}

              <div className="flex flex-col gap-4 pt-2">
                
                {/* Quantity and Actions */}
                <div className="flex flex-col gap-5 mt-2">
                  <div className="flex items-center gap-4">
                    <span className="text-[15px] font-medium text-gray-800">Quantity:</span>
                    <div className="flex items-center border border-gray-200 rounded-md overflow-hidden bg-white h-[42px] shrink-0 w-32">
                      <button 
                        type="button" 
                        onClick={() => setQty(Math.max(1, qty - 1))}
                        className="w-10 h-full flex items-center justify-center text-gray-500 hover:bg-gray-100 hover:text-gray-900 transition-colors disabled:opacity-50 cursor-pointer"
                        disabled={!inStock}
                      >−</button>
                      <input
                        type="number"
                        min={inStock ? "1" : "0"}
                        max={Math.min(99, Math.max(1, activeVariantStock))}
                        value={inStock ? qty : 0}
                        onChange={(e) => {
                          const val = parseInt(e.target.value, 10) || 1;
                          const clamped = Math.max(1, Math.min(Math.min(99, activeVariantStock), val));
                          setQty(clamped);
                        }}
                        className="flex-1 w-full h-full text-center border-0 bg-transparent p-0 font-medium text-gray-900 focus:ring-0 disabled:text-gray-400"
                        disabled={!inStock}
                      />
                      <button 
                        type="button" 
                        onClick={() => setQty(Math.min(Math.min(99, activeVariantStock), qty + 1))}
                        className="w-10 h-full flex items-center justify-center text-gray-500 hover:bg-gray-100 hover:text-gray-900 transition-colors disabled:opacity-50 cursor-pointer"
                        disabled={!inStock || qty >= activeVariantStock}
                      >+</button>
                    </div>
                    {inStock && activeVariantStock > 0 && (
                      <span className="text-xs text-gray-500 font-medium">(সর্বোচ্চ {activeVariantStock}টি)</span>
                    )}
                  </div>

                  <div className="flex flex-col gap-3">
                    {/* Free Delivery Banner */}
                    {product.is_free_shipping && (
                      <div className="flex items-center gap-2.5 px-3.5 py-2.5 bg-emerald-50/90 border border-emerald-200/80 rounded-xl text-emerald-800 text-xs sm:text-sm font-semibold">
                        <div className="w-6 h-6 rounded-lg bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-2xs">
                          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" /></svg>
                        </div>
                        <span>এই প্রোডাক্টে রয়েছে <strong>ফ্রি হোম ডেলিভারি</strong> (সারা দেশে কোনো ডেলিভারি চার্জ নেই)!</span>
                      </div>
                    )}

                    {/* COD Quick Order Button — full width, prominent */}
                    {isCodEnabled && (
                      <button
                        type="button"
                        onClick={() => { if (inStock) setShowQuickOrder(true); }}
                        disabled={!inStock}
                        className={`w-full h-[50px] sm:h-[54px] active:scale-[0.98] font-extrabold rounded-xl shadow-lg transition-all flex items-center justify-center gap-2.5 text-sm sm:text-base ${
                          !inStock
                            ? 'bg-gray-300 text-gray-500 cursor-not-allowed shadow-none opacity-60'
                            : 'cursor-pointer hover:opacity-95'
                        }`}
                        style={inStock ? {
                          backgroundColor: codBgColor,
                          color: codTextColor,
                          boxShadow: `0 10px 25px -5px ${codBgColor}40`
                        } : {}}
                      >
                        <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                        {inStock ? codText : 'স্টক শেষ (Out of Stock)'}
                      </button>
                    )}

                    {/* Dynamic Grid for Actions: Add to Cart, Order Now, WhatsApp, Call */}
                    <div className="grid grid-cols-2 gap-2 sm:gap-3 w-full max-w-full">
                      <button
                        type="button"
                        onClick={handleAddToCart}
                        disabled={!inStock}
                        className={`font-semibold rounded-md shadow-sm transition-all h-[40px] sm:h-[46px] flex items-center justify-center gap-1.5 sm:gap-2 px-1 sm:px-2 min-w-0 overflow-hidden ${
                          !inStock ? 'bg-gray-200 text-gray-400 cursor-not-allowed opacity-60' : 'hover:opacity-90 cursor-pointer'
                        }`}
                        style={inStock ? {
                          backgroundColor: addCartBgColor,
                          color: addCartTextColor
                        } : {}}
                      >
                        <svg className="w-4 h-4 sm:w-5 sm:h-5 hidden sm:block shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/></svg>
                        <span className="text-[10px] sm:text-[14px] leading-tight text-center truncate">{inStock ? addCartText : 'স্টক নেই'}</span>
                      </button>

                      <button
                        type="button"
                        onClick={handleBuyNow}
                        disabled={!inStock}
                        className={`font-semibold rounded-md shadow-sm transition-all h-[40px] sm:h-[46px] flex items-center justify-center px-1 sm:px-2 min-w-0 overflow-hidden ${
                          !inStock ? 'bg-gray-200 text-gray-400 cursor-not-allowed opacity-60' : 'hover:opacity-90 cursor-pointer'
                        }`}
                        style={inStock ? {
                          backgroundColor: buyBgColor,
                          color: buyTextColor
                        } : {}}
                      >
                        <span className="text-[10px] sm:text-[14px] leading-tight text-center truncate">{inStock ? buyText : 'স্টক শেষ'}</span>
                      </button>

                      {isWhatsappEnabled && (
                        <a
                          href={`https://wa.me/${whatsappNumber.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Hi, I want to order ${product.name}. Link: ${typeof window !== 'undefined' ? window.location.href : ''}`)}`}
                          target="_blank"
                          rel="noreferrer"
                          className={`font-semibold rounded-md shadow-sm transition-all hover:opacity-90 h-[40px] sm:h-[46px] flex items-center justify-center gap-1.5 sm:gap-2 px-1 sm:px-2 min-w-0 overflow-hidden ${!isCallEnabled ? 'col-span-2' : ''}`}
                          style={{
                            backgroundColor: whatsappBgColor,
                            color: whatsappTextColor
                          }}
                        >
                          <svg className="w-3.5 h-3.5 sm:w-5 sm:h-5 hidden sm:block shrink-0" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 00-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                          <span className="text-[10px] sm:text-[14px] leading-tight text-center truncate">{whatsappText}</span>
                        </a>
                      )}

                      {isCallEnabled && (
                        <a
                          href={`tel:${callNumber}`}
                          className={`font-semibold rounded-md shadow-sm transition-all hover:opacity-90 h-[40px] sm:h-[46px] flex items-center justify-center gap-1.5 sm:gap-2 px-1 sm:px-2 min-w-0 overflow-hidden ${!isWhatsappEnabled ? 'col-span-2' : ''}`}
                          style={{
                            backgroundColor: callBgColor,
                            color: callTextColor
                          }}
                        >
                          <svg className="w-4 h-4 sm:w-5 sm:h-5 hidden sm:block shrink-0" fill="currentColor" viewBox="0 0 24 24"><path d="M20.01 15.38c-1.23 0-2.42-.2-3.53-.56a.977.977 0 00-1.01.24l-1.57 1.97c-2.83-1.35-5.48-3.9-6.89-6.83l1.95-1.66c.27-.28.35-.67.24-1.02-.37-1.11-.56-2.3-.56-3.53 0-.54-.45-.99-.99-.99H4.19C3.65 3 3 3.24 3 3.99 3 13.28 10.73 21 20.01 21c.71 0 .99-.63.99-1.18v-3.45c0-.54-.45-.99-.99-.99z"/></svg>
                          <span className="text-[10px] sm:text-[14px] leading-tight text-center truncate">{callText}</span>
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

        {/* Tabs section */}
        <div className="bg-white rounded-2xl border border-gray-100 p-4 sm:p-6 lg:p-8 shadow-sm mb-8">
          <div className="border-b border-gray-200 flex gap-6 sm:gap-8 overflow-x-auto custom-scrollbar">
            <button 
              type="button" 
              onClick={() => setActiveTab('desc')}
              className={`py-4 -mb-px border-b-2 font-bold whitespace-nowrap transition-colors cursor-pointer ${activeTab === 'desc' ? 'border-[#f15a24] text-[#f15a24]' : 'border-transparent text-gray-500 hover:text-gray-900'}`}
            >
              {specRows.length > 0 ? 'Description & Specs' : 'Description'}
            </button>
            <button 
              type="button" 
              onClick={() => setActiveTab('rev')}
              className={`py-4 -mb-px border-b-2 font-bold whitespace-nowrap transition-colors cursor-pointer ${activeTab === 'rev' ? 'border-[#f15a24] text-[#f15a24]' : 'border-transparent text-gray-500 hover:text-gray-900'}`}
            >
              Reviews ({reviews?.total || 0})
            </button>
          </div>

          <div className="pt-8">
            {activeTab === 'desc' && (
              <div className={specRows.length > 0 ? "grid lg:grid-cols-3 gap-10" : "max-w-4xl"}>
                <div className={specRows.length > 0 ? "lg:col-span-2 min-w-0 break-words" : "w-full min-w-0 break-words"}>
                  <h3 className="text-xl font-extrabold text-gray-900 mb-6">Product Description</h3>
                  <div className="product-description-content text-gray-700 leading-relaxed max-w-none prose prose-slate [&_p]:mb-4 [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:my-4 [&_h3]:text-xl [&_h3]:font-bold [&_h3]:my-3 [&_h4]:text-lg [&_h4]:font-semibold [&_h4]:my-2 [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:my-3 [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:my-3 [&_li]:mb-1.5 [&_blockquote]:border-l-4 [&_blockquote]:border-orange-500 [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:text-gray-600 [&_blockquote]:my-4 [&_a]:text-orange-600 [&_a]:underline [&_hr]:my-6 [&_hr]:border-gray-200">
                    {product.description ? (
                      /<\/?[a-z][\s\S]*>/i.test(product.description) ? (
                        <div dangerouslySetInnerHTML={{ __html: product.description }} />
                      ) : (
                        product.description.split(/\n\n+/).map((para, i) => para.trim() ? <p key={i}>{para}</p> : null)
                      )
                    ) : (
                      <p>No description available.</p>
                    )}
                  </div>
                </div>
                
                {specRows.length > 0 && (
                  <div className="lg:col-span-1 min-w-0 break-words">
                    <div className="bg-gray-50 rounded-xl p-5 border border-gray-100 overflow-hidden">
                      <h3 className="text-lg font-extrabold text-gray-900 mb-4">Specifications</h3>
                      <table className="w-full text-sm">
                        <tbody className="divide-y divide-gray-200">
                          {product.brand && (
                            <tr>
                              <td className="py-3 text-gray-500 font-medium">Brand</td>
                              <td className="py-3 text-gray-900 font-semibold text-right">{product.brand}</td>
                            </tr>
                          )}
                          {product.sku && (
                            <tr>
                              <td className="py-3 text-gray-500 font-medium">SKU</td>
                              <td className="py-3 text-gray-900 font-semibold text-right">{product.sku}</td>
                            </tr>
                          )}
                          {specRows.map((row, i) => (
                            <tr key={i}>
                              <td className="py-3 text-gray-500 font-medium">{row.label}</td>
                              <td className="py-3 text-gray-900 font-semibold text-right">{row.value || '—'}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'rev' && (
              <div className="grid lg:grid-cols-12 gap-10">
                <div className="lg:col-span-7 space-y-6">
                  {reviews?.data?.length === 0 ? (
                    <div className="text-center py-12 bg-gray-50 rounded-xl border border-gray-100">
                      <div className="mx-auto w-12 h-12 rounded-full bg-amber-50 text-amber-400 flex items-center justify-center mb-3">
                        <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                      </div>
                      <p className="text-gray-900 font-bold">No reviews yet</p>
                      <p className="text-gray-500 text-sm mt-1">Be the first to review this product!</p>
                    </div>
                  ) : (
                    reviews.data.map(review => (
                      <article key={review.id} className="border-b border-gray-100 pb-6 last:border-0 last:pb-0">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="flex text-amber-400 text-sm">
                            {'★'.repeat(review.rating)}<span className="text-gray-200">{'★'.repeat(5 - review.rating)}</span>
                          </div>
                          <span className="text-gray-400 text-xs font-medium">•</span>
                          <span className="text-gray-500 text-xs font-medium">{new Date(review.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                        </div>
                        {review.title && <h3 className="font-bold text-gray-900 mb-1">{review.title}</h3>}
                        <p className="text-gray-600 text-sm whitespace-pre-line leading-relaxed">{review.body}</p>
                        <p className="mt-3 text-xs font-bold text-gray-900">{review.author_name}</p>
                      </article>
                    ))
                  )}
                  
                  {reviews?.last_page > 1 && (
                    <nav className="flex justify-center pt-4">
                      <ul className="flex items-center gap-1">
                        {reviews.links.map((link, idx) => {
                          const isPrevOrNext = link.label.includes('Previous') || link.label.includes('Next');
                          const label = link.label.replace('&laquo; Previous', 'Prev').replace('Next &raquo;', 'Next');
                          
                          if (!link.url) return null;

                          return (
                            <li key={idx}>
                              <button 
                                type="button"
                                onClick={(e) => {
                                  e.preventDefault();
                                  router.get(link.url, {}, { preserveScroll: true });
                                }}
                                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                                  link.active 
                                    ? 'bg-[#f15a24] text-white' 
                                    : 'bg-white border border-gray-200 text-gray-700 hover:border-[#f15a24] hover:text-[#f15a24]'
                                }`}
                              >
                                {label}
                              </button>
                            </li>
                          );
                        })}
                      </ul>
                    </nav>
                  )}
                </div>

                <div className="lg:col-span-5">
                  <div className="bg-gray-50 rounded-xl p-6 border border-gray-100 sticky top-24">
                    <h3 className="font-extrabold text-gray-900 text-lg mb-1">Write a Review</h3>
                    <p className="text-sm text-gray-500 mb-6">Share your thoughts with other customers</p>
                    
                    {!auth?.user ? (
                      <div className="text-center">
                        <Link href={`/login?redirect=/product/${product.slug}#reviews`} className="block w-full bg-[#f15a24] hover:bg-[#d94a1a] text-white font-bold px-5 py-3 rounded-xl transition-colors">
                          Sign in to review
                        </Link>
                      </div>
                    ) : !canReview ? (
                      <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 text-sm text-blue-700 font-medium">
                        You have already submitted a review for this product. Thank you!
                      </div>
                    ) : (
                      <form onSubmit={submitReview} className="space-y-4">
                        <div>
                          <label className="block text-sm font-bold text-gray-900 mb-1.5">Your Name <span className="text-gray-400 font-normal">(Optional)</span></label>
                          <input 
                            type="text" 
                            value={reviewForm.data.author_name}
                            onChange={e => reviewForm.setData('author_name', e.target.value)}
                            placeholder={auth?.user?.name || "Your display name"}
                            className="w-full border-gray-200 rounded-lg text-sm focus:ring-[#f15a24] focus:border-[#f15a24] placeholder-gray-400" 
                          />
                          {reviewForm.errors.author_name && (
                            <p className="text-xs text-red-500 mt-1 font-medium">{reviewForm.errors.author_name}</p>
                          )}
                        </div>
                        <div>
                          <label className="block text-sm font-bold text-gray-900 mb-1.5">Rating</label>
                          <select 
                            value={reviewForm.data.rating}
                            onChange={e => reviewForm.setData('rating', e.target.value)}
                            className="w-full border-gray-200 rounded-lg text-sm focus:ring-[#f15a24] focus:border-[#f15a24] bg-white font-medium"
                          >
                            {[5, 4, 3, 2, 1].map(num => (
                              <option key={num} value={num}>{num} Stars</option>
                            ))}
                          </select>
                          {reviewForm.errors.rating && (
                            <p className="text-xs text-red-500 mt-1 font-medium">{reviewForm.errors.rating}</p>
                          )}
                        </div>
                        <div>
                          <label className="block text-sm font-bold text-gray-900 mb-1.5">Title <span className="text-gray-400 font-normal">(Optional)</span></label>
                          <input 
                            type="text" 
                            value={reviewForm.data.title}
                            onChange={e => reviewForm.setData('title', e.target.value)}
                            placeholder="Sum up your experience"
                            className="w-full border-gray-200 rounded-lg text-sm focus:ring-[#f15a24] focus:border-[#f15a24] placeholder-gray-400" 
                          />
                          {reviewForm.errors.title && (
                            <p className="text-xs text-red-500 mt-1 font-medium">{reviewForm.errors.title}</p>
                          )}
                        </div>
                        <div>
                          <label className="block text-sm font-bold text-gray-900 mb-1.5">Review</label>
                          <textarea 
                            rows="4" 
                            required 
                            value={reviewForm.data.body}
                            onChange={e => reviewForm.setData('body', e.target.value)}
                            placeholder="What did you like or dislike?"
                            className="w-full border-gray-200 rounded-lg text-sm focus:ring-[#f15a24] focus:border-[#f15a24] placeholder-gray-400 resize-none"
                          ></textarea>
                          {reviewForm.errors.body && (
                            <p className="text-xs text-red-500 mt-1 font-medium">{reviewForm.errors.body}</p>
                          )}
                        </div>
                        <button 
                          type="submit" 
                          disabled={reviewForm.processing}
                          className="w-full bg-gray-900 hover:bg-gray-800 text-white font-bold py-3 rounded-xl transition-colors disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer"
                        >
                          {reviewForm.processing ? 'Submitting...' : 'Submit Review'}
                        </button>
                      </form>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Related Products */}
        {related?.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-extrabold text-gray-900 tracking-tight">You Might Also Like</h2>
              <Link href={`/category/${product.category?.slug}`} className="text-sm font-bold text-[#f15a24] hover:text-[#d94a1a] transition-colors">
                View more <span aria-hidden="true">&rarr;</span>
              </Link>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4 lg:gap-5">
              {related.map(rel => (
                <ProductCard key={rel.id} product={rel} />
              ))}
            </div>
          </div>
        )}
      </main>

      <CodOrderModal
        open={showQuickOrder}
        onClose={() => setShowQuickOrder(false)}
        product={product}
        qty={qty}
        variant={getVariantString() || null}
        unitPrice={priceData.price}
        imageUrl={imageUrl}
      />

      {/* Mobile Sticky Bottom Action Bar */}
      {isMobileStickyEnabled && (
        <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-200/90 shadow-[0_-4px_16px_rgba(0,0,0,0.08)] px-3 py-2 flex items-center gap-2">
          {/* Product Thumbnail */}
          <div className="w-10 h-10 rounded-md border border-gray-200 overflow-hidden shrink-0 bg-gray-50 flex items-center justify-center">
            {mainImageUrl ? (
              <img
                src={mainImageUrl}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-400 text-[10px]">
                IMG
              </div>
            )}
          </div>

          {/* Product Name & Current Price */}
          <div className="flex flex-col min-w-0 max-w-[85px] sm:max-w-[115px] shrink-0">
            <span className="text-[11px] sm:text-xs font-bold text-gray-900 truncate leading-tight">
              {product.name}
            </span>
            <span className="text-[11px] sm:text-xs font-extrabold text-[#f43f5e] leading-tight mt-0.5">
              {money(priceData.price)}
            </span>
          </div>

          {/* Add to Cart Button */}
          <button
            type="button"
            onClick={handleAddToCart}
            disabled={!inStock}
            style={{
              backgroundColor: stickyAddCartBgColor,
              color: stickyAddCartTextColor,
              borderColor: stickyAddCartBorderColor,
            }}
            className={`flex-1 min-w-0 h-9 rounded-lg border text-xs font-bold px-1.5 flex items-center justify-center gap-1.5 transition-all active:scale-95 shadow-2xs leading-none shrink-0 ${
              !inStock ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:opacity-95'
            }`}
          >
            <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="9" cy="21" r="1" />
              <circle cx="20" cy="21" r="1" />
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
            </svg>
            <span className="truncate">{inStock ? stickyAddCartText : 'স্টক নেই'}</span>
          </button>

          {/* Buy Now Button */}
          <button
            type="button"
            onClick={() => {
              if (!inStock) return;
              if (isCodEnabled) {
                setShowQuickOrder(true);
              } else {
                handleBuyNow();
              }
            }}
            disabled={!inStock}
            style={{
              backgroundColor: stickyBuyBgColor,
              color: stickyBuyTextColor,
            }}
            className={`flex-1 min-w-0 h-9 rounded-lg text-xs font-bold px-1.5 flex items-center justify-center gap-1.5 transition-all active:scale-95 shadow-2xs leading-none shrink-0 ${
              !inStock ? 'opacity-50 cursor-not-allowed bg-gray-300 text-gray-500' : 'cursor-pointer hover:opacity-95'
            }`}
          >
            <svg className="w-3.5 h-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            <span className="truncate">{inStock ? stickyBuyText : 'স্টক শেষ'}</span>
          </button>
        </div>
      )}
    </StorefrontLayout>
  );
}
