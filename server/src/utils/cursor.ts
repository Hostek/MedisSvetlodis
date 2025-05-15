export function encodeCursor(id: number): string {
    return Buffer.from(id.toString()).toString("base64")
}

export function decodeCursor(cursor: string): number {
    return parseInt(Buffer.from(cursor, "base64").toString("ascii"), 10)
}
