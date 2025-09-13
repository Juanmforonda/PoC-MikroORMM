import { api } from "./axiosInstance.js";

export async function getProducts(params = {}) {
  try {
    const res = await api.get("/api/products", { params });
    console.log('API Response:', res.data); // Para debug
    // Extraer el array de productos desde res.data.data
    return Array.isArray(res.data?.data) ? res.data.data : [];
  } catch (error) {
    console.error('Error in getProducts:', error);
    throw error;
  }
}

export async function createProduct(payload) {
  // payload esperado: { name, price, description?, stock?, categoryId? }
  const res = await api.post("/api/products", payload);
  return res.data?.data ?? res.data;
}

export async function updateProduct(id, payload) {
  const res = await api.put(`/api/products/${id}`, payload);
  return res.data?.data ?? res.data;
}

export async function deleteProduct(id) {
  const res = await api.delete(`/api/products/${id}`);
  return res.data;
}
