
export default function ProductOrderStateDTO(entity) {
    if (!entity || typeof entity !== "object") {
        throw new Error("entity is required and must be an object");
    }

    const attributes = {
        name: entity.name,
        created_at: entity.created_at,
        updated_at: entity.updated_at,
    }

    return attributes;
}
