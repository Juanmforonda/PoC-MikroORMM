import { api } from "./axiosInstance.js";

export async function getCategories(params = {}) {
  const res = await api.get("/api/categories", { params });
  // El backend responde: { message, data }
  return res.data?.data ?? res.data;
}

export async function createCategory(payload) {
  const res = await api.post("/api/categories", payload);
  return res.data?.data ?? res.data;
}

export async function updateCategory(id, payload) {
  const res = await api.put(`/api/categories/${id}`, payload);
  return res.data?.data ?? res.data;
}

export async function deleteCategory(id) {
  const res = await api.delete(`/api/categories/${id}`);
  return res.data;
}
