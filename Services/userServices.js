import {User, Employee, Employer} from "../Models/index.js";
import {employeeServices} from "../Services/index.js";
import {employerServices} from "../Services/index.js";
import bcrypt from "bcryptjs";

class userServices{
    static async createEmployerUser(data){
        const {username, password, cnpj} = data
        if (!username || !password) throw new Error("Missing required fields for user")

        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)

        const user = await User.create({
            username,
            password: hashedPassword,
            employerId: cnpj
        })
        if(!user) throw new Error("Failed to create user")
        return user
    }

    static async createEmployeeUser(data){
        const {username,password,cpf} = data
        
        if (!username || !password) throw new Error("Missing required fields username or password for user")

        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)

        const user = await User.create({
            username,
            password: hashedPassword,
            employeeId: cpf
        })
        if(!user) throw new Error("Failed to create user")
        return user
    }

    static async getAllUsers(data){
        try{
            const {username} = data
            
            let where = {}
            if (username) where.username = username

            const users = await User.findAll({
                where,
                include: [
                    {model: Employee},
                    {model: Employer}
                ]
            })
            return users
        }catch (error){
            console.log(error)
            return {}
        }
    }

    static async createUser(data){
        const {role} = data
        let user = null;
        if (role === "employee"){
            const {cpf, name, cnpj, companyName} = data
            const employee = await employeeServices.createEmployee({cpf,name,cnpj,companyName})

            const {username,password} = data
            user = await userServices.createEmployeeUser({
                username,
                password,
                cpf: employee.cpf
            })

        }else if(role === "employer"){

            const {cnpj, companyName} = data
            const employer = await employerServices.createEmployer({cnpj,companyName})

            const {username,password} = data
            user = await userServices.createEmployerUser({
                username,
                password, 
                cnpj: employer.cnpj
            })

        }else {
            throw new Error("Invalid role")
        }

        if(!user) throw new Error("Failed to create user")
        return user
    }

    static async deleteUser(data){
        const {role} = data
        if (role=== 'employee'){
            const {username, cpf, name, employerAutentication} = data
            const {username: employerUsername, password: employerPassword} = employerAutentication

            const user = await User.findOne({
                where: {
                    username: employerUsername
                },
                include: Employer
            })

            if(!user) throw new Error("This user dont have Autorization to delete")

            const isSamePassword = await bcrypt.compare(employerPassword, user.password)

            if (!isSamePassword) throw new Error("This user dont have Autorization to delete")
            if(!user.Employer) throw new Error("This user dont have Autorization to delete")

            const employer = user.Employer
            const employee = await employeeServices.getEmployee({username, cpf})

            if (employee.employerId != employer.cnpj) throw new Error("This is not your employee, so you can\'t delete him")

            const result = await Employee.destroy({
                where: {
                    cpf: employee.cpf
                }
            })

            console.log('result of destroy employer:')
            console.log(result)
            
            return employee.toJSON()

        }else if (role === 'employer'){
            const {username, password} = data
            const user = await User.findOne({
                where:{
                    username
                }
            })

            if (!user || !user.employerId  ) throw new Error('Employer dont exist or password is incorrect')

            const isSamePassword = await bcrypt.compare(password,user.password)

            if (!isSamePassword) throw new Error('Employer don\'t exist or password is incorrect. You dont have autorization to delete this user')

            const employer = await user.getEmployer()

            const result = await Employer.destroy({
                where:{
                    cnpj: employer.cnpj
                }
            })

            console.log('result of destroy employer:')
            console.log(result)

            return employer.toJSON()
        }else {
            throw new Error('Invalid role')
        }
    }

}

export default userServices