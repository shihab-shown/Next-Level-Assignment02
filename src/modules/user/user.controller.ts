import { userService } from "./user.service";
import { Request, Response } from "express";

const signupUser = async (req: Request, res: Response) => {
  try {
    // Check if user already exists
    const result = await userService.signupUser(req.body);

    if ('rows' in result) {
      res.status(201).json(
        {
          "success": "true",
          "message": "User registered successfully",
          "data": result.rows[0]
        }
      );
    } else {
      res.status(400).json(
        {
          "success": "false",
          "message": "User registration failed",
          "error": result.error
        }
      );
    }
  } catch (err) {
    console.error('Error registering user:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
}

export const userController = {
  signupUser
}