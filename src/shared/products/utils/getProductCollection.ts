export function getProductCollection(
  pathname: string,
  collection: string | null,
): 'hardware' | 'unique' {
  if (pathname.startsWith('/products/')) {
    return /^\/products\/[1-9]\d*\/?$/.test(pathname) ? 'unique' : 'hardware';
  }
  return collection === 'unique' ? 'unique' : 'hardware';
}
