const CMS_URL = process.env.CMS_URL || 'http://localhost:3001';

let cachedToken: string | null = null;

function basicAuthHeader(): Record<string, string> {
  const user = process.env.HTTP_BASIC_USER;
  const pass = process.env.HTTP_BASIC_PASSWORD;
  if (!user || !pass) return {};
  return { Authorization: `Basic ${btoa(`${user}:${pass}`)}` };
}

export async function getToken(): Promise<string> {
  if (cachedToken) return cachedToken;

  const email = process.env.CMS_EMAIL || 'ondrej.zapletal@etnetera.cz';
  const password = process.env.CMS_PASSWORD || 'etnetera123';

  const res = await fetch(`${CMS_URL}/api/users/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...basicAuthHeader(),
    },
    body: JSON.stringify({ email, password }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`CMS login failed (${res.status}): ${text}`);
  }

  const data = (await res.json()) as { token: string };
  cachedToken = data.token;
  return cachedToken;
}

export function getCmsUrl(): string {
  return CMS_URL;
}
