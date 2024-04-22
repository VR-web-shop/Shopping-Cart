import Jwt from 'jsonwebtoken';

/**
 * @function AuthorizeJWT
 * @description A middleware function to authenticate a JSON Web Token
 * @param {Request} req
 * @param {Response} res
 * @param {NextFunction} next
 * @returns {void}
 */
const AuthorizeJWT = function(req, res, next) {
    const header = req.headers['authorization'];
    if (!header) {
        return res.status(401).send({ message: 'Unauthorized' });
    }
    
    const token = header && header.split(' ')[1];
    if (!token) {
        return res.status(401).send({ message: 'No token provided' });
    }

    try {
        const decoded = Jwt.verify(token, process.env.JWT_ACCESS_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).send({ message: 'Unauthorized' });
    }
}

/**
 * @function AuthorizePermissionJWT
 * @description A middleware function to authenticate a permission against JSON Web Token
 * @param {string} permissionName
 * @returns {void}
 */
const AuthorizePermissionJWT = function(permissionName) {
    return (req, res, next) => {
        const user = req.user;

        if (!user) {
            return res.status(401).send({ message: 'Unauthorized' });
        }

        const { permissions } = user;
        let hasPermission = false;
        
        for (const permission of permissions) {
            if (permission === permissionName) {
                hasPermission = true;
                break;
            }
        }

        if (!hasPermission) {
            return res.status(403).send({ message: 'Forbidden' });
        }

        next();
    }
}

export default {
    AuthorizeJWT,
    AuthorizePermissionJWT
}
