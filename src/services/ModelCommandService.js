import ModelCommand from '../commands/abstractions/ModelCommand.js';
import _db from '../../db/models/index.cjs';

export default function ModelCommandService(db=_db) {
    if (!db) throw new Error('db is required');
    if (typeof db !== 'object') 
        throw new Error('db must be an object');
    
    const invoke = async (command, options={}) => {
        if (!command) throw new Error('Command is required');
        if (!(command instanceof ModelCommand))
            throw new Error('Command must be an instance of ModelCommand');
        
        await command.execute(db, options);
    }

    return {
        invoke
    }
}
