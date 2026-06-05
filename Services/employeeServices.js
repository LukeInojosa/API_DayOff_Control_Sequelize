import { Employee, Employer , User} from "../Models/index.js";

class employeeServices{
    static async createEmployee(data){
        const {cpf, name, companyName} = data
        let {cnpj} = data

        if(!cnpj && companyName){
            const employer = await Employer.findOne({
                where:{
                    companyName
                }
            })
            if(!employer) throw new Error("Employer not found with the provided company name")
            cnpj = employer.cnpj
        }

        if(!cnpj) throw new Error("Missing required fields cnpj or companyName for employer")
        if (!cpf || !name) throw new Error("Missing required fields cpf and name for employee")

        const employee = await Employee.create({
            cpf,
            name,
            employerId: cnpj
        })

        if(!employee) throw new Error("Failed to create employee")
        
        return employee
    }

    static async getEmployee(data){
        const { username, cpf} = data
        if (cpf){
            const employee = await Employee.findOne({
                where:{
                    cpf
                }
            })
            return employee
        }else if (username){
            const user = await User.findOne({
                where: {
                    username
                },
                include: Employee
            })
            if (!user.Employee) return {}
            
            return user.Employee
        }else {
            return {}
        }
    }
}

export default employeeServices