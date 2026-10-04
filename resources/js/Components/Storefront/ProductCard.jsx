import { useState, useEffect } from 'react';
import { Link, usePage, router } from '@inertiajs/react';
import { money, imageUrl, getCardBoxShadow, getCardRadiusClass } from '@/lib/utils';
import { trackAddToCart } from '@/lib/tracking';

export default function ProductCard({ product }) {
  const { app } = usePage().props;
  const [imageError, setImageError] = useState(false);
  const [inWishlist, setInWishlist] = useState(false);
  const [addingToCart, setAddingToCart] = useState(false);
  const [addedSuccess, setAddedSuccess] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const checkWishlist = () => {
      const saved = localStorage.getItem('projoss_wishlist');
      if (saved) {
        try {
          const list = JSON.parse(saved);
          setInWishlist(list.some(p => p.id === product.id));
        } catch (e) {}
      } else {
        setInWishlist(false);
      }
    };
    checkWishlist();
    window.addEventListener('wishlist-updated', checkWishlist);
    return () => window.removeEventListener('wishlist-updated', checkWishlist);
  }, [product.id]);

  const toggleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const saved = localStorage.getItem('projoss_wishlist');
    let list = saved ? JSON.parse(saved) : [];
    
    if (inWishlist) {
      list = list.filter(p => p.id !== product.id);
    } else {
      list.push(product);
    }
    
    localStorage.setItem('projoss_wishlist', JSON.stringify(list));
    setInWishlist(!inWishlist);
    window.dispatchEvent(new Event('wishlist-updated'));
  };
  
  // Calculate discount percentage manually if not passed
  let discount = 0;
  if (product.sale_price && product.regular_price > product.sale_price) {
    discount = Math.round(((product.regular_price - product.sale_price) / product.regular_price) * 100);
  }

  const primaryImage = product.images?.find(img => img.is_primary)?.path || product.images?.[0]?.path;
  const imageSrc = imageUrl(primaryImage, product.name);
  const stock = Math.max(0, parseInt(product.stock_quantity) || 0);
  const rating = Math.max(0, Math.min(5, Math.round(parseFloat(product.rating) || 0)));
  const preset = app.settings?.product_card_preset || 'preset-1';
  const ctaAction = app.settings?.product_cta_action || 'checkout';
  const cardBg = app.settings?.product_card_bg_color || '#FFFFFF';
  const cardText = app.settings?.product_card_text_color || '#111827';
  const cardShadowStyle = app.settings?.product_card_shadow_style || 'subtle';
  const cardShadowColor = app.settings?.product_card_shadow_color || '#000000';
  const cardBorderColor = app.settings?.product_card_border_color || '#f1f5f9';
  const cardBorderRadius = app.settings?.product_card_border_radius || 'preset-default';

  const rawBtnBg = app.settings?.product_card_btn_bg_color;
  const btnBg = (rawBtnBg && rawBtnBg !== '#f15a24') ? rawBtnBg : 'var(--brand-primary, #f15a24)';
  const btnTextColor = app.settings?.product_card_btn_text_color || '#ffffff';
  const secondaryBtnBg = app.settings?.product_card_secondary_btn_bg_color || '#e11d48';
  const secondaryBtnTextColor = app.settings?.product_card_secondary_btn_text_color || '#ffffff';
  const buyText = app.settings?.product_card_buy_text || 'অর্ডার করুন';
  const viewText = app.settings?.product_card_view_text || 'View Details';
  const hasVariants = product.variants_exists;
  const inStock = stock > 0;
  const savings = (product.regular_price && product.sale_price && product.regular_price > product.sale_price)
    ? (product.regular_price - product.sale_price)
    : 0;

  const cardContainerProps = (defaultRadius, extraClass = '') => ({
    onMouseEnter: () => setIsHovered(true),
    onMouseLeave: () => setIsHovered(false),
    style: {
      backgroundColor: cardBg,
      borderColor: cardBorderColor,
      boxShadow: getCardBoxShadow(cardShadowStyle, cardShadowColor, isHovered),
    },
    className: `product-card relative ${getCardRadiusClass(cardBorderRadius, defaultRadius)} border p-2 sm:p-2.5 flex flex-col h-full min-w-0 transition-all duration-300 group ${extraClass}`,
  });

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!inStock || addingToCart) return;

    setAddingToCart(true);
    trackAddToCart({
      id: product.id,
      name: product.name,
      price: product.sale_price || product.regular_price,
      category: product.category?.name,
    }, 1);

    router.post('/cart/add', {
      product_id: product.id,
      qty: 1
    }, {
      preserveScroll: true,
      onSuccess: () => {
        setAddedSuccess(true);
        window.dispatchEvent(new CustomEvent('open-cart'));
        window.dispatchEvent(new Event('cart-updated'));
        setTimeout(() => setAddedSuccess(false), 2000);
      },
      onError: (err) => {
        console.error('Failed to add to cart:', err);
      },
      onFinish: () => {
        setAddingToCart(false);
      }
    });
  };

  const wishlistBtn = (
    <button 
      onClick={toggleWishlist}
      className="absolute right-2 top-2 sm:right-2.5 sm:top-2.5 z-10 p-1 sm:p-1.5 rounded-full bg-white/90 backdrop-blur-xs text-gray-400 hover:text-red-500 hover:bg-white shadow-xs border border-gray-100 transition-all"
      aria-label="Wishlist"
    >
      <svg className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${inWishlist ? 'fill-red-500 text-red-500' : 'fill-none'}`} strokeWidth="2" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
      </svg>
    </button>
  );

  const cartIconBtn = (className = "") => (
    <button
      type="button"
      disabled={!inStock || addingToCart}
      onClick={handleAddToCart}
      title={inStock ? (addedSuccess ? "কার্টে যোগ হয়েছে!" : "কার্টে যোগ করুন (Add to Cart)") : "স্টক আউট"}
      aria-label="কার্টে যোগ করুন"
      className={`flex items-center justify-center shrink-0 border transition-all active:scale-95 shadow-2xs cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed ${
        addedSuccess
          ? 'bg-emerald-600 border-emerald-600 text-white'
          : 'border-gray-200 bg-white hover:bg-gray-50 hover:border-gray-800 text-gray-700 hover:text-gray-900'
      } ${className}`}
    >
      {addingToCart ? (
        <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 animate-spin text-gray-600" viewBox="0 0 24 24" fill="none">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      ) : addedSuccess ? (
        <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
      ) : (
        <svg className="w-4 h-4 sm:w-4.5 sm:h-4.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="9" cy="21" r="1" />
          <circle cx="20" cy="21" r="1" />
          <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
        </svg>
      )}
    </button>
  );

  const circularCartBtn = (
    <button
      type="button"
      disabled={!inStock || addingToCart}
      onClick={handleAddToCart}
      title={inStock ? (addedSuccess ? "কার্টে যোগ হয়েছে!" : "কার্টে যোগ করুন") : "স্টক আউট"}
      aria-label="কার্টে যোগ করুন"
      className={`rounded-full h-8 w-8 min-[360px]:h-8.5 min-[360px]:w-8.5 sm:h-9.5 sm:w-9.5 border flex items-center justify-center shrink-0 transition-all active:scale-95 shadow-2xs cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed ${
        addedSuccess
          ? 'bg-emerald-600 border-emerald-600 text-white'
          : 'border-slate-200 bg-white hover:bg-slate-50 hover:border-slate-400 text-slate-700'
      }`}
    >
      {addingToCart ? (
        <svg className="w-3.5 h-3.5 animate-spin text-gray-600" viewBox="0 0 24 24" fill="none">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      ) : addedSuccess ? (
        <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
      ) : (
        <svg className="w-3.5 h-3.5 min-[360px]:w-4 min-[360px]:h-4 sm:w-4.5 sm:h-4.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="9" cy="21" r="1" />
          <circle cx="20" cy="21" r="1" />
          <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
        </svg>
      )}
    </button>
  );

  /* ──────────────────────────────────────────────────────────────────────────
     PRESET 2: FLASH DEAL & URGENCY STOCK BAR (Urgency Style)
     ────────────────────────────────────────────────────────────────────────── */
  if (preset === 'preset-2') {
    return (
      <article {...cardContainerProps('rounded-[22px]')}>
        <div className="relative shrink-0 aspect-square">
          <Link href={`/product/${product.slug || product.id}`} className="block w-full h-full overflow-hidden bg-gray-50 rounded-[16px]">
            {/* Top-left Save Badge */}
            <div className="absolute left-2 top-2 z-10 max-w-[calc(100%-44px)] flex flex-col items-start pointer-events-none">
              {savings > 0 ? (
                <span className="bg-[#fff1f2] text-[#e11d48] border border-[#fecdd3] text-[8px] min-[360px]:text-[9px] sm:text-[10px] font-extrabold px-1.5 sm:px-2 py-0.5 rounded-md shadow-2xs truncate">
                  সেভ করুন {money(savings)}
                </span>
              ) : discount > 0 ? (
                <span className="bg-[#fff1f2] text-[#e11d48] border border-[#fecdd3] text-[8px] min-[360px]:text-[9px] sm:text-[10px] font-extrabold px-1.5 sm:px-2 py-0.5 rounded-md shadow-2xs truncate">
                  -{discount}% OFF
                </span>
              ) : null}
            </div>

            {/* Bottom-left Flash Deal Timer Pill (Separated from top row to avoid collision on mobile) */}
            <div className="absolute left-2 bottom-2 z-10 flex items-center gap-1 bg-white/95 backdrop-blur-xs text-[#27272a] text-[8px] min-[360px]:text-[8.5px] sm:text-[9.5px] font-bold px-1.5 sm:px-2 py-0.5 rounded-md shadow-2xs border border-gray-200/80 pointer-events-none">
              <svg className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-[#f43f5e] shrink-0" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="10" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6l4 2" />
              </svg>
              <span className="tracking-tight whitespace-nowrap">{product.is_flash_sale ? 'FLASH SALE' : '11D 14:47'}</span>
            </div>

            {imageSrc && !imageError ? (
              <img src={imageSrc} onError={() => setImageError(true)} className="product-img w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt={product.name} loading="lazy" />
            ) : (
              <div className="product-img w-full h-full flex items-center justify-center text-gray-300">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/></svg>
              </div>
            )}
          </Link>
          {wishlistBtn}
        </div>

        <div className="pt-2 px-0.5 sm:px-1 pb-0.5 flex-1 flex flex-col min-w-0 justify-between">
          <div>
            {/* Standardized 2-line title container to keep cards perfectly aligned horizontally */}
            <div className="h-[2.4rem] min-[360px]:h-[2.6rem] sm:h-[2.8rem] mb-1.5 flex items-start overflow-hidden">
              <Link 
                href={`/product/${product.slug || product.id}`} 
                className="text-[12px] min-[360px]:text-[13px] sm:text-[14px] hover:opacity-80 font-bold transition-colors leading-[1.25] line-clamp-2"
                style={{ color: cardText }}
                title={product.name}
              >
                {product.name}
              </Link>
            </div>

            {/* Price */}
            <div className="flex flex-wrap items-baseline gap-1.5 mb-2">
              <span className="font-extrabold text-[#e11d48] text-[13px] min-[360px]:text-[14px] sm:text-base leading-tight">
                {money(product.sale_price || product.regular_price)}
              </span>
              {product.sale_price && product.regular_price > product.sale_price && (
                <span className="text-[10px] sm:text-xs text-gray-400 line-through leading-tight">
                  {money(product.regular_price)}
                </span>
              )}
            </div>

            {/* Urgency Progress Bar */}
            {inStock && stock > 0 ? (
              <div className="mb-2.5">
                <div className="flex items-center justify-between text-[8px] min-[360px]:text-[8.5px] sm:text-[9.5px] font-extrabold uppercase tracking-tight mb-1">
                  <span className="text-gray-500 font-bold truncate">{stock} LEFT</span>
                  <span className="text-[#e11d48] font-black animate-pulse truncate">SELLING FAST</span>
                </div>
                <div className="w-full h-1.5 bg-rose-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-rose-400 to-[#e11d48] rounded-full transition-all duration-500" 
                    style={{ width: `${Math.min(100, Math.max(12, Math.round((stock / 150) * 100)))}%` }}
                  />
                </div>
              </div>
            ) : (
              <div className="mb-2.5">
                <div className="flex items-center justify-between text-[8px] min-[360px]:text-[8.5px] sm:text-[9.5px] font-extrabold uppercase tracking-tight mb-1">
                  <span className="text-gray-400 font-bold truncate">স্টক শেষ</span>
                  <span className="text-gray-400 font-semibold truncate">OUT OF STOCK</span>
                </div>
                <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-gray-300 w-0" />
                </div>
              </div>
            )}
          </div>

          {/* Action Buttons: Pill Order Button + Circular Cart Button */}
          <div className="mt-auto pt-1 flex items-center gap-1.5 sm:gap-2">
            {inStock ? (
              <>
                <Link
                  href={`/product/${product.slug || product.id}`}
                  style={{
                    backgroundColor: btnBg === 'var(--brand-primary, #f15a24)' ? '#ffffff' : btnBg,
                    color: btnBg === 'var(--brand-primary, #f15a24)' ? '#1e293b' : btnTextColor,
                    borderColor: btnBg === 'var(--brand-primary, #f15a24)' ? '#cbd5e1' : btnBg,
                  }}
                  className="flex-1 min-w-0 h-8 min-[360px]:h-8.5 sm:h-9.5 rounded-full border text-[10px] min-[360px]:text-[11px] sm:text-xs font-bold px-1.5 sm:px-2 transition-all hover:bg-slate-50 active:scale-[0.98] flex items-center justify-center shadow-2xs text-center leading-none"
                >
                  <span className="truncate whitespace-nowrap tracking-tight">{buyText}</span>
                </Link>
                {circularCartBtn}
              </>
            ) : (
              <div className="w-full h-8 min-[360px]:h-8.5 sm:h-9.5 rounded-full border border-gray-200 bg-gray-50 text-gray-400 text-[10.5px] sm:text-xs font-bold px-2 flex items-center justify-center opacity-70 cursor-not-allowed leading-none">
                <span className="truncate whitespace-nowrap">স্টক আউট</span>
              </div>
            )}
          </div>
        </div>
      </article>
    );
  }

  /* ──────────────────────────────────────────────────────────────────────────
     PRESET 3: GLAMOUR & BEAUTY DUAL CTA (Cosmetic & Dual Action)
     ────────────────────────────────────────────────────────────────────────── */
  if (preset === 'preset-3') {
    return (
      <article {...cardContainerProps('rounded-[10px]', 'p-2 sm:p-2.5')}>
        <div className="relative shrink-0 aspect-square">
          <Link href={`/product/${product.slug || product.id}`} className="block w-full h-full overflow-hidden bg-gray-50/40 rounded-[6px]">
            {/* Top-left New / Hot badge */}
            <div className="absolute left-2 top-2 z-10 flex flex-col items-start pointer-events-none">
              {product.is_new_arrival || product.is_featured ? (
                <span className="bg-neutral-900 text-white text-[8.5px] min-[360px]:text-[9px] sm:text-[10px] font-bold px-1.5 py-0.5 rounded-[4px] shadow-2xs">
                  New
                </span>
              ) : discount > 0 ? (
                <span className="bg-[#ff007f] text-white text-[8.5px] min-[360px]:text-[9px] sm:text-[10px] font-bold px-1.5 py-0.5 rounded-[4px] shadow-2xs">
                  -{discount}%
                </span>
              ) : null}
            </div>

            {imageSrc && !imageError ? (
              <img src={imageSrc} onError={() => setImageError(true)} className="product-img w-full h-full object-contain p-2 group-hover:scale-105 transition-transform duration-500" alt={product.name} loading="lazy" />
            ) : (
              <div className="product-img w-full h-full flex items-center justify-center text-gray-300">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/></svg>
              </div>
            )}
          </Link>
          {wishlistBtn}
        </div>

        <div className="pt-2 px-0.5 pb-0 flex-1 flex flex-col items-center text-center min-w-0">
          <Link 
            href={`/product/${product.slug || product.id}`} 
            className="block text-[12px] min-[360px]:text-[13px] sm:text-[13.5px] hover:opacity-80 font-bold transition-colors leading-tight line-clamp-2 min-h-[2.6em] mb-1"
            style={{ color: cardText }}
          >
            {product.name}
          </Link>

          {/* Centered Rating Stars */}
          <div className="flex items-center justify-center gap-0.5 mb-1 text-amber-500">
            {[1, 2, 3, 4, 5].map((star) => (
              <svg key={star} className={`w-2.5 h-2.5 sm:w-3 sm:h-3 ${star <= (rating || 5) ? 'fill-amber-400 text-amber-400' : 'fill-gray-200 text-gray-200'}`} viewBox="0 0 20 20" fill="currentColor">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
          </div>

          {/* Centered Price Row */}
          <div className="flex items-baseline justify-center gap-1.5 mb-2.5">
            {product.sale_price && product.regular_price > product.sale_price && (
              <span className="text-[10px] sm:text-xs text-gray-400 line-through">
                {money(product.regular_price)}
              </span>
            )}
            <span className="font-black text-[#ff007f] text-[13.5px] min-[360px]:text-[14.5px] sm:text-base">
              {money(product.sale_price || product.regular_price)}
            </span>
          </div>

          {/* Dual Action Buttons */}
          <div className="mt-auto w-full flex items-center gap-1 sm:gap-1.5">
            <Link
              href={`/product/${product.slug || product.id}`}
              style={{
                backgroundColor: secondaryBtnBg,
                color: secondaryBtnTextColor,
              }}
              className="flex-1 min-w-0 h-8 sm:h-8.5 rounded-[6px] text-[10px] min-[360px]:text-[11px] sm:text-[11.5px] font-bold px-1 flex items-center justify-center gap-0.5 sm:gap-1 transition-all hover:brightness-95 active:scale-95 shadow-2xs leading-none"
            >
              <svg className="w-3 h-3 shrink-0" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              <span className="truncate whitespace-nowrap">{viewText}</span>
            </Link>

            {inStock ? (
              <Link
                href={`/product/${product.slug || product.id}`}
                style={{
                  backgroundColor: btnBg === 'var(--brand-primary, #f15a24)' ? '#18181b' : btnBg,
                  color: btnTextColor,
                }}
                className="flex-1 min-w-0 h-8 sm:h-8.5 rounded-[6px] text-[10px] min-[360px]:text-[11px] sm:text-[11.5px] font-bold px-1 flex items-center justify-center gap-0.5 sm:gap-1 transition-all hover:brightness-95 active:scale-95 shadow-2xs leading-none cursor-pointer"
              >
                <svg className="w-3 h-3 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="9" cy="21" r="1" />
                  <circle cx="20" cy="21" r="1" />
                  <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
                </svg>
                <span className="truncate whitespace-nowrap">{buyText}</span>
              </Link>
            ) : (
              <div className="flex-1 min-w-0 h-8 sm:h-8.5 rounded-[6px] bg-gray-200 text-gray-500 text-[10px] font-bold px-1 flex items-center justify-center opacity-60 cursor-not-allowed leading-none">
                <span className="truncate">স্টক শেষ</span>
              </div>
            )}
          </div>
        </div>
      </article>
    );
  }

  /* ──────────────────────────────────────────────────────────────────────────
     PRESET 4: MINIMAL TECH CLEAN PILL (Clean Minimal Tech)
     ────────────────────────────────────────────────────────────────────────── */
  if (preset === 'preset-4') {
    return (
      <article {...cardContainerProps('rounded-[18px]')}>
        <div className="relative shrink-0 aspect-square">
          <Link href={`/product/${product.slug || product.id}`} className="block w-full h-full overflow-hidden bg-slate-50/70 rounded-[14px]">
            {/* Top-Right Save Badge */}
            {savings > 0 ? (
              <div className="absolute right-2 top-2 z-10 flex items-center gap-1 bg-white/95 text-slate-700 text-[8.5px] min-[360px]:text-[9.5px] sm:text-[10.5px] font-bold px-1.5 sm:px-2 py-0.5 rounded-lg border border-slate-200/80 shadow-2xs pointer-events-none">
                <svg className="w-2.5 h-2.5 text-amber-500 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M17.707 9.293a1 1 0 010 1.414l-7 7a1 1 0 01-1.414 0l-7-7A.997.997 0 012 10V5a3 3 0 013-3h5c.256 0 .512.098.707.293l7 7zM5 6a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                </svg>
                <span>Save {money(savings)}</span>
              </div>
            ) : discount > 0 ? (
              <div className="absolute right-2 top-2 z-10 bg-slate-900 text-white text-[8.5px] min-[360px]:text-[9.5px] sm:text-[10.5px] font-bold px-1.5 sm:px-2 py-0.5 rounded-lg shadow-2xs pointer-events-none">
                -{discount}% OFF
              </div>
            ) : null}

            {imageSrc && !imageError ? (
              <img src={imageSrc} onError={() => setImageError(true)} className="product-img w-full h-full object-contain p-2 group-hover:scale-105 transition-transform duration-500" alt={product.name} loading="lazy" />
            ) : (
              <div className="product-img w-full h-full flex items-center justify-center text-gray-300">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/></svg>
              </div>
            )}
          </Link>
          {wishlistBtn}
        </div>

        <div className="pt-2 px-1 pb-1 sm:p-3 flex-1 flex flex-col min-w-0">
          <Link 
            href={`/product/${product.slug || product.id}`} 
            className="block text-[12px] min-[360px]:text-[13px] sm:text-[14px] hover:text-blue-600 font-semibold transition-colors leading-tight line-clamp-2 min-h-[2.6em] mb-1.5"
            style={{ color: cardText }}
          >
            {product.name}
          </Link>

          <div className="flex flex-wrap items-baseline gap-1.5 mb-2.5">
            <span className="font-extrabold text-slate-900 text-[13px] min-[360px]:text-[14px] sm:text-base">
              {money(product.sale_price || product.regular_price)}
            </span>
            {product.sale_price && product.regular_price > product.sale_price && (
              <span className="text-[10px] sm:text-xs text-slate-400 line-through">
                {money(product.regular_price)}
              </span>
            )}
          </div>

          {/* Action Row: Outline Pill + Round Cart */}
          <div className="mt-auto flex items-center gap-1.5 sm:gap-2">
            {inStock ? (
              <Link
                href={`/product/${product.slug || product.id}`}
                style={{
                  backgroundColor: btnBg === 'var(--brand-primary, #f15a24)' ? '#ffffff' : btnBg,
                  color: btnBg === 'var(--brand-primary, #f15a24)' ? '#0f172a' : btnTextColor,
                  borderColor: btnBg === 'var(--brand-primary, #f15a24)' ? '#cbd5e1' : btnBg,
                }}
                className="flex-1 min-w-0 h-8.5 sm:h-9.5 rounded-full border text-[10.5px] min-[360px]:text-[11.5px] sm:text-xs font-bold px-2 transition-all hover:bg-slate-50 active:scale-[0.98] flex items-center justify-center shadow-2xs text-center leading-none"
              >
                <span className="truncate whitespace-nowrap tracking-tight">{buyText}</span>
              </Link>
            ) : (
              <div className="flex-1 min-w-0 h-8.5 sm:h-9.5 rounded-full border border-gray-200 bg-gray-50 text-gray-400 text-[10px] sm:text-xs font-bold px-2 flex items-center justify-center opacity-60 cursor-not-allowed leading-none">
                <span className="truncate whitespace-nowrap">স্টক আউট</span>
              </div>
            )}

            {circularCartBtn}
          </div>
        </div>
      </article>
    );
  }

  /* ──────────────────────────────────────────────────────────────────────────
     PRESET 5: SOFT PASTEL & FLOATING CART (Distinct New Design)
     ────────────────────────────────────────────────────────────────────────── */
  if (preset === 'preset-5') {
    return (
      <article {...cardContainerProps('rounded-[24px] sm:rounded-[26px]', 'p-2 sm:p-2.5')}>
        <div className="relative shrink-0 aspect-square">
          <Link href={`/product/${product.slug || product.id}`} className="block w-full h-full overflow-hidden bg-rose-50/30 rounded-[18px]">
            {/* Soft pink savings badge top-left */}
            <div className="absolute left-2 top-2 z-10 flex flex-col items-start pointer-events-none">
              {savings > 0 ? (
                <span className="bg-[#fff1f2] border border-[#fecdd3] text-[#e11d48] text-[8.5px] min-[360px]:text-[9.5px] sm:text-[10px] font-extrabold px-1.5 sm:px-2 py-0.5 rounded-lg shadow-2xs">
                  সেভ করুন {money(savings)}
                </span>
              ) : discount > 0 ? (
                <span className="bg-[#fff1f2] border border-[#fecdd3] text-[#e11d48] text-[8.5px] min-[360px]:text-[9.5px] sm:text-[10px] font-extrabold px-1.5 sm:px-2 py-0.5 rounded-lg shadow-2xs">
                  -{discount}%
                </span>
              ) : null}
            </div>

            {imageSrc && !imageError ? (
              <img src={imageSrc} onError={() => setImageError(true)} className="product-img w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt={product.name} loading="lazy" />
            ) : (
              <div className="product-img w-full h-full flex items-center justify-center text-gray-300">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/></svg>
              </div>
            )}
          </Link>
          
          {wishlistBtn}

          {/* Unique Feature: Circular Quick-Add Cart Button Floating on Image Corner */}
          <div className="absolute right-2 bottom-2 z-10">
            {circularCartBtn}
          </div>
        </div>

        <div className="pt-2 px-1 pb-0.5 sm:p-3 flex-1 flex flex-col min-w-0">
          <Link 
            href={`/product/${product.slug || product.id}`} 
            className="block text-[12px] min-[360px]:text-[13px] sm:text-[14px] hover:opacity-80 font-bold transition-colors leading-tight line-clamp-2 min-h-[2.6em] mb-1.5"
            style={{ color: cardText }}
          >
            {product.name}
          </Link>

          <div className="flex flex-wrap items-baseline gap-1.5 mb-2.5">
            <span className="font-black text-[#e11d48] text-[13.5px] min-[360px]:text-[14.5px] sm:text-base">
              {money(product.sale_price || product.regular_price)}
            </span>
            {product.sale_price && product.regular_price > product.sale_price && (
              <span className="text-[10px] sm:text-xs text-slate-400 line-through">
                {money(product.regular_price)}
              </span>
            )}
          </div>

          {/* Full-Width Prominent Order Button */}
          <div className="mt-auto w-full">
            {inStock ? (
              <Link
                href={`/product/${product.slug || product.id}`}
                style={{
                  backgroundColor: btnBg,
                  color: btnTextColor,
                }}
                className="w-full h-8.5 sm:h-9.5 rounded-xl sm:rounded-2xl text-[10.5px] min-[360px]:text-[11.5px] sm:text-xs font-bold px-2 transition-all hover:brightness-95 active:scale-[0.98] flex items-center justify-center gap-1.5 shadow-2xs text-center leading-none"
              >
                <svg className="w-3.5 h-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                <span className="truncate whitespace-nowrap">{buyText}</span>
              </Link>
            ) : (
              <div className="w-full h-8.5 sm:h-9.5 rounded-xl sm:rounded-2xl border border-gray-200 bg-gray-50 text-gray-400 text-[10.5px] sm:text-xs font-bold px-2 flex items-center justify-center opacity-60 cursor-not-allowed leading-none">
                <span className="truncate whitespace-nowrap">স্টক শেষ</span>
              </div>
            )}
          </div>
        </div>
      </article>
    );
  }

  /* ──────────────────────────────────────────────────────────────────────────
     PRESET 1: MODERN COMPACT (Default Balanced Design)
     ────────────────────────────────────────────────────────────────────────── */
  return (
    <article {...cardContainerProps('rounded-[20px]')}>
      <div className="relative shrink-0 aspect-square">
        <Link href={`/product/${product.slug || product.id}`} className="block w-full h-full overflow-hidden bg-gray-50 rounded-[14px]">
          {/* Top-left badge (Always strictly 1 badge: Highest priority shown) */}
          <div className="absolute left-2 top-2 z-10 flex flex-col items-start pointer-events-none">
            {product.is_best_seller ? (
              <span className="bg-amber-500 text-white text-[8.5px] min-[360px]:text-[9px] sm:text-[10px] font-bold px-1.5 sm:px-2 py-0.5 rounded-md shadow-xs flex items-center gap-1">
                <svg className="w-2.5 h-2.5 sm:w-3 sm:h-3 shrink-0" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2c.5 2.5 2 4.5 4 6 2.5 2 3 5 2 8a7 7 0 1 1-13.8-3.5C4.5 11 6 8.5 7.5 7c.5 1.5 1.5 2.5 2.5 3 0-2.5 1-5.5 2-8z"/>
                </svg>
                Best Seller
              </span>
            ) : product.is_flash_sale ? (
              <span className="bg-rose-500 text-white text-[8.5px] min-[360px]:text-[9px] sm:text-[10px] font-bold px-1.5 sm:px-2 py-0.5 rounded-md shadow-xs flex items-center gap-1">
                <svg className="w-2.5 h-2.5 sm:w-3 sm:h-3 shrink-0" viewBox="0 0 24 24" fill="currentColor">
                  <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
                </svg>
                Hot Offer
              </span>
            ) : product.is_new_arrival ? (
              <span className="bg-blue-600 text-white text-[8.5px] min-[360px]:text-[9px] sm:text-[10px] font-bold px-1.5 sm:px-2 py-0.5 rounded-md shadow-xs flex items-center gap-1">
                <svg className="w-2.5 h-2.5 sm:w-3 sm:h-3 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/>
                </svg>
                New Arrival
              </span>
            ) : product.is_featured ? (
              <span className="bg-purple-600 text-white text-[8.5px] min-[360px]:text-[9px] sm:text-[10px] font-bold px-1.5 sm:px-2 py-0.5 rounded-md shadow-xs flex items-center gap-1">
                <svg className="w-2.5 h-2.5 sm:w-3 sm:h-3 shrink-0" viewBox="0 0 24 24" fill="currentColor">
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                </svg>
                Featured
              </span>
            ) : discount > 0 ? (
              <span className="bg-[#00D06C] text-white text-[9px] min-[360px]:text-[10px] sm:text-[11px] font-bold px-1.5 sm:px-2 py-0.5 rounded-md shadow-xs">
                -{discount}%
              </span>
            ) : product.is_free_shipping ? (
              <span className="bg-emerald-600 text-white text-[8.5px] font-bold px-1.5 py-0.5 rounded-md shadow-xs flex items-center gap-1">
                <svg className="w-2.5 h-2.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/></svg>
                Free Delivery
              </span>
            ) : null}
          </div>
          {imageSrc && !imageError ? (
            <img src={imageSrc} onError={() => setImageError(true)} className="product-img w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt={product.name} loading="lazy" />
          ) : (
            <div className="product-img w-full h-full flex items-center justify-center text-gray-300">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/></svg>
            </div>
          )}
        </Link>
        {wishlistBtn}
      </div>
      
      <div className="pt-2 px-1 pb-1 sm:p-3 flex-1 flex flex-col min-w-0">
        <div className="flex items-center justify-between gap-1 mb-1">
          <span className="text-[8.5px] min-[360px]:text-[9.5px] sm:text-[10px] font-bold text-gray-500 uppercase tracking-wider truncate block">
            {product.category?.name || 'Category'}
          </span>
          {product.brand && (
            <span className="text-[8.5px] min-[360px]:text-[9.5px] sm:text-[10px] font-semibold text-gray-400 truncate">
              {product.brand}
            </span>
          )}
        </div>
        
        <div className="flex items-start justify-between gap-1.5 mb-2.5 sm:mb-3">
          <Link 
            href={`/product/${product.slug || product.id}`} 
            className="block text-[12px] min-[360px]:text-[13px] sm:text-[14px] hover:opacity-80 font-bold transition-colors leading-tight line-clamp-2 min-h-[2.6em] pr-1"
            style={{ color: cardText }}
          >
            {product.name}
          </Link>
          
          <div className="flex flex-col items-end shrink-0 leading-tight mt-0.5">
            <span className="whitespace-nowrap font-bold text-gray-900 text-[12px] min-[360px]:text-[13px] sm:text-[14px]">
              {money(product.sale_price || product.regular_price)}
            </span>
            {product.sale_price && product.regular_price > product.sale_price && (
              <span className="whitespace-nowrap text-[9.5px] min-[360px]:text-[10px] sm:text-[11px] text-gray-400 line-through mt-0.5">
                {money(product.regular_price)}
              </span>
            )}
          </div>
        </div>
        
        <div className="mt-auto flex items-center gap-1.5 sm:gap-2">
          {/* Quick Add To Cart Button */}
          {cartIconBtn("h-8.5 w-8.5 sm:h-9.5 sm:w-9.5 rounded-lg sm:rounded-xl shrink-0")}

          {/* Primary Order Now Button */}
          {inStock ? (
            <Link
              href={`/product/${product.slug || product.id}`}
              style={{
                backgroundColor: btnBg,
                color: btnTextColor,
              }}
              className="flex-1 min-w-0 h-8.5 sm:h-9.5 rounded-lg sm:rounded-xl text-[10px] min-[360px]:text-[11px] sm:text-xs font-bold px-1.5 sm:px-2 transition-all hover:brightness-95 active:scale-[0.98] flex items-center justify-center gap-1 shadow-2xs text-center leading-none"
            >
              <svg className="w-3 h-3 sm:w-3.5 sm:h-3.5 shrink-0" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              <span className="truncate whitespace-nowrap tracking-tight">{buyText}</span>
            </Link>
          ) : (
            <div
              style={{
                backgroundColor: '#9ca3af',
                color: '#ffffff',
              }}
              className="flex-1 min-w-0 h-8.5 sm:h-9.5 rounded-lg sm:rounded-xl text-[10px] min-[360px]:text-[11px] sm:text-xs font-bold px-1.5 sm:px-2 flex items-center justify-center gap-1 shadow-2xs opacity-50 cursor-not-allowed text-center leading-none"
            >
              <span className="truncate whitespace-nowrap tracking-tight">স্টক আউট</span>
            </div>
          )}
        </div>
      </div>
    </article>
  );
}
