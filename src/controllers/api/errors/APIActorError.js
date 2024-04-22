
/**
 * @class APIActorError
 * @classdesc Error indicating that an error occurred because of an API actor
 * did not provide valid parameters when interacting with an API endpoint.
 * Possible reasons include:
 * - Not providing the correct keys
 * - Providing keys with undefined or null values when they are required
 * - Lookups for non existing entities
 * - Provided the wrong password in a login request
 * @extends Error
 * @param {string} msg - The error message
 * @param {number} statusCode - The HTTP status code to be sent back to the API actor
 */
class APIActorError extends Error {
    constructor(msg, statusCode) {
        super(msg)
        this.name = 'APIActorError'
        this.statusCode = statusCode
    }
}

export default APIActorError;
