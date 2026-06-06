// import { Employer } from "../Models";

// class employerController{
//     static async createEmployer(req,res,next){
//         const {cnpj, companyName} = req.body
//         try{
//             const employer = await Employer.create({
//                 cnpj,
//                 companyName
//             })
//             return res.status(201).send({
//                 cnpj: employer.cnpj,
//                 companyName: employer.companyName,
//                 message: "Employer created successfully",
//             })
//         }catch(error){
//             next(error)
//         }
//     }
// }