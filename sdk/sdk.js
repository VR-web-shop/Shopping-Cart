
export function shoppingCartSDK(server_url, options={}) {
    const request = async (endpoint, method='GET', body=null, useAuth = false) => {
        const headers = {}
        const params = { method, headers }

        if (useAuth) {
            const tokenKey = options.tokenKey || 'auth'
            const token = localStorage.getItem(tokenKey)
            if (!token) throw new Error('No token found')
            params.headers['Authorization'] = 'Bearer ' + token
        }

        if (body) {
            params.body = JSON.stringify(body)
            params.headers['Content-Type'] = 'application/json'
        }

        const response = await fetch(`${server_url}${endpoint}`, params)

        if (!response.ok) {
            if (options.toast) {
                options.toast.add('Failed to fetch data', 5000, 'error')
            }
            return
        }   

        if (method === 'DELETE') return
        
        return await response.json()
    }

    const api = (endpoint, pkName, apiOptions = {}) => {
        const methods = {}

        if (apiOptions.find) {
            methods.find = async (pk) => {
                return await request(`${endpoint}/${pk}`, 'GET', null, apiOptions.find.useAuth)
            }
        }

        if (apiOptions.findAll) {
            methods.findAll = async ({limit, page}) => {
                return await request(`${endpoint}?limit=${limit}&page=${page}`, 'GET', null, apiOptions.findAll.useAuth)
            }
        }

        if (apiOptions.create) {
            methods.create = async (data) => {
                return await request(`${endpoint}`, 'POST', data, apiOptions.create.useAuth)
            }
        }

        if (apiOptions.update) {
            methods.update = async (data) => {
                return await request(endpoint, 'PUT', data, apiOptions.update.useAuth)
            }
        }

        if (apiOptions.remove) {
            methods.remove = async (pk) => {
                return await request(`${endpoint}`, 'DELETE', {[pkName]: pk}, apiOptions.remove.useAuth)
            }
        }

        return methods
    }

    return {
        api: {
            AdminCart: api('/admin/carts', 'client_side_uuid', {
                find: { useAuth: true },
                findAll: { useAuth: true },
                create: { useAuth: true },
                update: { useAuth: true },
            }),
            AdminCartProductEntity: api('/admin/cart_product_entities', 'client_side_uuid', {
                find: { useAuth: true },
                findAll: { useAuth: true },
                create: { useAuth: true },
                remove: { useAuth: true }
            }),
            AdminCartState: api('/admin/cart_states', 'name', {
                find: { useAuth: true },
                findAll: { useAuth: true },
                create: { useAuth: true },
            }),
            Cart: api('/carts', 'client_side_uuid', {
                find: { useAuth: false },
                create: { useAuth: false },
                update: { useAuth: false },
            }),
            CartProductEntity: api('/cart_product_entities', 'client_side_uuid', {
                find: { useAuth: false },
                findAll: { useAuth: false },
                create: { useAuth: false },
                remove: { useAuth: false }
            }),
            CartState: api('/cart_states', 'name', {
                find: { useAuth: false },
                findAll: { useAuth: false },
                create: { useAuth: false },
            }),
            DeliverOption: api('/deliver_options', 'client_side_uuid', {
                find: { useAuth: false },
                findAll: { useAuth: false },
            }),
            PaymentOption: api('/payment_options', 'client_side_uuid', {
                find: { useAuth: false },
                findAll: { useAuth: false },
            }),
            ProductOrder: api('/product_orders', 'client_side_uuid', {
                find: { useAuth: false },
                create: { useAuth: false },
                update: { useAuth: false },
                delete: { useAuth: false },
            }),
        }
    }
}
