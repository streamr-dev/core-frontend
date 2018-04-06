// @flow

export default (str: string) => str.toLowerCase().replace(/(?:^|\s|-)\S/g, (s) => s.toUpperCase())
