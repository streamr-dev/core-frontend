// @flow

export const truncate = (path: string) => (
    typeof path !== 'string' ? path : path.replace(/0x[a-f\d]{40,}/ig, (match) => (
        `${match.substr(0, 5)}...${match.substring(match.length - 5)}`
    ))
)

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
        '100': 'a hundred',
        '1000': 'a thousand',
        '10000': 'ten thousand',
        '100000': 'a hundred thousand',
        '1000000': 'a million',
    }

    if (translatedNumbers[numberStr]) {
        return translatedNumbers[numberStr]
    }

    return numberStr
}
