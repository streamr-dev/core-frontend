export const GET = 0x01

export const EDIT = 0x02

export const DELETE = 0x04

export const PUBLISH = 0x08

export const SUBSCRIBE = 0x10

export const STARTSTOP = 0x20

export const INTERACT = 0x40

export const SHARE = 0x80

const ALL = {
    GET,
    EDIT,
    DELETE,
    PUBLISH,
    SUBSCRIBE,
    STARTSTOP,
    INTERACT,
    SHARE,
}

const REVERSE = Object.keys(ALL).reduce((memo, k) => ({
    ...memo,
    [ALL[k]]: k,
}), [])

export const getReverse = (operationID) => (
    REVERSE[operationID]
)

export default ALL
