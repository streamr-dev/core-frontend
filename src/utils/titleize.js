// @flow

/**
 * Capitalize first letter of each word.
 * @param str Input string.
 */
const titleize = (str: string): string => str.toLowerCase().replace(/(?:^|\s|-)\S/g, (s) => s.toUpperCase())

export default titleize
