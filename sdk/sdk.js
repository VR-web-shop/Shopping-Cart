

    /**
     * AUTO GENERATED SDK BY METEOR (Model Express Toolkit for Efficient ORM REST-APIs)
     * GitHub: https://github.com/VR-web-shop/METEOR
     * Method: BuildAPISDK
     * 
     * Example Usage:
     * import SDK from './sdk.js'
     * 
     * const sdk = SDK('http://localhost:3000')
     * 
     * sdk.api.ControllerName.find({ uuid: '00000000-0000-0000-0000-000000000000' })
     * sdk.api.ControllerName.findAll({ limit: 1, page: 1 })
     * sdk.api.ControllerName.create({ name: 'Material' })
     * sdk.api.ControllerName.update({ uuid: '00000000-0000-0000-0000-000000000000', name: 'Material' })
     * sdk.api.ControllerName.destroy({ uuid: '00000000-0000-0000-0000-000000000000' })
     */

    /**
     * @class CrudAPI
     * @classdesc A class that creates a CRUD API for a given endpoint.
     * @example new CrudAPI('http://localhost:3000', '/api/users', 'id', {
     *    authorization: { storage: 'localStorage', key: 'auth' }, or { storage: 'memory', token: 'YOUR_TOKEN' }
     *    find: { auth: true },
     *    findAll: { auth: true },
     *    create: { auth: true, properties: ['name', 'email'] },
     *    update: { auth: true, properties: ['name', 'email'] },
     *    delete: { auth: true }
     * });
     */
    class CrudAPI {
    constructor(serverURL, endpoint, foreignKeyName = '', options = {}) {
        let _serverURL = serverURL;
        let _endpoint = endpoint;
        let authorizationOptions = options.authorization || {};

        /**
         * @function setServerURL
         * @description Sets the server URL for the API.
         * @param {string} serverURL - The server URL.
         */
        this.setServerURL = function (serverURL) {
            _serverURL = serverURL;
        };

        /**
         * @function setEndpoint
         * @description Sets the endpoint for the API.
         * @param {string} endpoint - The endpoint.
         */
        this.setEndpoint = function (endpoint) {
            _endpoint = endpoint;
        };

        /**
         * @function buildRequestOptions
         * @description Builds the request options for the API.
         * @param {object} requestOptions - The request options.
         * @param {boolean} useAuth - Whether to use authorization.
         * @returns {object} The built request options.
         * @example const requestOptions = buildRequestOptions({ method: 'GET' }, true);
         */
        const buildRequestOptions = async function (requestOptions, useAuth = false) {
            if (useAuth) {
                if (authorizationOptions.storage === 'localStorage') {
                    const token = localStorage.getItem(authorizationOptions.key);
                    if (token) {
                        requestOptions.headers = {
                            ...requestOptions.headers,
                            'Authorization': `Bearer ${token}`
                        };
                    }
                } else if (authorizationOptions.storage === 'memory') {
                    requestOptions.headers = {
                        ...requestOptions.headers,
                        'Authorization': `Bearer ${authorizationOptions.token}`
                    };
                }
            }

            return requestOptions;
        };

        /**
         * @function setAuthorizationOptions
         * @description Sets the authorization options for the API.
         * @param {object} newOptions - The new authorization options.
         * @example setAuthorizationOptions({ storage: 'localStorage', key: 'auth' });
         * @example setAuthorizationOptions({ storage: 'memory', token: 'YOUR_TOKEN' });
         */
        this.setAuthorizationOptions = function (newOptions) {
            authorizationOptions = newOptions;
        };

        /**
         * @function getConstructorOptions
         * @description Gets the constructor options for the API.
         * @returns {object} The constructor options.
         */
        this.getConstructorOptions = function () {
            return {
                serverURL,
                endpoint,
                foreignKeyName,
                options
            };
        };

        const getUrl = function () {
            return `${_serverURL}${_endpoint}`;
        };

        if (options.find) {
            /**
             * @function find
             * @description Finds a record by the foreign key.
             * @param {object} params - The parameters to use for the find operation.
             * @param {object} methodOptions - The method options.
             * @returns {object} The found record.
             * @example const record = await find({ id: 1 });
             * @example const record = await find({ id: 1 }, { include: 'profile' });
             * @example const record = await find({ id: 1 }, { include: 'profile', customParams: { key1: 'value1', key2: 'value2' } });
             */
            this.find = async function (params, methodOptions = {}) {
                const key = params[foreignKeyName];
                if (!key) {
                    throw new Error(`No ${foreignKeyName} provided.`);
                }

                let currentEndpoint = `${getUrl()}/${key}`;
                if (methodOptions.include) {
                    currentEndpoint += `/${methodOptions.include}`;
                }

                if (methodOptions.customParams) {
                    currentEndpoint += CrudAPIUtils.getCustomParamsString(methodOptions.customParams, '?');
                }

                const requestOptions = await buildRequestOptions({ method: 'GET' }, options.find.auth);
                const response = await fetch(currentEndpoint, requestOptions);
                const data = await response.json();
                return data;
            };
        }

        if (options.findAll) {
            /**
             * @function findAll
             * @description Finds all records.
             * @param {object} params - The parameters to use for the find all operation.
             * @returns {object} The found records.
             * @example const records = await findAll({ limit: 10 });
             * @example const records = await findAll({ limit: 10, page: 1 });
             * @example const records = await findAll({ limit: 10, page: 1, q: 'search' });
             * @example const records = await findAll({ limit: 10, page: 1, q: 'search', include: [
             *   { model: 'profile', include: ['address', 'phone'] },
             *   { model: 'posts' }
             * ]
             * @example const records = await findAll({ limit: 10, page: 1, where: { name: 'John Doe', age: 30 } });
             * @example const records = await findAll({ limit: 10, page: 1, customParams: { key1: 'value1', key2: 'value2' } });
             */
            this.findAll = async function (params) {
                const { page, limit, q, include, where, customParams } = params;
                if (!limit) {
                    throw new Error('No limit parameter provided.');
                }

                let _endpoint = `${getUrl()}?limit=${limit}`;

                if (where) {
                    _endpoint += CrudAPIUtils.getWhereString(where, '&where=');
                }

                if (include) {
                    _endpoint += CrudAPIUtils.getIncludeString(include, '&include=');
                }

                if (page) _endpoint += `&page=${page}`;
                if (q) _endpoint += `&q=${q}`;

                if (customParams) {
                    _endpoint += CrudAPIUtils.getCustomParamsString(customParams, '&');
                }

                const requestOptions = await buildRequestOptions({ method: 'GET' }, options.findAll.auth);
                const response = await fetch(_endpoint, requestOptions);
                const data = await response.json();
                return data;
            };
        }

        if (options.create) {
            /**
             * @function create
             * @description Creates a record.
             * @param {object} params - The parameters to use for the create operation.
             * @returns {object} The created record.
             * @example const record = await create({ name: 'John Doe', email: 'test@example.com' });
             * @example const record = await create({ name: 'John Doe', email: 'test@example.com', responseInclude: ['profile'] });
             */
            this.create = async function (params) {
                const isFormData = params instanceof FormData;

                for (let key of options.create.properties) {
                    const val = isFormData ? params.get(key) : params[key];
                    if (!val) {
                        throw new Error(`No ${key} provided.`);
                    }
                }

                const responseInclude = isFormData ? params.get('responseInclude') : params.responseInclude;
                if (responseInclude) {
                    const val = CrudAPIUtils.getIncludeString(responseInclude);
                    if (isFormData) params.set('responseInclude', val);
                    else params.responseInclude = val;
                }

                const requestOptions = await buildRequestOptions(
                    { method: 'POST', headers: {} }, 
                    options.create.auth
                );

                if (params instanceof FormData) {
                    requestOptions.body = params;
                } else {
                    requestOptions.body = JSON.stringify(params);
                    requestOptions.headers['Content-Type'] = 'application/json';
                }
          
                const response = await fetch(getUrl(), requestOptions);
                const data = await response.json();
                return data;
            };
        }

        if (options.update) {
            /**
             * @function update
             * @description Updates a record.
             * @param {object} params - The parameters to use for the update operation.
             * @returns {object} The updated record.
             * @example const record = await update({ id: 1, name: 'Jane Doe', email: 'test2@example.com' });
             * @example const record = await update({ id: 1, name: 'Jane Doe', email: 'test2@example.com', responseInclude: ['profile'] });
             */
            this.update = async function (params) {
                const isFormData = params instanceof FormData;

                if (options.update.requiredProperties) {
                    for (let key of options.update.requiredProperties) {
                        const val = isFormData ? params.get(key) : params[key];
                        if (!val) {
                            throw new Error(`No ${key} provided.`);
                        }
                    }
                }

                const key = isFormData ? params.get(foreignKeyName) : params[foreignKeyName];
                if (!key) {
                    throw new Error(`No ${foreignKeyName} provided.`);
                }

                const responseInclude = isFormData ? params.get('responseInclude') : params.responseInclude;
                if (responseInclude) {
                    const val = CrudAPIUtils.getIncludeString(responseInclude);
                    if (isFormData) params.set('responseInclude', val);
                    else params.responseInclude = val;
                }

                const requestOptions = await buildRequestOptions(
                    { method: 'PUT', headers: {} }, 
                    options.update.auth
                );

                if (params instanceof FormData) {
                    requestOptions.body = params;
                } else {
                    requestOptions.body = JSON.stringify(params);
                    requestOptions.headers['Content-Type'] = 'application/json';
                }

                const response = await fetch(getUrl(), requestOptions);
                const data = await response.json();
                return data;
            };
        }

        if (options.delete) {
            /**
             * @function destroy
             * @description Destroys a record.
             * @param {object} params - The parameters to use for the destroy operation.
             * @returns {boolean} Whether the record was destroyed.
             * @example const result = await destroy({ id: 1 });
             */
            this.destroy = async function (params) {
                const key = params[foreignKeyName];
                if (!key) {
                    throw new Error(`No ${foreignKeyName} provided.`);
                }

                const body = JSON.stringify(params);
                const requestOptions = await buildRequestOptions({
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body
                }, options.delete.auth);
                const response = await fetch(getUrl(), requestOptions);
                return response.status === 204;
            };
        }
    }

    static buildOptions(options = {}) {
        const apiOptions = {};
        const useAuth = (middleware) => middleware && middleware.length > 0;

        if (options.authorization) apiOptions.authorization = options.authorization;

        if (options.find) apiOptions.find = { 
            auth: useAuth(options.find.middleware)
        };
        
        if (options.findAll) apiOptions.findAll = { 
            auth: useAuth(options.findAll.middleware)
        };

        if (options.create) apiOptions.create = {
            auth: useAuth(options.create.middleware),
            properties: options.create.properties
        };

        if (options.update) apiOptions.update = {
            auth: useAuth(options.update.middleware),
            properties: options.update.properties,
            requiredProperties: options.update.requiredProperties
        };

        if (options.delete) apiOptions.delete = { 
            auth: useAuth(options.delete.middleware)
        };

        return apiOptions;
    }

    static toJson(api) {
        const options = api.getConstructorOptions();
        return JSON.stringify(options);
    }

    static fromJson(json) {
        const parsed = JSON.parse(json);
        return new CrudAPI(parsed.serverURL, parsed.endpoint, parsed.foreignKeyName, parsed.options);
    }
}

    class CrudAPIUtils {
    /**
     * @function getWhereString
     * @description Get the where string for the query
     * @param {Object} whereObject - The where object
     * @param {String} whereString - The where string
     * @returns {String} The where string
     * @throws {Error} Where parameter must be an object
     * @example getWhereString({ key1: 'value1', key2: 'value2' })
     * @static
     */
    static getWhereString(whereObject, whereString = '') {

        if (typeof whereObject !== 'object') {
            throw new Error('Where parameter must be an object.');
        }

        for (let i = 0; i < Object.keys(whereObject).length; i++) {
            const key = Object.keys(whereObject)[i];
            const value = whereObject[key];
            whereString += `${key}:${value}`;

            if (i < Object.keys(whereObject).length - 1) {
                whereString += ',';
            }
        }

        return whereString;
    }

    /**
     * @function getIncludeString
     * @description Get the include string for the query
     * @param {Array} includeArray - The include array
     * @param {String} includeString - The include string
     * @returns {String} The include string
     * @throws {Error} includeArray must be an array
     * @throws {Error} includeArray parameter must be an object
     * @throws {Error} includeArray parameter must have a model property
     * @throws {Error} includeArray parameter must be an array of strings
     * @example getIncludeString([{ model: 'Texture', include: ['Image'] }])
     * @example getIncludeString([{ model: 'Texture', include: ['Image', 'TextureType'] }])
     * @static
     */
    static getIncludeString(includeArray, includeString = '') {

        if (!Array.isArray(includeArray)) {
            throw new Error('Include parameter must be an array.');
        }

        for (let i = 0; i < includeArray.length; i++) {

            // Check if include is a object
            if (typeof includeArray[i] !== 'object') {
                throw new Error('Include parameter must be an object.');
            }

            // Check if include has the model property
            if (!includeArray[i].model) {
                throw new Error('Include parameter must have a model property.');
            }

            includeString += includeArray[i].model;
            // Check if include has the include property
            if (includeArray[i].include) {
                includeString += '.';

                // Check if include is an array
                if (!Array.isArray(includeArray[i].include)) {
                    throw new Error('Include parameter must be an array of strings.');
                }

                for (let j = 0; j < includeArray[i].include.length; j++) {
                    includeString += includeArray[i].include[j];

                    if (j < includeArray[i].include.length - 1) {
                        includeString += ':';
                    }
                }
            }

            if (i < includeArray.length - 1) {
                includeString += ',';
            }
        }

        return includeString;
    }

    /**
     * @function getCustomParamsString
     * @description Get the custom parameters string for the query
     * @param {Object} customParams - The custom parameters
     * @param {String} customParamsString - The custom parameters string
     * @returns {String} The custom parameters string
     * @example getCustomeParamsString({ key1: 'value1', key2: 'value2' })
     * @static
     */
    static getCustomParamsString(customParams, customParamsString = '') {
        for (let key of Object.keys(customParams)) {
            customParamsString += `${key}=${customParams[key]}&`;
        }
        customParamsString = customParamsString.slice(0, -1);
        return customParamsString;
    }
}

    /**
     * @constant apis
     * @description JSON representation of the controllers
     * that will be used to create instances of the CrudAPI class.
     */
    const apis = {
    "apis": [
        {
            "CartController": "{\"serverURL\":\"http://http://localhost:3004\",\"endpoint\":\"/api/v1/carts\",\"foreignKeyName\":\"uuid\",\"options\":{\"authorization\":{\"storage\":\"localStorage\",\"key\":\"auth\"},\"find\":{\"auth\":true},\"findAll\":{\"auth\":true},\"create\":{\"auth\":false,\"properties\":[]},\"update\":{\"auth\":true,\"properties\":[\"cart_state_name\",\"access_token\"]},\"delete\":{\"auth\":true}}}"
        },
        {
            "CartStateController": "{\"serverURL\":\"http://http://localhost:3004\",\"endpoint\":\"/api/v1/cart_states\",\"foreignKeyName\":\"name\",\"options\":{\"authorization\":{\"storage\":\"localStorage\",\"key\":\"auth\"},\"find\":{\"auth\":false},\"findAll\":{\"auth\":false}}}"
        },
        {
            "CartProductEntityController": "{\"serverURL\":\"http://http://localhost:3004\",\"endpoint\":\"/api/v1/cart_product_entities\",\"foreignKeyName\":\"uuid\",\"options\":{\"authorization\":{\"storage\":\"localStorage\",\"key\":\"auth\"},\"findAll\":{\"auth\":true},\"create\":{\"auth\":true,\"properties\":[\"cart_uuid\",\"product_entity_uuid\",\"access_token\"]},\"update\":{\"auth\":true,\"properties\":[\"access_token\"]}}}"
        },
        {
            "ProductOrderController": "{\"serverURL\":\"http://http://localhost:3004\",\"endpoint\":\"/api/v1/product_orders\",\"foreignKeyName\":\"uuid\",\"options\":{\"authorization\":{\"storage\":\"localStorage\",\"key\":\"auth\"},\"find\":{\"auth\":false},\"findAll\":{\"auth\":false},\"create\":{\"auth\":false,\"properties\":[\"name\",\"email\",\"address\",\"city\",\"country\",\"postal_code\",\"deliver_option_name\",\"payment_option_name\",\"cart_uuid\"]},\"update\":{\"auth\":false,\"properties\":[\"name\",\"email\",\"address\",\"city\",\"country\",\"postal_code\",\"deliver_option_name\",\"payment_option_name\",\"cart_uuid\"]},\"delete\":{\"auth\":false}}}"
        },
        {
            "ProductOrderEntityController": "{\"serverURL\":\"http://http://localhost:3004\",\"endpoint\":\"/api/v1/product_order_entities\",\"foreignKeyName\":\"uuid\",\"options\":{\"authorization\":{\"storage\":\"localStorage\",\"key\":\"auth\"},\"find\":{\"auth\":false},\"findAll\":{\"auth\":false},\"create\":{\"auth\":false,\"properties\":[\"product_order_uuid\",\"product_entity_uuid\"]},\"update\":{\"auth\":false,\"properties\":[\"product_order_uuid\",\"product_entity_uuid\"]},\"delete\":{\"auth\":false}}}"
        },
        {
            "ProductOrderStateController": "{\"serverURL\":\"http://http://localhost:3004\",\"endpoint\":\"/api/v1/product_order_states\",\"foreignKeyName\":\"name\",\"options\":{\"authorization\":{\"storage\":\"localStorage\",\"key\":\"auth\"},\"find\":{\"auth\":false},\"findAll\":{\"auth\":false}}}"
        },
        {
            "DeliverOptionController": "{\"serverURL\":\"http://http://localhost:3004\",\"endpoint\":\"/api/v1/deliver_options\",\"foreignKeyName\":\"name\",\"options\":{\"authorization\":{\"storage\":\"localStorage\",\"key\":\"auth\"},\"find\":{\"auth\":false},\"findAll\":{\"auth\":false}}}"
        },
        {
            "PaymentOptionController": "{\"serverURL\":\"http://http://localhost:3004\",\"endpoint\":\"/api/v1/payment_options\",\"foreignKeyName\":\"name\",\"options\":{\"authorization\":{\"storage\":\"localStorage\",\"key\":\"auth\"},\"find\":{\"auth\":false},\"findAll\":{\"auth\":false}}}"
        },
        {
            "ProductEntityController": "{\"serverURL\":\"http://http://localhost:3004\",\"endpoint\":\"/api/v1/product_entities\",\"foreignKeyName\":\"uuid\",\"options\":{\"authorization\":{\"storage\":\"localStorage\",\"key\":\"auth\"},\"find\":{\"auth\":false},\"findAll\":{\"auth\":false},\"create\":{\"auth\":false,\"properties\":[\"uuid\",\"product_entity_state_name\"]},\"update\":{\"auth\":false,\"properties\":[\"product_entity_state_name\"]},\"delete\":{\"auth\":false}}}"
        },
        {
            "ProductEntityStateController": "{\"serverURL\":\"http://http://localhost:3004\",\"endpoint\":\"/api/v1/product_entity_states\",\"foreignKeyName\":\"name\",\"options\":{\"authorization\":{\"storage\":\"localStorage\",\"key\":\"auth\"},\"find\":{\"auth\":false},\"findAll\":{\"auth\":false}}}"
        }
    ]
}

    /**
     * @function SDK
     * @description Create an SDK from the server URL.
     * @param {string} serverURL - The server URL
     * @returns {Object} The SDK object
     * @example SDK('http://localhost:3000')
     */
    const SDK = function(serverURL) {    
        if (!serverURL) {
            throw new Error('serverURL is required');
        }
        
        const api = {};
        // Convert the JSON representation of the controllers
        // back to a CrudAPI instance
        for (let object of apis.apis) {
            const key = Object.keys(object)[0];
            const apiInstance = CrudAPI.fromJson(object[key]);
            
            // Use the latest server URL
            apiInstance.setServerURL(serverURL);
            api[key] = apiInstance;
        }

        // Return an object with the APIs.
        return { api }
    }

    export default SDK
    