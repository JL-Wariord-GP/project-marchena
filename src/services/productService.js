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
    console.log("📤 Enviando datos a FastAPI:", productData); // Log para depuración
    const response = await apiClient.post("/products", productData);
    console.log("✅ Producto creado:", response.data); // Log de éxito
    return response.data;
  } catch (error) {
    console.error(
      "❌ Error creando producto:",
      error.response?.data || error.message
    );
    throw error;
  }
};
