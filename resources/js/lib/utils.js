export function money(amount) {
  return '৳' + Number(amount).toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 2 });
}

export function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

export function imageUrl(path, seed = 'Projoss') {
  if (path) {
    if (path.startsWith('http://') || path.startsWith('https://')) {
      return path;
    }
    if (path.startsWith('/uploads/') || path.startsWith('uploads/')) {
      return path.startsWith('/') ? path : '/' + path;
    }
    return path.startsWith('/') ? '/storage' + path : '/storage/' + path;
  }
  
  const label = (seed || 'No image').substring(0, 28);
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="720" viewBox="0 0 600 720">
  <rect width="600" height="720" fill="#f5f5f4"/>
  <rect x="40" y="40" width="520" height="640" rx="24" fill="#e7e5e4"/>
  <text x="300" y="370" text-anchor="middle" fill="#a8a29e" font-family="system-ui,sans-serif" font-size="26">${label}</text>
</svg>`;
  return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
}

export function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    if (!file) {
      resolve('');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ''));
    reader.onerror = (error) => reject(error);
    reader.readAsDataURL(file);
  });
}

export function getCardBoxShadow(style = 'subtle', color = '#000000', isHovered = false) {
  if (style === 'none') return 'none';
  
  const hex = (color || '#000000').replace('#', '');
  const r = parseInt(hex.length === 3 ? hex[0]+hex[0] : hex.substring(0, 2) || '0', 16) || 0;
  const g = parseInt(hex.length === 3 ? hex[1]+hex[1] : hex.substring(2, 4) || '0', 16) || 0;
  const b = parseInt(hex.length === 3 ? hex[2]+hex[2] : hex.substring(4, 6) || '0', 16) || 0;

  if (style === 'glow') {
    return isHovered 
      ? `0 10px 25px rgba(${r}, ${g}, ${b}, 0.24)`
      : `0 4px 14px rgba(${r}, ${g}, ${b}, 0.14)`;
  }
  if (style === 'medium') {
    return isHovered
      ? `0 10px 24px rgba(${r}, ${g}, ${b}, 0.12)`
      : `0 3px 10px rgba(${r}, ${g}, ${b}, 0.06)`;
  }
  // subtle (default)
  return isHovered
    ? `0 6px 16px rgba(${r}, ${g}, ${b}, 0.08)`
    : `0 1px 4px rgba(${r}, ${g}, ${b}, 0.04)`;
}

export function getCardRadiusClass(selectedRadius, defaultPresetRadius) {
  if (!selectedRadius || selectedRadius === 'preset-default') {
    return defaultPresetRadius;
  }
  return selectedRadius;
}

