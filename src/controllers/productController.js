// controllers/productController.js
import {
  getProducts,
  createProduct as createProductService,
  updateProduct as updateProductService,
  deleteProduct as deleteProductService,
  purchaseProduct as purchaseProductService,
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
    const newProduct = await createProductService(productData);
    res.status(201).json(newProduct);
  } catch (error) {
    console.error("Error creando el producto:", error);
    res
      .status(500)
      .json({ message: "Error creando el producto", error: error.message });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const productData = req.body;
    const updatedProduct = await updateProductService(id, productData);
    if (!updatedProduct) {
      return res.status(404).json({ message: "Producto no encontrado" });
    }
    res.json(updatedProduct);
  } catch (error) {
    console.error("Error actualizando producto:", error);
    res.status(500).json({ message: "Error actualizando producto" });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedProduct = await deleteProductService(id);
    if (!deletedProduct) {
      return res.status(404).json({ message: "Producto no encontrado" });
    }
    res.json({ message: "Producto eliminado correctamente" });
  } catch (error) {
    console.error("Error eliminando producto:", error);
    res.status(500).json({ message: "Error eliminando producto" });
  }
};

export const purchaseProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { quantity } = req.body;
    const purchasedProduct = await purchaseProductService(id, quantity);
    res.json(purchasedProduct);
  } catch (error) {
    console.error("Error en la compra:", error);
    res
      .status(500)
      .json({ message: "Error en la compra", error: error.message });
  }
};
