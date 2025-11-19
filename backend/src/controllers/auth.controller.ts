import type{ Request, Response } from "express";
import { User } from "../models/User";

export const signup = async(req: Request, res: Response) => {
  const {fullName, email, phone, password, profilePic} = req.body;

  try {
    if (!fullName || !email || !password) {
      return res.status(400).json({message: "All fields are required" });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be atleast 6 characters" });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid email format"})
    }

    const user = await User.findOne({email})
    if (user) {
      return res.status(402).json({message: "User already exists"})
    }

    const newUser = await User.create({
      fullName,
      email,
      phone,
      password,
      profilePic
    })

    const verificationToken = newUser.getVerificationToken()
    await newUser.save({ validateBeforeSave: false})

    return res.status(201).json({
      message: "User created successfully. Verify your email.",
      user: {
        id: newUser._id,
        fullName: newUser.fullName,
        email: newUser.email,
        phone: newUser.phone,
        profilePic: newUser.profilePic
      },
      verificationToken
    });
  } catch (error) {
    console.error("Signup Error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}