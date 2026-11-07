export class ApiError extends Error {
  readonly status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
    this.name = 'ApiError';
  }
}

export async function getJson<T>(
  url: string,
  isResponse: (value: unknown) => value is T,
  resourceName: string,
  signal?: AbortSignal,
): Promise<T> {
  const response = await fetch(url, { signal });
  if (!response.ok) {
    throw new ApiError(
      response.status,
      `Unable to load ${resourceName} (${response.status}).`,
    );
  }

  const payload: unknown = await response.json();
  if (!isResponse(payload)) {
    throw new Error(`Invalid ${resourceName} data format.`);
  }
  return payload;
}
