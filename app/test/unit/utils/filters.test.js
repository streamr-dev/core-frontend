import * as all from '$userpages/utils/filters'

describe('getParamsForFilter', () => {
    const f = (...args) => all.getParamsForFilter(...args)

    describe('order', () => {
        it('is `desc` by out of the box', () => {
            expect(f(null, null)).toHaveProperty('order', 'desc')
        })

        it('defaults to given default order', () => {
            expect(f(null, {
                order: 'FOO',
            })).toHaveProperty('order', 'FOO')

            expect(f({}, {
                order: 'FOO',
            })).toHaveProperty('order', 'FOO')

            expect(f({
                order: null,
            }, {
                order: 'FOO',
            })).toHaveProperty('order', 'FOO')
        })

        it('returns a value from the filter', () => {
            expect(f({
                order: 'FOO',
            })).toHaveProperty('order', 'FOO')

            expect(f({
                order: 'FOO',
            }, {
                order: 'BAR',
            })).toHaveProperty('order', 'FOO')
        })
    })

    describe('search', () => {
        it('is null by out of the box', () => {
            expect(f(null, null)).toHaveProperty('search', null)
        })

        it('defaults to given default search', () => {
            expect(f(null, {
                search: 'FOO',
            })).toHaveProperty('search', 'FOO')

            expect(f({}, {
                search: 'FOO',
            })).toHaveProperty('search', 'FOO')

            expect(f({
                search: null,
            }, {
                search: 'FOO',
            })).toHaveProperty('search', 'FOO')
        })

        it('returns a value from the filter', () => {
            expect(f({
                search: 'FOO',
            })).toHaveProperty('search', 'FOO')

            expect(f({
                search: 'FOO',
            }, {
                search: 'BAR',
            })).toHaveProperty('search', 'FOO')
        })
    })

    describe('sortBy', () => {
        it('is null by out of the box', () => {
            expect(f(null, null)).toHaveProperty('sortBy', null)
        })

        it('defaults to given default sortBy', () => {
            expect(f(null, {
                sortBy: 'FOO',
            })).toHaveProperty('sortBy', 'FOO')

            expect(f({}, {
                sortBy: 'FOO',
            })).toHaveProperty('sortBy', 'FOO')

            expect(f({
                sortBy: null,
            }, {
                sortBy: 'FOO',
            })).toHaveProperty('sortBy', 'FOO')
        })

        it('returns a value from the filter', () => {
            expect(f({
                sortBy: 'FOO',
            })).toHaveProperty('sortBy', 'FOO')

            expect(f({
                sortBy: 'FOO',
            }, {
                sortBy: 'BAR',
            })).toHaveProperty('sortBy', 'FOO')
        })
    })

    describe('[key]', () => {
        it('is skipped if either key or value are blank', () => {
            expect(f(null)).toMatchObject({
                order: 'desc',
                search: null,
                sortBy: null,
            })

            expect(f({})).toMatchObject({
                order: 'desc',
                search: null,
                sortBy: null,
            })

            expect(f({
                key: null,
                value: null,
            })).toMatchObject({
                order: 'desc',
                search: null,
                sortBy: null,
            })

            expect(f({
                key: 'FOO',
                value: null,
            })).toMatchObject({
                order: 'desc',
                search: null,
                sortBy: null,
            })

            expect(f({
                key: null,
                value: 'FOO',
            })).toMatchObject({
                order: 'desc',
                search: null,
                sortBy: null,
            })
        })

        it('gets included into the filter if both key and value are present', () => {
            expect(f({
                key: 'FOO',
                value: 'BAR',
            })).toHaveProperty('FOO', 'BAR')
        })
    })
})
