const {internalError} = require('../../utils/500');
const Role = require('../../models/roleModel')
const Permission = require('../../models/permissionModel');
const { body, validationResult} = require('express-validator')


const isFieldUnique = async(value, field) => {
    const existingRole = await Role.findOne({[field]: value});
    if(existingRole){
        return Promise.reject(`Role name already exist`)
    }
}


const getAll = async (req, res) => {

    try {
        const roles = await Role.find();
        res.json(roles);
    } catch (error) {
        res.json(internalError());
    }
}

const storingValidation = [
    body('role')
        .notEmpty()
        .custom(value => isFieldUnique(value, 'role')),
    body('permissions')
        .notEmpty()
        .custom(value => {
            if (Array.isArray(value) && value.length === 0) {
                throw new Error('permissions field must not be empty');
            }
            return true;
        }),
];



const store = async (req, res) => {
    let roleData = req.body;
    
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        
        // get all permissions from Database. (To get the ids);
        const permissions = await Permission.find({ label: {$in: roleData.permissions}})
        
        const newRole = new Role({
            role: roleData.role,
            permissions: permissions.map(permission => permission._id)
        });
    
        

        const savedRole = await newRole.save();
        res.json({
            data: savedRole,
            statu: 200
        });
        
    } catch (error) {
        res.json(internalError());
    }
}








module.exports = { getAll, store, storingValidation }