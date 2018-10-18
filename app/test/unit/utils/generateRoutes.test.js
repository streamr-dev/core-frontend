import generateRoutes from '$app/src/utils/generateRoutes'

describe('generateRoutes util', () => {
    describe('generated routes instance', () => {
        const routes = generateRoutes({
            resource: '/resource/:id',
            external: '<url>/route/:id',
        }, {
            url: 'https://domain.com',
        })

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
})
