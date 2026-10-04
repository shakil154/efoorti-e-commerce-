import { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { imageUrl } from '@/lib/utils';

export default function CustomerReviewScreenshots({
  screenshots = [],
  config = {},
}) {
  const [lightboxIndex, setLightboxIndex] = useState(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isTouching, setIsTouching] = useState(false);
  const scrollRef = useRef(null);
  const touchTimerRef = useRef(null);

  const title = config.title || 'Customer Reviews & Feedback';
  const subtitle = config.subtitle || 'আমাদের সম্মানিত কাস্টমারদের বাস্তব অভিজ্ঞতা ও রিভিউ';
  const autoplay = config.autoplay === true || config.autoplay === '1' || config.autoplay === 1;
  const speed = config.speed || 'normal';

  // Interval duration based on speed setting
  const intervalMs = speed === 'fast' ? 2200 : speed === 'slow' ? 4500 : 3200;

  // Filter only active screenshots
  const items = useMemo(() => {
    return (screenshots || []).filter(s => s.is_active !== false);
  }, [screenshots]);

  // If items are few (e.g. 1-4), repeat them so there's always enough items to scroll across desktop & mobile
  const displayItems = useMemo(() => {
    if (!items.length) return [];
    if (items.length >= 8) {
      return items.map((item, idx) => ({
        ...item,
        uniqueKey: `item-${item.id}-${idx}`,
        originalIndex: idx,
      }));
    }

    // Repeat items to fill carousel track
    let repeated = [];
    const targetMin = Math.max(9, items.length * 3);
    while (repeated.length < targetMin) {
      repeated = [...repeated, ...items];
    }
    return repeated.map((item, idx) => ({
      ...item,
      uniqueKey: `item-${item.id}-${idx}`,
      originalIndex: idx % items.length,
    }));
  }, [items]);

  const scroll = (direction) => {
    if (!scrollRef.current) return;
    const cardEl = scrollRef.current.firstElementChild;
    const step = cardEl ? cardEl.offsetWidth + 20 : 300;
    const offset = direction === 'left' ? -step : step;
    scrollRef.current.scrollBy({ left: offset, behavior: 'smooth' });
  };

  // Autoplay functionality
  useEffect(() => {
    if (!autoplay || isHovered || isTouching || items.length <= 1 || lightboxIndex !== null) {
      return;
    }

    const timer = setInterval(() => {
      const el = scrollRef.current;
      if (!el) return;

      const { scrollLeft, scrollWidth, clientWidth } = el;
      const cardEl = el.firstElementChild;
      const step = cardEl ? cardEl.offsetWidth + 20 : 280;

      // If reached the end of the scroll track, loop back smoothly
      if (scrollLeft + clientWidth >= scrollWidth - 25) {
        el.scrollTo({ left: 0, behavior: 'smooth' });
      } else {
        el.scrollBy({ left: step, behavior: 'smooth' });
      }
    }, intervalMs);

    return () => clearInterval(timer);
  }, [autoplay, isHovered, isTouching, items.length, lightboxIndex, intervalMs]);

  // Touch event handlers for mobile
  const handleTouchStart = () => {
    setIsTouching(true);
    if (touchTimerRef.current) clearTimeout(touchTimerRef.current);
  };

  const handleTouchEnd = () => {
    // Resume autoplay 3 seconds after touch ends
    if (touchTimerRef.current) clearTimeout(touchTimerRef.current);
    touchTimerRef.current = setTimeout(() => {
      setIsTouching(false);
    }, 3000);
  };

  // Keyboard navigation for Lightbox
  const handleKeyDown = useCallback((e) => {
    if (lightboxIndex === null) return;
    if (e.key === 'Escape') {
      setLightboxIndex(null);
    } else if (e.key === 'ArrowRight') {
      setLightboxIndex((prev) => (prev + 1) % items.length);
    } else if (e.key === 'ArrowLeft') {
      setLightboxIndex((prev) => (prev - 1 + items.length) % items.length);
    }
  }, [lightboxIndex, items.length]);

  useEffect(() => {
    if (lightboxIndex !== null) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [lightboxIndex, handleKeyDown]);

  const isEnabled = config.enabled !== false && config.enabled !== '0' && config.enabled !== 0;

  if (!isEnabled || !items || items.length === 0) {
    return null;
  }

  const getPlatformInfo = (platform) => {
    switch (platform) {
      case 'facebook':
        return {
          name: 'Facebook Review',
          bg: 'bg-blue-600/90 text-white',
          icon: (
            <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.477 2 2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.879V14.89h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.989C18.343 21.129 22 16.99 22 12c0-5.523-4.477-10-10-10z"/>
            </svg>
          ),
        };
      case 'whatsapp':
        return {
          name: 'WhatsApp Feedback',
          bg: 'bg-[#25D366]/90 text-white',
          icon: (
            <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0012.04 2z"/>
            </svg>
          ),
        };
      case 'instagram':
        return {
          name: 'Instagram DM',
          bg: 'bg-gradient-to-r from-purple-600 to-pink-500 text-white',
          icon: (
            <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
            </svg>
          ),
        };
      default:
        return {
          name: 'Verified Review',
          bg: 'bg-gray-800/90 text-white',
          icon: (
            <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/>
            </svg>
          ),
        };
    }
  };

  const activeLightboxItem = lightboxIndex !== null ? items[lightboxIndex] : null;

  return (
    <section className="mx-auto max-w-7xl px-3 sm:px-6 lg:px-8 py-8 sm:py-12 my-2 sm:my-4">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6 sm:mb-8">
        <div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-gray-900 tracking-tight">
            {title}
          </h2>
          {subtitle && (
            <p className="text-xs sm:text-sm text-gray-500 mt-1 max-w-xl">
              {subtitle}
            </p>
          )}
        </div>

        {/* Carousel Arrow Controls (Visible on Desktop & Mobile) */}
        <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
          <button
            type="button"
            onClick={() => scroll('left')}
            className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white hover:bg-orange-500 hover:text-white border border-gray-200 text-gray-700 flex items-center justify-center transition-all duration-200 shadow-xs cursor-pointer active:scale-95"
            aria-label="Previous reviews"
          >
            <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7"/>
            </svg>
          </button>
          <button
            type="button"
            onClick={() => scroll('right')}
            className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white hover:bg-orange-500 hover:text-white border border-gray-200 text-gray-700 flex items-center justify-center transition-all duration-200 shadow-xs cursor-pointer active:scale-95"
            aria-label="Next reviews"
          >
            <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7"/>
            </svg>
          </button>
        </div>
      </div>

      {/* Horizontal Carousel Track */}
      <div
        className="relative group/carousel"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <div
          ref={scrollRef}
          className="flex overflow-x-auto snap-x snap-mandatory gap-3.5 sm:gap-6 pb-4 pt-1 no-scrollbar scroll-smooth -mx-3 px-3 sm:mx-0 sm:px-0"
        >
          {displayItems.map((item) => {
            const platform = getPlatformInfo(item.platform);
            return (
              <div
                key={item.uniqueKey}
                onClick={() => setLightboxIndex(item.originalIndex)}
                className="w-[230px] xs:w-[250px] sm:w-[280px] md:w-[300px] shrink-0 snap-start bg-white rounded-2xl sm:rounded-3xl p-2.5 sm:p-3.5 border border-gray-100 shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_12px_30px_rgba(241,90,36,0.12)] hover:border-orange-200/80 transition-all duration-300 hover:-translate-y-1.5 group cursor-pointer flex flex-col justify-between select-none"
              >
                {/* Mobile Chat Frame Image Container */}
                <div className="relative rounded-xl sm:rounded-2xl overflow-hidden aspect-[9/15] bg-gray-100 w-full">
                  <img
                    src={imageUrl(item.image)}
                    alt={item.customer_name || 'Customer Review'}
                    className="w-full h-full object-cover object-top group-hover:scale-[1.03] transition-transform duration-500 pointer-events-none"
                    loading="lazy"
                  />

                  {/* Top Floating Glass Platform Badge */}
                  <div className="absolute top-2 left-2 right-2 flex items-center justify-between pointer-events-none gap-1">
                    <span className={`inline-flex items-center gap-1 sm:gap-1.5 px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-[11px] font-bold backdrop-blur-md shadow-xs truncate ${platform.bg}`}>
                      {platform.icon}
                      <span className="truncate">{platform.name}</span>
                    </span>

                    {/* Star Rating Badge */}
                    <span className="px-1.5 sm:px-2 py-0.5 rounded-full text-[9px] sm:text-[10px] font-extrabold bg-black/65 text-white backdrop-blur-xs flex items-center gap-0.5 shrink-0">
                      <span className="text-amber-400">★</span> {item.rating || 5}.0
                    </span>
                  </div>

                  {/* Hover Center Zoom CTA Button */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center p-4">
                    <span className="px-3.5 py-1.5 sm:px-4 sm:py-2 bg-white/95 backdrop-blur-sm text-gray-900 rounded-full text-[11px] sm:text-xs font-bold flex items-center gap-1.5 shadow-xl transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                      <svg className="w-3.5 h-3.5 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v6m3-3H7"/>
                      </svg>
                      বড় করে পড়ুন
                    </span>
                  </div>
                </div>

                {/* Card Meta Box */}
                <div className="pt-2.5 sm:pt-3 px-1">
                  <div className="flex items-center justify-between gap-1.5">
                    <h3 className="font-bold text-gray-900 text-xs sm:text-sm truncate">
                      {item.customer_name || item.title || 'Happy Customer'}
                    </h3>
                    <span className="text-[9px] sm:text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded-full border border-emerald-200/80 shrink-0">
                      ✓ {item.badge || 'Verified Buyer'}
                    </span>
                  </div>

                  {item.review_text && (
                    <p className="text-[11px] sm:text-xs text-gray-500 mt-1 line-clamp-2 italic leading-relaxed">
                      "{item.review_text}"
                    </p>
                  )}

                  <div className="mt-2 pt-2 border-t border-gray-100 flex items-center justify-between text-[10px] sm:text-[11px] text-gray-400 font-medium">
                    <div className="flex items-center gap-0.5 text-amber-400">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <span key={i} className="text-xs leading-none">★</span>
                      ))}
                    </div>
                    <span className="text-orange-500 font-bold group-hover:underline flex items-center gap-0.5">
                      রিভিউ দেখুন &rarr;
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Mobile Swipe Hint */}
        <div className="sm:hidden flex items-center justify-center gap-1.5 text-[11px] text-gray-400 mt-2 font-medium">
          <svg className="w-3.5 h-3.5 animate-pulse text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"/>
          </svg>
          <span>আঙুল দিয়ে বামে-ডানে সোয়াইপ করে সব স্ক্রিনশট দেখুন</span>
        </div>
      </div>

      {/* Lightbox Modal */}
      {lightboxIndex !== null && activeLightboxItem && (
        <div
          className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 select-none animate-in fade-in duration-200"
          onClick={() => setLightboxIndex(null)}
        >
          {/* Top Bar with counter & close */}
          <div className="absolute top-4 left-4 right-4 flex items-center justify-between text-white z-20">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-bold">
                রিভিউ {lightboxIndex + 1} / {items.length}
              </span>
              <span className="text-xs text-white/70 hidden sm:inline">
                (তীর বা কীবোর্ড দিয়ে পরের ছবি দেখুন)
              </span>
            </div>

            <button
              type="button"
              onClick={() => setLightboxIndex(null)}
              className="p-2 sm:p-2.5 rounded-full bg-white/10 hover:bg-white/25 text-white transition-colors cursor-pointer flex items-center gap-1.5 text-xs font-bold"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/>
              </svg>
              <span className="hidden sm:inline">বন্ধ করুন (Esc)</span>
            </button>
          </div>

          {/* Left Arrow Button */}
          {items.length > 1 && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setLightboxIndex((prev) => (prev - 1 + items.length) % items.length);
              }}
              className="absolute left-2 sm:left-6 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-14 sm:h-14 rounded-full bg-white/15 hover:bg-white/30 text-white backdrop-blur-md flex items-center justify-center transition-all cursor-pointer z-20 active:scale-95"
              aria-label="Previous"
            >
              <svg className="w-6 h-6 sm:w-8 sm:h-8" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7"/>
              </svg>
            </button>
          )}

          {/* Right Arrow Button */}
          {items.length > 1 && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setLightboxIndex((prev) => (prev + 1) % items.length);
              }}
              className="absolute right-2 sm:right-6 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-14 sm:h-14 rounded-full bg-white/15 hover:bg-white/30 text-white backdrop-blur-md flex items-center justify-center transition-all cursor-pointer z-20 active:scale-95"
              aria-label="Next"
            >
              <svg className="w-6 h-6 sm:w-8 sm:h-8" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7"/>
              </svg>
            </button>
          )}

          {/* Center Lightbox Card */}
          <div
            className="relative max-h-[92vh] max-w-lg w-full flex flex-col items-center justify-center py-8"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl border border-white/20 bg-black/40">
              <img
                src={imageUrl(activeLightboxItem.image)}
                alt={activeLightboxItem.customer_name || 'Customer Review'}
                className="max-h-[75vh] w-auto max-w-full object-contain mx-auto"
              />

              {/* Bottom Customer Info Overlay */}
              <div className="bg-gradient-to-t from-black/90 via-black/70 to-transparent p-4 text-white text-center">
                <div className="flex items-center justify-center gap-2 mb-1">
                  <h4 className="font-bold text-sm sm:text-base">
                    {activeLightboxItem.customer_name || activeLightboxItem.title || 'Customer Review'}
                  </h4>
                  <span className="text-xs text-amber-400">★★★★★</span>
                </div>
                {activeLightboxItem.review_text && (
                  <p className="text-xs text-gray-200 line-clamp-2 max-w-md mx-auto">
                    "{activeLightboxItem.review_text}"
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
