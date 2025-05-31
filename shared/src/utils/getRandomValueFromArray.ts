/**
 * Only works when arr has length greater that 0 ; !!! (not empty)
 */
export function getRandomValueFromArray<T>(arr: T[]): T {
    if (arr.length === 0)
        console.error("Error in getRandomValueFromArray (empty array)")
    const randomIndex = Math.floor(Math.random() * arr.length)
    return arr[randomIndex]
}
