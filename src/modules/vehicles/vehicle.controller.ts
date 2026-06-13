import { vehicleService } from "./vehicle.service";
import { Request, Response } from "express";

const createVehicle = async (req: Request, res: Response) => {
  try {
    const result = await vehicleService.createVehicle(req.body);

    if (result) {
      res.status(201).json(
        {
          "success": true,
          "message": "Vehicle created successfully",
          "data": result
        }
      );
    } else {
      res.status(400).json(
        {
          "success": false,
          "message": "Vehicle Creation failed",
          "error": "Something went wrong"
        }
      );
    }
  } catch (err) {
    console.error('Error registering user:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
}

const getAllVehicles = async (req: Request, res: Response) => {
  try {
    const result = await vehicleService.getAllVehicles();
    if (Array.isArray(result) && result.length > 0) {
      res.status(200).json(
        {
          "success": true,
          "message": "Vehicles retrieved successfully",
          "data": result
        }
      );
    }
    else if (Array.isArray(result) && result.length === 0) {
      res.status(200).json(
        {
          "success": true,
          "message": "No vehicles found",
          "data": []
        }
      );
    }
    else if (!Array.isArray(result)) {
      const errMsg = (result as any)?.message ?? "Failed to fetch vehicles";
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
          "message": "Failed to fetch vehicles",
          "error": "Something went wrong"
        }
      );
    }
  } catch (err) {
    console.error('Error fetching vehicles:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
}

const getVehiclebyID = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const result = await vehicleService.getVehiclebyID(parseInt(id as string));
    if (result && !('error' in result)) {
      res.status(200).json(
        {
          "success": true,
          "message": "Vehicle retrieved successfully",
          "data": result
        }
      );
    } else {
      const errMsg = (result as any)?.message ?? `Vehicle with ID ${id} not found`;
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
    console.error('Error fetching vehicle by ID:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
}

const updateVehicle = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const result = await vehicleService.updateVehicle(parseInt(id as string), req.body);
    if (result && !('error' in result)) {
      res.status(200).json(
        {
          "success": true,
          "message": "Vehicle updated successfully",
          "data": result
        }
      );
    } else {
      const errMsg = (result as any)?.message ?? `Vehicle with ID ${id} not found or update failed`;
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
    console.error('Error updating vehicle:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
}

const deleteVehicle = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const result = await vehicleService.deleteVehicle(parseInt(id as string));
    if (result && !('error' in result)) {
      res.status(200).json(
        {
          "success": true,
          "message": "Vehicle deleted successfully",
          "data": result
        }
      );
    } else {
      const errMsg = (result as any)?.message ?? `Vehicle with ID ${id} not found or deletion failed`;
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
    console.error('Error deleting vehicle:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
}

export const vehicleController = {
  createVehicle, getAllVehicles, getVehiclebyID, updateVehicle, deleteVehicle
}