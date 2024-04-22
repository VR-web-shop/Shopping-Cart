import { Op } from "sequelize";

export default class ModelQuery {
    async execute(db) {
        throw new Error("Method not implemented");
    }

    static getSqlOperator = (operator) => {
        let sqlOperator;

        if (operator === Op.eq) sqlOperator = "=";
        else if (operator === Op.gt) sqlOperator = ">";
        else if (operator === Op.lt) sqlOperator = "<";
        else if (operator === Op.gte) sqlOperator = ">=";
        else if (operator === Op.lte) sqlOperator = "<=";
        else if (operator === Op.ne) sqlOperator = "!=";
        else if (operator === Op.like) sqlOperator = "LIKE";
        else if (operator === Op.in) sqlOperator = "IN";
        else if (operator === Op.notIn) sqlOperator = "NOT IN";
        else {
            throw new Error(`Operator ${operator} not supported`);
        }

        return sqlOperator;
    }

    static getSqlForWhereOption = (whereOption) => {
        return whereOption
            ? whereOption.map((where, index) => {
                const prefix = index > 0 ? "AND" : "";
                const operator = ModelQuery.getSqlOperator(where.operator);

                return ` ${prefix} ${where.table} . ${where.column} ${operator} :${where.key}`
            }).join(" ")
            : ""
    }

    static getSql = (options={}) => {
        let { limit, offset, mTable, sTable, tTable, where, fkName, pkName, prefix } = options;

        return `
            ${prefix} FROM ${mTable}
            ${
                // Left join the latest created snapshot
                sTable 
                ? ` LEFT JOIN ${sTable} ON ${sTable} . ${fkName} = ${mTable} . ${pkName}`
                : ""
            }
            ${
                // Left join the latest created tombstone
                tTable 
                ? ` LEFT JOIN ${tTable} ON ${tTable} . ${fkName} = ${mTable} . ${pkName}`
                : ""
            }

            ${
                sTable
                ? ` WHERE ${sTable} . created_at = (
                        SELECT MAX(created_at) FROM ${sTable} 
                        WHERE ${sTable} . ${fkName} = ${mTable} . ${pkName}
                    )`
                : ""
            }
            ${
                tTable 
                ? ` ${sTable ? "AND" : "WHERE"} ${tTable} . ${fkName} IS NULL`
                : ""
            }
            ${
                where 
                ? ` ${tTable || sTable ? "AND" : "WHERE"}`
                : ""
            }

            ${ModelQuery.getSqlForWhereOption(where)}

            ORDER BY ${mTable} . created_at DESC

            ${limit ? ` LIMIT :limit` : ""}
            ${offset ? ` OFFSET :offset` : ""}
        `;
    }
}
