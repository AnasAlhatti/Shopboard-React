import { productResponse } from '@/lib/products/apiResponse';
import { fetchCourseProduct } from '@/lib/products/courseProducts';
export const dynamic = 'force-dynamic';
export async function GET(
  _request: Request,
  context: { params: Promise<{ id: string }> },
) {
  return productResponse(async () =>
    fetchCourseProduct((await context.params).id),
  );
}
