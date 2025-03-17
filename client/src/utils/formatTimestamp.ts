export function formatUniversalDate(input: string): string {
    const date =
        typeof input === "string"
            ? /^\d+$/.test(input)
                ? new Date(Number(input))
                : new Date(input)
            : new Date(input)

    // Check for invalid date
    if (isNaN(date.getTime())) {
        throw new Error("Invalid date input")
    }

    // UTC version (recommended for consistency)
    const day = date.getUTCDate()
    const month = String(date.getUTCMonth() + 1).padStart(2, "0")
    const year = date.getUTCFullYear()
    const hours = String(date.getUTCHours()).padStart(2, "0")
    const minutes = String(date.getUTCMinutes()).padStart(2, "0")

    return `${day}.${month}.${year}, ${hours}:${minutes}`
}

export function formatUTCTimestamp(timestamp: string): string {
    const x = typeof timestamp === "string" ? parseInt(timestamp) : timestamp
    const date = new Date(x)

    const day = date.getUTCDate()
    const month = (date.getUTCMonth() + 1).toString().padStart(2, "0")
    const year = date.getUTCFullYear()

    const hours = date.getUTCHours().toString().padStart(2, "0")
    const minutes = date.getUTCMinutes().toString().padStart(2, "0")

    return `${day}.${month}.${year}, ${hours}:${minutes}`
}
