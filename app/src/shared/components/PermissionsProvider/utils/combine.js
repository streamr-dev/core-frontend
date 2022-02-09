import toOperationId from './toOperationId'

export default function combine(rawPermissions) {
    const result = {}

    Object.entries(rawPermissions).forEach(([userId, permissions]) => {
        if (!permissions.length) {
            return
        }

        result[userId.toLowerCase()] = permissions.reduce((memo, operationName) => (
            // eslint-disable-next-line no-bitwise
            memo | toOperationId(operationName)
        ), 0)
    })

    return result
}
