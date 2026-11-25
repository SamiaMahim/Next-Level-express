import bcrypt from "bcryptjs";
import { pool } from "../../db";
import jwt, { JwtPayload } from "jsonwebtoken";
import { initDB } from '../../db/index';
import config from "../../config";
import { access } from "fs";

const loginUserIntoDB = async (payLoad: {
  email: string, 
  password: string,

  //check if the user exist - done
  //check if the password match - DONE
  // check the user status- done
  // if pass all then generate jwt token
}) => {
  const { email, password } = payLoad;

  const user = await pool.query(
    `SELECT * FROM users WHERE email = $1`,
    [email]
  );
  if (user.rowCount == 0){
    throw new Error("Invalid credentials!!")
  }
 
  const matchPassword = await bcrypt.compare
  (password, user.rows[0].password);

  if(!matchPassword){
    throw new Error ("Invalid credentials!!")
  }

  if(!user.rows[0].is_active){
    throw new Error ("Access Denied!!")
  }
  const jwtPayLoad = {
    id: user.rows[0].id,
    name: user.rows[0].name,
    email: user.rows[0].email,
    role: user.rows[0].role

  }
  const accessToken = jwt.sign(jwtPayLoad, 
    config.jwt_secret,

    {
        expiresIn: "1h"
    }
  );

    const refreshToken = jwt.sign(jwtPayLoad, 
    config.refresh_secret,

    {
        expiresIn: "10d"
    }
  );
    console.log(accessToken,refreshToken);


  return {accessToken , refreshToken, user:user.rows[0]};
};

const generateAccessToken = async(token: string) => {
  if (!token) {
        throw new Error("Unauthorized access!!")
      }
      const decode = jwt.verify(token, config.refresh_secret) as JwtPayload;


      const user = await pool.query(
        `SELECT * FROM users WHERE email = $1`,
        
        [decode.email]);

   if  (user.rowCount === 0)  {
      
        throw new Error("User not found")
      }

      // 4. Check user status
      if (!user.rows[0].is_active) {
        
        throw new Error("Forbidden")
      }

       const jwtPayLoad = {
    id: user.rows[0].id,
    name: user.rows[0].name,
    email: user.rows[0].email,
    role: user.rows[0].role

  }
  const accessToken = jwt.sign(jwtPayLoad, 
    config.jwt_secret,

    {
        expiresIn: "1h"
    }
  );
  return {accessToken};


}

export const authService = {
  loginUserIntoDB,
  generateAccessToken
};
