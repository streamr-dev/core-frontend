import defineRoute from '$app/src/utils/defineRoute'

describe('utils', () => {
    describe('defineRoute', () => {
        it('squashes slashes', () => {
            expect(defineRoute('///')()).toEqual('/')
            expect(defineRoute('https://www.streamr.com/')()).toEqual('https://www.streamr.com/')
        })

        it('prints the raw path when params are falsy', () => {
            expect(defineRoute('/resource/:id')()).toEqual('/resource/:id')
        })

        it('does not skip constraints if params are falsy', () => {
            expect(defineRoute('/resource/:tab(tab1|tab2)')()).toEqual('/resource/:tab(tab1|tab2)')
            expect(defineRoute('/resource/:tab(tab1|tab2)/edit')()).toEqual('/resource/:tab(tab1|tab2)/edit')
        })

        it('applies given params', () => {
            expect(defineRoute('/resource/:id')({
                id: 1,
            })).toEqual('/resource/1')
            expect(defineRoute('/resource/:id/whatever/:id')({
                id: 1,
            })).toEqual('/resource/1/whatever/1')
        })

        it('skips constraints', () => {
            expect(defineRoute('/resource/:id(val1|val2)')({
                id: 1,
            })).toEqual('/resource/1')
            expect(defineRoute('/resource/:id(val1|val2)/whatever/:whateverId(val3|val4)')({
                id: 1,
                whateverId: 2,
            })).toEqual('/resource/1/whatever/2')
        })

        it('matches params correctly', () => {
            expect(defineRoute('/resource/:id/:idd')({
                id: 1,
                idd: 2,
            })).toEqual('/resource/1/2')
        })

        it('throws an error for missing params', () => {
            expect(() => {
                defineRoute('/resource/:id')({})
            }).toThrow(/missing params in "\/resource\/:id"/i)
        })

        it('appends outstanding params as query string', () => {
            expect(defineRoute('/resource/:id')({
                id: 1,
                param1: 'value1',
                param2: 'value2',
            })).toEqual('/resource/1?param1=value1&param2=value2')
        })

        it('includes prefix in the route', () => {
            expect(defineRoute('/resource/:id', '/api/v1')()).toEqual('/api/v1/resource/:id')
            expect(defineRoute('/resource/:id', '/api/:version')()).toEqual('/api/:version/resource/:id')
        })

        it('lets you set params for both route and prefix', () => {
            expect(defineRoute('/resource/:id', '/api/:apiVersion')({
                id: 1,
                apiVersion: 'v1',
            })).toEqual('/api/v1/resource/1')
        })

        it('applies given default params', () => {
            expect(defineRoute('/resource/:id', '/api/:apiVersion', {
                apiVersion: 'v1'
            })({
                id: 1,
            })).toEqual('/api/v1/resource/1')
        })

        it('allows to override default params', () => {
            expect(defineRoute('/resource', '/api/:apiVersion', {
                apiVersion: 'v1',
            })({
                apiVersion: 'v1337',
            })).toEqual('/api/v1337/resource')
        })

        it('keeps default params out of the query string', () => {
            expect(defineRoute('/resource', null, {
                param: 'value',
            })({
                otherParam: 'otherValue',
            })).toEqual('/resource?otherParam=otherValue')
        })
    })
})
