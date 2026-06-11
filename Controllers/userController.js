import User from "../Models/User.js"
import { userServices } from "../Services/index.js"

class userController{
    static async createUser(req, res,next){
        try{
            const {cpf, cnpj, name, companyName, username, password} = req.body
            const {username: requestUsername, role: requestRole} = req.user

            const user = await userServices.createUser({
                username, password,
                cpf,name,
                cnpj,companyName,
                requestUsername, requestRole
            })
            
            return res.status(201).send({
                user: user.toJSON(),
                message: "User created successfully",
            })
        }catch(error){
            console.log(error)
            next(error)
        }
    }

    static async getMe(req,res,next){
        const {username} = req.user
        const user=  await userServices.getAllUsers({username})
        res.status(201).send({
            user
        })
    }

    static async deleteUser(req,res,next){
        try{
            const {username,cpf,cnpj} = req.body 
            const {username: requestUsername} = req.user

            const user = await userServices.deleteUser({requestUsername, username, cpf,cnpj})

            return res.status(201).send({
                user: user,
                message: "User was successfully deleted"
            })
        }catch(error){
            console.log(error)
            next(error)
        }
    }

    static async getAllUsers(req,res,next){
        try{
            const users = await userServices.getAllUsers(req.params)
            return res.status(201).send({
                users
            })
        }catch (error){
            console.log(error)
            next(error)
        }
    }

    static async getUserByUsername(req,res,next){
        const {username} = req.params
        try{
            const user = await User.findOne({
                where:{
                    username
                }
            })
            if(!user){
                return res.status(404).send({
                    message: "User not found"
                })
            }
            return res.status(200).send({
                username: user.username,
                message: "User found successfully",
            })
        }catch(error){
            next(error)
        }
    }

    static async alterUser(req,res,next){
        try{
            const {username} = req.params
            const {modifications} = req.body
            
            if(!await userServices.checkUpdatePermissions({
                requestUsername: req.user.username,
                updateUsername: username
            })) return res.status(401).send({
                message: 'you dont have permission to change this data'
            })
            
            const modifiedUser = await userServices.alterUser({username, modifications})

            res.status(201).send({
                modifiedUser
            })
        }catch (error){
            next(error)
        }
    }
}

export default userController