import { authServices } from "../Services/index.js";
import bcrypt from "bcryptjs";  

class authController{
    static async autenticate(req,res,next){
        try{
            const {username, password} = req.body
            const token = await authServices.autenticate({username, password})
            res.status(201).send({
                token
            })

            
        }catch(error){
            console.log(error)
            return next(error)
        }
    }
    static async checkAutentication(req,res,next){
        try{
            const checkedAutentication = await authServices.checkAutentication(req.headers)
            
            if (!checkedAutentication) {
                return res.status(401).send({
                    message: "Your credentials are wrong"
                })
            }   
            
            req.user = {
                username: checkedAutentication.username
            }

            return next()
        }catch (error){
            console.log(error)
            return next(error)
        }
    }
}

export default authController