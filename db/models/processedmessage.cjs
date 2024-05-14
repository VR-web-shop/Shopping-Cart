'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class ProcessedMessage extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {

        }
    }
    ProcessedMessage.init({
        subscriberID: {
            type: DataTypes.STRING,
            field: 'subscriber_id',
            primaryKey: true
        },
        messageUUID: {
            type: DataTypes.UUID,
            field: 'message_uuid',
            primaryKey: true
        },
        createdAt: {
            allowNull: false,
            type: DataTypes.DATE,
            field: 'created_at',
        },
        updatedAt: {
            allowNull: false,
            type: DataTypes.DATE,
            field: 'updated_at',
        },
    }, {
        sequelize,
        modelName: 'ProcessedMessage',
    });
    return ProcessedMessage;
};