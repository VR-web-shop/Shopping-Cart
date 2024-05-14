import _CreateCommand from "../abstractions/CreateCommand.js";

export default class CreateCommand extends _CreateCommand {
    constructor(name) {
        super(
            name, 
            {}, 
            "name",
            "CartState"
        );
    }
}
