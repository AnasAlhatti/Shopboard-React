export interface CourseProduct {
  source: 'course';
  id: string;
  name: string;
  category: string;
  price: number;
  inStock: boolean;
}
export function isCourseProduct(value: unknown): value is CourseProduct {
  return (
    typeof value === 'object' &&
    value !== null &&
    'source' in value &&
    value.source === 'course' &&
    'id' in value &&
    typeof value.id === 'string' &&
    /^\d+$/.test(value.id) &&
    'name' in value &&
    typeof value.name === 'string' &&
    'category' in value &&
    typeof value.category === 'string' &&
    'price' in value &&
    typeof value.price === 'number' &&
    Number.isFinite(value.price) &&
    value.price >= 0 &&
    'inStock' in value &&
    typeof value.inStock === 'boolean'
  );
}
