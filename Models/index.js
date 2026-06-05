import Dayoff from "./Dayoff.js";
import Employee from "./Employee.js";
import Employer from "./Employer.js";
import User from "./User.js";

// Define Relationships between models

Employer.hasOne(User,{
    onDelete: 'CASCADE',
    foreignKey: {
        name: "employerId",
    }
})
User.belongsTo(Employer,{
    foreignKey: {
        name: "employerId",
    }
})

Employee.hasOne(User, {
    onDelete: 'CASCADE',
    foreignKey: {
        name: "employeeId",
    }
})
User.belongsTo(Employee,{
    foreignKey: {
        name: "employeeId",
    }
})

Employer.hasMany(Employee, {
    foreignKey:{
        name: "employerId",
        allowNull: false
    }
})
Employee.belongsTo(Employer,{
    foreignKey:{
        name: "employerId",
        allowNull: false
    }
})

// Relationships between Employee and Dayoff when the employer approves the day off
Employee.hasMany(Dayoff,{
    foreignKey:{
        name: "employeeApprovedId",
        as: "approvedDayoff",
    }
})
Dayoff.belongsTo(Employee,{
    foreignKey:{
        name: "employeeApprovedId",
        as: "approver",
    }
})

// Relationships between Employee and Dayoff when the employee is the one requesting the day off
Employee.hasMany(Dayoff,{
    foreignKey:{
        name: "employeeRequestedId",
        as: "requestedDayoff",
    }
})
Dayoff.belongsTo(Employee,{
    foreignKey:{
        name: "employeeRequestedId",
        as: "requester",
    }
})

// Withdraw this after testing
// Dayoff.sync({alter: true})
// Employer.sync({alter: true})
// Employee.sync({alter: true})
// User.sync({alter: true})

export { Dayoff, Employee, Employer, User}