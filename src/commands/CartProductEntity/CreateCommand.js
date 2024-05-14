import _CreateCommand from "../abstractions/CreateCommand.js";

export default class CreateCommand extends _CreateCommand {
    constructor(clientSideUUID, params) {
        super(
            clientSideUUID, 
            params, 
            "client_side_uuid",
            "CartProductEntity"
        );
    }
}
