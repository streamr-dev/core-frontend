import { define, buildRoutes } from '$routes'

describe('route utils', () => {
    describe('buildRoutes', () => {
        const routes = buildRoutes({
            resource: '/resource/:id',
            external: 'https://domain.com/route/:id',
            site: '<site>/api/resource/:id',
            slashed: '<slashed>/api/resource/:id',
            namespace: {
                resource: '/ns/resource/:id',
                external: 'https://domain.com/ns/route/:id',
                site: '<site>/ns/api/resource/:id',
                slashed: '<slashed>/ns/api/resource/:id',
                deep: {
                    deep: {
                        deep: {
                            resource: '/deep/resource/:id',
                        },
                    },
                },
            },
            customRegex: '/resource/:id(.*)',
        }, () => ({
            site: 'https://streamr.network',
            slashed: 'https://streamr.network/',
        }))

        it('generates a local route', () => {
            expect(routes.resource()).toEqual('/resource/:id')
            expect(routes.resource({
                id: 13,
            })).toEqual('/resource/13')
        })

        it('generates a local namespaced route', () => {
            expect(routes.namespace.resource()).toEqual('/ns/resource/:id')
            expect(routes.namespace.resource({
                id: 13,
            })).toEqual('/ns/resource/13')
        })

        it('generates an external route', () => {
            expect(routes.external()).toEqual('https://domain.com/route/:id')
            expect(routes.external({
                id: 13,
            })).toEqual('https://domain.com/route/13')
        })

        it('generates an external namespaced route', () => {
            expect(routes.namespace.external()).toEqual('https://domain.com/ns/route/:id')
            expect(routes.namespace.external({
                id: 13,
            })).toEqual('https://domain.com/ns/route/13')
        })

        it('generates a deeply namespaced route', () => {
            expect(routes.namespace.deep.deep.deep.resource()).toEqual('/deep/resource/:id')
            expect(routes.namespace.deep.deep.deep.resource({
                id: 13,
            })).toEqual('/deep/resource/13')
        })

        it('generates a route using variabled', () => {
            expect(routes.site()).toEqual('https://streamr.network/api/resource/:id')
            expect(routes.site({
                id: 13,
            })).toEqual('https://streamr.network/api/resource/13')
        })

        it('generates a route using variabled (slash-squish)', () => {
            expect(routes.slashed()).toEqual('https://streamr.network/api/resource/:id')
            expect(routes.slashed({
                id: 13,
            })).toEqual('https://streamr.network/api/resource/13')
        })

        it('generates a namespaced route using variabled', () => {
            expect(routes.namespace.site()).toEqual('https://streamr.network/ns/api/resource/:id')
            expect(routes.namespace.site({
                id: 13,
            })).toEqual('https://streamr.network/ns/api/resource/13')
        })

        it('generates a namespaced route using variabled (slash-squish)', () => {
            expect(routes.namespace.slashed()).toEqual('https://streamr.network/ns/api/resource/:id')
            expect(routes.namespace.slashed({
                id: 13,
            })).toEqual('https://streamr.network/ns/api/resource/13')
        })

        it('customRegex', () => {
            expect(routes.customRegex()).toEqual('/resource/:id(.*)')
            expect(routes.customRegex({
                id: 'plaa/hessu/1',
            }, undefined, false)).toEqual('/resource/plaa/hessu/1')
        })
    })

    describe('define', () => {
        const r = (pathstr, ...args) => define(pathstr, () => ({
            url: 'url',
        }))(...args)

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
            }).toThrow(/expected "id" to be a string/i)
        })

        it('appends outstanding params as query string', () => {
            expect(r('/resource/:id', {
                id: 1,
                param1: 'value1',
                param2: 'value2',
            })).toEqual('/resource/1?param1=value1&param2=value2')
        })

        it('encodes params by default', () => {
            expect(r('/resource/:path', {
                path: 'sandbox/path/resource',
                id: 'test/1',
            })).toEqual('/resource/sandbox%2Fpath%2Fresource?id=test%2F1')
        })

        it('does not encode route params if encode = false', () => {
            expect(r('/resource/:path', {
                path: 'sandbox/path/resource',
            }, undefined, false)).toEqual('/resource/sandbox/path/resource')
        })

        it('does not encode query string even if encode = false', () => {
            expect(r('/resource/:path', {
                path: 'sandbox/path/resource',
                id: 'test/1',
            }, undefined, false)).toEqual('/resource/sandbox/path/resource?id=test%2F1')
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
