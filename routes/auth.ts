import express, { Request, Response } from 'express'
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/user';
import dotenv from 'dotenv';
dotenv.config();

const router =  express.Router();

router.post("/register", async (req: Request, res: Response) => {

    const { firstName, lastName, email, password } = req.body;

    if (!firstName || !lastName || !email || !password) {
     return res.status(400).json({ message: "All fields are required" });
    }

    const user = await User.findOne({ where: { email } })

    if (user) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
    });

    

    res.status(201).json({ user: {
      id: newUser.id,
      firstName: newUser.firstName,
      lastName: newUser.lastName,
      email: newUser.email,
    } });

 

})


router.post("/login", async (req: Request, res: Response) => {
const {email, password} = req.body;

if (!email || !password) {
  return res.status(400).json({ message: "All fields are required" });
    }
    
    const user = await User.findOne({ where: { email } })

    if (!user) {
      return res.status(400).json({ message: "User does not exist" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid password" });
    }

    const token = jwt.sign({ id: user.id , email: user.email}, process.env.JWT_SECRET as string, {
      expiresIn:  "1d",
    });

    res.status(200).json({ user: {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
    }, token });
})

export default router;