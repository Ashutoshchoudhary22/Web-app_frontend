function stripTrailingSlash(value?: string | null) {
  return value ? value.replace(/\/$/, "") : null;
}

function withHttps(value?: string) {
  if (!value) return null;
  return value.startsWith("http") ? value : `https://${value}`;
}
//hii
export function getShortLinkBaseUrl() {
  return (
    stripTrailingSlash(process.env.NEXT_PUBLIC_SHORT_LINK_BASE_URL) ??
    stripTrailingSlash(process.env.NEXT_PUBLIC_APP_URL) ??
    stripTrailingSlash(process.env.APP_BASE_URL) ??
    stripTrailingSlash(withHttps(process.env.VERCEL_URL)) ??
    "http://localhost:4000"
  );
}

export function getApiBaseUrl() {
  return stripTrailingSlash(process.env.NEXT_PUBLIC_API_URL) ?? "http://localhost:4000";
}

