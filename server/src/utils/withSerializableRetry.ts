export async function withSerializableRetry<T>(
    operation: () => Promise<T>,
    maxRetries = 3
): Promise<T> {
    let attempts = 0
    while (attempts < maxRetries) {
        try {
            return await operation()
        } catch (error) {
            if (error.code === "40001") {
                // Serialization failure
                attempts++
                await new Promise((resolve) =>
                    setTimeout(resolve, 50 * 2 ** attempts)
                )
                continue
            }
            throw error
        }
    }
    throw new Error("Max retries reached")
}
