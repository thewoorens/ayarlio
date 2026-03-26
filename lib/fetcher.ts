type FetchOptions = RequestInit & {
  token?: string;
};

export async function fetcher<T>(
  url: string,
  options: FetchOptions = {}
): Promise<T> {

  const { token, headers, ...rest } = options;

  const res = await fetch(url, {
    ...rest,
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
      ...headers,
    },
  });

  if (!res.ok) {
    let message = "Something went wrong";

    try {
      const data = await res.json();
      message = data.message || message;
    } catch {}

    throw new Error(message);
  }

  return res.json();
}
