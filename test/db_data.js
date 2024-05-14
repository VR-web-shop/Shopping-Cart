const today = new Date().setHours(0, 0, 0, 0);
const yesterday = new Date().setDate(new Date().getDate() - 1);
const twoDaysAgo = new Date().setDate(new Date().getDate() - 2);

export default {

    cartStates: [
        { name: 'Active', created_at: twoDaysAgo, updated_at: twoDaysAgo },
        { name: 'Inactive', created_at: yesterday, updated_at: yesterday }
    ],

    carts: [
        { client_side_uuid: 'aaa-bbb-ccc' },
        { client_side_uuid: 'aaa-bbb-ccc2' }
    ],
    cartDescriptions: [
        { id: 1, cart_client_side_uuid: 'aaa-bbb-ccc', cart_state_name: 'Active', created_at: twoDaysAgo, updated_at: twoDaysAgo },
        { id: 2, cart_client_side_uuid: 'aaa-bbb-ccc2', cart_state_name: 'Active', created_at: yesterday, updated_at: yesterday }
    ],

    cartProductEntities: [
        { client_side_uuid: 'aaa-bbb-ccc', cart_product_entity_client_side_uuid: 'aaa-bbb-ccc', cart_client_side_uuid: 'aaa-bbb-ccc', product_entity_client_side_uuid: 'aaa-bbb-ccc' },
        { client_side_uuid: 'aaa-bbb-ccc2', cart_product_entity_client_side_uuid: 'aaa-bbb-ccc2', cart_client_side_uuid: 'aaa-bbb-ccc2', product_entity_client_side_uuid: 'aaa-bbb-ccc2' }
    ],
    cartProductEntityRemoved: [
        { id: 1, cart_product_entity_client_side_uuid: 'aaa-bbb-ccc2', deleted_at: new Date(), created_at: twoDaysAgo, updated_at: twoDaysAgo },
    ],

    deliverOptions: [
        { client_side_uuid: 'aaa-bbb-ccc' },
        { client_side_uuid: 'aaa-bbb-ccc2' }
    ],
    deliverOptionDescriptions: [
        { id: 1, deliver_option_client_side_uuid: 'aaa-bbb-ccc', name: 'Standard', price: 10, created_at: twoDaysAgo, updated_at: twoDaysAgo },
        { id: 2, deliver_option_client_side_uuid: 'aaa-bbb-ccc2', name: 'Express', price: 10, created_at: yesterday, updated_at: yesterday }
    ],
    deliverOptionRemoved: [
        { id: 1, deliver_option_client_side_uuid: 'aaa-bbb-ccc2', deleted_at: new Date(), created_at: twoDaysAgo, updated_at: twoDaysAgo },
    ],

    paymentOptions: [
        { client_side_uuid: 'aaa-bbb-ccc' },
        { client_side_uuid: 'aaa-bbb-ccc2' }
    ],
    paymentOptionDescriptions: [
        { id: 1, payment_option_client_side_uuid: 'aaa-bbb-ccc', name: 'Cash', price: 10, created_at: twoDaysAgo, updated_at: twoDaysAgo },
        { id: 2, payment_option_client_side_uuid: 'aaa-bbb-ccc2', name: 'Credit Card', price: 10, created_at: yesterday, updated_at: yesterday }
    ],
    paymentOptionRemoved: [
        { id: 1, payment_option_client_side_uuid: 'aaa-bbb-ccc2', deleted_at: new Date(), created_at: twoDaysAgo, updated_at: twoDaysAgo },
    ],

    products: [
        { client_side_uuid: 'aaa-bbb-ccc' },
        { client_side_uuid: 'aaa-bbb-ccc2' }
    ],
    productDescriptions: [
        { id: 1, product_client_side_uuid: 'aaa-bbb-ccc', name: 'Product 1', description: 'Description 1', thumbnail_source: 'thumbnail1.jpg', price: 10, created_at: twoDaysAgo, updated_at: twoDaysAgo },
        { id: 2, product_client_side_uuid: 'aaa-bbb-ccc2', name: 'Product 2', description: 'Description 2', thumbnail_source: 'thumbnail2.jpg', price: 10, created_at: yesterday, updated_at: yesterday }
    ],
    productRemoved: [
        { id: 1, product_client_side_uuid: 'aaa-bbb-ccc2', deleted_at: new Date(), created_at: twoDaysAgo, updated_at: twoDaysAgo },
    ],

    productEntityStates: [
        { name: 'Available' },
        { name: 'Unavailable' }
    ],

    productEntities: [
        { client_side_uuid: 'aaa-bbb-ccc' },
        { client_side_uuid: 'aaa-bbb-ccc2' },
        { client_side_uuid: 'aaa-bbb-ccc3' }
    ],
    productEntityDescriptions: [
        { id: 1, product_entity_client_side_uuid: 'aaa-bbb-ccc', product_entity_state_name: 'Available', product_client_side_uuid: 'aaa-bbb-ccc', created_at: twoDaysAgo, updated_at: twoDaysAgo },
        { id: 2, product_entity_client_side_uuid: 'aaa-bbb-ccc2', product_entity_state_name: 'Available', product_client_side_uuid: 'aaa-bbb-ccc2', created_at: yesterday, updated_at: yesterday },
        { id: 3, product_entity_client_side_uuid: 'aaa-bbb-ccc3', product_entity_state_name: 'Available', product_client_side_uuid: 'aaa-bbb-ccc', created_at: yesterday, updated_at: yesterday }
    ],
    productEntityRemoved: [
        { id: 1, product_entity_client_side_uuid: 'aaa-bbb-ccc2', deleted_at: new Date(), created_at: twoDaysAgo, updated_at: twoDaysAgo },
    ],

    productOrderStates: [
        { name: 'Pending' },
        { name: 'Completed' }
    ],

    productOrders: [
        { client_side_uuid: 'aaa-bbb-ccc' },
        { client_side_uuid: 'aaa-bbb-ccc2' },
        { client_side_uuid: 'aaa-bbb-ccc3' }
    ],
    productOrderDescriptions: [
        { id: 1, product_order_client_side_uuid: 'aaa-bbb-ccc', name: 'product order 1', email: 'email1', address: 'address1', city: 'city1', country: 'country1', postal_code: 'postal_code1', product_order_state_name: 'Pending', deliver_option_client_side_uuid: 'aaa-bbb-ccc', payment_option_client_side_uuid: 'aaa-bbb-ccc', created_at: twoDaysAgo, updated_at: twoDaysAgo },
        { id: 2, product_order_client_side_uuid: 'aaa-bbb-ccc2', name: 'product order 2', email: 'email2', address: 'address2', city: 'city2', country: 'country2', postal_code: 'postal_code2', product_order_state_name: 'Pending', deliver_option_client_side_uuid: 'aaa-bbb-ccc2', payment_option_client_side_uuid: 'aaa-bbb-ccc2', created_at: yesterday, updated_at: yesterday },
        { id: 3, product_order_client_side_uuid: 'aaa-bbb-ccc3', name: 'product order 3', email: 'email3', address: 'address3', city: 'city3', country: 'country3', postal_code: 'postal_code3', product_order_state_name: 'Pending', deliver_option_client_side_uuid: 'aaa-bbb-ccc', payment_option_client_side_uuid: 'aaa-bbb-ccc', created_at: yesterday, updated_at: yesterday }
    ], 
    productOrderRemoved: [
        { id: 1, product_order_client_side_uuid: 'aaa-bbb-ccc2', deleted_at: new Date(), created_at: twoDaysAgo, updated_at: twoDaysAgo },
    ],

    productOrderEntities: [
        { client_side_uuid: 'aaa-bbb-ccc' },
        { client_side_uuid: 'aaa-bbb-ccc2' }
    ],
    productOrderEntityDescriptions: [
        { id: 1, product_order_entity_client_side_uuid: 'aaa-bbb-ccc', product_entity_client_side_uuid: 'aaa-bbb-ccc', product_order_client_side_uuid: 'aaa-bbb-ccc', created_at: twoDaysAgo, updated_at: twoDaysAgo },
        { id: 2, product_order_entity_client_side_uuid: 'aaa-bbb-ccc2', product_entity_client_side_uuid: 'aaa-bbb-ccc2', product_order_client_side_uuid: 'aaa-bbb-ccc2', created_at: yesterday, updated_at: yesterday }
    ],
    productOrderEntityRemoved: [
        { id: 1, product_order_entity_client_side_uuid: 'aaa-bbb-ccc2', deleted_at: new Date(), created_at: twoDaysAgo, updated_at: twoDaysAgo },
    ],

}
