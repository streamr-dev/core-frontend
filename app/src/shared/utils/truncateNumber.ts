export const truncateNumber = (
    value: number,
    shortenFrom: 'thousands' | 'millions',
): string => {
    const scale = shortenFrom === 'millions' || value >= 1000000 ? 1000000 : 1000
    const unit = shortenFrom === 'millions' || value >= 1000000 ? 'M' : 'K'
    if (value < scale) {
        return value.toString()
    }
    return Math.round(value / scale) + unit
}
