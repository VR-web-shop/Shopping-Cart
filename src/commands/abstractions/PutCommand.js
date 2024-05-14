import ModelCommand from "../abstractions/ModelCommand.js";
import APIActorError from "../../controllers/api/errors/APIActorError.js";

export default class PutCommand extends ModelCommand {
    constructor(pk, params, pkName, fkName, casKeys, modelName, snapshotName, tombstoneName) {
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

        if (!fkName || typeof fkName !== "string") {
            throw new Error("fkName is required and must be a string");
        }

        if (!casKeys || !Array.isArray(casKeys)) {
            throw new Error("casKeys is required and must be an array");
        }

        if (!modelName || typeof modelName !== "string") {
            throw new Error("modelName is required and must be a string");
        }

        if (!snapshotName || typeof snapshotName !== "string") {
            throw new Error("snapshotName is required and must be a string");
        }

        if (tombstoneName && typeof tombstoneName !== "string") {
            throw new Error("tombstoneName is required and must be a string");
        }

        this.pk = pk;
        this.params = params;
        this.pkName = pkName;
        this.fkName = fkName;
        this.casKeys = casKeys;
        this.modelName = modelName;
        this.snapshotName = snapshotName;
        this.tombstoneName = tombstoneName;
    }

    async execute(db, options={}) {
        if (!db || typeof db !== "object") {
            throw new Error("db is required and must be an object");
        }

        if (!options || typeof options !== "object") {
            throw new Error("options is required and must be an object");
        }

        const pk = this.pk;
        const pkName = this.pkName;
        const fkName = this.fkName;
        const casKeys = this.casKeys;
        const params = this.params;
        const modelName = this.modelName;
        const snapshotName = this.snapshotName;
        const tombstoneName = this.tombstoneName;
        const time = {
            created_at: new Date(),
            updated_at: new Date(),
        }

        const include = [
            { 
                model: db[snapshotName], 
                limit: 1,
                order: [["id", "DESC"]] 
            },
        ];

        if (tombstoneName) {
            include.push({ 
                model: db[tombstoneName], 
                limit: 1,
                order: [["id", "DESC"]] 
            });
        }

        try {
            const transactions = async (transaction) => {
                let entity = await db[modelName].findOne(
                    { 
                        where: { [pkName]: pk },
                        include
                    },
                    { transaction }
                );

                if (!entity) {
                    entity = await db[modelName].create(
                        { [pkName]: pk }, 
                        { transaction }
                    );
                } else if (tombstoneName && entity[`${tombstoneName}s`].length > 0) {
                    // Undo remove
                    await db[tombstoneName].destroy(
                        { where: { [fkName]: pk } },
                        { transaction }
                    );
                }

                const snapshots = entity[`${snapshotName}s`];
                if (snapshots && snapshots.length > 0) {
                    const description = snapshots[0];
                    const inputString = casKeys.map(key => params[key]).join(", ");
                    const currentString = casKeys.map(key => description[key]).join(", ");
                    const inputCAS = PutCommand.calculateCAS(inputString);
                    const currentCAS = PutCommand.calculateCAS(currentString);
                    if (currentCAS === inputCAS) return; // No changes
                }

                if (options.beforeTransactions) {
                    for (const transactionMethod of options.beforeTransactions) {
                        await transactionMethod(transaction, entity, params, db);
                    }
                }

                const snapshot = await db[snapshotName].create(
                    { [fkName]: pk, ...params, ...time }, 
                    { transaction }
                );

                if (options.afterTransactions) {
                    for (const transactionMethod of options.afterTransactions) {
                        await transactionMethod(transaction, entity, snapshot, db);
                    }
                }
            }

            if (options.transaction) {
                await transactions(options.transaction);
            } else {
                await db.sequelize.transaction(async t => await transactions(t));
            }
        } catch (error) {
            console.log(error)

            if (error instanceof APIActorError) {
                throw error;
            }

            if (error.name === "SequelizeUniqueConstraintError") {
                const paths = error.errors.map(e => e.path).join(", ");
                throw new APIActorError(`The following fields must be unique: ${paths}`, 400);
            }

            throw new APIActorError("An error occurred while putting an entity", 500);
        }
    }

    static calculateCAS = (params) => {
        const base64 = Buffer.from(`${params}`).toString("base64");
        return Buffer.from(base64).toString("base64");
    }
}
