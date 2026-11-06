export async function getJson<T>(
  url: string,
  isResponse: (value: unknown) => value is T,
  resourceName: string,
): Promise<T> {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Unable to load ${resourceName} (${response.status}).`);
  }

  const payload: unknown = await response.json();
  if (!isResponse(payload)) {
    throw new Error(`Invalid ${resourceName} data format.`);
  }
  return payload;
}
