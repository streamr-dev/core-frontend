import groupBy from 'lodash/groupBy'
import { getOperationKeys, lookup, toOperationName } from '$shared/components/PermissionsProvider/packer'

export default function getPermissionsDiff(resourceType, raw, permissions, changeset) {
    const groupedRaw = groupBy(raw, 'user')

    const result = {
        add: [],
        del: [],
    }

    Object.entries(changeset).forEach(([userId, combination]) => {
        // eslint-disable-next-line no-bitwise
        getOperationKeys(permissions[userId] ^ combination).forEach((key) => {
            const operationName = toOperationName(resourceType, key)

            if (lookup(combination, key)) {
                result.add.push({
                    ...(userId === 'anonymous' ? {
                        anonymous: true,
                    } : {
                        user: userId,
                    }),
                    operation: operationName,
                })
            } else {
                result.del.push(...groupedRaw[userId].filter(({ operation }) => operation === operationName))
            }
        })
    })

    return result
}
