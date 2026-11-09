import { productResponse } from '@/lib/products/apiResponse';
import { getHardwareProduct } from '@/lib/products/hardwareProducts';
export const dynamic = 'force-dynamic';
export async function GET(
  _request: Request,
  context: { params: Promise<{ id: string }> },
) {
  return productResponse(async () =>
    getHardwareProduct((await context.params).id),
  );
}
