const API_BASE = import.meta.env.VITE_API_BASE ?? "http://localhost:4000";

async function req(path, init) {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { "Content-Type": "application/json", ...(init?.headers ?? {}) },
    ...init,
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body?.message ?? `Request failed (${res.status})`);
  }

  if (res.status === 204) return undefined;
  return await res.json();
}

export const http = {
  get: (p) => req(p),
  post: (p, data) => req(p, { method: "POST", body: JSON.stringify(data) }),
  patch: (p, data) => req(p, { method: "PATCH", body: JSON.stringify(data) }),
  del: (p) => req(p, { method: "DELETE" }),
};
