import { nextUniqueName, nextUniqueCopyName } from '../utils/uniqueName'

const name = 'existingname'
const nameWithSpaces = 'existing name'

describe('nextUniqueName', () => {
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
            expect(nextUniqueName(name, [])).toBe(name)
            expect(nextUniqueName(name, [])).toBe(name)
            expect(nextUniqueName(name, ['othername'])).toBe(name)
        })

        it('works with names with spaces', () => {
            expect(nextUniqueName(nameWithSpaces, [])).toBe(nameWithSpaces)
            expect(nextUniqueName(nameWithSpaces, [])).toBe(nameWithSpaces)
            expect(nextUniqueName(nameWithSpaces, ['other name'])).toBe(nameWithSpaces)
        })

        it('trims whitespace', () => {
            expect(nextUniqueName(` ${name} `, [])).toBe(name)
            expect(nextUniqueName(` ${nameWithSpaces} `, [])).toBe(nameWithSpaces)
        })

        it('is not case sensitive', () => {
            const capitalizedName = name.toUpperCase()
            expect(nextUniqueName(capitalizedName, [name])).toBe(capitalizedName)
            expect(nextUniqueName(name, [capitalizedName])).toBe(name)
        })
    })

    describe('appends " 02" on first duplicate', () => {
        it('works for simple cases', () => {
            expect(nextUniqueName(name, [name])).toBe(`${name} 02`)
            expect(nextUniqueName(nameWithSpaces, [nameWithSpaces])).toBe(`${nameWithSpaces} 02`)
        })

        it('ignores trimmable whitespace', () => {
            expect(nextUniqueName(` ${name} `, [` ${name} `])).toBe(`${name} 02`)
            expect(nextUniqueName(` ${nameWithSpaces} `, [` ${nameWithSpaces} `])).toBe(`${nameWithSpaces} 02`)
        })
    })

    describe('appends " 0n" on subsequent duplicate', () => {
        it('works for 02', () => {
            expect(nextUniqueName(name, [`${name} 02`])).toBe(`${name} 03`)
            expect(nextUniqueName(nameWithSpaces, [`${nameWithSpaces} 02 `])).toBe(`${nameWithSpaces} 03`)
        })

        it('works for 02-09', () => {
            expect(nextUniqueName(name, [`${name} 02`])).toBe(`${name} 03`)
            expect(nextUniqueName(name, [`${name} 03`])).toBe(`${name} 04`)
        })

        it('works for 09-n', () => {
            expect(nextUniqueName(name, [`${name} 09`])).toBe(`${name} 10`)
            expect(nextUniqueName(name, [`${name} 10`])).toBe(`${name} 11`)
            expect(nextUniqueName(name, [`${name} 99`])).toBe(`${name} 100`)
        })

        it('picks largest index found of passed in name and existing names', async () => {
            expect(nextUniqueName(name, [`${name} 02`])).toBe(`${name} 03`)
            expect(nextUniqueName(`${name} 02`, [name])).toBe(`${name} 02`)
            expect(nextUniqueName(`${name} 02`, [`${name} 03`])).toBe(`${name} 04`)
            expect(nextUniqueName(`${name} 03`, [`${name} 02`])).toBe(`${name} 03`)
        })

        it('ignores leading 0', () => {
            expect(nextUniqueName(`${name} 02`, [`${name} 2`])).toBe(`${name} 03`)
            expect(nextUniqueName(`${name} 2`, [`${name} 02`])).toBe(`${name} 03`)
            expect(nextUniqueName(`${name} 2`, [`${name} 2`])).toBe(`${name} 03`)
            expect(nextUniqueName(`${name} 1`, [`${name} 01`])).toBe(`${name} 02`)
            expect(nextUniqueName(name, [`${name} 010`])).toBe(`${name} 11`)
        })

        it('works with bad names', () => {
            expect(nextUniqueName(`${name} 0`, [name])).toBe(`${name} 02`)
            expect(nextUniqueName(`${name} 01`, [name])).toBe(`${name} 02`)
            expect(nextUniqueName(name, [`${name} 0`])).toBe(`${name} 02`)
            expect(nextUniqueName(name, [`${name} 01`])).toBe(`${name} 02`)
            expect(nextUniqueName(name, [`${name} 0`, `${name} 01`])).toBe(`${name} 02`)
        })

        it('ignores trimmable whitespace', () => {
            expect(nextUniqueName(` ${name} `, [` ${name} `])).toBe(`${name} 02`)
            expect(nextUniqueName(` ${nameWithSpaces} `, [` ${nameWithSpaces} `])).toBe(`${nameWithSpaces} 02`)
        })

        it('works with names that already contain digits', async () => {
            expect(nextUniqueName(`${name} 1 Copy`, [`${name} 1 Copy`])).toBe(`${name} 1 Copy 02`)
            expect(nextUniqueName(`${name} Copy`, [`${name} Copy`])).toBe(`${name} Copy 02`)
            expect(nextUniqueName(`${name} Copy 02`, [`${name} Copy`])).toBe(`${name} Copy 02`)
            expect(nextUniqueName(`${name} Copy`, [`${name} Copy 02`])).toBe(`${name} Copy 03`)
            expect(nextUniqueName(`${name} 1 Copy 02`, [`${name} 1 Copy 02`])).toBe(`${name} 1 Copy 03`)
            expect(nextUniqueName(`${name}1`, [`${name}1`])).toBe(`${name}1 02`)
        })
    })
})

describe('nextUniqueCopyName', () => {
    it('appends copy if necessary', () => {
        expect(nextUniqueCopyName(name, [])).toBe(`${name} Copy`)
        expect(nextUniqueCopyName(`${name} Copy`, [])).toBe(`${name} Copy`)
    })

    it('works with names with digits', () => {
        expect(nextUniqueCopyName(`${name} 02`, [])).toBe(`${name} 02 Copy`)
        expect(nextUniqueCopyName(`${name} 02`, [`${name} 02 Copy`])).toBe(`${name} 02 Copy 02`)
        expect(nextUniqueCopyName(`${name} 02 Copy 02`, [`${name} 02 Copy`])).toBe(`${name} 02 Copy 02`)
    })

    it('returns original name if already copy & no dupes', () => {
        expect(nextUniqueCopyName(`${name} Copy 02`, [])).toBe(`${name} Copy 02`)
        expect(nextUniqueCopyName(`${name} Copy 2`, [])).toBe(`${name} Copy 2`)
    })

    it('applies appropriate counter', () => {
        expect(nextUniqueCopyName(name, [`${name} Copy`])).toBe(`${name} Copy 02`)
        expect(nextUniqueCopyName(name, [`${name} Copy`])).toBe(`${name} Copy 02`)
        expect(nextUniqueCopyName(name, [`${name} Copy 2`])).toBe(`${name} Copy 03`)
    })
})
