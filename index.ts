import express, { Request, Response } from "express";

const app = express();

const PORT = 4000;

app.use(express.json());

const products = [
  { id: 1, name: "Electric Cooker", price: 10.0, category: "Electronics" },
  { id: 2, name: "Carrot", price: 20.0, category: "Grocery" },
  { id: 3, name: "Iron", price: 30.0, category: "Electronics" },
];

app.get("/products", (req: Request, res: Response) => {
  console.log(req.query);
  const category = req.query.category as string | undefined;
  const price = req.query.price as string | undefined;

  if (category) {
    const filteredProducts = products.filter(
      (product) => product.category.toLowerCase() === category.toLowerCase()
    );

    return res.json({
      message: "Products retrieved successfully",
      products: filteredProducts,
    });
  }

  return res.json({ message: "Products retrieved successfully", products });
});

app.get("/products/:id", (req: Request, res: Response) => {
  const productId = req.params.id;

  const product = products.find((product) => {
    if (product.id === parseInt(productId)) {
      return product;
    }
  });

  return res.json({
    message: "Product retrieved Successfully",
    product,
  });
});

app.post("/products", (req: Request, res: Response) => {
  const newProduct = req.body;

  const updatedProduct = { ...newProduct, id: products.length + 1 };
  products.push(updatedProduct);

  return res.status(201).json({
    message: "Product created successfully",
    product: updatedProduct,
  });
});

app.patch("/products/:id", (req: Request, res: Response) => {
    const productId = req.params.id;
    const updatedData = req.body;

    console.log("Updated Data:", updatedData);
  
    const productIndex = products.findIndex(
      (product) => product.id === parseInt(productId)
    );
 
    console.log("Product Index:", productIndex);

    if (productIndex === -1) {
      return res.status(404).json({ message: "Product not found" });
    }

    const updatedProduct = { ...products[productIndex], ...updatedData  };
    products[productIndex] = updatedProduct; 
    
    console.log("Updated Product:", updatedProduct);
    return res.json({
      message: "Product updated successfully",
      product: updatedProduct,
    });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
