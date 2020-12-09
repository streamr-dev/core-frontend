// @flow

import { I18n } from 'react-redux-i18n'

type Options = {
    length: number,
    separator?: string,
}

export const truncate = (path: string, options: Options = {}) => {
    const { length, separator } = {
        separator: '...',
        length: 5,
        ...options,
    }

    if (typeof path === 'string' && path.indexOf('0x') >= 0) {
        const search = new RegExp(`0x([A-Fa-f0-9]{${length - 2}})[A-Fa-f0-9]{32,}([A-Fa-f0-9]{${length}})`, 'g')

        return path.replace(search, `0x$1${separator}$2`)
    }

    return path
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
