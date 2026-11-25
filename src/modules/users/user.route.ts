import { Router } from "express";

import { userController } from "./user.controller";
import auth from '../../middleware/auth';
import { USER_Role } from "../../types";



const router = Router();





//api/v1/users/:id
router.post("/", userController.createUser);


// to retrieved all users
router.get("/", auth(USER_Role.admin, USER_Role.agent), userController.getAllUser)

router.get("/:id",auth(USER_Role.admin, USER_Role.agent, USER_Role.user),  userController.getUser )

router.put("/:id", auth(USER_Role.admin, USER_Role.user), userController.updateUser )

router.delete("/:id", userController.deleteUser)

export const userRoute = router