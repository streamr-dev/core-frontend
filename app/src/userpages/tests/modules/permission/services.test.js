import moxios from 'moxios'

import * as all from '$userpages/modules/permission/services'

describe('services', () => {
    let oldStreamrApiUrl

    beforeEach(() => {
        moxios.install()
        oldStreamrApiUrl = process.env.STREAMR_API_URL
        process.env.STREAMR_API_URL = ''
    })

    afterEach(() => {
        moxios.uninstall()
        process.env.STREAMR_API_URL = oldStreamrApiUrl
    })

    describe('getApiUrl', () => {
        it.each([
            ['STREAM', 'streams'],
            ['PRODUCT', 'products'],
        ])('returns %s permission urls', (resourceType, url) => {
            expect(all.getApiUrl({
                resourceType,
                resourceId: '123',
            })).toStrictEqual(`/${url}/123/permissions`)

            expect(all.getApiUrl({
                resourceType,
                resourceId: '123',
                id: 'me',
            })).toStrictEqual(`/${url}/123/permissions/me`)

            expect(all.getApiUrl({
                resourceType,
                resourceId: '123',
                id: 'abc456',
            })).toStrictEqual(`/${url}/123/permissions/abc456`)
        })

        it('throws an error for unknown type', () => {
            expect(() => {
                all.getApiUrl({
                    resourceType: 'UNKNOWN',
                    resourceId: '123',
                    id: 'me',
                })
            }).toThrow()
        })
    })

    describe('getResourcePermissions', () => {
        it('makes a GET request for stream permissions', async (done) => {
            const id = 'afasdfasdfasgsdfg'
            all.getResourcePermissions({
                resourceType: 'STREAM',
                resourceId: id,
            })
            await moxios.promiseWait()
            const request = moxios.requests.mostRecent()
            expect(request.url).toMatch(`streams/${id}/permissions`)
            expect(request.config.method).toMatch('get')
            done()
            request.respondWith({
                status: 200,
            })
        })

        it('makes a GET request for product permissions', async (done) => {
            const id = 'afasdfasdfasgsdfg'
            all.getResourcePermissions({
                resourceType: 'PRODUCT',
                resourceId: id,
            })
            await moxios.promiseWait()
            const request = moxios.requests.mostRecent()
            expect(request.url).toMatch(`products/${id}/permissions`)
            expect(request.config.method).toMatch('get')
            done()
            request.respondWith({
                status: 200,
            })
        })
    })

    describe('addResourcePermission', () => {
        it('makes a POST request to add stream permission', async (done) => {
            const id = 'afasdfasdfasgsdfg'
            all.addResourcePermission({
                resourceType: 'STREAM',
                resourceId: id,
                data: {
                    test: '1234',
                },
            })
            await moxios.promiseWait()
            const request = moxios.requests.mostRecent()
            expect(request.url).toMatch(`streams/${id}/permissions`)
            expect(request.config.method).toMatch('post')
            expect(request.config.data).toMatch(JSON.stringify({
                test: '1234',
            }))
            done()
            request.respondWith({
                status: 200,
            })
        })

        it('makes a POST request to add product permission', async (done) => {
            const id = 'afasdfasdfasgsdfg'
            all.addResourcePermission({
                resourceType: 'PRODUCT',
                resourceId: id,
                data: {
                    test: '1234',
                },
            })
            await moxios.promiseWait()
            const request = moxios.requests.mostRecent()
            expect(request.url).toMatch(`products/${id}/permissions`)
            expect(request.config.method).toMatch('post')
            expect(request.config.data).toMatch(JSON.stringify({
                test: '1234',
            }))
            done()
            request.respondWith({
                status: 200,
            })
        })
    })

    describe('removeResourcePermission', () => {
        it('makes a DELETE request to remove stream permission', async (done) => {
            const resourceId = 'afasdfasdfasgsdfg'
            const id = '1234'
            all.removeResourcePermission({
                resourceType: 'STREAM',
                resourceId,
                id,
            })
            await moxios.promiseWait()
            const request = moxios.requests.mostRecent()
            expect(request.url).toMatch(`streams/${resourceId}/permissions/${id}`)
            expect(request.config.method).toMatch('delete')
            done()
            request.respondWith({
                status: 200,
            })
        })

        it('makes a DELETE request to remove product permission', async (done) => {
            const resourceId = 'afasdfasdfasgsdfg'
            const id = '1234'
            all.removeResourcePermission({
                resourceType: 'PRODUCT',
                resourceId,
                id,
            })
            await moxios.promiseWait()
            const request = moxios.requests.mostRecent()
            expect(request.url).toMatch(`products/${resourceId}/permissions/${id}`)
            expect(request.config.method).toMatch('delete')
            done()
            request.respondWith({
                status: 200,
            })
        })
    })
})
