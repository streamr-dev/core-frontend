import defineRoute from '$app/src/utils/defineRoute'

const r = (pathstr, vars, params) => defineRoute(pathstr, vars)(params)

describe('utils', () => {
    describe('defineRoute', () => {
        it('renders urls correctly', () => {
            expect(r('https://www.streamr.com/')).toEqual('https://www.streamr.com/')
        })

        it('prints the raw path when params are falsy', () => {
            expect(r('/resource/:id')).toEqual('/resource/:id')
            expect(r('/resource/:id?')).toEqual('/resource/:id?')
        })

        it('does not skip constraints if params are falsy', () => {
            expect(r('/resource/:tab(tab1|tab2)', null, null)).toEqual('/resource/:tab(tab1|tab2)')
            expect(r('/resource/:tab(tab1|tab2)/edit', null, null)).toEqual('/resource/:tab(tab1|tab2)/edit')
        })

        it('applies given params', () => {
            expect(r('/resource/:id', null, {
                id: 1,
            })).toEqual('/resource/1')
            expect(r('/resource/:id/whatever/:id', null, {
                id: 1,
            })).toEqual('/resource/1/whatever/1')
            expect(r('/resource/:id(val1|val2)', null, {
                id: 'val1',
            })).toEqual('/resource/val1')
            expect(r('/resource/:id(val1|val2)/whatever/:whateverId(val3|val4)', null, {
                id: 'val2',
                whateverId: 'val4',
            })).toEqual('/resource/val2/whatever/val4')
            expect(r('/resource/:id/:idd', null, {
                id: 1,
                idd: 2,
            })).toEqual('/resource/1/2')
        })

        it('skips unset optional params', () => {
            expect(r('/resource/:id?', null, {})).toEqual('/resource')
        })

        it('throws an error when param values don\'t match format', () => {
            expect(() => {
                r('/resource/:id(a|b)', null, {
                    id: 1,
                })
            }).toThrow(/expected "id" to match/i)
        })

        it('throws an error for missing params', () => {
            expect(() => {
                r('/resource/:id', null, {})
            }).toThrow(/expected "id" to be defined/i)
        })

        it('appends outstanding params as query string', () => {
            expect(r('/resource/:id', null, {
                id: 1,
                param1: 'value1',
                param2: 'value2',
            })).toEqual('/resource/1?param1=value1&param2=value2')
        })

        describe('using variables', () => {
            it('includes vars in the route', () => {
                expect(r('<x>/resource/:id')).toEqual('<x>/resource/:id')
            })

            it('lets you set a variable', () => {
                expect(r('<x>/resource/:id', {
                    x: 'https://domain.com',
                }, {
                    id: 1,
                })).toEqual('https://domain.com/resource/1')
                expect(r('<x>', {
                    x: 'http://domain.com',
                })).toEqual('http://domain.com')
            })

            it('does not merge slashes', () => {
                expect(r('<x>/', {
                    x: 'http://domain.com/',
                })).toEqual('http://domain.com//')
            })
        })
    })
})
