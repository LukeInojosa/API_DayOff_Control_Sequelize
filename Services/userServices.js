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
        const {requestUsername,requestRole} = data
        let user = null

        // se usuário não está autenticado, então ele pode criar sua conta como empregador
        if (!requestUsername && !requestRole) {
            const {cnpj, companyName} = data
            const employer = await employerServices.createEmployer({cnpj,companyName})

            const {username,password} = data
            user = await userServices.createEmployerUser({
                username,
                password, 
                cnpj: employer.cnpj
            })
        }else if (requestRole == "employer"){ // se usuário está autenticado, então ele pode criar apenas empregados
            const {requestUsername} = data
            const {employerId} = await User.findOne({
                where: {
                    username: requestUsername
                },
                attributes: ['employerId']
            })

            const {cpf, name} = data

            const employee = await employeeServices.createEmployee({
                cpf,
                name,
                cnpj: employerId
            })

            const {username,password} = data
            user = await userServices.createEmployeeUser({
                username,
                password,
                cpf: employee.cpf
            })
        }else {
            throw new Error('you cant create a user')
        }
        if(!user) throw new Error("Failed to create user")
        return user
    }

    static async getUserRole(user){
        if (user.employeeId) return 'employee'
        return 'employer'
    }

    static async deleteUser(data){
        const {username, cpf, cnpj, requestUsername} = data

        let where = {}
        if (username) where.username = username
        if (cpf) where.employeeId = cpf
        if (cnpj) where.employerId = cnpj

        if ((where?.employeeId && where?.employerId) || (!where?.employeeId && !where?.employerId && !where?.username)) throw new Error("requisição errada")

        const userToDelete = await User.findOne({
            where,
        })

        if (!userToDelete) throw new Error('no user to delete')

        const role = await this.getUserRole(userToDelete)

        if (role == "employee"){
            const employer = await this.getEmployerOfEmployee(userToDelete)
            if (!employer) throw new Error ('user is not a employee')
            if (employer.username !== requestUsername) throw new Error ('you cant delete this user')
            const result = await Employee.destroy({
                where: {
                    cpf: userToDelete.employeeId
                }
            })
            return result
        }

        if(requestUsername !== userToDelete.username) throw new Error('you cant delete this user')
        const result = await Employer.destroy({
            where:{
                cnpj: userToDelete.employerId
            }
        })
        return result
    }

    static async alterUser(data){
        const {username, modifications} = data
        const user = await User.findOne({
            where:{
                username
            },
            include: [
                {model: Employee},
                {model: Employer}
            ]

        })
        if (user.Employer){
            const res = await Employer.update(modifications, {
                where: {
                    cnpj: user.Employer.cnpj
                }
            }) 
            return res
        }else if (user.Employee){
            const res = await Employee.update(modifications, {
                where: {
                    cpf: user.Employee.cpf
                }
            }) 
            return res
        }else{
            throw new Error("User dont exist")
        }
    }

    static async getEmployerOfEmployee(data){
        if (data instanceof Employee){
            const employer = await data.getEmployer()
            return await employer.getUser()
        } else if (data instanceof User){
            if (!data.employeeId) return null
            const employee = await data.getEmployee()
            const employer =  await employee.getEmployer()
            return await employer.getUser()
        }else if (data?.employeeUsername){
            const {employeeUsername} = data
            const user = await User.findOne({
                where:{
                    username: employeeUsername
                },
                include: Employee
            })
            
            if (user.employerId) return null
            if (!user.Employee) return null
        
            const employer = await user.Employee.getEmployer()

            const employerUser = await employer.getUser()

            return employerUser
        }
        return null
    }

    static async checkUpdatePermissions(data){
        const {requestUsername,updateUsername} = data
        // If it is me , so i have permission
        if (requestUsername == updateUsername) return true
        
        // If is my employee, do i have permission
        const employerUser = await this.getEmployerOfEmployee({
            employeeUsername: updateUsername
        })
        if (employerUser?.username !== updateUsername) return false

        return true
    }
}

export default userServices