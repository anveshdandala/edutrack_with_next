const ROOT_HOSTS = new Set(["localhost", "127.0.0.1", "0.0.0.0"]);

export function getTenantFromHost(hostHeader) {
  const host = (hostHeader || "").split(":")[0].toLowerCase();
  const parts = host.split(".");

  if (parts.length < 2 || ROOT_HOSTS.has(host)) {
    return null;
  }

  return parts[0] || null;
}

export function buildTenantLoginUrl(slug) {
  if (typeof window === "undefined" || !slug) {
    return "/auth/login";
  }

  const { protocol, hostname, port } = window.location;
  const parts = hostname.split(".");
  const rootHost = parts.length > 1 ? parts.slice(1).join(".") : hostname;
  const portPart = port ? `:${port}` : "";

  return `${protocol}//${slug}.${rootHost}${portPart}/auth/login`;
}
