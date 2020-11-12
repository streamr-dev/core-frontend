/* eslint-disable no-bitwise */

import O from './operations'

export const toOperationKey = (o) => (
    o.toUpperCase().split(/_/).reverse()[0]
)

export const toOperationName = (resourceType, o) => (
    `${resourceType}_${toOperationKey(o)}`.toLowerCase()
)

export const toOperationID = (o) => (
    O[toOperationKey(o)]
)

export const getOperationKeys = (combination) => (
    Object.keys(O).reduce((memo, operationKey) => (
        combination & O[operationKey] ? [...memo, operationKey] : memo
    ), [])
)

export const lookup = (combination, operationKey) => !!(
    combination & O[operationKey]
)

export const combineMany = (rawPermissions) => {
    const result = {}

    rawPermissions.forEach(({ user, anonymous, operation: operationName }) => {
        const userId = anonymous ? 'anonymous' : user
        result[userId] = (result[userId] || 0) | toOperationID(operationName)
    })

    return result
}

export const count = (combination) => {
    let sum = 0
    let c = combination

    while (c > 0) {
        sum += c & 1
        c >>= 1
    }

    return sum
}
