const User = require('../../models/user.model');


const permissionMiddleware = (permissionNeeded) => async (req, res, next) => {

    const userPermissions = req.user.role.permissions;

    const permission = userPermissions.find(permission =>  permission.label === permissionNeeded)

    if(permission){
        return next();
    }else{
        return res.status(403).json({ message: 'Permission denied' });
    }
}



module.exports = {
    permissionMiddleware
}