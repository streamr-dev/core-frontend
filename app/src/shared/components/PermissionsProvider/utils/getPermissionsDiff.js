import getOperationKeys from './getOperationKeys'
import lookup from './lookup'
import toOperationName from './toOperationName'

export default function getPermissionsDiff(combinations, changeset) {
    const grant = []

    const revoke = []

    Object.entries(changeset).forEach(([userId, combination]) => {
        // eslint-disable-next-line no-bitwise
        getOperationKeys(combinations[userId] ^ combination).forEach((key) => {
            const operationName = toOperationName(key)

            const collection = lookup(combination, key) ? grant : revoke

            collection.push([userId, operationName])
        })
    })

    return {
        grant,
        revoke,
    }
}
