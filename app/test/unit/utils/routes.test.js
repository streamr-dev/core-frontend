import { define, buildRoutes } from '$routes'

describe('route utils', () => {
    describe('buildRoutes', () => {
        const routes = buildRoutes({
            resource: '/resource/:id',
            external: 'https://domain.com/route/:id',
        }, () => ({}))

        it('generates a local route', () => {
            expect(routes.resource()).toEqual('/resource/:id')
            expect(routes.resource({
                id: 13,
            })).toEqual('/resource/13')
        })

        it('generates an external route', () => {
            expect(routes.external()).toEqual('https://domain.com/route/:id')
            expect(routes.external({
                id: 13,
            })).toEqual('https://domain.com/route/13')
        })
    })

    describe('defile', () => {
        const r = (pathstr, params) => define(pathstr, () => ({
            url: 'url',
        }))(params)

        it('renders urls correctly', () => {
            expect(r('https://www.streamr.network/')).toEqual('https://www.streamr.network/')
        })

        it('prints the raw path when params are falsy', () => {
            expect(r('/resource/:id')).toEqual('/resource/:id')
            expect(r('/resource/:id?')).toEqual('/resource/:id?')
        })

        it('does not skip constraints if params are falsy', () => {
            expect(r('/resource/:tab(tab1|tab2)', null)).toEqual('/resource/:tab(tab1|tab2)')
            expect(r('/resource/:tab(tab1|tab2)/edit', null)).toEqual('/resource/:tab(tab1|tab2)/edit')
        })

        it('applies given params', () => {
            expect(r('/resource/:id', {
                id: 1,
            })).toEqual('/resource/1')
            expect(r('/resource/:id/whatever/:id', {
                id: 1,
            })).toEqual('/resource/1/whatever/1')
            expect(r('/resource/:id(val1|val2)', {
                id: 'val1',
            })).toEqual('/resource/val1')
            expect(r('/resource/:id(val1|val2)/whatever/:whateverId(val3|val4)', {
                id: 'val2',
                whateverId: 'val4',
            })).toEqual('/resource/val2/whatever/val4')
            expect(r('/resource/:id/:idd', {
                id: 1,
                idd: 2,
            })).toEqual('/resource/1/2')
        })

        it('skips unset optional params', () => {
            expect(r('/resource/:id?', {})).toEqual('/resource')
        })

        it('throws an error when param values don\'t match format', () => {
            expect(() => {
                r('/resource/:id(a|b)', {
                    id: 1,
                })
            }).toThrow(/expected "id" to match/i)
        })

        it('throws an error for missing params', () => {
            expect(() => {
                r('/resource/:id', {})
            }).toThrow(/expected "id" to be defined/i)
        })

        it('appends outstanding params as query string', () => {
            expect(r('/resource/:id', {
                id: 1,
                param1: 'value1',
                param2: 'value2',
            })).toEqual('/resource/1?param1=value1&param2=value2')
        })

        describe('variables', () => {
            it('replaces all variables with given values', () => {
                expect(r('<url>/resource/:id', {
                    id: 1,
                })).toEqual('url/resource/1')
            })

            it('explodes when a variable is missing', () => {
                expect(() => r('<unknown>')).toThrow(/expected "unknown" variable\(s\) to be defined/i)
                expect(() => r('<var1>/<var2>/resource/:id', {
                    id: 1,
                })).toThrow(/expected "var1", "var2" variable\(s\) to be defined/i)
            })
        })
    })
})
