export function cropText(input: string, maxLength: number = 50): string {
    if (input.length <= maxLength) return input
    return input.slice(0, maxLength - 3) + "..."
}
