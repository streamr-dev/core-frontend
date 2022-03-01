export default async function getUserPermissions(stream, user) {
    const permissions = {}

    try {
        const allPermissions = await stream.getPermissions()

        allPermissions.find(({ user: pUser }) => user === pUser).permissions.forEach((op) => {
            permissions[op] = true
        })
    } catch (e) {
        console.error('Fetching permissions failed', e)
    }

    return permissions
}
