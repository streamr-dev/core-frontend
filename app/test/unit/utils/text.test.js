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
})
