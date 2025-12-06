import express, { Request, Response } from 'express'
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/user';

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

export default router;