/**
 * @module services/LinkService
 * @description Provides services for creating links for the API.
 */

const SERVER_URL = (() => {
    if (process.env.NODE_ENV === 'production') {
        return process.env.PROD_SERVER_URL;
    } else if (process.env.NODE_ENV === 'test') {
        return process.env.TEST_SERVER_URL;
    } else {
        return process.env.DEV_SERVER_URL;
    }
})();

/**
 * @function combineUrl
 * @description Combines the server URL with the given path.
 * @param {string} path The path to combine with the server URL.
 * @returns {string} The combined URL.
 */
const combineUrl = (path) => `${SERVER_URL}/${path}`;

/**
 * @function entityLinks
 * @description Creates an object with links for the entity.
 * @param {string} self The path to the entity.
 * @param {string} selfMethod The method for the self link.
 * @param {Array} options The options for the entity.
 * @returns {object} The links object.
 */
const entityLinks = (self, selfMethod, options=[], alternatePath) => {
    const links = { "self": { "href": combineUrl(self), "method": selfMethod } };

    options.forEach(option => {
        if (option.unless && option.unless === true) return;
        let path = alternatePath ? alternatePath : self;
        if (option.additionalPath) path = `${path}/${option.additionalPath}`;
        links[option.name] = { "href": combineUrl(path), "method": option.method };
    });

    return { "_links": links };
}

/**
 * @function paginateLinks
 * @description Creates an object with links for pagination.
 * @param {string} self The path to the entity.
 * @param {number} page The current page.
 * @param {number} pages The total number of pages.
 * @returns {object} The links object.
 */
const paginateLinks = (self, page, pages) => {
    const links = { "self": { "href": combineUrl(self), "method": "GET" } };

    if (page > 1) {
        links["previous"] = { "href": combineUrl(`${self}?page=${page - 1}`), "method": "GET" };
    }

    if (page > 2) {
        links["first"] = { "href": combineUrl(`${self}?page=1`), "method": "GET" };
    }

    if (page < pages) {
        links["next"] = { "href": combineUrl(`${self}?page=${page + 1}`), "method": "GET" };
    }

    if (page < pages - 1) {
        links["last"] = { "href": combineUrl(`${self}?page=${pages}`), "method": "GET" };
    }

    return { "_links": links };
}

export default { 
    entityLinks, 
    paginateLinks 
};
