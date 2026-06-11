import { authServices } from "../Services/index.js";
import bcrypt from "bcryptjs";  

class authController{
    static async signUp(req,res,next){
        const {username, password, cnpj, companyName} = req.body
        try{
            const user = await authServices.signUp({username, password,cnpj,companyName})
            console.log(user.toJSON())
            return res.status(200).send({
                message: "user created sucessfully",
                user: user.toJSON()
            })
        }catch(error){
            console.log(error)
            return next(error)
        }
    }
    static async signIn(req,res,next){
        try{
            const {username, password} = req.body
            const token = await authServices.signIn({username, password})
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
                username: checkedAutentication.username,
                role: checkedAutentication.role
            }

            return next()
        }catch (error){
            console.log(error)
            return next(error)
        }
    }
}

export default authController