import { Request, Response } from "express";

import { userService } from "./user.service";

const createUser = async (req: Request, res: Response) => {
  try {
    const result = await userService.createUserIntoDB(req.body);
    res.status(201).json({
      success: true,
      message: "User Created",
      data: result.rows[0],
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error?.message,
      data: error,
    });
  }
};
const getAllUser = async (req: Request, res: Response) => {
  console.log("From controller:", req.user)
  try {
    const result = await userService.getAllUserFromDB();
    res.status(200).json({
      success: true,
      message: "User retrieved successfully",
      data: result.rows,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error?.message,
      data: error,
    });
  }
};

const getUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const result = await userService.getUserFromDB(id as string);
    if (result.rowCount == 0) {
      res.status(404).json({
        success: false,
        message: "User not found",
        // data: result.rows[0],
      });
    }

    res.status(200).json({
      success: true,
      message: "User retrieved successfully",
      data: result.rows[0],
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error?.message,
      data: error,
    });
  }
};

const updateUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const result = await userService.updatedUserFromDB(req.body, id as string);
    // console.log(result)
    if (result.rowCount == 0) {
      res.status(404).json({
        success: false,
        message: "User not found",
        // data: result.rows[0],
      });
    }
    res.status(200).json({
      success: true,
      message: "User updated successfully",
      data: result.rows[0],
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error?.message,
      data: error,
    });
  }
};

const deleteUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await userService.deleteUserFromDB(id as string);
    if (result.rowCount == 0) {
      res.status(404).json({
        success: false,
        message: "User not found",
        // data: result.rows[0],
      });
    }
    res.status(201).json({
      success: true,
      message: "User deleted seccessfully",
      // data: result.rows[0],
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error?.message,
      data: error,
    });
  }
};

export const userController = {
  createUser,
  getAllUser,
  getUser,
  updateUser,
  deleteUser,
};
