// @flow

type Options = {
    minLength?: number,
    maxLength?: number,
    separator?: string,
}

export const truncate = (text: string, options: Options = {}) => {
    const { minLength, maxLength, separator } = {
        minLength: 20,
        maxLength: 30,
        separator: '...',
        ...options,
    }

    if (text.length < minLength) {
        return text
    }

    const maxLengthWithoutSeparator = Math.min(maxLength, text.length) - separator.length
    const sideLength = Math.floor(maxLengthWithoutSeparator / 2)

    return text.substr(0, sideLength) + separator + text.substr(-sideLength)
}
