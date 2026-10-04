import { createInertiaApp, router } from '@inertiajs/react';
import { createRoot } from 'react-dom/client';
import { trackPageView } from '@/lib/tracking';
import { generateThemePalette, applyAdminTheme, getLocalAdminTheme } from '@/lib/adminTheme';
import '../css/app.css';

// Apply stored or initial brand theme immediately
if (typeof window !== 'undefined') {
  const localTheme = getLocalAdminTheme();
  if (localTheme?.primary_color) {
    applyAdminTheme(generateThemePalette(localTheme.primary_color, localTheme.preset, localTheme.link_color));
  }
}

// Track SPA page views on every Inertia navigation and sync site name & active theme
router.on('navigate', (event) => {
  trackPageView(event.detail.page.url);
  const currentSiteName = event.detail?.page?.props?.app?.name;
  if (currentSiteName) {
    const meta = document.querySelector('meta[name="site-name"]');
    if (meta) meta.setAttribute('content', currentSiteName);
  }

  // Synchronize brand theme across Storefront, User Dashboard, and Admin
  const localTheme = getLocalAdminTheme();
  const serverBrand = event.detail?.page?.props?.brand_theme || event.detail?.page?.props?.admin_theme;
  const activeColor = localTheme?.primary_color || serverBrand?.primary_color;
  const activePreset = localTheme?.preset || serverBrand?.preset || 'custom';
  const activeLink = (localTheme && 'link_color' in localTheme) ? localTheme.link_color : serverBrand?.link_color;
  if (activeColor) {
    applyAdminTheme(generateThemePalette(activeColor, activePreset, activeLink));
  }
});

function getDynamicSiteName() {
  const meta = document.querySelector('meta[name="site-name"]');
  return meta?.getAttribute('content')?.trim() || '';
}

createInertiaApp({
    title: (title) => {
        const siteName = getDynamicSiteName() || 'Shop';
        const cleanTitle = (title || '').trim();
        if (!cleanTitle || cleanTitle.toLowerCase() === 'home') {
            return siteName;
        }
        return `${cleanTitle} — ${siteName}`;
    },
    resolve: (name) => {
        const pages = import.meta.glob('./Pages/**/*.jsx', { eager: true });
        return pages[`./Pages/${name}.jsx`];
    },
    setup({ el, App, props }) {
        createRoot(el).render(<App {...props} />);
    },
    progress: {
        color: '#f15a24',
    },
});
