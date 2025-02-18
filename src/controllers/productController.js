import {
  getProducts,
  createProduct as createProductService,
} from "../services/productService.js";

export const fetchProducts = async (req, res) => {
  try {
    const products = await getProducts();
    res.json(products);
  } catch (error) {
    console.error("Error obteniendo productos:", error);
    res.status(500).json({ message: "Error obteniendo productos" });
  }
};

export const createProduct = async (req, res) => {
  try {
    const productData = req.body;
    const newProduct = await createProductService(productData); // ✅ Se usa el servicio correctamente
    res.status(201).json(newProduct);
  } catch (error) {
    console.error("Error creando el producto:", error);
    res.status(500).json({
      message: "Error creando el producto",
      error: error.response?.data || error.message, // ✅ Se muestran los detalles del error
    });
  }
};
