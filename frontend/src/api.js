const API_URL = import.meta.env.VITE_API_URL;

export async function api(path, options = {}) {
  const res = await fetch(API_URL + path, {
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  const json = await res.json();
  if (!res.ok) {
    const err = new Error(json.error?.message || "Erreur");
    err.code = json.error?.code;
    throw err;
  }
  return json.data;
}