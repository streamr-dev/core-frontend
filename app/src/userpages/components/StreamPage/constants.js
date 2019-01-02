// @flow

export const leftColumn = {
    xs: 7,
}

export const rightColumn = {
    xs: {
        size: 4,
        offset: 1,
    },
}

export const fieldTypes = ['number', 'boolean', 'map', 'list', 'string']

export const fieldValidators = {
    number: (f: string): boolean => !Number.isNaN(parseFloat(f)),
    string: (f: string): boolean => f instanceof String || typeof f === 'string',
    boolean: (f: string): boolean => f === 'true' || f === 'false',
    map: (f: string): boolean => {
        try {
            const m = JSON.parse(f)
            return typeof m === 'object' && m !== null
        } catch (e) {
            return false
        }
    },
    list: (f: string): boolean => {
        try {
            const a = JSON.parse(f)
            return Array.isArray(a)
        } catch (e) {
            return false
        }
    },
}
