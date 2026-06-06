import { userServices } from "../Services/index.js"

class userController{
    static async createUser(req, res,next){
        try{
            const user = await userServices.createUser(req.body)
            
            return res.status(201).send({
                user: user.toJSON(),
                message: "User created successfully",
            })
        }catch(error){
            console.log(error)
            next(error)
        }
    }

    static async deleteUser(req,res,next){
        try{
            const user = await userServices.deleteUser(req.body)

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
}

export default userController