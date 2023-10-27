const User = require('../../models/user.model');
const {checkPermissions} = require('../../utils/checkPermissions')

const categorieRead = async (req, res, next) => {

    const userPermissions = req.user.role.permissions;

    const permission = userPermissions.find(permission =>  permission.label === 'categorie-read')

    if(permission){
        next()
    }
    return res.status(403).json({ message: 'Permission denied' });

    
    
}



module.exports = {
    categorieRead
}