import * as all from '$userpages/modules/permission/services'

describe('services', () => {
    let oldStreamrApiUrl

    beforeEach(() => {
        oldStreamrApiUrl = process.env.STREAMR_API_URL
        process.env.STREAMR_API_URL = ''
    })

    afterEach(() => {
        process.env.STREAMR_API_URL = oldStreamrApiUrl
    })

    describe('getApiUrl', () => {
        it.each([
            ['DASHBOARD', 'dashboards'],
            ['STREAM', 'streams'],
            ['CANVAS', 'canvases'],
            ['PRODUCT', 'products'],
        ])('returns %s permission urls', (type, url) => {
            expect(all.getApiUrl({
                type,
                resourceId: '123',
            })).toStrictEqual(`/${url}/123/permissions`)

            expect(all.getApiUrl({
                type,
                resourceId: '123',
                id: 'me',
            })).toStrictEqual(`/${url}/123/permissions/me`)

            expect(all.getApiUrl({
                type,
                resourceId: '123',
                id: 'abc456',
            })).toStrictEqual(`/${url}/123/permissions/abc456`)
        })

        it('throws an error for unknown type', () => {
            expect(() => {
                all.getApiUrl({
                    type: 'UNKNOWN',
                    resourceId: '123',
                    id: 'me',
                })
            }).toThrow()
        })
    })
})
