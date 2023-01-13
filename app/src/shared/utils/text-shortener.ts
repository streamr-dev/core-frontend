export const textShortener = (text: string, amountOfCharactersFromStart = 3, amountOfCharactersFromEnd = 3): string => {
    if (text.length <= (amountOfCharactersFromStart + amountOfCharactersFromEnd + 3)) {
        return text
    }
    const leftSide = text.slice(0, amountOfCharactersFromStart)
    const rightSide = text.slice(text.length - amountOfCharactersFromEnd)
    return `${leftSide}...${rightSide}`
}
