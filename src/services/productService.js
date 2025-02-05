import apiClient from "./apiService.js";

export const getProducts = async () => {
  try {
    const response = await apiClient.get("/products");
    return response.data;
  } catch (error) {
    console.error("Error obteniendo productos:", error);
    throw error;
  }
};
