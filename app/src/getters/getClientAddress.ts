/**
 * TODO - check if we need it at all, maybe it could be replaced with useAuthController
 * @param client
 * @param suppressFailures
 */
export default async function getClientAddress(client, { suppressFailures = false } = {}) {
    try {
        return await client.getAddress()
    } catch (e) {
        if (!suppressFailures) {
            throw e
        }
    }

    return undefined
}
