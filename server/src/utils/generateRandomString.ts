import crypto from "crypto"

export function generateRandomString(length = 15) {
    const letters = "abcdefghijklmnopqrstuvwxyz"
    const bytes = crypto.randomBytes(length)
    let result = ""
    for (let i = 0; i < length; i++) {
        result += letters[bytes[i] % letters.length]
    }
    return result
}
