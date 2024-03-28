import pkg from 'amqplib';

(async () => {
    const url = process.env.MESSAGE_BROKER_URL;
    const conn = await pkg.connect(url);
    const ch = await conn.createChannel();
    const queues = [];

    const addListener = (queueName, callback) => {
        if (queues.includes(queueName)) {
            throw new Error(`Queue ${queueName} is already being listened to.`);
        }

        queues.push(queueName);
        ch.assertQueue(queueName, { durable: false });
        ch.consume(queueName, (msg) => {
            const text = msg.content.toString();
            const json = JSON.parse(text);
            callback(json);
        }, { noAck: true });
    };

    const removeListener = (queueName) => {
        ch.cancel(queueName);
    };

    const sendMessage = (queueName, msg) => {
        ch.assertQueue(queueName, { durable: false });
        ch.sendToQueue(queueName, Buffer.from(msg));
    };

    /*
    TODO: BELOW
    addListener('discard_product_entity', ProductEntityService.create.bind(ProductEntityService))
    addListener('failed_checkout', ProductEntityService.create.bind(ProductEntityService))
    addListener('successful_checkout', ProductEntityService.update.bind(ProductEntityService))

    sendMessage('reserve_product_entity_to_cart', {product_entity})
    sendMessage('release_product_entity_from_cart', {product_entity})
    sendMessage('initiate_cart_checkout', [{product_entity}...])
    sendMessage('cancel_cart_checkout', [{product_entity}...])
    */
})()