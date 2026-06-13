import { User } from "../../types";
import { bookingService } from "./booking.service";
import { Request, Response } from "express";

const createBooking = async (req: Request, res: Response) => {
  try {
    const result = await bookingService.createBooking(req.body);

    if (result && !result.error) {
      res.status(201).json(
        {
          "success": true,
          "message": "Booking created successfully",
          "data": result
        }
      );
    } else {
      res.status(400).json(
        {
          "success": false,
          "message": "Booking Creation failed",
          "error": result.error || "Something went wrong"
        }
      );
    }
  } catch (err) {
    console.error('Error registering user:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
}

const getAllBookings = async (req: Request, res: Response) => {
  const user = (req as Request & { user?: User }).user;
  if (!user) {
    res.status(401).json(
      {
        "success": false,
        "message": "Unauthorized",
        "error": "User not found in request"
      }
    );
    return;
  }
  try {
    const result = await bookingService.getAllBookings(user);
    if (Array.isArray(result) && result.length > 0) {
      res.status(200).json(
        {
          "success": true,
          "message": "Bookings retrieved successfully",
          "data": result
        }
      );
    }
    else if (Array.isArray(result) && result.length === 0) {
      res.status(200).json(
        {
          "success": true,
          "message": "No bookings found",
          "data": []
        }
      );
    }
    else if (!Array.isArray(result)) {
      const errMsg = (result as any)?.message ?? "Failed to fetch bookings";
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
          "message": "Failed to fetch bookings",
          "error": "Something went wrong"
        }
      );
    }
  } catch (err) {
    console.error('Error fetching bookings:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
}

const updateBooking = async (req: Request, res: Response) => {
  try {
    const user = (req as Request & { user?: User }).user;  
    const Id = parseInt(req.params.id as string);
    const request = {
      user,
      Id,
    }
    const result = await bookingService.updateBooking(request, req.body);
    if (result && !('error' in result)) {
      res.status(200).json(
        {
          "success": true,
          "message": "Booking updated successfully",
          "data": result
        }
      );
    } else {
      const errMsg = (result as any)?.message ?? `Booking with ID ${Id} not found or update failed`;
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
    console.error('Error updating booking:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
}


export const bookingController = {
  createBooking, getAllBookings, updateBooking
}