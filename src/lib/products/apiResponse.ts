import { NextResponse } from 'next/server';
import { ApiError } from '../apiClient';
export async function productResponse(load: () => Promise<unknown>) {
  try {
    const data = await load();
    if (data === null) {
      return NextResponse.json(
        { message: 'Product not found' },
        { status: 404 },
      );
    }
    return NextResponse.json(data, {
      headers: { 'Cache-Control': 'no-store' },
    });
  } catch (error) {
    return NextResponse.json(
      { message: 'Unable to load products' },
      {
        status: error instanceof ApiError ? error.status : 500,
        headers: { 'Cache-Control': 'no-store' },
      },
    );
  }
}
