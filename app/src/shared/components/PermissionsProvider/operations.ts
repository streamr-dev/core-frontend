export const NONE = 0x0
export const GET = 0x01
export const EDIT = 0x02
export const DELETE = 0x04
export const PUBLISH = 0x08
export const SUBSCRIBE = 0x10
export const STARTSTOP = 0x20
export const INTERACT = 0x40
export const GRANT = 0x80

// Express same as typescript enum flag
export enum Operation {
    None        = 0,
    Get         = 1 << 0,
    Edit        = 1 << 1,
    Delete      = 1 << 2,
    Publish     = 1 << 3,
    Subscribe   = 1 << 4,
    StartStop   = 1 << 5,
    Interact    = 1 << 6,
    Grant       = 1 << 7,
}

export const setOperation = (value: Operation, flag: Operation): number => value |= flag
export const unsetOperation = (value: Operation, flag: Operation): number => value &= ~flag
export const checkOperation = (value: Operation, flag: Operation): boolean => (value & flag) === flag