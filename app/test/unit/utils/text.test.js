import * as all from '$shared/utils/text'

describe('text utils', () => {
    describe('truncate', () => {
        it('does not truncate short string', () => {
            const str = 'short'
            expect(all.truncate(str)).toBe(str)
        })

        it('truncates long string', () => {
            const str = 'really long string that should truncate'
            const match = /.+\.\.\..+$/
            expect(match.test(all.truncate(str))).toBe(true)
        })

        it('allows changing minimum length', () => {
            const str = 'really long string that should truncate'
            expect(all.truncate(str, {
                minLength: 50,
            })).toBe(str)
        })

        it('allows changing maximum length', () => {
            const str = 'really long string that should truncate'
            expect(all.truncate(str, {
                maxLength: 15,
            })).toBe('really...uncate')
        })

        it('truncates to minimum length', () => {
            const str = 'short'
            expect(all.truncate(str, {
                minLength: 5,
            })).toBe('s...t')
        })

        it('allows changing the separator', () => {
            const str = 'really long string that should truncate'
            const match = /.+\[separator\].+$/
            expect(match.test(all.truncate(str, {
                separator: '[separator]',
            }))).toBe(true)
        })
    })

    describe('numberToText', () => {
        it('returns negative number untranslated', () => {
            expect(all.numberToText(-12)).toBe('-12')
        })

        it('translates round numbers', () => {
            expect(all.numberToText(0)).toBe('zero')
            expect(all.numberToText(1)).toBe('one')
            expect(all.numberToText(2)).toBe('two')
            expect(all.numberToText(3)).toBe('three')
            expect(all.numberToText(4)).toBe('four')
            expect(all.numberToText(5)).toBe('five')
            expect(all.numberToText(6)).toBe('six')
            expect(all.numberToText(7)).toBe('seven')
            expect(all.numberToText(8)).toBe('eight')
            expect(all.numberToText(9)).toBe('nine')
            expect(all.numberToText(10)).toBe('ten')
            expect(all.numberToText(100)).toBe('hundred')
            expect(all.numberToText(1000)).toBe('thousand')
            expect(all.numberToText(10000)).toBe('tenThousand')
            expect(all.numberToText(100000)).toBe('hundredThousand')
            expect(all.numberToText(1000000)).toBe('million')
        })

        it('doesnt translate specific numbers', () => {
            expect(all.numberToText(12)).toBe('12')
            expect(all.numberToText(111)).toBe('111')
            expect(all.numberToText(1012)).toBe('1012')
            expect(all.numberToText(65231)).toBe('65231')
        })
    })
})
