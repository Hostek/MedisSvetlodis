export function checkIfArrayExistsNotEmpty<T>(
    x: T[] | null | undefined
): x is T[] {
    return Array.isArray(x) && x.length > 0
}
