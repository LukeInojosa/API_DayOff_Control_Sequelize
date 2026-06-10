import express from "express";
import cors from "cors"
import { userRoutes, authRoutes } from "./Routes/index.js";
import { authController } from "./Controllers/index.js" 
import errorMiddleware from "./Middlewares/errorMiddleware.js";

const app = express();


app.use(cors()) // Permite requisições de outras origens
app.use(express.json()) // converte body para json

app.use(authRoutes)// define rota de autenticação
app.use(authController.checkAutentication)// middleware para checar autenticação
app.use(userRoutes)// Rotas do usuário 
app.use(errorMiddleware);// middleware para comunicar erro

app.listen(3000, () => {
    console.log("Server is running on port 3000")
})