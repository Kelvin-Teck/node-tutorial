import express, { NextFunction, Request, Response } from "express";
import sequelize from "./config/sequelize";
import User from "./models/user";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const app = express();

const PORT = 4000;

app.use(express.json());

const products = [
  { id: 1, name: "Electric Cooker", price: 10.0, category: "Electronics" },
  { id: 2, name: "Carrot", price: 20.0, category: "Grocery" },
  { id: 3, name: "Iron", price: 30.0, category: "Electronics" },
];


const loggingMiddleware = (req: Request, res: Response, next: NextFunction) => {
  console.log(`${req.method} ${req.path} - ${new Date().toISOString()}`);
  next();
};

app.use(loggingMiddleware);




app.get("/products",(req: Request, res: Response) => {
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


app.post("/auth/register", async (req: Request, res: Response) => { 
  const { firstName, lastName, email, password } = req.body;

if (!firstName || !lastName || !email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }


  const existingUser = await User.findOne({ where: { email } });

  if (existingUser) {
    return res.status(400).json({ message: "Email already exists" });
  }

  const hashedPassword = await bcrypt.hash(password, 10); 

  const newUser = await User.create({
    firstName,
    lastName,
    email,
    password: hashedPassword,
  });

  const formatResponse =  {
    id: newUser.id,
    firstName: newUser.firstName,
    lastName: newUser.lastName,
    email: newUser.email,
  }

  return res.status(201).json({
    message: "User created successfully",
    user: formatResponse,
  });
})

app.post("/auth/login", async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  const user = await User.findOne({ where: { email } });

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    return res.status(401).json({ message: "Invalid password" });
  }

  const token = jwt.sign({ id: user.id, email: user.email }, "secret-key", {
    expiresIn: "1h",
  });


  
  return res.status(200).json({
    message: "Login successful",
    token,
  });
});



app.listen(PORT, async () => {
  await sequelize.authenticate()
  console.log("Database connected successfully.");
  console.log(`Server is running on http://localhost:${PORT}`);
});
