export function NormalizeError(value: string | string[]) {
    if (typeof value === "string") return value
    if (value.length > 0) return value[0]
    return ""
}
