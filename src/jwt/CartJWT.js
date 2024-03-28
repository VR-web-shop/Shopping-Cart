

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

    const access_token = Jwt.sign(payload, JWT_CART_ACCESS_SECRET, { 
        expiresIn: JWT_CART_ACCESS_EXPIRES_IN 
    });
    
    return access_token;
}


const AuthorizeJWTCart = function(req, res, next) {
    // Is the body in the url?
    let { uuid } = req.params;
    let { token } = req.query;
    // or is it in the body?
    if (!uuid) uuid = req.body.cart_uuid;
    if (!token) token = req.body.token;

    if (!uuid || !token) {
        return res.status(401).send({ message: 'Unauthorized' });
    }

    try {
        const decoded = Jwt.verify(token, process.env.JWT_CART_ACCESS_SECRET);
        const { sub } = decoded;
        if (sub !== uuid) {
            return res.status(401).send({ message: 'Unauthorized' });
        }

        next();
    } catch (error) {
        return res.status(401).send({ message: 'Unauthorized' });
    }
}

export default {
    NewCartAuthentication,
    AuthorizeJWTCart
}
