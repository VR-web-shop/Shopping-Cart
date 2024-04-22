import ModelCommand from "../abstractions/ModelCommand.js";
import APIActorError from "../../controllers/api/errors/APIActorError.js";

export default class CreateCommand extends ModelCommand {
    constructor(pk, params, pkName, modelName, fkName = null, snapshotName = null, snapshotParams = null) {
        super();
        if (!pk || typeof pk !== "string") {
            throw new Error("pk is required and must be a string");
        }

        if (!params || typeof params !== "object") {
            throw new Error("Params is required and must be an object");
        }

        if (!pkName || typeof pkName !== "string") {
            throw new Error("pkName is required and must be a string");
        }

        if (!modelName || typeof modelName !== "string") {
            throw new Error("modelName is required and must be a string");
        }

        if (fkName && typeof fkName !== "string") {
            throw new Error("if fkName is provided, it must be a string");
        }

        if (snapshotName && typeof snapshotName !== "string") {
            throw new Error("if snapshotName is provided, it must be a string");
        }

        if (snapshotName && !fkName) {
            throw new Error("if snapshotName is provided, fkName must also be provided");
        }

        if (snapshotName && !snapshotParams) {
            throw new Error("if snapshotName is provided, snapshotParams must also be provided");
        }

        this.pk = pk;
        this.params = params;
        this.pkName = pkName;
        this.modelName = modelName;
        this.fkName = fkName;
        this.snapshotName = snapshotName;
        this.snapshotParams = snapshotParams;
    }

    async execute(db) {
        if (!db || typeof db !== "object") {
            throw new Error("db is required and must be an object");
        }

        const pk = this.pk;
        const pkName = this.pkName;
        const params = this.params;
        const modelName = this.modelName;
        const fkName = this.fkName;
        const snapshotName = this.snapshotName;
        const snapshotParams = this.snapshotParams;
        const time = {
            created_at: new Date(),
            updated_at: new Date(),
        }

        try {
            await db.sequelize.transaction(async t => {
                const entity = await db[modelName].findOne(
                    { where: { [pkName]: pk } },
                    { transaction: t }
                );

                if (entity) {
                    throw new APIActorError(`Entity with ${pkName} ${pk} already exists`, 400);
                }

                await db[modelName].create(
                    { [pkName]: pk, ...params, ...time }, 
                    { transaction: t }
                );

                if (snapshotName && snapshotParams) {
                    await db[snapshotName].create(
                        { [fkName]: pk, ...snapshotParams, ...time }, 
                        { transaction: t }
                    );
                }
            });
        } catch (error) {
            console.log(error)
            
            if (error instanceof APIActorError) {
                throw error;
            }

            if (error.name === "SequelizeUniqueConstraintError") {
                const paths = error.errors.map(e => e.path).join(", ");
                throw new APIActorError(`The following fields must be unique: ${paths}`, 400);
            }

            throw new APIActorError("An error occurred while creating the entity", 500);
        }
    }
}
