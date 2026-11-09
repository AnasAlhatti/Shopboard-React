import { productResponse } from '@/lib/products/apiResponse';
import { getHardwareProducts } from '@/lib/products/hardwareProducts';
export const dynamic = 'force-dynamic';
export async function GET() {
  return productResponse(getHardwareProducts);
}
