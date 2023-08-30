export const pluralizeUnit = (value: number, unit: string): string => {
    return unit + `${value === 1 ? '' : 's'}`
}
