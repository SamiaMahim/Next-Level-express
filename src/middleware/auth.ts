import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import config from "../config";
import { pool } from "../db";
import { Role } from "../types";

const auth = (...roles: Role[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    // console.log(roles)
    try {
      // 1. Get token from Authorization header
      const token = req.headers.authorization?.split(" ")[1];

      if (!token) {
        return res.status(401).json({
          success: false,
          message: "Unauthorized access",
        });
      }
      const decode = jwt.verify(token, config.jwt_secret) as JwtPayload;

      console.log("1. JWT decoded:", decode);

      req.user = decode;

      console.log("2. Before next():", req.user);

      next();
      // 2. Verify token
      // const decode = jwt.verify(
      //     token,
      //     config.jwt_secret
      // ) as JwtPayload;

      // 3. Check if user exists
      const user = await pool.query(`SELECT * FROM users WHERE email = $1`, [
        decode.email,
      ]);

      if (user.rowCount === 0) {
        return res.status(401).json({
          success: false,
          message: "User not found",
        });
      }

      // 4. Check user status
      if (!user.rows[0].is_active) {
        return res.status(403).json({
          success: false,
          message: "Your account is inactive",
        });
      }

      // 5. Check user role
      if (roles.length && !roles.includes(user.rows[0].role)) {
        return res.status(403).json({
          success: false,
          message: "forbidden",
        });
      }

      // 6. Attach user to request
      req.user = decode;

      next();
    } catch (error) {
      return res.status(401).json({
        success: false,
        message: "Invalid or expired token",
      });
    }
  };
};

export default auth;
