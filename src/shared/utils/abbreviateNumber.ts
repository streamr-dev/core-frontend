const SI_SYMBOL = ['', 'k', 'M', 'G']

export const abbreviateNumber = (number: number, fractionDigits = 2): string => {
    const tier = (Math.log10(Math.abs(number)) / 3) | 0
    if (tier == 0) {
        return Number(number.toFixed(fractionDigits)).toString()
    }

    const suffix = SI_SYMBOL[tier]
    const scale = Math.pow(10, tier * 3)
    const scaled = number / scale
    return Number(scaled.toFixed(fractionDigits)) + suffix // Convert back to Number to get rid of useless zero decimals
}
