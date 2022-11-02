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
