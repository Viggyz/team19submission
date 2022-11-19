export const encode_location_id = (location) => {
    const mapping = {
        'way': 'W',
        'node': 'N',
        'relation': 'R',
    }
    return mapping[location.osm_type]+location.osm_id;
} 