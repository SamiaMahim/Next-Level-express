
import express, { Application, Request, Response } from "express"


import { userRoute } from "./modules/users/user.route";
import { profileRoute } from './modules/profile/profile.route';
import { authRoute } from "./modules/auth/auth.route";


const app: Application = express()


app.use(express.json());
app.use(express.text());
app.use(express.urlencoded({extended: true}));

app.use('/api/v1/users',userRoute)
app.use('/api/v1/profiles', profileRoute)
app.use('/api/v1/auth',authRoute)


app.get('/', (req: Request , res: Response) => {
  console.log(req)

// koi???????????????????????????? bol..ki problem hoisilo
// tmr sami@ er password tumi age set korsila  , ta hash save hoy nai tokhon 
 res.status(200).json({
    success: true,
    message: "This is root route",
    author: "PH",
  })
})









  

export default app