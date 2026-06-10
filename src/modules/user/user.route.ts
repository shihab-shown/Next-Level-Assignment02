import { Router } from "express";
import { usersController } from "./user.controller";
import { auth } from "../../middleware/auth";
import { adminOnly } from "../../middleware/adminOnly";
import { adminOrOwn } from "../../middleware/AdminOrOwn";


const router = Router();
router.get("/", auth, adminOnly, usersController.getAllUsers);
router.put("/:id", auth, adminOrOwn, usersController.updateUser);
router.delete("/:id", auth, adminOnly, usersController.deleteUser);

export const usersRoute = router;