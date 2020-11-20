import toOperationId from './toOperationId'

export default function combineMany(rawPermissions) {
    const result = {}

    rawPermissions.forEach(({ user, anonymous, operation: operationName }) => {
        const userId = anonymous ? 'anonymous' : user
        // eslint-disable-next-line no-bitwise
        result[userId] = (result[userId] || 0) | toOperationId(operationName)
    })

    return result
}
