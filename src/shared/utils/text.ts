export const truncate = (path: string): string => {
    const shortenedAddress =
        typeof path !== 'string'
            ? path
            : path.replace(
                  /0x[a-f\d]{40,}/gi,
                  (match) =>
                      `${match.substr(0, 5)}...${match.substring(match.length - 5)}`,
              )
    return shortenedAddress
}

const translatedNumbers: { [key: string]: string } = {
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
export const numberToText = (number: number): string => {
    const numberStr = String(number)

    if (number < 0) {
        return numberStr
    }

    if (translatedNumbers[numberStr]) {
        return translatedNumbers[numberStr]
    }

    return numberStr
}

const MAX_STREAM_NAME_LENGTH = 26

export const truncateStreamName = (
    streamName: string,
    limit = MAX_STREAM_NAME_LENGTH,
): string => {
    // adding 3 to the limit because we when truncating we're adding 3 characters of ellipsis when we truncate + 1 for the separator
    if (streamName.length <= limit + 4) {
        return streamName
    }
    const separatorIndex = streamName.indexOf('/')
    const addressPart = streamName.substring(0, separatorIndex)
    const namePart = streamName.substring(separatorIndex + 1)
    return addressPart.length >= namePart.length
        ? truncateStartingWithTheAddressPart(addressPart, namePart, limit)
        : truncateStartingWithTheNamePart(addressPart, namePart, limit)
}

const truncateStartingWithTheAddressPart = (
    addressPart: string,
    namePart: string,
    limit: number,
): string => {
    const shortenedAddressPart = truncateAddressPart(addressPart)
    // adding 3 to the limit because we when truncating we're adding 3 characters of ellipsis when we truncate + 1 for the separator
    if (`${shortenedAddressPart}/${namePart}`.length <= limit + 4) {
        return `${shortenedAddressPart}/${namePart}`
    }
    return `${shortenedAddressPart}/${truncateNamePart(namePart)}`
}

const truncateStartingWithTheNamePart = (
    addressPart: string,
    namePart: string,
    limit: number,
): string => {
    const shortenedNamePart = truncateNamePart(namePart)
    // adding 3 to the limit because we when truncating we're adding 3 characters of ellipsis when we truncate + 1 for the separator
    if (`${addressPart}/${shortenedNamePart}`.length <= limit + 4) {
        return `${addressPart}/${shortenedNamePart}`
    }
    return `${truncateAddressPart(addressPart)}/${shortenedNamePart}`
}

const truncateAddressPart = (addressPart: string): string => {
    const isEnsName = addressPart.match(/0x[a-f\d]{40,}/gi) === null
    return isEnsName
        ? `${addressPart.substring(0, 5)}...${addressPart.substring(
              addressPart.length - 9,
          )}`
        : truncate(addressPart)
}

const truncateNamePart = (namePart: string): string => {
    return `${namePart.substring(0, 5)}...${namePart.substring(namePart.length - 5)}`
}
