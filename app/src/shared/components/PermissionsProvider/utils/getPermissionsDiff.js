import groupBy from 'lodash/groupBy'
import getOperationKeys from './getOperationKeys'
import lookup from './lookup'
import toOperationName from './toOperationName'

export default function getPermissionsDiff(resourceType, raw, combinations, changeset) {
    const groupedRaw = groupBy(raw, 'user')

    const result = {
        add: [],
        del: [],
    }

    Object.entries(changeset).forEach(([userId, combination]) => {
        // eslint-disable-next-line no-bitwise
        getOperationKeys(combinations[userId] ^ combination).forEach((key) => {
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
                const collection = (userId === 'anonymous' ? groupedRaw.undefined : groupedRaw[userId]) || []

                result.del.push(...collection.filter(({ operation, anonymous }) => (
                    operation === operationName && (userId !== 'anonymous' || anonymous)
                )))
            }
        })
    })

    return result
}
