import { sign, verify } from "jsonwebtoken"

export function generateOAuthProof(email: string, PROOF_SECRET: string) {
    return sign(
        { email, timestamp: Date.now() },
        PROOF_SECRET,
        { expiresIn: "5m" } // Short-lived proof
    )
}

export async function verifyOAuthProof(
    proof: string,
    email: string,
    PROOF_SECRET: string
) {
    try {
        const decoded = verify(proof, PROOF_SECRET) as { email: string }
        return decoded.email === email
    } catch {
        return false
    }
}
