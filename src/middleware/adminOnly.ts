import { Request, Response, NextFunction } from "express";
import { User } from "../types/index.d";

export const adminOnly = async(req: Request, res: Response, next: NextFunction) =>{
  const user = (req as Request & { user?: User }).user;  
  if (!user) {
      return res.status(403).json({ message: 'Access denied. Admins only.' });
    }
    if (user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Admins only.' });
    }
    next();
}