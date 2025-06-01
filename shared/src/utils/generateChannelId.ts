/**
 * Generates a unique and consistent channel ID for a one-on-one chat.
 * The channel ID is based on lexicographical order of the two UUIDv4 user IDs.
 *
 * @param userId1 - UUIDv4 of the first user
 * @param userId2 - UUIDv4 of the second user
 * @returns A string channel ID in the format: uuid1_uuid2 (ordered)
 */
export function generateChannelId(userId1: string, userId2: string): string {
    const [id1, id2] = [userId1, userId2].sort()
    return `${id1}_${id2}`
}
