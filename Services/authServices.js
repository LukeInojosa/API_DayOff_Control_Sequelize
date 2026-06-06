import bcrypt, { hash } from "bcryptjs"
import jwt from 'jsonwebtoken'
import { User } from "../Models/index.js"
import { jwt_key, algorithm } from "../Config/index.js"

class authServices{
    static async autenticate(data){
        const {username, password} = data

        const {password:hashedPassword} = await User.findOne({
            where:{
                username
            }, 
            attributes: ['password']
        })

        if (!hashedPassword) throw new Error('User don\'t exist')
        
        const isSamePassword = bcrypt.compare(password,hashedPassword)

        if (!isSamePassword) throw new Error('Username or password are wrong')

        const token = await jwt.sign({
            username,
            password
        }, jwt_key)

        return token
    }
    static async checkAutentication(data){
        const {authorization: token} = data
        if (!token) return false

        const [,acessToken] = token.split(' ')

        const {username, password} = await jwt.verify(acessToken,jwt_key)

        const user = await User.findOne({
            where: {
                username
            },
            attributes: ['password']
        })

        if (!user) return false

        const isSamePassword = await bcrypt.compare(password, user.password)

        if (!isSamePassword) return false

        return true
    }
}

export default authServices