// Admin Theme Definitions and Helpers

export const HEADER_TEMPLATES = [
  {
    id: 'modern_tabbed',
    name: 'Template 1: Modern Tabbed Bar',
    shortName: 'Modern Tabbed',
    badge: 'Recommended',
    tag: 'Design 1',
    description: 'Clean white background with left Categories dropdown tab and uppercase navigation links (HOME, SHOP, BEST SELLING, NEW ARRIVALS, BRANDS, 🔥 HOT OFFER, BLOG).',
  },
  {
    id: 'classic_dark',
    name: 'Template 2: Classic Category Strip',
    shortName: 'Classic Dark',
    badge: 'Full Strip',
    tag: 'Design 2',
    description: 'Rich dark green horizontal strip displaying direct category links across the full header with subcategory dropdowns and right-aligned ⚡ Offer Zone.',
  },
];

export const ADMIN_THEME_PRESETS = [
  {
    id: 'orange',
    name: 'Vibrant Orange',
    badge: 'Shopzy Signature',
    primary: '#f97316',
    hover: '#ea580c',
    light: '#fff7ed',
    border: '#fed7aa',
    shadow: 'rgba(249, 115, 22, 0.25)',
  },
  {
    id: 'indigo',
    name: 'Royal Indigo',
    badge: 'Modern SaaS',
    primary: '#6366f1',
    hover: '#4f46e5',
    light: '#eef2ff',
    border: '#c7d2fe',
    shadow: 'rgba(99, 102, 241, 0.25)',
  },
  {
    id: 'blue',
    name: 'Ocean Cyan',
    badge: 'Clean Tech',
    primary: '#0284c7',
    hover: '#0369a1',
    light: '#f0f9ff',
    border: '#bae6fd',
    shadow: 'rgba(2, 132, 199, 0.25)',
  },
  {
    id: 'emerald',
    name: 'Emerald Green',
    badge: 'Fresh & Trust',
    primary: '#10b981',
    hover: '#059669',
    light: '#ecfdf5',
    border: '#a7f3d0',
    shadow: 'rgba(16, 185, 129, 0.25)',
  },
  {
    id: 'violet',
    name: 'Luxury Violet',
    badge: 'Creative & Bold',
    primary: '#8b5cf6',
    hover: '#7c3aed',
    light: '#f5f3ff',
    border: '#ddd6fe',
    shadow: 'rgba(139, 92, 246, 0.25)',
  },
  {
    id: 'rose',
    name: 'Rose Crimson',
    badge: 'Passionate & Chic',
    primary: '#f43f5e',
    hover: '#e11d48',
    light: '#fff1f2',
    border: '#fecdd3',
    shadow: 'rgba(244, 63, 94, 0.25)',
  },
  {
    id: 'amber',
    name: 'Amber Gold',
    badge: 'Prestige & Warm',
    primary: '#f59e0b',
    hover: '#d97706',
    light: '#fffbeb',
    border: '#fde68a',
    shadow: 'rgba(245, 158, 11, 0.25)',
  },
  {
    id: 'slate',
    name: 'Slate Charcoal',
    badge: 'Minimalist Dark',
    primary: '#334155',
    hover: '#1e293b',
    light: '#f1f5f9',
    border: '#cbd5e1',
    shadow: 'rgba(51, 65, 85, 0.25)',
  },
];

/**
 * Convert a hex color string to RGB values
 */
export function hexToRgb(hex) {
  if (!hex) return { r: 249, g: 115, b: 22 };
  let clean = hex.replace('#', '').trim();
  if (clean.length === 3) {
    clean = clean.split('').map(c => c + c).join('');
  }
  const num = parseInt(clean, 16);
  if (isNaN(num) || clean.length !== 6) {
    return { r: 249, g: 115, b: 22 };
  }
  return {
    r: (num >> 16) & 255,
    g: (num >> 8) & 255,
    b: num & 255,
  };
}

export const LINK_COLOR_PRESETS = [
  { id: 'match', name: 'Match Theme', hex: null, desc: 'Uses primary theme color' },
  { id: 'blue', name: 'Royal Blue', hex: '#2563eb', desc: 'Standard hyperlinked blue' },
  { id: 'cyan', name: 'Ocean Cyan', hex: '#0284c7', desc: 'Clean high-contrast cyan' },
  { id: 'emerald', name: 'Emerald Teal', hex: '#059669', desc: 'Fresh organic green' },
  { id: 'indigo', name: 'Royal Indigo', hex: '#4f46e5', desc: 'Modern vibrant indigo' },
  { id: 'violet', name: 'Amethyst Violet', hex: '#7c3aed', desc: 'Creative luxury purple' },
  { id: 'rose', name: 'Crimson Rose', hex: '#e11d48', desc: 'Vivid striking red' },
  { id: 'amber', name: 'Sunset Amber', hex: '#d97706', desc: 'Warm prestige tone' },
  { id: 'slate', name: 'Dark Slate', hex: '#1e293b', desc: 'Deep subtle dark' },
];

/**
 * Generate a complete theme palette from any arbitrary primary hex color and optional link color
 */
export function generateThemePalette(primaryHex, presetId = 'custom', linkHex = null) {
  const matchingPreset = ADMIN_THEME_PRESETS.find(p => p.id === presetId || p.primary.toLowerCase() === primaryHex?.toLowerCase());

  const { r, g, b } = hexToRgb(primaryHex || '#f97316');
  
  // Slightly darker for hover (mix with 15% black)
  const hoverR = Math.max(0, Math.floor(r * 0.85));
  const hoverG = Math.max(0, Math.floor(g * 0.85));
  const hoverB = Math.max(0, Math.floor(b * 0.85));
  const hoverHex = `#${((1 << 24) + (hoverR << 16) + (hoverG << 8) + hoverB).toString(16).slice(1)}`;

  // Very light tint for backgrounds (mix with 92% white)
  const lightR = Math.min(255, Math.floor(r * 0.08 + 255 * 0.92));
  const lightG = Math.min(255, Math.floor(g * 0.08 + 255 * 0.92));
  const lightB = Math.min(255, Math.floor(b * 0.08 + 255 * 0.92));
  const lightHex = `#${((1 << 24) + (lightR << 16) + (lightG << 8) + lightB).toString(16).slice(1)}`;

  // Soft border (mix with 75% white)
  const borderR = Math.min(255, Math.floor(r * 0.25 + 255 * 0.75));
  const borderG = Math.min(255, Math.floor(g * 0.25 + 255 * 0.75));
  const borderB = Math.min(255, Math.floor(b * 0.25 + 255 * 0.75));
  const borderHex = `#${((1 << 24) + (borderR << 16) + (borderG << 8) + borderB).toString(16).slice(1)}`;

  // Link color logic
  const activeLink = (linkHex && linkHex.trim() !== '') ? linkHex : primaryHex;
  const linkRgb = hexToRgb(activeLink || primaryHex);
  const linkHoverR = Math.max(0, Math.floor(linkRgb.r * 0.80));
  const linkHoverG = Math.max(0, Math.floor(linkRgb.g * 0.80));
  const linkHoverB = Math.max(0, Math.floor(linkRgb.b * 0.80));
  const linkHoverHex = `#${((1 << 24) + (linkHoverR << 16) + (linkHoverG << 8) + linkHoverB).toString(16).slice(1)}`;

  return {
    id: presetId,
    name: matchingPreset?.name || (presetId === 'custom' ? 'Custom Color' : 'Theme'),
    badge: matchingPreset?.badge || 'Custom',
    primary: primaryHex,
    hover: hoverHex,
    light: lightHex,
    border: borderHex,
    shadow: `rgba(${r}, ${g}, ${b}, 0.25)`,
    link: activeLink,
    linkHover: linkHoverHex,
    isCustomLink: Boolean(linkHex && linkHex.trim() !== ''),
  };
}

/**
 * Apply CSS custom properties to the document root element
 */
export function applyAdminTheme(palette) {
  if (typeof document === 'undefined' || !palette) return;
  const root = document.documentElement;
  
  // Admin tokens
  root.style.setProperty('--admin-primary', palette.primary);
  root.style.setProperty('--admin-primary-hover', palette.hover);
  root.style.setProperty('--admin-primary-light', palette.light);
  root.style.setProperty('--admin-primary-border', palette.border);
  root.style.setProperty('--admin-primary-shadow', palette.shadow);

  // Global Brand tokens (Storefront & User Dashboard)
  root.style.setProperty('--brand-primary', palette.primary);
  root.style.setProperty('--brand-primary-hover', palette.hover);
  root.style.setProperty('--brand-primary-light', palette.light);
  root.style.setProperty('--brand-primary-border', palette.border);
  root.style.setProperty('--brand-primary-shadow', palette.shadow);

  // Link tokens
  const linkColor = palette.link || palette.primary;
  const linkHover = palette.linkHover || palette.hover;
  root.style.setProperty('--brand-link', linkColor);
  root.style.setProperty('--brand-link-hover', linkHover);

  const rgb = hexToRgb(palette.primary);
  root.style.setProperty('--brand-primary-subtle', `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.1)`);
  root.style.setProperty('--brand-primary-5', `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.05)`);
  root.style.setProperty('--brand-primary-20', `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.2)`);
}

export const HEADER_NAV_COLOR_PRESETS = [
  {
    id: 'emerald',
    name: 'Forest Emerald',
    bg: '#0A2A22',
    text: '#ffffff',
    hover: '#fbbf24',
    badge: 'Design 2 Default',
  },
  {
    id: 'navy',
    name: 'Midnight Navy',
    bg: '#0f172a',
    text: '#ffffff',
    hover: '#38bdf8',
    badge: 'Deep Blue',
  },
  {
    id: 'slate',
    name: 'Charcoal Slate',
    bg: '#1e293b',
    text: '#f8fafc',
    hover: '#f97316',
    badge: 'High Contrast',
  },
  {
    id: 'black',
    name: 'Pitch Black',
    bg: '#111827',
    text: '#ffffff',
    hover: '#22c55e',
    badge: 'Monochrome Modern',
  },
  {
    id: 'white',
    name: 'Clean White',
    bg: '#ffffff',
    text: '#1f2937',
    hover: '#f97316',
    badge: 'Minimalist Bright',
  },
];

export function applyHeaderNavTheme(bg, text, hover) {
  if (typeof document === 'undefined') return;
  const root = document.documentElement;
  if (bg) root.style.setProperty('--header-nav-bg', bg);
  if (text) root.style.setProperty('--header-nav-text', text);
  if (hover) root.style.setProperty('--header-nav-hover', hover);
}

export const applyBrandTheme = applyAdminTheme;

const STORAGE_KEY = 'shopzy_admin_theme';

export function getLocalAdminTheme() {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function setLocalAdminTheme(theme) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(theme));
  } catch (err) {
    console.error('Failed to save admin theme to localStorage', err);
  }
}
