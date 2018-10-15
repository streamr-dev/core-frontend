import generateRoutes from '$app/src/utils/generateRoutes'

describe('generateRoutes util', () => {
    describe('generated routes instance', () => {
        const routes = generateRoutes({
            resource: '/resource/:id',
        })

        it('acts as an object where values are functions', () => {
            expect(routes.resource()).toEqual('/resource/:id')
            expect(routes.resource({
                id: 1,
            })).toEqual('/resource/1')
        })

        it('acts as a function of prefix and defaultParams', () => {
            expect(routes('/api/:apiVersion/', {}).resource()).toEqual('/api/:apiVersion/resource/:id')
            expect(routes('/api/:apiVersion', {
                apiVersion: 'v1',
            }).resource({
                id: 1,
            })).toEqual('/api/v1/resource/1')
        })

        it('jeez, it can do a whole lot more!', () => {
            expect(routes('/prefix0')('/prefix1')('/prefix2').void()).toEqual('/prefix0/prefix1/prefix2')
            expect(routes('/api/:v')('', {
                v: 'v1337',
            })('/resource')('/:id').void({
                id: '1403',
            })).toEqual('/api/v1337/resource/1403')
            expect('Beautiful!').toMatch(/beautiful/i)
        })

        it('comes with a root path set to "/"', () => {
            expect(routes.root()).toEqual('/')
        })

        it('comes with a void path set to an empty string', () => {
            expect(routes.void()).toEqual('')
        })

        it('generates a proper external link', () => {
            expect(routes('', {
                url: 'https://domain.com/',
            })(':url').resource({
                id: '1',
            })).toEqual('https://domain.com/resource/1')
        })
    })
})
