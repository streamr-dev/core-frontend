import { nextUniqueName, nextUniqueCopyName } from '../utils/uniqueName'

const simpleName = 'existingname'
const nameWithSpaces = 'existing name'

describe('nextUniqueName generator', () => {
    it('errors if not passed string name', () => {
        expect(() => nextUniqueName(undefined, [])).toThrow()
        expect(() => nextUniqueName(null, [])).toThrow()
        expect(() => nextUniqueName({}, [])).toThrow()
        expect(() => nextUniqueName([], [])).toThrow()
        expect(() => nextUniqueName(3, [])).toThrow()
    })

    it('errors if not passed array of existing names', () => {
        expect(() => nextUniqueName('name')).toThrow()
        expect(() => nextUniqueName('name', null)).toThrow()
        expect(() => nextUniqueName('name', {})).toThrow()
        expect(() => nextUniqueName('name', [1])).toThrow()
        expect(() => nextUniqueName('name', [null])).toThrow()
        expect(() => nextUniqueName('name', [[]])).toThrow()
        expect(() => nextUniqueName()).toThrow()
    })

    describe('returns passed in name if no duplicates', () => {
        it('works with simple name', () => {
            expect(nextUniqueName(simpleName, [])).toBe(simpleName)
            expect(nextUniqueName(simpleName, [])).toBe(simpleName)
            expect(nextUniqueName(simpleName, ['othername'])).toBe(simpleName)
        })

        it('works with names with spaces', () => {
            expect(nextUniqueName(nameWithSpaces, [])).toBe(nameWithSpaces)
            expect(nextUniqueName(nameWithSpaces, [])).toBe(nameWithSpaces)
            expect(nextUniqueName(nameWithSpaces, ['other name'])).toBe(nameWithSpaces)
        })

        it('trims whitespace', () => {
            expect(nextUniqueName(` ${simpleName} `, [])).toBe(simpleName)
            expect(nextUniqueName(` ${nameWithSpaces} `, [])).toBe(nameWithSpaces)
        })

        it('is not case sensitive', () => {
            const capitalizedName = simpleName.toUpperCase()
            expect(nextUniqueName(capitalizedName, [simpleName])).toBe(capitalizedName)
            expect(nextUniqueName(simpleName, [capitalizedName])).toBe(simpleName)
        })
    })

    describe('appends " 02" on first duplicate', () => {
        it('works for simple cases', () => {
            expect(nextUniqueName(simpleName, [simpleName])).toBe(`${simpleName} 02`)
            expect(nextUniqueName(nameWithSpaces, [nameWithSpaces])).toBe(`${nameWithSpaces} 02`)
        })

        it('ignores trimmable whitespace', () => {
            expect(nextUniqueName(` ${simpleName} `, [` ${simpleName} `])).toBe(`${simpleName} 02`)
            expect(nextUniqueName(` ${nameWithSpaces} `, [` ${nameWithSpaces} `])).toBe(`${nameWithSpaces} 02`)
        })
    })

    describe('appends " 0n" on subsequent duplicate', () => {
        it('works for 02', () => {
            expect(nextUniqueName(simpleName, [`${simpleName} 02`])).toBe(`${simpleName} 03`)
            expect(nextUniqueName(nameWithSpaces, [`${nameWithSpaces} 02 `])).toBe(`${nameWithSpaces} 03`)
        })

        it('works for 02-09', () => {
            expect(nextUniqueName(simpleName, [`${simpleName} 02`])).toBe(`${simpleName} 03`)
            expect(nextUniqueName(simpleName, [`${simpleName} 03`])).toBe(`${simpleName} 04`)
        })

        it('works for 09-n', () => {
            expect(nextUniqueName(simpleName, [`${simpleName} 09`])).toBe(`${simpleName} 10`)
            expect(nextUniqueName(simpleName, [`${simpleName} 10`])).toBe(`${simpleName} 11`)
            expect(nextUniqueName(simpleName, [`${simpleName} 99`])).toBe(`${simpleName} 100`)
        })

        it('picks largest index found of passed in name and existing names', async () => {
            expect(nextUniqueName(simpleName, [`${simpleName} 02`])).toBe(`${simpleName} 03`)
            expect(nextUniqueName(`${simpleName} 02`, [simpleName])).toBe(`${simpleName} 02`)
            expect(nextUniqueName(`${simpleName} 02`, [`${simpleName} 03`])).toBe(`${simpleName} 04`)
            expect(nextUniqueName(`${simpleName} 03`, [`${simpleName} 02`])).toBe(`${simpleName} 03`)
        })

        it('ignores leading 0', () => {
            expect(nextUniqueName(`${simpleName} 02`, [`${simpleName} 2`])).toBe(`${simpleName} 03`)
            expect(nextUniqueName(`${simpleName} 2`, [`${simpleName} 02`])).toBe(`${simpleName} 03`)
            expect(nextUniqueName(`${simpleName} 2`, [`${simpleName} 2`])).toBe(`${simpleName} 03`)
            expect(nextUniqueName(`${simpleName} 1`, [`${simpleName} 01`])).toBe(`${simpleName} 02`)
            expect(nextUniqueName(simpleName, [`${simpleName} 010`])).toBe(`${simpleName} 11`)
        })

        it('works with bad names', () => {
            expect(nextUniqueName(`${simpleName} 0`, [simpleName])).toBe(`${simpleName} 02`)
            expect(nextUniqueName(`${simpleName} 01`, [simpleName])).toBe(`${simpleName} 02`)
            expect(nextUniqueName(simpleName, [`${simpleName} 0`])).toBe(`${simpleName} 02`)
            expect(nextUniqueName(simpleName, [`${simpleName} 01`])).toBe(`${simpleName} 02`)
            expect(nextUniqueName(simpleName, [`${simpleName} 0`, `${simpleName} 01`])).toBe(`${simpleName} 02`)
        })

        it('ignores trimmable whitespace', () => {
            expect(nextUniqueName(` ${simpleName} `, [` ${simpleName} `])).toBe(`${simpleName} 02`)
            expect(nextUniqueName(` ${nameWithSpaces} `, [` ${nameWithSpaces} `])).toBe(`${nameWithSpaces} 02`)
        })

        it('works with names that already contain digits', async () => {
            expect(nextUniqueName(`${simpleName} 1 Copy`, [`${simpleName} 1 Copy`])).toBe(`${simpleName} 1 Copy 02`)
            expect(nextUniqueName(`${simpleName} Copy`, [`${simpleName} Copy`])).toBe(`${simpleName} Copy 02`)
            expect(nextUniqueName(`${simpleName} Copy 02`, [`${simpleName} Copy`])).toBe(`${simpleName} Copy 02`)
            expect(nextUniqueName(`${simpleName} Copy`, [`${simpleName} Copy 02`])).toBe(`${simpleName} Copy 03`)
            expect(nextUniqueName(`${simpleName} 1 Copy 02`, [`${simpleName} 1 Copy 02`])).toBe(`${simpleName} 1 Copy 03`)
            expect(nextUniqueName(`${simpleName}1`, [`${simpleName}1`])).toBe(`${simpleName}1 02`)
        })
    })
})

describe('copyName', () => {
    it('appends copy if necessary', () => {
        expect(nextUniqueCopyName(simpleName, [])).toBe(`${simpleName} Copy`)
        expect(nextUniqueCopyName(`${simpleName} Copy`, [])).toBe(`${simpleName} Copy`)
    })

    it('returns original name if already copy & no dupes', () => {
        expect(nextUniqueCopyName(`${simpleName} Copy 02`, [])).toBe(`${simpleName} Copy 02`)
        expect(nextUniqueCopyName(`${simpleName} Copy 2`, [])).toBe(`${simpleName} Copy 2`)
    })

    it('applies appropriate counter', () => {
        expect(nextUniqueCopyName(simpleName, [`${simpleName} Copy`])).toBe(`${simpleName} Copy 02`)
        expect(nextUniqueCopyName(simpleName, [`${simpleName} Copy`])).toBe(`${simpleName} Copy 02`)
        expect(nextUniqueCopyName(simpleName, [`${simpleName} Copy 2`])).toBe(`${simpleName} Copy 03`)
    })
})
