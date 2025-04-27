import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
require("dotenv").config();
const SECRET_KEY = process.env.SECRET_KEY; 

interface CustomRequest extends Request {
  user?: string | jwt.JwtPayload;
}

const verifyToken = (req: CustomRequest, res: Response, next: NextFunction): void | Response => {
  const token = req.headers['authorization'];
  if (!token) return res.status(401).json({ success: false, message: "Token missing" });

  jwt.verify(token.split(" ")[1], SECRET_KEY as string, (err, decoded) => {
    if (err) return res.status(401).json({ success: false, message: "Invalid token" });
    req.user = decoded;
    next();
  });
};

export default verifyToken;