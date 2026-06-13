import { usersService } from "./user.service";
import { Request, Response } from "express";


const getAllUsers = async (req: Request, res: Response) => {
  try {
    const result = await usersService.getAllUsers();
    if (Array.isArray(result) && result.length > 0) {
      res.status(200).json(
        {
          "success": true,
          "message": "userss retrieved successfully",
          "data": result
        }
      );
    }
    else if (Array.isArray(result) && result.length === 0) {
      res.status(200).json(
        {
          "success": true,
          "message": "No userss found",
          "data": []
        }
      );
    }
    else if (!Array.isArray(result)) {
      const errMsg = (result as any)?.message ?? "Failed to fetch userss";
      const errDetail = (result as any)?.error ?? "Something went wrong";
      res.status(400).json(
        {
          "success": false,
          "message": errMsg,
          "error": errDetail
        }
      );
    }
    else {
      res.status(400).json(
        {
          "success": false,
          "message": "Failed to fetch userss",
          "error": "Something went wrong"
        }
      );
    }
  } catch (err) {
    console.error('Error fetching userss:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
}

const updateUser = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const result = await usersService.updateUser(parseInt(id as string), req.body);
    if (result && !('error' in result)) {
      res.status(200).json(
        {
          "success": true,
          "message": "users updated successfully",
          "data": result
        }
      );
    } else {
      const errMsg = (result as any)?.message ?? `users with ID ${id} not found or update failed`;
      const errDetail = (result as any)?.error ?? "Something went wrong";
      res.status(404).json(
        {
          "success": false,
          "message": errMsg,
          "error": errDetail
        }
      );
    }
  } catch (err) {
    console.error('Error updating users:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
}

const deleteUser = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const result = await usersService.deleteUser(parseInt(id as string));
    if (result && !('error' in result)) {
      res.status(200).json(
        {
          "success": true,
          "message": "users deleted successfully",
          "data": result
        }
      );
    } else {
      const errMsg = (result as any)?.message ?? `users with ID ${id} not found or deletion failed`;
      const errDetail = (result as any)?.error ?? "Something went wrong";
      res.status(404).json(
        {
          "success": false,
          "message": errMsg,
          "error": errDetail
        }
      );
    }
  } catch (err) {
    console.error('Error deleting users:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
}

export const usersController = {
  getAllUsers, updateUser, deleteUser
}