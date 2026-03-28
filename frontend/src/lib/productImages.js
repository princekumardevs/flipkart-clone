const CATEGORY_FALLBACKS = {
  electronics: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9',
  fashion: 'https://images.unsplash.com/photo-1445205170230-053b83016050',
  'home & kitchen': 'https://images.unsplash.com/photo-1556911220-bff31c812dba',
  books: 'https://images.unsplash.com/photo-1512820790803-83ca734da794',
  sports: 'https://images.unsplash.com/photo-1517649763962-0c623066013b',
};

const GENERIC_FALLBACK = 'https://images.unsplash.com/photo-1523275335684-37898b6baf30';

export function getCategoryFallbackImage(categoryName) {
  if (!categoryName) return GENERIC_FALLBACK;
  return CATEGORY_FALLBACKS[String(categoryName).toLowerCase()] || GENERIC_FALLBACK;
}

export function getProductImage(product, imageIndex = 0) {
  const direct = product?.images?.[imageIndex];
  if (direct) return direct;
  return getCategoryFallbackImage(product?.category?.name);
}

export function handleProductImageError(event, categoryName) {
  event.currentTarget.onerror = null;
  event.currentTarget.src = getCategoryFallbackImage(categoryName);
}
