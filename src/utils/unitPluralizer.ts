export const unitPluralizer = (value: number, unit: string): string => {
    return unit + `${value === 1 ? '' : 's'}`
}
