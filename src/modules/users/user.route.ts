import { Router } from "express";

import { userController } from "./user.controller";



const router = Router();
//api/v1/users/:id
router.post("/", userController.createUser);


// to retrieved all users
router.get("/", userController.getAllUser)

router.get("/:id", userController.getUser )

router.put("/:id", userController.updateUser )

router.delete("/:id", userController.deleteUser)

export const userRoute = router