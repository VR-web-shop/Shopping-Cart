
export default function ProductDTO(entity) {
    if (!entity || typeof entity !== "object") {
        throw new Error("entity is required and must be an object");
    }

    const attributes = {
        client_side_uuid: entity.client_side_uuid,
        name: entity.name,
        description: entity.description,
        thumbnail_source: entity.thumbnail_source,
        price: entity.price,
        created_at: entity.created_at,
        updated_at: entity.updated_at,
    }

    return attributes;
}
