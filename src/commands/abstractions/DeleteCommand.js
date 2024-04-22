import ModelCommand from "../abstractions/ModelCommand.js";
import APIActorError from "../../controllers/api/errors/APIActorError.js";

export default class DeleteCommand extends ModelCommand {
    constructor(pk, pkName, fkName, modelName, tombstoneName) {
        super();

        if (!pk || typeof pk !== "string") {
            throw new Error("pk is required and must be a string");
        }

        if (!pkName || typeof pkName !== "string") {
            throw new Error("pkName is required and must be a string");
        }

        if (!fkName || typeof fkName !== "string") {
            throw new Error("fkName is required and must be a string");
        }

        if (!modelName || typeof modelName !== "string") {
            throw new Error("modelName is required and must be a string");
        }

        if (!tombstoneName || typeof tombstoneName !== "string") {
            throw new Error("tombstoneName is required and must be a string");
        }

        this.pk = pk;
        this.pkName = pkName;
        this.fkName = fkName;
        this.modelName = modelName;
        this.tombstoneName = tombstoneName;
    }

    async execute(db, options={}) {
        if (!db || typeof db !== "object") {
            throw new Error("db is required and must be an object");
        }

        const pk = this.pk;
        const pkName = this.pkName;
        const fkName = this.fkName;
        const modelName = this.modelName;
        const tombstoneName = this.tombstoneName;
        const time = {
            deleted_at: new Date(),
            created_at: new Date(),
            updated_at: new Date(),
        }

        try {
            await db.sequelize.transaction(async t => {
                const entity = await db[modelName].findOne(
                    { 
                        where: { [pkName]: pk },
                        include: [{ model: db[tombstoneName], limit: 1 }]
                    },
                    { transaction: t }
                );
    
                if (!entity || entity[`${tombstoneName}s`].length > 0) {
                    throw new APIActorError("No entity found", 404);
                }

                await db[tombstoneName].create(
                    { [fkName]: pk, ...time },
                    { transaction: t }
                );

                if (options.afterTransactions) {
                    for (const transaction of options.afterTransactions) {
                        await transaction(t, entity);
                    }
                }
            });
        } catch (error) {
            console.log(error)
            
            if (error instanceof APIActorError) {
                throw error;
            }

            throw new APIActorError("An error occurred while deleting the entity", 500);
        }
    }
}
