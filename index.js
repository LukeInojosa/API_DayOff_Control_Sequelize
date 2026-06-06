import express from "express";
import cors from "cors"
import { userRoutes, authRoutes } from "./Routes/index.js";
import { authController } from "./Controllers/index.js" 
import errorMiddleware from "./Middlewares/errorMiddleware.js";

const app = express();


app.use(cors())
app.use(express.json())

app.use(authRoutes)
app.use(authController.checkAutentication)
app.use(userRoutes)
app.use(errorMiddleware);

app.listen(3000, () => {
    console.log("Server is running on port 3000")
})