import bcrypt from "bcryptjs";
import { pool } from "../../db";
import jwt from "jsonwebtoken";
import { initDB } from '../../db/index';

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
    email: user.rows[0].email

  }
  const accessToken = jwt.sign(jwtPayLoad, "dfsldkfj343",
    {
        expiresIn: "1d"
    }
  )
 

  return {accessToken, user:user.rows[0]};
//   console.log(user.rows[0]);
};

export const authService = {
  loginUserIntoDB,
};
