import { authService } from "./auth.service";
import { Request, Response } from "express";

const signupUser = async (req: Request, res: Response) => {
  try {
    const result = await authService.signupUser(req.body);

    if (result) {
      res.status(201).json(
        {
          "success": "true",
          "message": "User registered successfully",
          "data": result
        }
      );
    } else {
      res.status(400).json(
        {
          "success": "false",
          "message": "User registration failed",
          "error": "Email already in use"
        }
      );
    }
  } catch (err) {
    console.error('Error registering user:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
}

const signinUser = async (req: Request, res: Response) => {
  try {
    const result = await authService.signinUser(req.body);

    if (result) {
      res.status(201).json(
        {
          "success": "true",
          "message": "Login successful",
          "data": result
        }
      );
    } else {
      res.status(400).json(
        {
          "success": "false",
          "message": "Login failed",
          "error": "Something went wrong"
        }
      );
    }
  } catch (err) {
    console.error('Error registering user:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
}

export const authController = {
  signupUser, signinUser
}