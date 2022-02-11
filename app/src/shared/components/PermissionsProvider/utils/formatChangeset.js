import getOperationKeys from './getOperationKeys'
import toOperationName from './toOperationName'

export default function formatChangeset(changeset) {
    const userIds = []

    const permissions = []

    Object.entries(changeset).forEach(([userId, combination]) => {
        userIds.push(userId)

        permissions.push(getOperationKeys(combination)
            .map(toOperationName)
            .reduce((memo, key) => ({
                ...memo,
                [key]: true,
            }), {}))
    })

    return [userIds, permissions]
}
