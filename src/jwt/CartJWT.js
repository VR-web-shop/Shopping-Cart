

import Jwt from 'jsonwebtoken';

const { JWT_CART_ACCESS_SECRET, JWT_CART_ACCESS_EXPIRES_IN } = process.env;

/**
 * @function NewCartAuthentication
 * @description Generate a JSON Web Token for a cart
 * @param {number} cartID
 * @returns {string} access_token
 * @throws {AuthenticateJWTArgumentError} if uuid is not a string
 */
const NewCartAuthentication = function (uuid) {
    if (!uuid) throw new Error('uuid is required');
    if (typeof uuid !== 'string') throw new Error('uuid must be a string');

    const iat = new Date().getTime() / 1000;
    const payload = { iat, sub: uuid };

    const access_token = Jwt.sign(payload, JWT_CART_ACCESS_SECRET);
    
    return access_token;
}


const AuthorizeJWTCart = function(req, res, next) {
   
    const header = req.headers['authorization'];
    if (!header) {
        return res.status(401).send({ message: 'Unauthorized' });
    }

    const lookUpUUIDs = [];
    if (req.body.client_side_uuid) {
        lookUpUUIDs.push(req.body.client_side_uuid);
    }

    if (req.body.cart_client_side_uuid) {
        lookUpUUIDs.push(req.body.cart_client_side_uuid);
    }

    if (req.params.client_side_uuid) {
        lookUpUUIDs.push(req.params.client_side_uuid);
    }

    if (req.query.client_side_uuid) {
        lookUpUUIDs.push(req.query.client_side_uuid);
    }

    if (req.query.cart_client_side_uuid) {
        lookUpUUIDs.push(req.query.cart_client_side_uuid);
    }

    const token = header && header.split(' ')[1];
    if (!token) {
        return res.status(401).send({ message: 'No token provided' });
    }
    
    try {
        const decoded = Jwt.verify(token, process.env.JWT_CART_ACCESS_SECRET);
        req.cart = decoded;

        if (lookUpUUIDs.length > 0) {
            const hasUUID = lookUpUUIDs.includes(decoded.sub);
            
            if (!hasUUID) {
                return res.status(401).send({ message: 'Unauthorized' });
            }
        }

        next();
    } catch (error) {
        console.error(error);
        return res.status(401).send({ message: 'Unauthorized' });
    }
}

export default {
    NewCartAuthentication,
    AuthorizeJWTCart
}
