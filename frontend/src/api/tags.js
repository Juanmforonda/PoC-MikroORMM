// src/api/tags.js
import { api } from "./axiosInstance.js";

export async function getTags(params = {}) {
  const res = await api.get("/api/tags", { params });
  return res.data?.data ?? res.data;
}

export async function createTag(payload) {
  const res = await api.post("/api/tags", payload);
  return res.data?.data ?? res.data;
}

export async function updateTag(id, payload) {
  const res = await api.put(`/api/tags/${id}`, payload);
  return res.data?.data ?? res.data;
}

export async function deleteTag(id) {
  const res = await api.delete(`/api/tags/${id}`);
  return res.data;
}
