const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";

async function request<T>(
  path: string,
  token?: string,
  options: RequestInit = {}
): Promise<T> {
  const headers: Record<string, string> = {
    ...(options.headers as Record<string, string> || {}),
  };

  if (!(options.body instanceof FormData)) {
    headers["Content-Type"] = "application/json";
  }

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers,
  });

  const text = await response.text();

  let data: any = null;

  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = { raw: text };
  }

  if (!response.ok) {
    throw new Error(
      data?.message || data?.error || `HTTP ${response.status}`
    );
  }

  return data as T;
}

export const api = {
  getProfile: (token: string) =>
    request<{ user: any }>("/api/protected/profile", token),

  getAdminSubmissions: (token: string) =>
    request<{ data: any[] }>("/api/admin/submissions", token),

  submitConsultation: (
    formData: FormData,
    token: string
  ) =>
    request<any>("/api/submissions", token, {
      method: "POST",
      body: formData,
    }),
};