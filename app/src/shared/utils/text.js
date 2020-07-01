// @flow

import { I18n } from 'react-redux-i18n'

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

export const numberToText = (number: number): string => {
    const numberStr = String(number)

    if (number < 0) {
        return numberStr
    }

    const translatedNumbers = {
        '0': 'zero',
        '1': 'one',
        '2': 'two',
        '3': 'three',
        '4': 'four',
        '5': 'five',
        '6': 'six',
        '7': 'seven',
        '8': 'eight',
        '9': 'nine',
        '10': 'ten',
        '100': 'hundred',
        '1000': 'thousand',
        '10000': 'tenThousand',
        '100000': 'hundredThousand',
        '1000000': 'million',
    }

    if (translatedNumbers[numberStr]) {
        return I18n.t(`number.${translatedNumbers[numberStr]}`)
    }

    return numberStr
}
