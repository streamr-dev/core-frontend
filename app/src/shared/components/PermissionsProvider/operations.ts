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

export const getOperationNames = (): Array<string> => {
    return Object.keys(Operation).filter((key) => !isNaN(Number(Operation[key])) && Operation[key] !== Operation.None)
}
export const getOperationWithName = (name: string): Operation | undefined => {
    const enumKey = Object.keys(Operation).find((key) => !isNaN(Number(Operation[key])) && name.toLowerCase() == key.toLowerCase())
    return Operation[enumKey]
}
export const setOperation = (value: Operation, flag: Operation): number => value |= flag
export const unsetOperation = (value: Operation, flag: Operation): number => value &= ~flag
export const checkOperation = (value: Operation, flag: Operation): boolean => (value & flag) === flag
