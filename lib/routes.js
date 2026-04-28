export function tenantPath(tenant, path) {
  const cleanPath = path.startsWith("/") ? path : `/${path}`;

  if (!tenant) {
    return cleanPath;
  }

  return `/${tenant}${cleanPath}`;
}

export function tenantApiPath(tenant, path) {
  return tenantPath(tenant, path.startsWith("/api") ? path : `/api${path}`);
}
