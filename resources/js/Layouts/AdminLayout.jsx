import { Link, usePage, router } from '@inertiajs/react';
import { useState, useEffect, useRef } from 'react';
import {
  ADMIN_THEME_PRESETS,
  generateThemePalette,
  applyAdminTheme,
  getLocalAdminTheme,
  setLocalAdminTheme,
} from '@/lib/adminTheme';

/* ─── Nav structure ──────────────────────────────────────────────── */
const navGroups = [
  {
    label: 'OVERVIEW',
    items: [
      {
        key: 'dashboard', label: 'Dashboard', href: '/admin', pattern: /^\/admin$/,
        icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6',
      },
      {
        key: 'analytics', label: 'Analytics & Reports', href: '/admin/analytics', pattern: /^\/admin\/analytics/,
        icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z',
      },
    ],
  },
  {
    label: 'STORE & PRODUCTS',
    collapsible: [
      {
        key: 'products-group', label: 'Products & Stock', defaultOpen: true,
        icon: 'M12 3l8 4.5v9L12 21l-8-4.5v-9z',
        children: [
          { key: 'products',     label: 'All Products',        href: '/admin/products',        pattern: /^\/admin\/products$/, perm: 'products.view' },
          { key: 'product-add',  label: 'Add New Product',     href: '/admin/products/create', pattern: /^\/admin\/products\/create/, perm: 'products.create' },
          { key: 'inventory',    label: 'Inventory / Stock',   href: '/admin/inventory',       pattern: /^\/admin\/inventory/, perm: 'products.view' },
          { key: 'categories',   label: 'Categories',          href: '/admin/categories',      pattern: /^\/admin\/categories/, perm: 'catalog.manage' },
          { key: 'brands',       label: 'Brands (ব্র্যান্ডস)',  href: '/admin/brands',          pattern: /^\/admin\/brands/,    perm: 'catalog.manage' },
        ],
      },
    ],
  },
  {
    label: 'SALES',
    collapsible: [
      {
        key: 'orders-group', label: 'Orders', defaultOpen: false,
        icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2',
        badge: 'pending_orders',
        children: [
          { key: 'orders',       label: 'All Orders',       href: '/admin/orders',              pattern: /^\/admin\/orders$/, badge: 'pending_orders', perm: 'orders.view' },
          { key: 'order-create', label: 'Create Order',     href: '/admin/orders/create',       pattern: /^\/admin\/orders\/create/, perm: 'orders.view' },
          { key: 'abandoned',    label: 'Abandoned Carts',  href: '/admin/abandoned-checkouts', pattern: /^\/admin\/abandoned-checkouts/, perm: 'customers.manage' },
        ],
      },
      {
        key: 'crm-group', label: 'Customer CRM', defaultOpen: false,
        icon: 'M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2M9 11a4 4 0 100-8 4 4 0 000 8zM23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75',
        children: [
          { key: 'customers', label: 'All Customers', href: '/admin/customers', pattern: /^\/admin\/customers/, perm: 'customers.manage' },
          { key: 'reviews',   label: 'Product Reviews', href: '/admin/reviews', pattern: /^\/admin\/reviews/, badge: 'pending_reviews', perm: 'reviews.manage' },
          { key: 'review-screenshots', label: 'Review Screenshots (সোশ্যাল রিভিউ)', href: '/admin/review-screenshots', pattern: /^\/admin\/review-screenshots/, perm: 'reviews.manage' },
        ],
      },
    ],
  },
  {
    label: 'STOREFRONT UI',
    collapsible: [
      {
        key: 'storefront-ui-group', label: 'Storefront & Design', defaultOpen: false,
        icon: 'M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z',
        children: [
          { key: 'banners',         label: 'Banners & Sliders',   href: '/admin/banners',            pattern: /^\/admin\/banners/, perm: 'catalog.manage' },
          { key: 'review-screenshots-ui', label: 'Review Screenshots (রিভিউ সেকশন)', href: '/admin/review-screenshots', pattern: /^\/admin\/review-screenshots/, perm: 'catalog.manage' },
          { key: 'landing',         label: 'Landing Pages',       href: '/admin/landing-pages',      pattern: /^\/admin\/landing-pages/, perm: 'marketing.manage' },
          { key: 'flash-sale',      label: 'Flash Sale UI',       href: '/admin/flash-sale',         pattern: /^\/admin\/flash-sale/, perm: 'marketing.manage' },
          { key: 'popup-notif',     label: 'Popup & Announcement',href: '/admin/popup-notification', pattern: /^\/admin\/popup-notification/, perm: 'marketing.manage' },
          { key: 'features',        label: 'Features & Badges',   href: '/admin/features',           pattern: /^\/admin\/features/, perm: 'catalog.manage' },
          { key: 'product-button',  label: 'Quick Order & CTA Buttons', href: '/admin/product-button', pattern: /^\/admin\/product-button/, perm: 'settings.manage' },
          { key: 'contact-fields',  label: 'Contact Form Fields', href: '/admin/contact-fields',     pattern: /^\/admin\/contact-fields/, perm: 'settings.manage' },
        ],
      },
    ],
  },
  {
    label: 'MARKETING & ADS',
    items: [
      {
        key: 'tracking', label: 'Pixel & Tracking', href: '/admin/tracking', pattern: /^\/admin\/tracking/,
        icon: 'M12 2v4M12 18v4M2 12h4M18 12h4M12 19a7 7 0 100-14 7 7 0 000 14zM12 15a3 3 0 100-6 3 3 0 000 6z',
      },
    ],
    collapsible: [
      {
        key: 'marketing-group', label: 'Marketing & Comms', defaultOpen: false,
        icon: 'M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z',
        children: [
          { key: 'coupons',     label: 'Coupons & Discounts', href: '/admin/coupons',  pattern: /^\/admin\/coupons/, perm: 'marketing.manage' },
          { key: 'messages',    label: 'Contact Messages',    href: '/admin/messages', pattern: /^\/admin\/messages/, badge: 'new_messages', perm: 'messages.manage' },
          { key: 'email-templates', label: 'Email Templates', href: '/admin/email-templates', pattern: /^\/admin\/email-templates/, perm: 'settings.manage' },
          { key: 'telegram-alerts', label: 'Telegram Alerts', href: '/admin/settings?tab=telegram', pattern: /^\/admin\/settings\?tab=telegram/, perm: 'settings.manage' },
        ],
      },
    ],
  },
  {
    label: 'SYSTEM',
    items: [
      {
        key: 'media', label: 'Media Manager', href: '/admin/media', pattern: /^\/admin\/media/,
        icon: 'M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z',
        perm: 'media.manage',
      },
      {
        key: 'fake-order-guard', label: 'Fraud Guard', href: '/admin/fake-order-guard', pattern: /^\/admin\/(fake-order-guard|blocked-devices|blocked-phones)/,
        icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z',
        perm: 'fraud_guard.manage',
      },
      {
        key: 'admins', label: 'Staff & Roles', href: '/admin/admins', pattern: /^\/admin\/admins/,
        icon: 'M12 12a4 4 0 100-8 4 4 0 000 8zM4 21v-1a6 6 0 016-6h4a6 6 0 016 6v1',
        perm: 'admins.manage',
      },
      {
        key: 'settings', label: 'Settings', href: '/admin/settings', pattern: /^\/admin\/settings/,
        icon: 'M12 15a3 3 0 100-6 3 3 0 000 6zM19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09a1.65 1.65 0 00-1-1.51 1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09a1.65 1.65 0 001.51-1 1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z',
        perm: 'settings.manage',
      },
    ],
  },
];

/* ─── Icon helper ─────────────────────────────────────────────────── */
function NavIcon({ d, size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
      {d.split('M').filter(Boolean).map((seg, i) => (
        <path key={i} d={`M${seg}`} />
      ))}
    </svg>
  );
}

/* ─── Chevron ─────────────────────────────────────────────────────── */
function Chevron({ open }) {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
      className={`shrink-0 transition-transform duration-200 ${open ? 'rotate-90' : ''}`}>
      <path d="M9 18l6-6-6-6" />
    </svg>
  );
}

/* ─── Collapsible nav item ────────────────────────────────────────── */
function CollapsibleItem({ item, isActive, admin_badges, hasPerm, palette, isDarkSidebar }) {
  if (!item.children || item.children.length === 0) {
    if (!hasPerm(item.perm)) return null;
    const active = isActive(item.pattern);
    const badge = item.badge && admin_badges ? admin_badges[item.badge] : 0;
    return (
      <a key={item.key} href={item.href}
        style={active ? { backgroundColor: palette.primary, color: '#ffffff', boxShadow: `0 2px 8px ${palette.shadow}` } : undefined}
        className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm mb-0.5 transition-all font-medium
          ${active
            ? 'font-semibold'
            : isDarkSidebar
              ? 'text-slate-300 hover:bg-slate-800/70 hover:text-white'
              : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}`}
      >
        <NavIcon d={item.icon} />
        <span className="flex-1">{item.label}</span>
        {badge > 0 && (
          <span
            style={active ? { backgroundColor: '#ffffff', color: palette.primary } : { backgroundColor: isDarkSidebar ? '#334155' : palette.light, color: isDarkSidebar ? '#ffffff' : palette.primary }}
            className="text-[10px] font-bold px-1.5 py-0.5 rounded-full"
          >
            {badge > 99 ? '99+' : badge}
          </span>
        )}
      </a>
    );
  }

  const visibleChildren = item.children.filter(c => hasPerm(c.perm));
  if (visibleChildren.length === 0) return null;

  const childActive = visibleChildren.some(c => isActive(c.pattern));
  const [open, setOpen] = useState(item.defaultOpen || childActive);

  const badge = item.badge && admin_badges ? admin_badges[item.badge] : 0;

  return (
    <div>
      <button
        onClick={() => setOpen(o => !o)}
        style={childActive ? { backgroundColor: isDarkSidebar ? 'rgba(51, 65, 85, 0.4)' : palette.light, color: isDarkSidebar ? '#ffffff' : palette.primary } : undefined}
        className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-all mb-0.5 group
          ${childActive
            ? 'font-semibold'
            : isDarkSidebar
              ? 'text-slate-300 hover:bg-slate-800/70 hover:text-white'
              : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}`}
      >
        <NavIcon d={item.icon} />
        <span className="flex-1 text-left">{item.label}</span>
        {badge > 0 && (
          <span
            style={{ backgroundColor: palette.primary, color: '#ffffff' }}
            className="text-[10px] font-bold px-1.5 py-0.5 rounded-full mr-1"
          >
            {badge > 99 ? '99+' : badge}
          </span>
        )}
        <Chevron open={open} />
      </button>

      <div className={`overflow-hidden transition-all duration-200 ${open ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
        <div className={`ml-3 pl-3 border-l ${isDarkSidebar ? 'border-slate-800' : 'border-gray-100'} space-y-0.5 mb-1`}>
          {visibleChildren.map(child => {
            const active = isActive(child.pattern);
            const childBadge = child.badge && admin_badges ? admin_badges[child.badge] : 0;
            return (
              <a key={child.key} href={child.href}
                style={active ? { backgroundColor: palette.primary, color: '#ffffff', boxShadow: `0 2px 8px ${palette.shadow}` } : undefined}
                className={`flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-sm transition-all
                  ${active
                    ? 'font-semibold'
                    : isDarkSidebar
                      ? 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                      : 'text-gray-500 hover:text-gray-800 hover:bg-gray-50'}`}
              >
                <span className="flex-1">{child.label}</span>
                {childBadge > 0 && (
                  <span
                    style={active ? { backgroundColor: '#ffffff', color: palette.primary } : { backgroundColor: isDarkSidebar ? '#334155' : palette.light, color: isDarkSidebar ? '#ffffff' : palette.primary }}
                    className="text-[10px] font-bold px-1.5 py-0.5 rounded-full"
                  >
                    {childBadge > 99 ? '99+' : childBadge}
                  </span>
                )}
              </a>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/* ─── Main layout ─────────────────────────────────────────────────── */
export default function AdminLayout({ children, title }) {
  const { url, props } = usePage();
  const { auth, app, flash, testing_mode, admin_badges } = props;
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [confirmModal, setConfirmModal] = useState(null);

  // ── Theme State & Logic ──
  const serverTheme = props.admin_theme || { preset: 'orange', primary_color: '#f97316', link_color: '', sidebar_style: 'light' };
  const [themeState, setThemeState] = useState(() => {
    const local = getLocalAdminTheme();
    if (local && local.primary_color) {
      return local;
    }
    return serverTheme;
  });

  const [themeOpen, setThemeOpen] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);
  const [saveNotice, setSaveNotice] = useState(null);
  const themeDropdownRef = useRef(null);

  const palette = generateThemePalette(themeState.primary_color, themeState.preset, themeState.link_color);
  const isDarkSidebar = themeState.sidebar_style === 'dark';

  useEffect(() => {
    applyAdminTheme(palette);
    setLocalAdminTheme(themeState);
  }, [themeState.primary_color, themeState.preset, themeState.link_color, themeState.sidebar_style]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (themeDropdownRef.current && !themeDropdownRef.current.contains(e.target)) {
        setThemeOpen(false);
      }
    };
    if (themeOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [themeOpen]);

  const handleSelectPreset = (preset) => {
    const updated = {
      ...themeState,
      preset: preset.id,
      primary_color: preset.primary,
    };
    setThemeState(updated);
    setLocalAdminTheme(updated);
    applyAdminTheme(generateThemePalette(preset.primary, preset.id, updated.link_color));
  };

  const handleCustomColor = (hex) => {
    const updated = {
      ...themeState,
      preset: 'custom',
      primary_color: hex,
    };
    setThemeState(updated);
    setLocalAdminTheme(updated);
    applyAdminTheme(generateThemePalette(hex, 'custom', updated.link_color));
  };

  const handleCustomLinkColor = (hex) => {
    const updated = {
      ...themeState,
      link_color: hex,
    };
    setThemeState(updated);
    setLocalAdminTheme(updated);
    applyAdminTheme(generateThemePalette(updated.primary_color, updated.preset, hex));
  };

  const handleSidebarToggle = (style) => {
    const updated = {
      ...themeState,
      sidebar_style: style,
    };
    setThemeState(updated);
    setLocalAdminTheme(updated);
  };

  const handleSaveTheme = () => {
    setSaveLoading(true);
    setSaveNotice(null);
    router.put('/admin/settings/admin_theme', {
      admin_theme_preset: themeState.preset,
      admin_primary_color: themeState.primary_color,
      admin_link_color: themeState.link_color || '',
      admin_sidebar_style: themeState.sidebar_style,
      header_template: themeState.header_template || app?.header_template || 'modern_tabbed',
    }, {
      preserveScroll: true,
      preserveState: true,
      onSuccess: () => {
        setSaveLoading(false);
        setSaveNotice('Theme saved permanently as default!');
        setTimeout(() => setSaveNotice(null), 3500);
      },
      onError: () => {
        setSaveLoading(false);
        setSaveNotice('Failed to save theme to server.');
      }
    });
  };

  const handleResetTheme = () => {
    const defaultTheme = { preset: 'orange', primary_color: '#f97316', link_color: '', sidebar_style: 'light' };
    setThemeState(defaultTheme);
    setLocalAdminTheme(defaultTheme);
    applyAdminTheme(generateThemePalette('#f97316', 'orange', ''));
  };

  const user = auth?.user;
  const isSuperAdmin = user?.is_super_admin || user?.role === 'admin';
  const userPerms = Array.isArray(user?.permissions) ? user.permissions : [];

  const hasPerm = (perm) => {
    if (isSuperAdmin) return true;
    if (!perm) return true;
    return userPerms.includes(perm);
  };

  useEffect(() => {
    window.showConfirm = (message, onConfirm) => {
      setConfirmModal({ message, onConfirm });
    };
    return () => { delete window.showConfirm; };
  }, []);

  const isActive = (pattern) => pattern.test(url);

  const handleLogout = (e) => {
    e.preventDefault();
    router.post('/admin/logout');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex font-sans">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/30 z-40 lg:hidden backdrop-blur-sm"
          onClick={() => setSidebarOpen(false)} />
      )}

      {/* ── Sidebar ── */}
      <aside className={`
        fixed lg:sticky lg:top-0 lg:self-start inset-y-0 left-0 z-50
        w-60 h-screen border-r flex flex-col shadow-sm transition-all duration-200
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        ${isDarkSidebar ? 'bg-slate-900 border-slate-800 text-slate-200' : 'bg-white border-gray-100 text-gray-800'}
      `}>

        {/* Logo / Store header */}
        <div className={`h-14 flex items-center gap-2.5 px-4 border-b shrink-0 ${isDarkSidebar ? 'border-slate-800' : 'border-gray-100'}`}>
          <a href="/admin" className="flex items-center gap-2.5 min-w-0 flex-1">
            {(app?.has_custom_logo && app?.logo_url) || (app?.logo_url && !app?.logo_url?.includes('theme/logo.svg') && !app?.logo_url?.includes('theme/favicon.svg')) ? (
              <img src={app.logo_url} alt={app?.name || 'Logo'} className="h-8 max-h-9 w-auto max-w-[160px] object-contain shrink-0" />
            ) : (
              <>
                <div className="h-7 w-7 rounded-lg flex items-center justify-center shrink-0 shadow-xs" style={{ backgroundColor: palette.primary }}>
                  <span className="text-white font-bold text-xs">{(app?.name || 'S').charAt(0).toUpperCase()}</span>
                </div>
                <span className={`font-bold text-sm truncate ${isDarkSidebar ? 'text-white' : 'text-gray-900'}`}>{app?.name || 'Shopzy'}</span>
              </>
            )}
          </a>
          <button onClick={() => setSidebarOpen(false)}
            className={`lg:hidden p-1 rounded-md ${isDarkSidebar ? 'text-slate-400 hover:text-white' : 'text-gray-400 hover:text-gray-600'}`}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12"/>
            </svg>
          </button>
        </div>

        {/* View Site link */}
        <div className="px-3 pt-3 shrink-0">
          <a href="/" target="_blank"
            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium transition-all border border-dashed ${
              isDarkSidebar
                ? 'text-slate-400 border-slate-800 hover:text-white hover:bg-slate-800/80 hover:border-slate-700'
                : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50 border-gray-200 hover:border-gray-300'
            }`}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6v6M10 14L21 3"/>
            </svg>
            View Store
          </a>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto py-3 px-3 space-y-0 min-h-0">
          {navGroups.map((group) => {
            const visibleDirectItems = group.items ? group.items.filter(item => hasPerm(item.perm)) : [];
            const visibleCollapsibles = group.collapsible ? group.collapsible.filter(item => {
              if (item.children) return item.children.some(c => hasPerm(c.perm));
              return hasPerm(item.perm);
            }) : [];

            if (visibleDirectItems.length === 0 && visibleCollapsibles.length === 0) {
              return null;
            }

            return (
              <div key={group.label} className="mb-3">
                <p className={`px-3 text-[9px] font-bold uppercase tracking-widest mb-1.5 ${isDarkSidebar ? 'text-slate-500' : 'text-gray-400'}`}>
                  {group.label}
                </p>

                {/* Direct items */}
                {visibleDirectItems.map(item => {
                  const active = isActive(item.pattern);
                  const badge = item.badge && admin_badges ? admin_badges[item.badge] : 0;
                  return (
                    <a key={item.key} href={item.href}
                      style={active ? { backgroundColor: palette.primary, color: '#ffffff', boxShadow: `0 2px 8px ${palette.shadow}` } : undefined}
                      className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm mb-0.5 transition-all font-medium
                        ${active
                          ? 'font-semibold'
                          : isDarkSidebar
                            ? 'text-slate-300 hover:bg-slate-800/70 hover:text-white'
                            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}`}
                    >
                      <NavIcon d={item.icon} />
                      <span className="flex-1">{item.label}</span>
                      {badge > 0 && (
                        <span
                          style={active ? { backgroundColor: '#ffffff', color: palette.primary } : { backgroundColor: isDarkSidebar ? '#334155' : palette.light, color: isDarkSidebar ? '#ffffff' : palette.primary }}
                          className="text-[10px] font-bold px-1.5 py-0.5 rounded-full"
                        >
                          {badge > 99 ? '99+' : badge}
                        </span>
                      )}
                    </a>
                  );
                })}

                {/* Collapsible items */}
                {visibleCollapsibles.map(item => (
                  <CollapsibleItem
                    key={item.key}
                    item={item}
                    isActive={isActive}
                    admin_badges={admin_badges}
                    hasPerm={hasPerm}
                    palette={palette}
                    isDarkSidebar={isDarkSidebar}
                  />
                ))}
              </div>
            );
          })}
        </nav>

        {/* Admin user footer */}
        <div className={`border-t p-3 shrink-0 ${isDarkSidebar ? 'border-slate-800' : 'border-gray-100'}`}>
          <div className="flex items-center gap-2.5 px-2 py-1.5">
            <img
              src={`https://ui-avatars.com/api/?name=${encodeURIComponent(auth?.user?.name || 'Admin')}&background=${palette.primary.replace('#', '')}&color=fff&size=64`}
              className="h-8 w-8 rounded-full shrink-0 ring-1 ring-black/10" alt=""
            />
            <div className="min-w-0 flex-1">
              <p className={`text-sm font-semibold truncate ${isDarkSidebar ? 'text-white' : 'text-gray-800'}`}>{auth?.user?.name || 'Admin'}</p>
              <p className={`text-[10px] truncate ${isDarkSidebar ? 'text-slate-500' : 'text-gray-400'}`}>{auth?.user?.email}</p>
            </div>
            <button onClick={handleLogout} title="Log out"
              className={`h-7 w-7 rounded-lg flex items-center justify-center transition-colors ${
                isDarkSidebar ? 'text-slate-400 hover:text-red-400 hover:bg-slate-800' : 'text-gray-400 hover:text-red-500 hover:bg-red-50'
              }`}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9"/>
              </svg>
            </button>
          </div>
        </div>
      </aside>

      {/* ── Main content ── */}
      <div className="flex-1 flex flex-col min-w-0">

        {/* Topbar */}
        <header className="h-14 bg-white border-b border-gray-100 flex items-center gap-3 px-4 sm:px-6 shrink-0 sticky top-0 z-30 shadow-sm">
          <button onClick={() => setSidebarOpen(true)}
            className="lg:hidden p-1.5 rounded-lg text-gray-500 hover:bg-gray-100 transition-colors">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 12h18M3 6h18M3 18h18"/>
            </svg>
          </button>

          <div className="flex-1">
            {title && (
              <h1 className="text-base font-bold text-gray-800">{title}</h1>
            )}
          </div>

          {/* Right side: theme palette switcher + admin badge + avatar */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* ── Theme Switcher Palette Dropdown ── */}
            <div className="relative" ref={themeDropdownRef}>
              <button
                type="button"
                onClick={() => setThemeOpen(!themeOpen)}
                className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl border border-gray-200 hover:border-gray-300 bg-white hover:bg-gray-50 text-xs font-semibold text-gray-700 transition-all shadow-xs cursor-pointer"
                title="Change Admin Colors & Theme"
              >
                <span className="w-3.5 h-3.5 rounded-full ring-2 ring-white shadow-xs shrink-0" style={{ backgroundColor: palette.primary }} />
                <span className="hidden sm:inline font-medium">{palette.name}</span>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className={`transition-transform duration-200 text-gray-400 ${themeOpen ? 'rotate-180' : ''}`}>
                  <path d="M6 9l6 6 6-6"/>
                </svg>
              </button>

              {themeOpen && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-gray-100 z-50 p-4 animate-in fade-in zoom-in-95 duration-150">
                  {/* Header */}
                  <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg flex items-center justify-center text-white" style={{ backgroundColor: palette.primary }}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                          <circle cx="12" cy="12" r="10"/><path d="m4.93 4.93 4.24 4.24"/><path d="m14.83 9.17 4.24-4.24"/><path d="m14.83 14.83 4.24 4.24"/><path d="m9.17 14.83-4.24 4.24"/>
                        </svg>
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-gray-900">Admin Appearance</h3>
                        <p className="text-[11px] text-gray-400">Color presets & custom theme</p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setThemeOpen(false)}
                      className="text-gray-400 hover:text-gray-600 p-1 rounded-lg hover:bg-gray-100"
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M18 6L6 18M6 6l12 12"/>
                      </svg>
                    </button>
                  </div>

                  {/* Preset Swatches */}
                  <div className="py-3">
                    <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2">Ready-made Color Schemes</p>
                    <div className="grid grid-cols-4 gap-2">
                      {ADMIN_THEME_PRESETS.map(preset => {
                        const isSelected = themeState.preset === preset.id;
                        return (
                          <button
                            key={preset.id}
                            type="button"
                            onClick={() => handleSelectPreset(preset)}
                            className={`group flex flex-col items-center p-2 rounded-xl border text-center transition-all cursor-pointer ${
                              isSelected
                                ? 'border-gray-900 bg-gray-50 shadow-xs'
                                : 'border-gray-100 hover:border-gray-300 hover:bg-gray-50/70'
                            }`}
                          >
                            <div className="relative w-6 h-6 rounded-full flex items-center justify-center shadow-xs" style={{ backgroundColor: preset.primary }}>
                              {isSelected && (
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
                                  <polyline points="20 6 9 17 4 12" />
                                </svg>
                              )}
                            </div>
                            <span className="text-[10px] font-medium text-gray-700 mt-1.5 truncate max-w-full leading-tight">
                              {preset.name.split(' ')[1] || preset.name}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Custom Color Input */}
                  <div className="py-2.5 border-t border-gray-100">
                    <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2">Custom Color Picker</p>
                    <div className="flex items-center gap-2">
                      <div className="relative w-9 h-9 rounded-xl border border-gray-200 overflow-hidden shrink-0 shadow-xs">
                        <input
                          type="color"
                          value={palette.primary}
                          onChange={(e) => handleCustomColor(e.target.value)}
                          className="absolute inset-0 w-[150%] h-[150%] -top-1/4 -left-1/4 cursor-pointer"
                        />
                      </div>
                      <div className="flex-1 relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-mono text-gray-400 font-bold">#</span>
                        <input
                          type="text"
                          value={themeState.primary_color.replace('#', '')}
                          onChange={(e) => {
                            const val = e.target.value.replace(/[^0-9A-Fa-f]/g, '').slice(0, 6);
                            handleCustomColor('#' + val);
                          }}
                          placeholder="f97316"
                          className="w-full pl-6 pr-3 py-1.5 text-xs font-mono font-semibold border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-300"
                          maxLength={6}
                        />
                      </div>
                      <div
                        className="px-3 py-1.5 rounded-xl text-xs font-bold text-white shadow-xs shrink-0"
                        style={{ backgroundColor: palette.primary }}
                      >
                        Live
                      </div>
                    </div>
                  </div>

                  {/* Link Text Color Picker */}
                  <div className="py-2.5 border-t border-gray-100">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Link Text Color</p>
                      {themeState.link_color && (
                        <button
                          type="button"
                          onClick={() => handleCustomLinkColor('')}
                          className="text-[10px] text-gray-400 hover:text-gray-700 underline cursor-pointer"
                        >
                          Match Theme
                        </button>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="relative w-9 h-9 rounded-xl border border-gray-200 overflow-hidden shrink-0 shadow-xs">
                        <input
                          type="color"
                          value={palette.link || palette.primary}
                          onChange={(e) => handleCustomLinkColor(e.target.value)}
                          className="absolute inset-0 w-[150%] h-[150%] -top-1/4 -left-1/4 cursor-pointer"
                        />
                      </div>
                      <div className="flex-1 relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-mono text-gray-400 font-bold">#</span>
                        <input
                          type="text"
                          value={(themeState.link_color || '').replace('#', '')}
                          onChange={(e) => {
                            const val = e.target.value.replace(/[^0-9A-Fa-f]/g, '').slice(0, 6);
                            handleCustomLinkColor(val ? '#' + val : '');
                          }}
                          placeholder={palette.primary.replace('#', '')}
                          className="w-full pl-6 pr-3 py-1.5 text-xs font-mono font-semibold border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-300"
                          maxLength={6}
                        />
                      </div>
                      <div
                        className="px-2.5 py-1.5 rounded-xl text-xs font-bold text-white shadow-xs shrink-0"
                        style={{ backgroundColor: palette.link || palette.primary }}
                      >
                        Link
                      </div>
                    </div>
                  </div>

                  {/* Sidebar Style Mode */}
                  <div className="py-2.5 border-t border-gray-100">
                    <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2">Sidebar Mode</p>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => handleSidebarToggle('light')}
                        className={`flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                          themeState.sidebar_style !== 'dark'
                            ? 'border-gray-900 bg-gray-50 text-gray-900 shadow-xs'
                            : 'border-gray-200 text-gray-500 hover:bg-gray-50'
                        }`}
                      >
                        <span className="w-2.5 h-2.5 rounded-full bg-white border border-gray-300" />
                        Light Sidebar
                      </button>
                      <button
                        type="button"
                        onClick={() => handleSidebarToggle('dark')}
                        className={`flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                          themeState.sidebar_style === 'dark'
                            ? 'border-gray-900 bg-slate-900 text-white shadow-xs'
                            : 'border-gray-200 text-gray-500 hover:bg-gray-50'
                        }`}
                      >
                        <span className="w-2.5 h-2.5 rounded-full bg-slate-800 border border-slate-700" />
                        Dark Sidebar
                      </button>
                    </div>
                  </div>

                  {/* Header Design Template Switcher */}
                  <div className="py-2.5 border-t border-gray-100">
                    <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2">Header Design Template</p>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          const updated = { ...themeState, header_template: 'modern_tabbed' };
                          setThemeState(updated);
                          setLocalAdminTheme(updated);
                        }}
                        className={`flex flex-col items-start p-2 rounded-xl text-left border transition-all cursor-pointer ${
                          (themeState.header_template || app?.header_template || 'modern_tabbed') === 'modern_tabbed'
                            ? 'border-gray-900 bg-gray-50 text-gray-900 shadow-xs font-bold'
                            : 'border-gray-200 text-gray-500 hover:bg-gray-50'
                        }`}
                      >
                        <span className="text-[11px] font-bold text-gray-800">Design 1</span>
                        <span className="text-[10px] text-gray-500">Modern Tabbed</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          const updated = { ...themeState, header_template: 'classic_dark' };
                          setThemeState(updated);
                          setLocalAdminTheme(updated);
                        }}
                        className={`flex flex-col items-start p-2 rounded-xl text-left border transition-all cursor-pointer ${
                          (themeState.header_template || app?.header_template) === 'classic_dark'
                            ? 'border-gray-900 bg-gray-50 text-gray-900 shadow-xs font-bold'
                            : 'border-gray-200 text-gray-500 hover:bg-gray-50'
                        }`}
                      >
                        <span className="text-[11px] font-bold text-gray-800">Design 2</span>
                        <span className="text-[10px] text-gray-500">Classic Strip</span>
                      </button>
                    </div>
                  </div>

                  {/* Save Notice */}
                  {saveNotice && (
                    <div className="mt-2 text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-2 rounded-xl flex items-center gap-1.5 animate-in fade-in">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                      {saveNotice}
                    </div>
                  )}

                  {/* Footer Actions */}
                  <div className="pt-3 mt-2 border-t border-gray-100 flex items-center justify-between gap-2">
                    <button
                      type="button"
                      onClick={handleResetTheme}
                      className="text-xs font-medium text-gray-400 hover:text-gray-700 px-2 py-1 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      Reset
                    </button>
                    <button
                      type="button"
                      onClick={handleSaveTheme}
                      disabled={saveLoading}
                      style={{ backgroundColor: palette.primary }}
                      className="px-3.5 py-1.5 rounded-xl text-xs font-bold text-white shadow-sm hover:opacity-90 transition-all cursor-pointer disabled:opacity-50"
                    >
                      {saveLoading ? 'Saving...' : 'Save as Default'}
                    </button>
                  </div>
                </div>
              )}
            </div>

            {admin_badges?.pending_orders > 0 && (
              <a href="/admin/orders?status=pending_verification"
                className="hidden sm:flex items-center gap-1.5 text-xs font-medium text-amber-700 bg-amber-50 border border-amber-200 px-3 py-1.5 rounded-full hover:bg-amber-100 transition-colors">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>
                </svg>
                {admin_badges.pending_orders} pending
              </a>
            )}
            <div className="flex items-center gap-2">
              <img
                src={`https://ui-avatars.com/api/?name=${encodeURIComponent(auth?.user?.name || 'Admin')}&background=${palette.primary.replace('#', '')}&color=fff&size=64`}
                className="h-8 w-8 rounded-full ring-1 ring-black/10" alt=""
              />
              <span className="hidden md:block text-sm font-medium text-gray-700">{auth?.user?.name}</span>
            </div>
          </div>
        </header>

        {/* Testing mode banner */}
        {testing_mode && (
          <div className="bg-amber-50 border-b border-amber-200 text-amber-800 text-xs px-6 py-2 text-center font-medium flex items-center justify-center gap-2">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
            </svg>
            Testing mode is ON — write actions are disabled.
          </div>
        )}

        {/* Flash messages */}
        <div className="px-4 sm:px-6 pt-4 space-y-2.5">
          {flash?.status && (
            <div className="bg-green-50 border border-green-200 text-green-700 text-sm font-medium px-4 py-2.5 rounded-xl flex items-center gap-2">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M22 11.08V12a10 10 0 11-5.93-9.14M22 4L12 14.01l-3-3"/>
              </svg>
              {flash.status}
            </div>
          )}
          {flash?.error && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-sm font-medium px-4 py-2.5 rounded-xl flex items-center gap-2">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"/><path d="M15 9l-6 6M9 9l6 6"/>
              </svg>
              {flash.error}
            </div>
          )}
          {props.errors && Object.keys(props.errors).length > 0 && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-2.5 rounded-xl">
              <ul className="list-disc list-inside space-y-1">
                {Object.values(props.errors).flat().map((err, i) => <li key={i}>{err}</li>)}
              </ul>
            </div>
          )}
        </div>

        {/* Page content */}
        <main className="flex-1 p-4 sm:p-6">
          {children}
        </main>
      </div>

      {/* ── Global Confirm Modal ── */}
      {confirmModal && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6">
            <div className="w-11 h-11 rounded-full bg-red-100 text-red-600 flex items-center justify-center mb-4">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
              </svg>
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-1.5">Confirm Action</h3>
            <p className="text-gray-500 text-sm mb-5">{confirmModal.message}<br/>This action cannot be undone.</p>
            <div className="flex items-center justify-end gap-2.5">
              <button type="button" onClick={() => setConfirmModal(null)}
                className="px-4 py-2 text-sm font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors">
                Cancel
              </button>
              <button type="button"
                onClick={() => { confirmModal.onConfirm(); setConfirmModal(null); }}
                className="px-4 py-2 text-sm font-semibold text-white bg-red-600 hover:bg-red-700 rounded-xl transition-colors">
                Yes, confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
