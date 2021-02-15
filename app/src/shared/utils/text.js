// @flow

import { I18n } from 'react-redux-i18n'

type Options = {
    length: number,
    separator?: string,
}

export const truncate = (path: string, options: Options = {}) => {
    const { length = 5, separator = '...' } = options

    return typeof path !== 'string' ? path : path.replace(/0x[a-f\d]{40,}/ig, (match) => {
        const l = Math.min(length, Math.floor((match.length - separator.length) / 2))

        return match.substr(0, l) + separator + match.substring(match.length - l)
    })
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
