import StorefrontLayout from '@/Layouts/StorefrontLayout';
import { useEffect, useRef, useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import ProductCard from '@/Components/Storefront/ProductCard';
import CustomerReviewScreenshots from '@/Components/Storefront/CustomerReviewScreenshots';
import { imageUrl } from '@/lib/utils';
function RenderFeatureIcon({ icon, sizeClass = "h-5 w-5" }) {
  if (!icon) {
    return (
      <svg className={sizeClass} fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    );
  }
  const str = icon.trim();
  if (str.startsWith('<svg')) {
    return (
      <div
        className={`${sizeClass} flex items-center justify-center [&>svg]:w-full [&>svg]:h-full`}
        dangerouslySetInnerHTML={{ __html: str }}
      />
    );
  }
  return (
    <svg className={sizeClass} fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d={str} />
    </svg>
  );
}

export default function HomePage({ 
  heroBanners = [], 
  heroSideBanner = null,
  middleBanners = [],
  features, 
  featuredCategories, 
  coupons, 
  flashProducts, 
  trending, 
  bestSellers, 
  newArrivals,
  reviewScreenshots = [],
  reviewScreenshotsConfig = {},
  app 
}) {
  const ctaDefault = app?.settings?.default_cta_text || 'Shop now';
  const viewMore = app?.settings?.home_view_more_label || 'View all';
  
  const catSliderRef = useRef(null);
  const [activeSlide, setActiveSlide] = useState(0);
  const [isSliderHovered, setIsSliderHovered] = useState(false);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  const nextSlide = () => {
    if (!heroBanners?.length) return;
    setActiveSlide((prev) => (prev + 1) % heroBanners.length);
  };

  const prevSlide = () => {
    if (!heroBanners?.length) return;
    setActiveSlide((prev) => (prev - 1 + heroBanners.length) % heroBanners.length);
  };

  const scrollToSlide = (index) => {
    setActiveSlide(index);
  };

  const handleTouchStart = (e) => {
    if (e.touches && e.touches.length > 0) {
      touchStartX.current = e.touches[0].clientX;
      touchEndX.current = 0;
    }
  };

  const handleTouchMove = (e) => {
    if (e.touches && e.touches.length > 0) {
      touchEndX.current = e.touches[0].clientX;
    }
  };

  const handleTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return;
    const diff = touchStartX.current - touchEndX.current;
    if (diff > 40) {
      nextSlide();
    } else if (diff < -40) {
      prevSlide();
    }
    touchStartX.current = 0;
    touchEndX.current = 0;
  };

  useEffect(() => {
    if (!heroBanners || heroBanners.length <= 1 || isSliderHovered) return;
    const heroInterval = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % heroBanners.length);
    }, 4500);

    return () => clearInterval(heroInterval);
  }, [heroBanners, isSliderHovered]);

  useEffect(() => {
    const catInterval = setInterval(() => {
      if (catSliderRef.current && featuredCategories?.length > 0) {
        const { scrollLeft, scrollWidth, clientWidth } = catSliderRef.current;
        if (scrollLeft + clientWidth >= scrollWidth - 10) {
          catSliderRef.current.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
          catSliderRef.current.scrollBy({ left: 200, behavior: 'smooth' });
        }
      }
    }, 3000);

    return () => clearInterval(catInterval);
  }, [featuredCategories]);
  
  // Basic coupon styles array
  const couponStyles = [
    { bg: 'bg-[#f15a24]', btn: 'bg-white text-[#f15a24]' },
    { bg: 'bg-[#1f2430]', btn: 'bg-[#f15a24] text-white' },
    { bg: 'bg-rose-500', btn: 'bg-white text-rose-600' },
    { bg: 'bg-emerald-600', btn: 'bg-white text-emerald-700' },
  ];

  return (
    <StorefrontLayout>
      <Head title="" />
      
      {/* Hero Section */}
      <section className="mx-auto max-w-7xl px-3 sm:px-6 lg:px-8 pt-6 min-w-0">
        <div className="flex flex-col gap-4 items-stretch">
          
          {/* Hero Slider & Side Banner Area */}
          <div className={`grid grid-cols-1 ${heroSideBanner ? 'lg:grid-cols-[2.5fr_1fr]' : ''} gap-3.5 sm:gap-4 w-full items-stretch`}>
            {/* Left Slider Container */}
            <div 
              className="relative rounded-2xl overflow-hidden aspect-[16/9] sm:aspect-[2/1] lg:aspect-auto lg:h-[420px] bg-gray-100 group shadow-2xs select-none"
              onMouseEnter={() => setIsSliderHovered(true)}
              onMouseLeave={() => setIsSliderHovered(false)}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
            >
              {/* Slides Track using CSS Transform */}
              <div 
                className="flex w-full h-full transition-transform duration-500 ease-out"
                style={{ transform: `translateX(-${activeSlide * 100}%)` }}
              >
                 {heroBanners?.length > 0 ? (
                   heroBanners.map((banner, index) => (
                     <div key={banner.id || index} className="w-full shrink-0 h-full relative">
                       <a 
                         href={banner.link_url || '/shop'} 
                         className="block w-full h-full relative"
                         title={banner.title || 'Banner'}
                       >
                         {banner.image ? (
                           <img 
                             src={imageUrl(banner.image)} 
                             className="w-full h-full object-cover object-center pointer-events-none select-none" 
                             alt={banner.title || 'Slide'} 
                           />
                         ) : (
                           <div className="w-full h-full bg-gradient-to-r from-[#f15a24] to-[#f37c4f] flex items-center justify-center p-6 text-white text-center">
                             <h2 className="text-2xl font-bold">{banner.title || app?.name}</h2>
                           </div>
                         )}
                         {banner.badge && (
                           <span className="absolute top-3.5 left-3.5 bg-[#f15a24] text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">
                             {banner.badge}
                           </span>
                         )}
                       </a>
                     </div>
                   ))
                 ) : (
                   <div className="w-full h-full flex items-center justify-center p-8 sm:p-12 text-center bg-gray-100 text-gray-500 shrink-0">
                     <div>
                       <h1 className="text-2xl sm:text-4xl font-extrabold mb-3 text-gray-800">Welcome to {app?.name || 'Projoss'}</h1>
                       <p className="mb-5 text-xs sm:text-sm text-gray-500 max-w-md mx-auto">Discover authentic items with nationwide fast cash-on-delivery delivery.</p>
                       <Link href="/shop" className="inline-block bg-[#f15a24] text-white px-7 py-2.5 rounded-full font-bold text-xs sm:text-sm shadow-sm hover:bg-[#d84815] transition-all">
                         {ctaDefault}
                       </Link>
                     </div>
                   </div>
                 )}
              </div>
               
              {/* Arrow Controls (visible when more than 1 banner) */}
              {heroBanners?.length > 1 && (
                <>
                  <button 
                    type="button"
                    onClick={prevSlide} 
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 md:w-10 md:h-10 bg-white/90 hover:bg-white shadow-md flex items-center justify-center rounded-full text-[#f15a24] opacity-80 md:opacity-0 group-hover:opacity-100 transition-all z-20 cursor-pointer"
                    aria-label="Previous slide"
                  >
                    <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7"/></svg>
                  </button>
                  <button 
                    type="button"
                    onClick={nextSlide} 
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 md:w-10 md:h-10 bg-white/90 hover:bg-white shadow-md flex items-center justify-center rounded-full text-[#f15a24] opacity-80 md:opacity-0 group-hover:opacity-100 transition-all z-20 cursor-pointer"
                    aria-label="Next slide"
                  >
                    <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7"/></svg>
                  </button>
                  
                  {/* Dynamic Slide Dots */}
                  <div className="absolute bottom-3 sm:bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-1.5 z-20 bg-black/25 backdrop-blur-xs px-2.5 py-1 rounded-full">
                    {heroBanners.map((_, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => scrollToSlide(i)}
                        className={`transition-all rounded-full cursor-pointer ${
                          i === activeSlide 
                            ? 'w-5 sm:w-6 h-2 bg-[#f15a24] shadow-xs' 
                            : 'w-2 h-2 bg-white/70 hover:bg-white'
                        }`}
                        aria-label={`Go to slide ${i + 1}`}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Right Static / Dedicated Side Banner (Hidden on mobile, visible on desktop) */}
            {heroSideBanner && (
              <div className="hidden lg:block relative rounded-2xl overflow-hidden lg:h-[420px] bg-orange-50 group shadow-2xs">
                <a 
                  href={heroSideBanner.link_url || '/shop'} 
                  className="block w-full h-full relative"
                  title={heroSideBanner.title || 'Special Offer'}
                >
                  {heroSideBanner.image ? (
                    <img 
                      src={imageUrl(heroSideBanner.image)} 
                      className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500" 
                      alt={heroSideBanner.title || 'Offer'} 
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-center p-6 bg-gradient-to-br from-orange-100 to-orange-50">
                       <div className="w-16 h-16 bg-orange-200 rounded-full flex items-center justify-center mb-3">
                         <svg className="w-8 h-8 text-orange-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7"/></svg>
                       </div>
                       <h3 className="text-xl font-bold text-gray-800 mb-1">{heroSideBanner.title || 'Special Offer'}</h3>
                       <p className="text-gray-600 text-xs font-medium">{heroSideBanner.subtitle || 'Shop our exclusive deals'}</p>
                    </div>
                  )}
                  {heroSideBanner.badge && (
                    <span className="absolute top-3.5 left-3.5 bg-[#f15a24] text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">
                      {heroSideBanner.badge}
                    </span>
                  )}
                </a>
              </div>
            )}
          </div>

          {/* Features Bottom Row */}
          {features?.length > 0 && (
            <div className="hidden xl:flex items-center justify-between gap-4 mt-2">
              {features.slice(0, 4).map((feature) => (
                <div key={feature.id} className="rounded-xl bg-white border border-gray-100 p-4 flex items-center gap-3 flex-1">
                  <div className="grid h-10 w-10 place-items-center rounded-full bg-[#f15a24]/10 text-[#f15a24] shrink-0">
                    <RenderFeatureIcon icon={feature.icon} sizeClass="h-5 w-5" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-bold leading-tight truncate text-gray-800">{feature.title}</p>
                    {feature.subtitle && <p className="text-xs text-gray-500 truncate mt-0.5">{feature.subtitle}</p>}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Mobile Features */}
        {features?.length > 0 && (
          <div className="grid grid-cols-2 gap-3 xl:hidden mt-4">
            {features.slice(0, 4).map((feature) => (
              <div key={feature.id} className="rounded-xl bg-white border border-gray-100 p-3 flex items-center gap-2.5">
                <div className="grid h-9 w-9 place-items-center rounded-full bg-[#f15a24]/10 text-[#f15a24] shrink-0">
                  <RenderFeatureIcon icon={feature.icon} sizeClass="h-4 w-4" />
                </div>
                <div className="min-w-0">
                  <p className="text-[13px] font-bold leading-snug truncate text-gray-800">{feature.title}</p>
                  {feature.subtitle && <p className="text-[11px] text-gray-500 truncate">{feature.subtitle}</p>}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Categories Grid */}
      {featuredCategories?.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 mt-2">
          <div className="flex items-center justify-center mb-8">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">Featured Categories</h2>
          </div>
          
          <div className="relative group">
            {/* Scrollable Container */}
            <div ref={catSliderRef} className="flex overflow-x-auto snap-x snap-mandatory gap-4 sm:gap-6 pb-4 no-scrollbar scroll-smooth">
              {featuredCategories.map((cat) => (
                <Link key={cat.id} href={`/category/${cat.slug}`} className="group/item flex flex-col items-center text-center shrink-0 w-24 sm:w-32 snap-start">
                  <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-[24px] bg-white shadow-sm border border-gray-100 overflow-hidden group-hover/item:shadow-lg group-hover/item:border-[#f15a24]/30 transition-all duration-300 group-hover/item:-translate-y-1 flex items-center justify-center p-3">
                    {cat.image ? (
                       <img src={imageUrl(cat.image)} alt={cat.name} className="w-full h-full object-contain" />
                    ) : (
                       <div className="w-full h-full flex items-center justify-center text-3xl sm:text-4xl bg-gray-50 text-gray-300 rounded-xl group-hover/item:text-[#f15a24] transition-colors">
                         {cat.icon ? <span dangerouslySetInnerHTML={{__html: cat.icon}} className="flex items-center justify-center w-10 h-10"/> : '📦'}
                       </div>
                    )}
                  </div>
                  <span className="mt-3 text-[13px] sm:text-sm font-bold text-gray-800 group-hover/item:text-[#f15a24] transition-colors line-clamp-2 leading-tight">{cat.name}</span>
                </Link>
              ))}
            </div>
            
            {/* Hover Arrows for Categories */}
            <button 
              onClick={() => catSliderRef.current?.scrollBy({ left: -300, behavior: 'smooth' })}
              className="hidden md:flex absolute -left-4 top-14 -translate-y-1/2 w-10 h-10 rounded-full bg-white shadow-md border border-gray-100 text-[#f15a24] items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10 hover:bg-gray-50"
              aria-label="Previous"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7"/></svg>
            </button>
            <button 
              onClick={() => catSliderRef.current?.scrollBy({ left: 300, behavior: 'smooth' })}
              className="hidden md:flex absolute -right-4 top-14 -translate-y-1/2 w-10 h-10 rounded-full bg-white shadow-md border border-gray-100 text-[#f15a24] items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10 hover:bg-gray-50"
              aria-label="Next"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7"/></svg>
            </button>
          </div>
        </section>
      )}

      {/* Trending / Featured Products */}
      {trending?.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-end justify-between mb-6 border-b border-gray-100 pb-4">
            <div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">Just For You</h2>
              <p className="text-gray-500 text-sm mt-1">Discover trending products</p>
            </div>
            <Link href="/shop?featured=1" className="text-sm font-bold text-[#f15a24] hover:underline flex items-center gap-1 mb-1">
              {viewMore} <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4 lg:gap-5">
            {trending.slice(0, 5).map((product, idx) => (
              <div key={product.id} className={`h-full min-w-0 ${idx >= 4 ? 'hidden lg:block' : ''}`}>
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Middle Banners */}
      {middleBanners?.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col gap-6">
            {middleBanners.map(banner => (
              <a 
                key={banner.id} 
                href={banner.link_url || banner.link || '/shop'} 
                className="block w-full overflow-hidden rounded-2xl shadow-sm hover:shadow-md transition-shadow group relative bg-gray-100"
              >
                {banner.image ? (
                  <img 
                    src={imageUrl(banner.image)} 
                    alt={banner.title || 'Banner'} 
                    className="w-full h-auto object-cover max-h-[400px] group-hover:scale-[1.02] transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-[300px] flex items-center justify-center text-gray-400 bg-gray-200">
                    <span className="font-semibold">Banner Image (Upload via Admin)</span>
                  </div>
                )}
                {/* Fallback text if no image but there's a title/subtitle */}
                {!banner.image && (banner.title || banner.subtitle) && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6 bg-gradient-to-r from-gray-900/60 to-gray-800/60 text-white">
                    {banner.title && <h2 className="text-2xl md:text-4xl font-extrabold mb-2 drop-shadow-md">{banner.title}</h2>}
                    {banner.subtitle && <p className="text-base md:text-lg font-medium drop-shadow-md">{banner.subtitle}</p>}
                  </div>
                )}
              </a>
            ))}
          </div>
        </section>
      )}

      {/* New Arrivals */}
      {newArrivals?.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 bg-gray-50 rounded-3xl my-8">
          <div className="flex items-end justify-between mb-6 pb-2">
            <div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">New Arrivals</h2>
              <p className="text-gray-500 text-sm mt-1">Fresh off the press</p>
            </div>
            <Link href="/new-arrivals" className="text-sm font-bold text-[#f15a24] hover:underline flex items-center gap-1 mb-1">
              {viewMore} <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4 lg:gap-5">
            {newArrivals.slice(0, 5).map((product, idx) => (
              <div key={product.id} className={`h-full min-w-0 ${idx >= 4 ? 'hidden lg:block' : ''}`}>
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Best Sellers */}
      {bestSellers?.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 mb-12">
          <div className="flex items-end justify-between mb-6 border-b border-gray-100 pb-4">
            <div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">Best Sellers</h2>
              <p className="text-gray-500 text-sm mt-1">Our most popular items</p>
            </div>
            <Link href="/best-selling" className="text-sm font-bold text-[#f15a24] hover:underline flex items-center gap-1 mb-1">
              {viewMore} <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4 lg:gap-5">
            {bestSellers.slice(0, 5).map((product, idx) => (
              <div key={product.id} className={`h-full min-w-0 ${idx >= 4 ? 'hidden lg:block' : ''}`}>
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Customer Review Screenshots (Social Proof / Real Chat Reviews) */}
      {reviewScreenshotsConfig?.enabled !== false && reviewScreenshotsConfig?.enabled !== '0' && (
        <CustomerReviewScreenshots
          screenshots={reviewScreenshots}
          config={reviewScreenshotsConfig}
        />
      )}

    </StorefrontLayout>
  );
}