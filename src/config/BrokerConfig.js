import pkg from 'amqplib';
import BrokerServiceConsumer from '../services/BrokerServiceConsumer.js';

const url = process.env.MESSAGE_BROKER_URL;
const queues = [];
let ch, conn;

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

export const sendMessage = (queueName, msg) => {
    const text = JSON.stringify(msg);

    ch.assertQueue(queueName, { durable: false });
    ch.sendToQueue(queueName, Buffer.from(text));
};

export const connect = async () => {
    conn = await pkg.connect(url);
    ch = await conn.createChannel();

    for (const conf of BrokerServiceConsumer.config) {
        addListener(conf.type, conf.callback);
    }
}
