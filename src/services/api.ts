interface ImportMetaEnv {
  readonly VITE_API_URL?: string;
}

declare global {
  interface ImportMeta {
    readonly env: ImportMetaEnv;
  }
}

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

// Upload manuscript file to server
export async function uploadManuscriptFile(
  file: File,
  token?: string
): Promise<{ filename: string; path: string; size: number }> {
  const formData = new FormData();
  formData.append("file", file);

  const headers: Record<string, string> = {};
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE}/api/uploads/manuscript`, {
    method: "POST",
    headers,
    body: formData,
  });

  const text = await response.text();
  let data: any;
  try {
    data = text ? JSON.parse(text) : {};
  } catch {
    data = { message: text };
  }

  if (!response.ok) {
    throw new Error(data.message || "File upload failed");
  }

  return data.file;
}

// Submit consultation form with optional file
export async function submitConsultation(
  data: {
    sourcePage: string;
    service: string;
    userName?: string;
    userEmail?: string;
    wordCount?: string;
    notes?: string;
    trimSize?: string;
    genrePreset?: string;
    file?: File;
  },
  token?: string
): Promise<{ success: boolean; message: string; data: any }> {
  const formData = new FormData();
  formData.append("sourcePage", data.sourcePage);
  formData.append("service", data.service);
  if (data.userName) formData.append("userName", data.userName);
  if (data.userEmail) formData.append("userEmail", data.userEmail);
  if (data.wordCount) formData.append("wordCount", data.wordCount);
  if (data.notes) formData.append("notes", data.notes);
  if (data.trimSize) formData.append("trimSize", data.trimSize);
  if (data.genrePreset) formData.append("genrePreset", data.genrePreset);
  if (data.file) formData.append("file", data.file);

  const headers: Record<string, string> = {};
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE}/api/submissions`, {
    method: "POST",
    headers,
    body: formData,
  });

  const text = await response.text();
  let result: any;
  try {
    result = text ? JSON.parse(text) : {};
  } catch {
    result = { message: text };
  }

  if (!response.ok) {
    throw new Error(result.message || "Submission failed");
  }

  return result;
}

export const api = {
  getProfile: (token: string) =>
    request<{ user: any }>("/api/protected/profile", token),

  getAdminSubmissions: (token: string) =>
    request<{ data: any[] }>("/api/admin/submissions", token),

  uploadManuscriptFile,
  submitConsultation,
};