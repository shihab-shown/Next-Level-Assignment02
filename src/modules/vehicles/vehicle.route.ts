import { Router } from "express";
import { vehicleController } from "./vehicle.controller";
import { auth } from "../../middleware/auth";
import { adminOnly } from "../../middleware/adminOnly";


const router = Router();
router.post("/", auth, adminOnly, vehicleController.createVehicle);
router.get("/", vehicleController.getAllVehicles);
router.get("/:id", vehicleController.getVehiclebyID);
router.put("/:id", auth, adminOnly, vehicleController.updateVehicle);
router.delete("/:id", auth, adminOnly, vehicleController.deleteVehicle);

export const vehicleRoute = router;