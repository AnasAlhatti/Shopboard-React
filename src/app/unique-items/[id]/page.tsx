import { redirect } from 'next/navigation';
export interface PageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}
export default async function Page({ params, searchParams }: PageProps) {
  const { id } = await params;
  const query = new URLSearchParams();
  for (const [key, value] of Object.entries(await searchParams)) {
    if (typeof value === 'string') query.set(key, value);
  }
  redirect(
    `/products/${encodeURIComponent(id)}${query.size ? '?' + query : ''}`,
  );
}
