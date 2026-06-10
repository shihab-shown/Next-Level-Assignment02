import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import config from "../config";
import { User } from "../types/index.d";

const secret = config.jwt_secret;
export const auth = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ error: 'Authorization header missing' });
  }

  const token = authHeader.split(' ')[1];
  if (!token) {
    return res.status(401).json({ error: 'Token missing' });
  }
  try {
    const decoded = jwt.verify(token, secret) as User;
    (req as Request & { user?: User}).user = decoded;
    console.log('Verification successful');
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid token' });
  }
}