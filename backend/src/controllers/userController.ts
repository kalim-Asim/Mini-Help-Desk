import {
  createUser,
  findUserByEmail,
  getUserDetailsByEmail,
  checkExistingFeedback,
  insertFeedback,
  markFeedbackGiven
} from '../models/userModel';
import {Request, Response} from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import prisma from '../config/db';

dotenv.config();

const SECRET_KEY = process.env.SECRET_KEY || '';
if (!SECRET_KEY) {
  throw new Error("SECRET_KEY is not defined in the environment variables.");
}

type SignupRequest = {
  name: string,
  email: string,
  password: string
};

const signup = async (req: Request, res: Response) => {
  const { name, email, password } = req.body as SignupRequest;

  try {
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      res.status(400).json({
        success: false,
        message: "User already exists",
      });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: 'user', // Default role as 'user'
      },
    });

    const token = jwt.sign(
      {
        name,
        email,
        isAdmin: false, // Default to non-admin user
      },
      SECRET_KEY,
      { expiresIn: '1h' }
    );

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      token,
      user: { name, email, isAdmin: false },
    });
  } catch (err) {
    console.error("Signup error:", err);
    res.status(500).json({
      success: false,
      error: "Something went wrong",
    });
  }
};

const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    const user = await findUserByEmail(email);

    if (!user) {
      res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
      return;
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
      return;
    }

    const token = jwt.sign(
      {
        name: user.name,
        email: user.email,
        isAdmin: user.role === 'admin',
      },
      SECRET_KEY,
      { expiresIn: '1h' }
    );

    res.json({
      success: true,
      token,
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

const userDetails = async (req: Request, res: Response) => {
  const { email } = req.params;

  try {
    const user = await getUserDetailsByEmail(email);

    if (!user) {
      res.status(404).json({
        success: false,
        message: "User not found",
      });
      return;
    }

    res.json({
      success: true,
      user,
    });
  } catch (err) {
    console.error("Error fetching user details:", err);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

const feedback = async (req: Request, res: Response) => {
  const { complaint_id, user_id, assigned_personnel_id, rating, comment } = req.body;

  if (!complaint_id || !user_id || !assigned_personnel_id || !rating) {
    res.status(400).json({
      success: false,
      message: "Missing required fields.",
    });
    return;
  }

  try {
    const existing = await checkExistingFeedback(complaint_id);

    if (existing) {
      res.status(400).json({
        success: false,
        message: "Feedback already submitted.",
      });
      return;
    }

    await insertFeedback(complaint_id, user_id, assigned_personnel_id, rating, comment);
    await markFeedbackGiven(complaint_id);

    res.status(200).json({
      success: true,
      message: "Feedback submitted successfully.",
    });
  } catch (err) {
    console.error("Feedback error:", err);
    res.status(500).json({
      success: false,
      message: "Server error during feedback submission.",
    });
  }
};

export { signup, login, userDetails, feedback };