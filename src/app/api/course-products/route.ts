import { productResponse } from '@/lib/products/apiResponse';
import { fetchCourseProducts } from '@/lib/products/courseProducts';
export const dynamic = 'force-dynamic';
export async function GET() {
  return productResponse(fetchCourseProducts);
}
