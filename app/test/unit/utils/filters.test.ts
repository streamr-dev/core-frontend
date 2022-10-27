import * as all from '$userpages/utils/filters'
describe('getParamsForFilter', () => {
    const f = (filter, defaults?: object) => all.getParamsForFilter(filter, defaults)

    describe('order', () => {
        it('is `desc` by out of the box', () => {
            expect(f(undefined, undefined)).toHaveProperty('order', 'desc')
        })
        it('defaults to given default order', () => {
            expect(
                f(undefined, {
                    order: 'FOO',
                }),
            ).toHaveProperty('order', 'FOO')
            expect(
                f(
                    {},
                    {
                        order: 'FOO',
                    },
                ),
            ).toHaveProperty('order', 'FOO')
            expect(
                f(
                    {
                        order: undefined,
                    },
                    {
                        order: 'FOO',
                    },
                ),
            ).toHaveProperty('order', 'FOO')
        })
        it('returns a value from the filter', () => {
            expect(
                f({
                    order: 'FOO',
                }),
            ).toHaveProperty('order', 'FOO')
            expect(
                f(
                    {
                        order: 'FOO',
                    },
                    {
                        order: 'BAR',
                    },
                ),
            ).toHaveProperty('order', 'FOO')
        })
    })
    describe('search', () => {
        it('is empty out of the box', () => {
            expect(f(undefined, undefined).search).toBeUndefined()
        })
        it('defaults to given default search', () => {
            expect(
                f(undefined, {
                    search: 'FOO',
                }),
            ).toHaveProperty('search', 'FOO')
            expect(
                f(
                    {},
                    {
                        search: 'FOO',
                    },
                ),
            ).toHaveProperty('search', 'FOO')
            expect(
                f(
                    {
                        search: undefined,
                    },
                    {
                        search: 'FOO',
                    },
                ),
            ).toHaveProperty('search', 'FOO')
        })
        it('returns a value from the filter', () => {
            expect(
                f({
                    search: 'FOO',
                }),
            ).toHaveProperty('search', 'FOO')
            expect(
                f(
                    {
                        search: 'FOO',
                    },
                    {
                        search: 'BAR',
                    },
                ),
            ).toHaveProperty('search', 'FOO')
        })
    })
    describe('sortBy', () => {
        it('is empty out of the box', () => {
            expect(f(undefined, undefined).sortBy).toBeUndefined()
        })
        it('defaults to given default sortBy', () => {
            expect(
                f(undefined, {
                    sortBy: 'FOO',
                }),
            ).toHaveProperty('sortBy', 'FOO')
            expect(
                f(
                    {},
                    {
                        sortBy: 'FOO',
                    },
                ),
            ).toHaveProperty('sortBy', 'FOO')
            expect(
                f(
                    {
                        sortBy: undefined,
                    },
                    {
                        sortBy: 'FOO',
                    },
                ),
            ).toHaveProperty('sortBy', 'FOO')
        })
        it('returns a value from the filter', () => {
            expect(
                f({
                    sortBy: 'FOO',
                }),
            ).toHaveProperty('sortBy', 'FOO')
            expect(
                f(
                    {
                        sortBy: 'FOO',
                    },
                    {
                        sortBy: 'BAR',
                    },
                ),
            ).toHaveProperty('sortBy', 'FOO')
        })
    })
    describe('[key]', () => {
        it('is skipped if either key or value are blank', () => {
            expect(f(undefined)).toMatchObject({
                order: 'desc',
            })
            expect(f({})).toMatchObject({
                order: 'desc',
            })
            expect(
                f({
                    key: undefined,
                    value: undefined,
                }),
            ).toMatchObject({
                order: 'desc',
            })
            expect(
                f({
                    key: 'FOO',
                    value: undefined,
                }),
            ).toMatchObject({
                order: 'desc',
            })
            expect(
                f({
                    key: undefined,
                    value: 'FOO',
                }),
            ).toMatchObject({
                order: 'desc',
            })
        })
        it('gets included into the filter if both key and value are present', () => {
            expect(
                f({
                    key: 'FOO',
                    value: 'BAR',
                }),
            ).toHaveProperty('FOO', 'BAR')
        })
    })
})
