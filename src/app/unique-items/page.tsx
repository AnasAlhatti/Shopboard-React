import { redirect } from 'next/navigation';
export interface PageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}
export default async function Page({ searchParams }: PageProps) {
  const original = await searchParams;
  const query = new URLSearchParams();
  for (const [key, value] of Object.entries(original)) {
    if (typeof value === 'string') query.set(key, value);
    else if (value) for (const item of value) query.append(key, item);
  }
  query.set('collection', 'unique');
  redirect(`/products${query.size ? '?' + query : ''}`);
}
