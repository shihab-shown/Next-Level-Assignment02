import { Request, Response, NextFunction } from "express";
import { User } from "../types";

export const adminOrOwn = async(req: Request, res: Response, next: NextFunction) =>{
  const user = (req as Request & { user?: User }).user;  
  const userId = parseInt(req.params.id as string);
  if (!user) {
      return res.status(404).json({ message: 'No user found' });
    }
    if (user.role === 'admin') {
      next();
    }
    else if (user.id === userId) {
      next();
    }
    else {
      return res.status(403).json({ message: 'Access denied. Admins or owner only.' });
    }
}