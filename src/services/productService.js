// services/productService.js
import apiClient from "./apiService.js";

export const getProducts = async () => {
  try {
    const response = await apiClient.get("/products");
    return response.data;
  } catch (error) {
    console.error(
      "Error obteniendo productos:",
      error.response?.data || error.message
    );
    throw error;
  }
};

export const createProduct = async (productData) => {
  try {
    const response = await apiClient.post("/products", productData);
    return response.data;
  } catch (error) {
    console.error(
      "Error creando producto:",
      error.response?.data || error.message
    );
    throw error;
  }
};

export const updateProduct = async (id, productData) => {
  try {
    const response = await apiClient.put(`/products/${id}`, productData);
    return response.data;
  } catch (error) {
    console.error(
      "Error actualizando producto:",
      error.response?.data || error.message
    );
    throw error;
  }
};

export const deleteProduct = async (id) => {
  try {
    const response = await apiClient.delete(`/products/${id}`);
    return response.data;
  } catch (error) {
    console.error(
      "Error eliminando producto:",
      error.response?.data || error.message
    );
    throw error;
  }
};

export const purchaseProduct = async (id, quantity) => {
  try {
    const response = await apiClient.post(`/products/${id}/purchase`, {
      quantity,
    });
    return response.data;
  } catch (error) {
    console.error("Error en la compra:", error.response?.data || error.message);
    throw error;
  }
};
