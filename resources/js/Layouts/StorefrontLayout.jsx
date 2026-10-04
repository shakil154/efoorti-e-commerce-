import { Link, usePage, router } from '@inertiajs/react';
import { useState, useEffect, useRef } from 'react';
import { Head } from '@inertiajs/react';
import CartDrawer from '@/Components/Storefront/CartDrawer';
import VisitorPopupModal from '@/Components/Storefront/VisitorPopupModal';
import CategoryVectorIcon from '@/Components/Storefront/CategoryVectorIcon';
import PaymentIcons from '@/Components/Storefront/PaymentIcons';
import { imageUrl } from '@/lib/utils';

function CartIcon({ count = 0, onClick }) {
  return (
    <button type="button" onClick={onClick} className="relative flex flex-col items-center justify-center gap-1 text-gray-700 hover:text-[#f15a24] transition-colors" aria-label="Cart">
      <div className="relative">
        <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 6h15l-1.5 9h-12L6 6Zm0 0-.7-3H3"/>
          <circle cx="9" cy="20" r="1.5"/><circle cx="18" cy="20" r="1.5"/>
        </svg>
        {count > 0 && (
          <span className="absolute -top-2 -right-2 grid h-4 w-4 place-items-center rounded-full bg-[#f15a24] text-[9px] font-bold text-white">
            {count}
          </span>
        )}
      </div>
      <span className="text-[10px] font-semibold hidden md:block">Cart</span>
    </button>
  );
}

export default function StorefrontLayout({ children, title, description, activeCategory = null, hideMobileBottomMenu = false }) {
  const { props } = usePage();
  const { auth, app, flash, cartCount = 0, categories = [], hasFlashSale = false, promoText = '', promoLink = '', popup } = props;
  const headerTemplate = app?.header_template || app?.settings?.header_template || 'modern_tabbed';
  
  // Header Navigation Colors (isolated so dark bars never inherit black link text)
  const headerNavBg = app?.header_nav_bg || app?.settings?.header_nav_bg || (headerTemplate === 'classic_dark' ? '#0A2A22' : '#ffffff');
  const headerNavText = app?.header_nav_text || app?.settings?.header_nav_text || (headerTemplate === 'classic_dark' ? '#ffffff' : '#374151');
  const headerNavHover = app?.header_nav_hover || app?.settings?.header_nav_hover || (headerTemplate === 'classic_dark' ? '#fbbf24' : 'var(--brand-primary, #f15a24)');

  const rawCategories = categories || [];
  const categoryList = Array.isArray(rawCategories)
    ? rawCategories
    : (typeof rawCategories === 'object' && rawCategories !== null ? Object.values(rawCategories) : []);

  const footerCreditEnabled = app?.settings?.footer_credit_enabled !== false && app?.settings?.footer_credit_enabled !== '0';
  const footerCreditPrefix = app?.settings?.footer_credit_prefix || 'DESIGNED BY';
  const footerCreditName = app?.settings?.footer_credit_name || 'PROJOSS';
  const footerCreditUrl = app?.settings?.footer_credit_url || 'https://projoss.com/';
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQ, setSearchQ] = useState('');
  const [cartOpen, setCartOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const chatRef = useRef(null);
  const [catMenuOpen, setCatMenuOpen] = useState(false);
  const catMenuRef = useRef(null);

  useEffect(() => {
    const handleCatClickOutside = (e) => {
      if (catMenuRef.current && !catMenuRef.current.contains(e.target)) {
        setCatMenuOpen(false);
      }
    };
    if (catMenuOpen) {
      document.addEventListener('mousedown', handleCatClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleCatClickOutside);
  }, [catMenuOpen]);

  const chatSettings = app?.settings || {};
  const hasWhatsapp = !!chatSettings.whatsapp_number;
  const hasCall = !!chatSettings.call_number;
  const hasMessenger = !!chatSettings.messenger_page;
  const showChat = chatSettings.chat_enabled !== false && (hasWhatsapp || hasCall || hasMessenger);

  const getMessengerUrl = (page) => {
    if (!page) return '#';
    if (page.startsWith('http')) return page;
    return `https://m.me/${page}`;
  };

  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const sy = window.scrollY;
          // Reveal sticky floating dock when scrolled past top header (140px), hide when near top (80px)
          setIsScrolled(prev => (prev ? sy > 80 : sy > 140));
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (flash?.cart_open) {
      setCartOpen(true);
    }
  }, [flash]);

  useEffect(() => {
    const handleOpenCart = () => setCartOpen(true);
    window.addEventListener('open-cart', handleOpenCart);
    return () => window.removeEventListener('open-cart', handleOpenCart);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        const target = isScrolled
          ? (document.getElementById('floating-search') || document.getElementById('desktop-search'))
          : (document.getElementById('desktop-search') || document.getElementById('floating-search'));
        target?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isScrolled]);

  const handleSearch = (e) => {
    e.preventDefault();
    window.location.href = `/shop${searchQ ? '?q=' + encodeURIComponent(searchQ) : ''}`;
  };

  const handleLogout = (e) => {
    e.preventDefault();
    router.post('/logout');
  };

  return (
    <>
      {title ? (
        <Head title={title}>
          {description && <meta name="description" content={description} />}
        </Head>
      ) : description ? (
        <Head>
          <meta name="description" content={description} />
        </Head>
      ) : null}

      {/* Top bar */}
      <div className="hidden md:block bg-[#f1f3f5] text-gray-600 text-xs border-b border-gray-200">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex items-center justify-end h-9 gap-4">
          {promoText && (
            promoLink
              ? <a href={promoLink} className="hover:text-[#f15a24] mr-auto font-medium" dangerouslySetInnerHTML={{ __html: promoText }} />
              : <span className="mr-auto font-medium text-gray-700" dangerouslySetInnerHTML={{ __html: promoText }} />
          )}
        </div>
      </div>

      {/* ── Floating Sticky Header Dock (Slides down from off-screen with smooth animation on scroll) ── */}
      <div
        className={`fixed top-0 sm:top-3.5 left-0 right-0 z-50 transition-all duration-350 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          isScrolled
            ? 'translate-y-0 opacity-100 pointer-events-auto'
            : '-translate-y-full opacity-0 pointer-events-none'
        }`}
      >
        <div className="mx-auto max-w-7xl px-0 sm:px-4 lg:px-8">
          <div className="bg-white/95 sm:bg-white/85 backdrop-blur-2xl sm:border border-white/80 shadow-[0_12px_40px_rgba(0,0,0,0.08),0_1px_3px_rgba(0,0,0,0.04)] sm:rounded-full px-4 md:px-6 border-b sm:border-b-0 border-gray-200/60">
            <div className="flex h-14 md:h-16 items-center gap-4 md:gap-6 lg:gap-10">
              
              {/* Mobile Hamburger */}
              <button onClick={() => setMenuOpen(true)} className="md:hidden p-2 -ml-2 text-gray-800" aria-label="Menu">
                <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" d="M4 7h16M4 12h16M4 17h16"/>
                </svg>
              </button>

              <a href="/" className="flex items-center gap-2 shrink-0 md:mr-4 flex-1 md:flex-none justify-center md:justify-start">
                {app?.logo_url
                  ? <img src={app.logo_url} alt={app?.name} className="h-8 md:h-10 w-auto max-w-[130px] object-contain" />
                  : <span className="text-[#f15a24] font-black text-xl md:text-2xl tracking-tight">{app?.name || 'Projoss'}</span>
                }
              </a>

              {/* Desktop search in floating dock */}
              <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-2xl min-w-0 group relative">
                <div className="flex w-full items-center rounded-full bg-gray-100/80 border border-gray-200/80 focus-within:bg-white focus-within:border-[#f15a24] focus-within:ring-1 focus-within:ring-[#f15a24]/20 overflow-hidden transition-all shadow-xs h-10 pl-4 pr-2">
                  <svg className="h-4 w-4 text-gray-400 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <circle cx="11" cy="11" r="7"/><path strokeLinecap="round" d="m20 20-3-3"/>
                  </svg>
                  <input
                    id="floating-search"
                    type="text"
                    value={searchQ}
                    onChange={e => setSearchQ(e.target.value)}
                    placeholder="What are you looking for?"
                    className="flex-1 h-full px-3 text-sm bg-transparent border-none focus:outline-none focus:ring-0 text-gray-800 placeholder-gray-400"
                  />
                  <div className="hidden lg:flex items-center gap-1 shrink-0 bg-white px-2 py-1 rounded-full border border-gray-100 shadow-xs">
                    <kbd className="inline-flex items-center justify-center px-1 py-0.5 text-[9px] font-bold text-gray-500 bg-gray-50 border border-gray-200 rounded">⌘</kbd>
                    <kbd className="inline-flex items-center justify-center px-1 py-0.5 text-[9px] font-bold text-gray-500 bg-gray-50 border border-gray-200 rounded">K</kbd>
                  </div>
                </div>
              </form>

              {/* Right icons */}
              <div className="flex items-center gap-4 md:gap-6 shrink-0 ml-auto md:ml-0">
                <button onClick={() => setSearchOpen(!searchOpen)} className="md:hidden p-2 text-gray-800" aria-label="Search">
                  <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <circle cx="11" cy="11" r="7"/><path strokeLinecap="round" d="m20 20-3-3"/>
                  </svg>
                </button>

                <Link href="/track" className="hidden md:flex flex-col items-center justify-center gap-0.5 text-gray-700 hover:text-[#f15a24] transition-colors group">
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                  <span className="text-[10px] font-semibold">Track Order</span>
                </Link>

                {auth?.user ? (
                  <div className="hidden md:block relative group">
                    <button className="flex flex-col items-center justify-center gap-0.5 text-gray-700 hover:text-[#f15a24] transition-colors">
                      <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                        <circle cx="12" cy="8" r="4"/><path strokeLinecap="round" strokeLinejoin="round" d="M4 21v-1a8 8 0 0116 0v1"/>
                      </svg>
                      <span className="text-[10px] font-semibold truncate max-w-[60px]">{auth.user.name.split(' ')[0]}</span>
                    </button>
                    <div className="absolute right-0 top-full pt-2 hidden group-hover:block z-50">
                      <div className="bg-white rounded-xl shadow-xl border border-gray-100 min-w-[180px] py-2">
                        <Link href="/account" className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50">My Account</Link>
                        <Link href="/account?tab=orders" className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50">My Orders</Link>
                        <hr className="my-1 border-gray-100"/>
                        <button onClick={handleLogout} className="flex w-full items-center gap-2.5 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50">Logout</button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <Link href="/login" className="hidden md:flex flex-col items-center justify-center gap-0.5 text-gray-700 hover:text-[#f15a24] transition-colors">
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                      <circle cx="12" cy="8" r="4"/><path strokeLinecap="round" strokeLinejoin="round" d="M4 21v-1a8 8 0 0116 0v1"/>
                    </svg>
                    <span className="text-[10px] font-semibold">Sign In</span>
                  </Link>
                )}

                <Link href="/wishlist" className="hidden md:flex flex-col items-center justify-center gap-0.5 text-gray-700 hover:text-[#f15a24] transition-colors">
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/></svg>
                  <span className="text-[10px] font-semibold">Wishlist</span>
                </Link>

                <CartIcon count={cartCount} onClick={() => setCartOpen(true)} />
              </div>
            </div>
          </div>
        </div>

        {/* Mobile search dropdown for floating dock */}
        {searchOpen && (
          <div className="md:hidden border-t border-gray-100 bg-white px-4 py-3 shadow-sm pointer-events-auto">
            <form onSubmit={handleSearch} className="flex items-center rounded-lg bg-gray-100/80 border border-gray-200 focus-within:border-[#f15a24] focus-within:bg-white overflow-hidden transition-all">
              <input type="text" value={searchQ} onChange={e => setSearchQ(e.target.value)}
                placeholder={`Search in ${app?.name || 'store'}...`}
                className="flex-1 min-w-0 h-10 px-4 text-sm bg-transparent border-none focus:outline-none focus:ring-0" autoFocus />
              <button type="submit" className="shrink-0 h-10 px-4 text-gray-500 hover:text-[#f15a24] flex items-center justify-center">
                <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <circle cx="11" cy="11" r="7"/><path strokeLinecap="round" d="m20 20-3-3"/>
                </svg>
              </button>
            </form>
          </div>
        )}
      </div>

      {/* Main header (in normal flow at top of page) */}
      <header className="bg-white border-b border-gray-100 px-4 sm:px-6 lg:px-8 relative z-40">
        <div className="mx-auto max-w-7xl">
          <div className="flex h-16 md:h-20 items-center gap-4 md:gap-6 lg:gap-10">
            
            {/* Mobile Hamburger */}
            <button onClick={() => setMenuOpen(true)} className="md:hidden p-2 -ml-2 text-gray-800" aria-label="Menu">
              <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" d="M4 7h16M4 12h16M4 17h16"/>
              </svg>
            </button>

            <a href="/" className="flex items-center gap-2 shrink-0 md:mr-4 flex-1 md:flex-none justify-center md:justify-start">
              {app?.logo_url
                ? <img src={app.logo_url} alt={app?.name} className="h-10 md:h-12 w-auto max-w-[140px] object-contain" />
                : <span className="text-[#f15a24] font-black text-2xl tracking-tight">{app?.name || 'Projoss'}</span>
              }
            </a>

            {/* Desktop search */}
            <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-2xl min-w-0 group relative">
              <div className="flex w-full items-center rounded-full bg-white/80 border border-gray-200/60 focus-within:border-[#f15a24] focus-within:ring-1 focus-within:ring-[#f15a24]/20 overflow-hidden transition-all shadow-sm h-11 pl-4 pr-2">
                <svg className="h-5 w-5 text-gray-400 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <circle cx="11" cy="11" r="7"/><path strokeLinecap="round" d="m20 20-3-3"/>
                </svg>
                <input id="desktop-search" type="text" value={searchQ} onChange={e => setSearchQ(e.target.value)}
                  placeholder="What are you looking for?"
                  className="flex-1 h-full px-3 text-sm bg-transparent border-none focus:outline-none focus:ring-0 text-gray-800 placeholder-gray-400" />
                
                <div className="hidden lg:flex items-center gap-1 shrink-0 bg-white px-2 py-1.5 rounded-full border border-gray-100 shadow-sm">
                  <kbd className="inline-flex items-center justify-center px-1.5 py-0.5 text-[10px] font-bold text-gray-500 bg-gray-50 border border-gray-200 rounded">⌘</kbd>
                  <kbd className="inline-flex items-center justify-center px-1.5 py-0.5 text-[10px] font-bold text-gray-500 bg-gray-50 border border-gray-200 rounded">K</kbd>
                </div>
              </div>
            </form>

            {/* Right icons (Desktop & Mobile adjustments) */}
            <div className="flex items-center gap-4 md:gap-6 shrink-0 ml-auto md:ml-0">
              
              <button onClick={() => setSearchOpen(!searchOpen)} className="md:hidden p-2 text-gray-800" aria-label="Search">
                <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <circle cx="11" cy="11" r="7"/><path strokeLinecap="round" d="m20 20-3-3"/>
                </svg>
              </button>

              <Link href="/track" className="hidden md:flex flex-col items-center justify-center gap-1 text-gray-700 hover:text-[#f15a24] transition-colors group">
                <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                <span className="text-[10px] font-semibold">Track Order</span>
              </Link>

              {/* Account dropdown */}
              {auth?.user ? (
                <div className="hidden md:block relative group">
                  <button className="flex flex-col items-center justify-center gap-1 text-gray-700 hover:text-[#f15a24] transition-colors">
                    <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                      <circle cx="12" cy="8" r="4"/><path strokeLinecap="round" strokeLinejoin="round" d="M4 21v-1a8 8 0 0116 0v1"/>
                    </svg>
                    <span className="text-[10px] font-semibold truncate max-w-[60px]">{auth.user.name.split(' ')[0]}</span>
                  </button>
                  <div className="absolute right-0 top-full pt-2 hidden group-hover:block z-50">
                    <div className="bg-white rounded-xl shadow-xl border border-gray-100 min-w-[180px] py-2">
                      <Link href="/account" className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50">My Account</Link>
                      <Link href="/account?tab=orders" className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50">My Orders</Link>
                      <hr className="my-1 border-gray-100"/>
                      <button onClick={handleLogout} className="flex w-full items-center gap-2.5 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50">Logout</button>
                    </div>
                  </div>
                </div>
              ) : (
                <Link href="/login" className="hidden md:flex flex-col items-center justify-center gap-1 text-gray-700 hover:text-[#f15a24] transition-colors">
                  <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                    <circle cx="12" cy="8" r="4"/><path strokeLinecap="round" strokeLinejoin="round" d="M4 21v-1a8 8 0 0116 0v1"/>
                  </svg>
                  <span className="text-[10px] font-semibold">Sign In</span>
                </Link>
              )}

              <Link href="/wishlist" className="hidden md:flex flex-col items-center justify-center gap-1 text-gray-700 hover:text-[#f15a24] transition-colors">
                <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/></svg>
                <span className="text-[10px] font-semibold">Wishlist</span>
              </Link>

              <CartIcon count={cartCount} onClick={() => setCartOpen(true)} />
            </div>
          </div>
        </div>

        {/* Mobile search drop-down */}
        {searchOpen && (
          <div className="md:hidden border-t border-gray-100 bg-white px-4 py-3 shadow-sm pointer-events-auto">
            <form onSubmit={handleSearch} className="flex items-center rounded-lg bg-gray-100/80 border border-gray-200 focus-within:border-[#f15a24] focus-within:bg-white overflow-hidden transition-all">
              <input type="text" value={searchQ} onChange={e => setSearchQ(e.target.value)}
                placeholder={`Search in ${app?.name || 'store'}...`}
                className="flex-1 min-w-0 h-10 px-4 text-sm bg-transparent border-none focus:outline-none focus:ring-0" autoFocus />
              <button type="submit" className="shrink-0 h-10 px-4 text-gray-500 hover:text-[#f15a24] flex items-center justify-center">
                <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <circle cx="11" cy="11" r="7"/><path strokeLinecap="round" d="m20 20-3-3"/>
                </svg>
              </button>
            </form>
          </div>
        )}

      </header>

      {/* Template 2: Classic Category Strip (Dark Green / Configurable Bar) */}
      {headerTemplate === 'classic_dark' && categoryList.length > 0 && (
        <div
          className="hidden lg:block header-nav-template-2 header-category-bar shadow-xs"
          style={{ backgroundColor: headerNavBg }}
        >
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-wrap items-center gap-x-7 gap-y-1 min-h-[44px] text-[13px] font-semibold" style={{ color: headerNavText }}>
            {categoryList.map(cat => (
              <div key={cat.id} className="relative group h-full flex items-center">
                <a
                  href={`/category/${cat.slug}`}
                  style={{ color: activeCategory?.id === cat.id ? headerNavHover : headerNavText }}
                  className={`cat-nav-link flex items-center gap-1.5 whitespace-nowrap transition-colors py-3 hover:opacity-90 ${activeCategory?.id === cat.id ? 'font-bold' : ''}`}
                >
                  <span>{cat.name}</span>
                  {cat.children && (Array.isArray(cat.children) ? cat.children.length > 0 : Object.keys(cat.children).length > 0) && (
                    <svg className="w-3.5 h-3.5 opacity-75" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7"/></svg>
                  )}
                </a>
                
                {cat.children && (Array.isArray(cat.children) ? cat.children.length > 0 : Object.keys(cat.children).length > 0) && (
                  <div className="subcat-flyout absolute left-0 top-[100%] hidden group-hover:block z-[999] min-w-[220px] pt-1">
                    <div className="bg-white rounded-xl shadow-xl border border-gray-100 py-2 flex flex-col relative before:absolute before:-top-4 before:left-0 before:w-full before:h-4 before:bg-transparent">
                      {(Array.isArray(cat.children) ? cat.children : Object.values(cat.children)).map(child => (
                        <a key={child.id} href={`/category/${child.slug}`} className="px-4 py-2.5 text-[13px] font-semibold text-gray-700 hover:text-[var(--brand-primary,#f15a24)] hover:bg-orange-50 transition-colors">
                          {child.name}
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
            {hasFlashSale && (
              <a
                href="/shop?flash=1"
                style={{ color: headerNavText }}
                className="cat-nav-link ml-auto flex items-center gap-1.5 whitespace-nowrap shrink-0 transition-colors py-3 font-bold hover:opacity-90"
              >
                <svg className="w-4 h-4 text-amber-300 shrink-0" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                <span>Offer Zone</span>
              </a>
            )}
          </div>
        </div>
      )}

      {/* Template 1: Modern Tabbed Category Dropdown & Navigation Bar (Clean White) */}
      {headerTemplate !== 'classic_dark' && (
        <nav className="hidden lg:block bg-white border-b border-gray-200/80 relative z-30">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex items-center justify-between min-h-[44px]">
            <div className="flex items-center">
              {/* Category Dropdown Button */}
              <div className="relative group/cat shrink-0" ref={catMenuRef}>
                <button
                  type="button"
                  onClick={() => setCatMenuOpen(!catMenuOpen)}
                  className={`flex items-center gap-2.5 px-4 h-11 rounded-t-lg bg-[#f0f2f5] hover:bg-gray-200/80 text-gray-800 text-[13px] font-bold tracking-wider uppercase transition-colors select-none ${catMenuOpen ? 'bg-gray-200/90' : ''}`}
                >
                  {/* 3-bar hamburger icon */}
                  <svg className="w-4 h-4 text-gray-700" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 6.5h16M4 12h16M4 17.5h16" />
                  </svg>
                  <span>CATEGORIES</span>
                  {/* Caret icon */}
                  <svg className={`w-3.5 h-3.5 text-gray-500 transition-transform duration-200 ${catMenuOpen ? 'rotate-180' : 'group-hover/cat:rotate-180'}`} fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {/* Dropdown Menu */}
                <div className={`absolute left-0 top-full z-[100] min-w-[260px] pt-1 transition-all duration-150 ${catMenuOpen ? 'block' : 'hidden group-hover/cat:block'}`}>
                  <div className="bg-white rounded-b-xl rounded-tr-xl shadow-2xl border border-gray-100 py-2 flex flex-col divide-y divide-gray-50/80">
                    {categoryList.length > 0 ? (
                      categoryList.map(cat => (
                        <div key={cat.id} className="relative group/sub">
                          <a
                            href={`/category/${cat.slug}`}
                            className={`flex items-center justify-between px-4 py-2.5 text-[13px] font-medium text-gray-700 hover:text-[var(--brand-primary,#f15a24)] hover:bg-orange-50/50 transition-colors ${activeCategory?.id === cat.id ? 'text-[var(--brand-primary,#f15a24)] bg-orange-50/50 font-semibold' : ''}`}
                          >
                            <div className="flex items-center gap-3">
                              <span className="w-7 h-7 rounded-lg bg-gray-100 flex items-center justify-center text-sm shrink-0 overflow-hidden text-gray-600">
                                {cat.image ? (
                                  <img src={imageUrl(cat.image)} alt={cat.name} className="w-full h-full object-cover" />
                                ) : (
                                  <CategoryVectorIcon slug={cat.slug} name={cat.name} className="w-4 h-4 text-gray-600 group-hover/sub:text-[var(--brand-primary,#f15a24)]" />
                                )}
                              </span>
                              <span className="truncate max-w-[170px]">{cat.name}</span>
                            </div>
                            {cat.children && (Array.isArray(cat.children) ? cat.children.length > 0 : Object.keys(cat.children).length > 0) && (
                              <svg className="w-3.5 h-3.5 text-gray-400 group-hover/sub:text-[var(--brand-primary,#f15a24)] shrink-0 transition-transform group-hover/sub:translate-x-0.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                              </svg>
                            )}
                          </a>

                          {/* Subcategories Flyout */}
                          {cat.children && (Array.isArray(cat.children) ? cat.children.length > 0 : Object.keys(cat.children).length > 0) && (
                            <div className="absolute left-full top-0 pl-1.5 hidden group-hover/sub:block z-[101] min-w-[220px]">
                              <div className="bg-white rounded-xl shadow-2xl border border-gray-100 py-2 flex flex-col">
                                {(Array.isArray(cat.children) ? cat.children : Object.values(cat.children)).map(child => (
                                  <a
                                    key={child.id}
                                    href={`/category/${child.slug}`}
                                    className="px-4 py-2 text-[13px] font-medium text-gray-600 hover:text-[var(--brand-primary,#f15a24)] hover:bg-gray-50 transition-colors"
                                  >
                                    {child.name}
                                  </a>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      ))
                    ) : (
                      <div className="px-4 py-3 text-xs text-gray-400">No categories found</div>
                    )}
                  </div>
                </div>
              </div>

              {/* Horizontal Links */}
              <div className="flex items-center text-[13px] font-semibold text-gray-600 tracking-wider ml-5">
                <Link href="/" className="hover:text-[var(--brand-primary,#f15a24)] transition-colors py-2 px-1">HOME</Link>
                
                <span className="h-3.5 w-px bg-gray-200 mx-3 select-none" />
                
                <Link href="/shop" className="hover:text-[var(--brand-primary,#f15a24)] transition-colors py-2 px-1">SHOP</Link>
                
                <span className="h-3.5 w-px bg-gray-200 mx-3 select-none" />
                
                <Link href="/best-selling" className="hover:text-[var(--brand-primary,#f15a24)] transition-colors py-2 px-1">BEST SELLING</Link>
                
                <span className="h-3.5 w-px bg-gray-200 mx-3 select-none" />
                
                <Link href="/new-arrivals" className="hover:text-[var(--brand-primary,#f15a24)] transition-colors py-2 px-1">NEW ARRIVALS</Link>
                
                <span className="h-3.5 w-px bg-gray-200 mx-3 select-none" />
                
                <Link href="/brands" className="hover:text-[var(--brand-primary,#f15a24)] transition-colors py-2 px-1">BRANDS</Link>
                
                <span className="h-3.5 w-px bg-gray-200 mx-3 select-none" />
                
                <Link href="/shop?flash=1" className="flex items-center gap-1.5 hover:text-rose-600 transition-colors py-2 px-1 group/hot">
                  <span className="w-5 h-5 rounded-full bg-gradient-to-tr from-rose-500 to-red-500 text-white flex items-center justify-center shadow-xs shrink-0 group-hover/hot:scale-110 transition-transform">
                    <svg className="w-3 h-3 fill-current" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.527.82-1.173 1.559-1.874 2.257C6.808 6.74 5 8.788 5 11.5 5 15.09 7.91 18 11.5 18s6.5-2.91 6.5-6.5c0-2.433-1.071-4.225-2.316-5.592a17.65 17.65 0 01-1.789-2.28 1 1 0 00-1.5-.075zm-3.056 9.043c-.07-.35-.297-.68-.6-.88-.415-.27-.923-.27-1.33 0-.41.27-.61.73-.55 1.22.12 1.05 1.02 1.87 2.1 1.87.21 0 .42-.03.62-.09.33-.1.59-.34.7-.66.11-.32.06-.67-.14-.94-.23-.31-.56-.47-.8-.52z" clipRule="evenodd" />
                    </svg>
                  </span>
                  <span className="font-bold text-gray-800 group-hover/hot:text-rose-600 transition-colors">HOT OFFER</span>
                </Link>
              </div>
            </div>
          </div>
        </nav>
      )}

      {/* Flash status */}
      {flash?.status && (
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-4">
          <div className="bg-white border border-green-200 text-green-700 text-sm font-semibold px-4 py-3 rounded-lg shadow-sm flex items-center gap-2">
            <svg className="h-5 w-5 text-green-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/></svg>
            {flash.status}
          </div>
        </div>
      )}

      {/* Mobile menu overlay */}
      {menuOpen && (
        <div className="fixed inset-0 z-[60] lg:hidden">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity" onClick={() => setMenuOpen(false)} />
          <div className="absolute left-0 top-0 bottom-0 w-[85%] max-w-sm bg-white flex flex-col shadow-2xl overflow-hidden">
            <div className="h-16 flex items-center justify-between px-5 border-b bg-gray-50">
              <div className="flex items-center gap-2 font-black text-xl text-[#f15a24]">
                {app?.logo_url ? <img src={app.logo_url} alt="" className="h-8 w-auto object-contain" /> : (app?.name || 'Projoss')}
              </div>
              <button onClick={() => setMenuOpen(false)} className="p-2 -mr-2 text-gray-500 hover:text-gray-900 rounded-full hover:bg-gray-200 transition-colors">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M18 6L6 18M6 6l12 12"/></svg>
              </button>
            </div>
            
            <nav className="flex-1 overflow-y-auto py-2">
              <div className="px-4 py-2 text-xs font-bold text-gray-400 uppercase tracking-wider">Main Menu</div>
              <a href="/" className="flex items-center px-6 py-3 text-sm font-medium text-gray-700 hover:text-[#f15a24] hover:bg-orange-50 transition-colors">Home</a>
              <a href="/shop" className="flex items-center px-6 py-3 text-sm font-medium text-gray-700 hover:text-[#f15a24] hover:bg-orange-50 transition-colors">Shop</a>
              <a href="/best-selling" className="flex items-center px-6 py-3 text-sm font-medium text-gray-700 hover:text-[#f15a24] hover:bg-orange-50 transition-colors">Best Selling</a>
              <a href="/new-arrivals" className="flex items-center px-6 py-3 text-sm font-medium text-gray-700 hover:text-[#f15a24] hover:bg-orange-50 transition-colors">New Arrivals</a>
              <a href="/brands" className="flex items-center px-6 py-3 text-sm font-medium text-gray-700 hover:text-[#f15a24] hover:bg-orange-50 transition-colors">Brands</a>
              <a href="/shop?flash=1" className="flex items-center px-6 py-3 text-sm font-medium text-rose-600 hover:bg-rose-50 transition-colors font-semibold">Hot Offer</a>
              
              {categoryList.length > 0 && (
                <>
                  <div className="px-4 py-4 mt-2 text-xs font-bold text-gray-400 uppercase tracking-wider border-t border-gray-100">Categories</div>
                  {categoryList.map(cat => (
                    <a key={cat.id} href={`/category/${cat.slug}`}
                      className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-gray-700 hover:text-[#f15a24] hover:bg-orange-50 transition-colors rounded-lg mx-2">
                      <span className="w-9 h-9 shrink-0 rounded-xl overflow-hidden bg-gray-100 ring-1 ring-gray-200 flex items-center justify-center text-gray-600">
                        {cat.image ? (
                          <img src={imageUrl(cat.image)} alt={cat.name} className="w-full h-full object-cover" />
                        ) : (
                          <CategoryVectorIcon slug={cat.slug} name={cat.name} className="w-5 h-5 text-gray-600" />
                        )}
                      </span>
                      <span>{cat.name}</span>
                    </a>
                  ))}
                </>
              )}

              <div className="px-4 py-4 mt-2 text-xs font-bold text-gray-400 uppercase tracking-wider border-t border-gray-100">Support</div>
              <a href="/contact" className="flex items-center px-6 py-3 text-sm font-medium text-gray-700 hover:text-[#f15a24] hover:bg-orange-50 transition-colors">Contact Us</a>
              <a href="/track" className="flex items-center px-6 py-3 text-sm font-medium text-gray-700 hover:text-[#f15a24] hover:bg-orange-50 transition-colors">Track Order</a>
            </nav>

            {!auth?.user ? (
              <div className="p-5 border-t border-gray-100 bg-gray-50">
                <a href="/login" className="flex items-center justify-center w-full py-3 bg-[#f15a24] hover:bg-[#e04708] text-white font-bold rounded-xl transition-colors shadow-sm">Sign In / Register</a>
              </div>
            ) : (
              <div className="p-5 border-t border-gray-100 bg-gray-50 space-y-3">
                <a href="/account" className="flex items-center justify-center w-full py-2.5 bg-white border border-gray-200 text-gray-700 font-bold rounded-xl hover:border-[#f15a24] hover:text-[#f15a24] transition-colors">My Account</a>
                <button onClick={handleLogout} className="flex w-full items-center justify-center py-2.5 bg-red-50 text-red-600 font-bold rounded-xl hover:bg-red-100 transition-colors">Logout</button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Main content - pad bottom on mobile for sticky nav */}
      <main className="bg-[#f8f9fa] min-h-screen pb-[70px] md:pb-0">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-transparent pb-8 pt-4 mb-[60px] md:mb-0">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm px-6 sm:px-10 py-12 lg:py-16">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8">
              <div className="lg:col-span-2">
                <a href="/" className="flex items-center gap-2 mb-5 inline-block">
                  {app?.logo_url
                    ? <img src={app.logo_url} alt="" className="h-10 w-auto object-contain" />
                    : <span className="text-[#f15a24] font-black text-xl">{app?.name}</span>
                  }
                </a>
                <p className="text-gray-500 text-sm leading-relaxed max-w-md">
                  {app?.settings?.footer_text || app?.footer_text || 'Your one-stop marketplace for quality products at great prices. We deliver the best items directly to your doorstep with care.'}
                </p>
              </div>
              <div>
                <h4 className="font-bold text-gray-900 text-base mb-5 uppercase tracking-wider">Quick Links</h4>
                <ul className="space-y-3 text-sm text-gray-500">
                  <li><a href="/shop" className="hover:text-[#f15a24] transition-colors">Shop All</a></li>
                  <li><a href="/contact" className="hover:text-[#f15a24] transition-colors">Contact Us</a></li>
                  <li><a href="/track" className="hover:text-[#f15a24] transition-colors">Track Order</a></li>
                </ul>
              </div>
              <div>
                <h4 className="font-bold text-gray-900 text-base mb-5 uppercase tracking-wider">Legal & Policy</h4>
                <ul className="space-y-3 text-sm text-gray-500">
                  <li><a href="/terms" className="hover:text-[#f15a24] transition-colors">Terms & Conditions</a></li>
                  <li><a href="/privacy" className="hover:text-[#f15a24] transition-colors">Privacy Policy</a></li>
                  <li><a href="/refund-policy" className="hover:text-[#f15a24] transition-colors">Refund Policy</a></li>
                </ul>
              </div>
            </div>
            <div className="border-t border-gray-100 mt-12 pt-8 text-center md:text-left flex flex-col md:flex-row items-center justify-between gap-4">
              <p className="text-gray-400 text-sm font-medium order-2 md:order-1">
                &copy; {new Date().getFullYear()} {app?.name || 'Projoss'}. All rights reserved.
              </p>
              <div className="order-1 md:order-2">
                <PaymentIcons settings={app?.settings} />
              </div>
              {footerCreditEnabled && (
                <a 
                  href={footerCreditUrl} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="order-3 inline-flex items-center gap-2 border border-gray-100 bg-white rounded-full px-3 py-1.5 shadow-sm hover:shadow-md hover:border-gray-200 transition-all"
                >
                  <span className="text-[11px] font-extrabold text-slate-500 tracking-wider">{footerCreditPrefix}</span>
                  <span className="bg-[#f15a24] text-white text-[11px] font-extrabold px-3 py-1 rounded-full tracking-wider">{footerCreditName}</span>
                </a>
              )}
            </div>
          </div>
        </div>
      </footer>

      {/* Sticky Bottom Mobile Menu */}
      {!hideMobileBottomMenu && (
        <div className="md:hidden fixed bottom-0 left-0 right-0 bg-[#f15a24] text-white flex justify-around items-center h-[60px] z-[45] shadow-[0_-4px_10px_rgba(0,0,0,0.1)] pb-safe">
          <a href="/" className="flex flex-col items-center justify-center w-full h-full text-white/90 hover:text-white hover:bg-black/10 transition-colors">
            <svg className="h-5 w-5 mb-1" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/></svg>
            <span className="text-[9px] font-bold tracking-wide">Home</span>
          </a>
          <button onClick={() => setMenuOpen(true)} className="flex flex-col items-center justify-center w-full h-full text-white/90 hover:text-white hover:bg-black/10 transition-colors">
            <svg className="h-5 w-5 mb-1" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16"/></svg>
            <span className="text-[9px] font-bold tracking-wide">Menu</span>
          </button>
          <button onClick={() => setCartOpen(true)} className="flex flex-col items-center justify-center w-full h-full text-white/90 hover:text-white hover:bg-black/10 transition-colors relative">
            <div className="relative">
              <svg className="h-5 w-5 mb-1" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/></svg>
              {cartCount > 0 && <span className="absolute -top-1 -right-2 bg-black text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full">{cartCount}</span>}
            </div>
            <span className="text-[9px] font-bold tracking-wide">Cart</span>
          </button>
          <button onClick={() => { setSearchOpen(true); window.scrollTo({top:0, behavior:'smooth'}); }} className="flex flex-col items-center justify-center w-full h-full text-white/90 hover:text-white hover:bg-black/10 transition-colors">
            <svg className="h-5 w-5 mb-1" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
            <span className="text-[9px] font-bold tracking-wide">Search</span>
          </button>
          <a href={auth?.user ? '/account' : '/login'} className="flex flex-col items-center justify-center w-full h-full text-white/90 hover:text-white hover:bg-black/10 transition-colors">
            <svg className="h-5 w-5 mb-1" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>
            <span className="text-[9px] font-bold tracking-wide">Account</span>
          </a>
        </div>
      )}

      {/* Cart Drawer */}
      <CartDrawer isOpen={cartOpen} onClose={() => setCartOpen(false)} />

      {/* Floating Live Chat Widget */}
      {showChat && (
        <div ref={chatRef} className={`fixed ${hideMobileBottomMenu ? 'bottom-[65px]' : 'bottom-[80px]'} right-4 md:bottom-6 md:right-6 z-[999] flex flex-col items-end gap-2`}>
          {/* Action buttons — shown when chatOpen */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '10px',
              alignItems: 'flex-end',
              overflow: 'hidden',
              maxHeight: chatOpen ? '300px' : '0',
              opacity: chatOpen ? 1 : 0,
              transition: 'max-height 0.35s cubic-bezier(0.4,0,0.2,1), opacity 0.3s ease',
            }}
          >
            {/* WhatsApp */}
            {hasWhatsapp && (
              <a
                href={`https://wa.me/${chatSettings.whatsapp_number.replace(/[^0-9]/g, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                title="Chat on WhatsApp"
                className="group flex items-center gap-2"
              >
                <span className="bg-white text-gray-700 text-xs font-semibold px-3 py-1.5 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">WhatsApp</span>
                <div className="w-12 h-12 rounded-full shadow-lg flex items-center justify-center cursor-pointer transition-transform hover:scale-110 active:scale-95"
                  style={{ background: 'linear-gradient(135deg, #25D366 0%, #128C7E 100%)' }}>
                  <svg viewBox="0 0 32 32" className="w-6 h-6" fill="white" xmlns="http://www.w3.org/2000/svg">
                    <path d="M16 2C8.28 2 2 8.28 2 16c0 2.44.65 4.73 1.78 6.72L2 30l7.52-1.74A13.93 13.93 0 0016 30c7.72 0 14-6.28 14-14S23.72 2 16 2zm0 25.5a11.43 11.43 0 01-5.86-1.62l-.42-.25-4.46 1.03 1.06-4.35-.28-.45A11.47 11.47 0 014.5 16C4.5 9.6 9.6 4.5 16 4.5S27.5 9.6 27.5 16 22.4 27.5 16 27.5zm6.29-8.56c-.34-.17-2.03-1-2.35-1.11-.32-.12-.55-.17-.78.17-.23.34-.9 1.11-1.1 1.34-.2.23-.4.26-.74.09-.34-.17-1.44-.53-2.74-1.69-1.01-.9-1.7-2.02-1.9-2.36-.2-.34-.02-.52.15-.69.15-.15.34-.4.51-.6.17-.2.23-.34.34-.57.12-.23.06-.43-.03-.6-.09-.17-.78-1.88-1.07-2.57-.28-.68-.57-.58-.78-.59h-.66c-.23 0-.6.09-.91.43-.31.34-1.2 1.17-1.2 2.86s1.23 3.32 1.4 3.55c.17.23 2.42 3.7 5.87 5.19.82.35 1.46.56 1.96.72.82.26 1.57.22 2.16.13.66-.1 2.03-.83 2.32-1.63.29-.8.29-1.49.2-1.63-.09-.14-.32-.23-.66-.4z"/>
                  </svg>
                </div>
              </a>
            )}
            {/* Call */}
            {hasCall && (
              <a
                href={`tel:${chatSettings.call_number}`}
                title="Call us"
                className="group flex items-center gap-2"
              >
                <span className="bg-white text-gray-700 text-xs font-semibold px-3 py-1.5 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">Call Now</span>
                <div className="w-12 h-12 rounded-full shadow-lg flex items-center justify-center cursor-pointer transition-transform hover:scale-110 active:scale-95"
                  style={{ background: 'linear-gradient(135deg, #34d399 0%, #059669 100%)' }}>
                  <svg viewBox="0 0 24 24" className="w-6 h-6" fill="white" xmlns="http://www.w3.org/2000/svg">
                    <path d="M6.62 10.79a15.05 15.05 0 006.59 6.59l2.2-2.2a1 1 0 011.01-.24c1.12.37 2.33.57 3.58.57a1 1 0 011 1V20a1 1 0 01-1 1C9.61 21 3 14.39 3 6.5a1 1 0 011-1h3.5a1 1 0 011 1c0 1.25.2 2.45.57 3.58a1 1 0 01-.25 1.01l-2.2 2.2z"/>
                  </svg>
                </div>
              </a>
            )}
            {/* Messenger */}
            {hasMessenger && (
              <a
                href={getMessengerUrl(chatSettings.messenger_page)}
                target="_blank"
                rel="noopener noreferrer"
                title="Chat on Messenger"
                className="group flex items-center gap-2"
              >
                <span className="bg-white text-gray-700 text-xs font-semibold px-3 py-1.5 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">Messenger</span>
                <div className="w-12 h-12 rounded-full shadow-lg flex items-center justify-center cursor-pointer transition-transform hover:scale-110 active:scale-95"
                  style={{ background: 'linear-gradient(135deg, #0084ff 0%, #a033ff 100%)' }}>
                  <svg viewBox="0 0 32 32" className="w-6 h-6" fill="white" xmlns="http://www.w3.org/2000/svg">
                    <path d="M16 2C8.27 2 2 7.8 2 14.93c0 3.9 1.85 7.38 4.76 9.76V30l4.59-2.52A14.86 14.86 0 0016 27.86c7.73 0 14-5.8 14-12.93C30 7.8 23.73 2 16 2zm1.41 17.41l-3.57-3.8-6.97 3.8 7.66-8.13 3.66 3.8 6.88-3.8-7.66 8.13z"/>
                  </svg>
                </div>
              </a>
            )}
          </div>

          {/* Main toggle button */}
          <button
            onClick={() => setChatOpen(o => !o)}
            title={chatOpen ? 'Close' : 'Chat with us'}
            className="w-14 h-14 rounded-full shadow-2xl flex items-center justify-center border-4 border-white"
            style={{
              background: chatOpen
                ? 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)'
                : 'linear-gradient(135deg, #25D366 0%, #128C7E 100%)',
              transform: chatOpen ? 'rotate(45deg)' : 'rotate(0deg)',
              transition: 'background 0.3s ease, transform 0.35s cubic-bezier(0.4,0,0.2,1)',
            }}
          >
            {chatOpen ? (
              <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" xmlns="http://www.w3.org/2000/svg">
                <path d="M6 18L18 6M6 6l12 12"/>
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" className="w-7 h-7" fill="white" xmlns="http://www.w3.org/2000/svg">
                <path d="M20 2H4C2.9 2 2 2.9 2 4v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM9 11H7V9h2v2zm4 0h-2V9h2v2zm4 0h-2V9h2v2z"/>
              </svg>
            )}
          </button>
        </div>
      )}

      {/* ── Marketing & Notice Visitor Popup ── */}
      <VisitorPopupModal popup={popup} />
    </>
  );
}
