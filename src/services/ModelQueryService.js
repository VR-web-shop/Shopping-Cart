import ModelQuery from "../queries/abstractions/ModelQuery.js";
import _db from '../../db/models/index.cjs';

export default function ModelQueryService(db=_db) {
    if (!db) throw new Error('db is required');
    if (typeof db !== 'object') 
        throw new Error('db must be an object');
    
    const invoke = async (query) => {
        if (!query) throw new Error('Query is required');
        if (!(query instanceof ModelQuery))
            throw new Error('Query must be an instance of ModelQuery');
        
        return await query.execute(db);
    }

    return {
        invoke
    }
}
