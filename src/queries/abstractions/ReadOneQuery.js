import ModelQuery from "./ModelQuery.js";
import APIActorError from "../../controllers/api/errors/APIActorError.js";
import { Op, QueryTypes } from "sequelize";

export default class ReadOneQuery extends ModelQuery {
    constructor(
        pk, 
        pkName, 
        dto, 
        tableName, 
        snapshotName = null, 
        tombstoneName = null,
        fkName = null,
        additionalParams = {}
    ) {
        super();

        if (!pk || typeof pk !== "string") {
            throw new Error("pk is required and must be a string");
        }

        if (!pkName || typeof pkName !== "string") {
            throw new Error("pkName is required and must be a string");
        }

        if (!dto || typeof dto !== "function") {
            throw new Error("dto is required and must be a function");
        }

        if (!tableName || typeof tableName !== "string") {
            throw new Error("tableName is required and must be a string");
        }

        if (snapshotName && typeof snapshotName !== "string") {
            throw new Error("if using snapshots, snapshotName must be a string");
        }

        if (tombstoneName && typeof tombstoneName !== "string") {
            throw new Error("if using tombstones, tombstoneName must be a string");
        }

        if (tombstoneName && !fkName) {
            throw new Error("if using tombstones, fkName is required");
        }

        if (additionalParams && typeof additionalParams !== "object") {
            throw new Error("additionalParams must be an object");
        }

        this.pk = pk;
        this.pkName = pkName;
        this.dto = dto;
        this.tableName = tableName;
        this.snapshotName = snapshotName;
        this.tombstoneName = tombstoneName;
        this.fkName = fkName;
        this.additionalParams = additionalParams;
    }

    async execute(db) {
        if (!db || typeof db !== "object") {
            throw new Error("db is required and must be an object");
        }

        const mTable = this.tableName;
        const sTable = this.snapshotName ? `${this.snapshotName}s` : null;
        const tTable = this.tombstoneName ? `${this.tombstoneName}s` : null;
        const fkName = this.fkName;
        const pkName = this.pkName;
        const limit = 1;
        const where = [{ 
            table: mTable, 
            column: pkName, 
            operator: Op.eq, 
            key: 'pk'
        }]

        const queryOptions = {
            mTable,
            sTable, 
            tTable, 
            fkName, 
            pkName, 
            limit,
            where
        }

        if (this.additionalParams.where) {
            this.additionalParams.where.forEach(w => {
                replacements[w.table] = w.table;
                replacements[w.column] = w.column;
                replacements[w.key] = w.value;
                queryOptions.where.push(w);
            });
        }

        const replacements = { pk: this.pk, limit: 1 };
        const selectSQL = ModelQuery.getSql({ prefix: "SELECT *", ...queryOptions });
        const selectOpt = { type: QueryTypes.SELECT, replacements }

        const entity = await db.sequelize.query(selectSQL, selectOpt);
        console.log(entity);
        if (entity.length === 0) {
            throw new APIActorError("No Entity found", 404);
        }

        return this.dto(entity[0]);
    }
}
