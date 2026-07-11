export const getImageUrl = (imagePath) => {
  if (!imagePath) return '';
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath;
  }
  if (imagePath.startsWith('/uploads/')) {
    const apiBase = import.meta.env.VITE_API_URL || 'http://localhost:5000';
    // Trim trailing slash from apiBase if any, and leading slash from imagePath
    const base = apiBase.endsWith('/') ? apiBase.slice(0, -1) : apiBase;
    return `${base}${imagePath}`;
  }
  // Otherwise, it's a frontend public asset (like /assets/roses.png)
  return imagePath;
};
