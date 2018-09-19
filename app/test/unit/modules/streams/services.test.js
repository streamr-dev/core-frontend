import assert from 'assert-diff'
import moxios from 'moxios'

import * as services from '../../../../src/marketplace/modules/streams/services'

describe('streams - services', () => {
    beforeEach(() => {
        moxios.install()
    })

    afterEach(() => {
        moxios.uninstall()
    })

    it('gets product streams', async () => {
        process.env.STREAMR_API_URL = 'TEST_STREAMR_API_URL'
        const data = [
            {
                id: 'run-canvas-spec',
                partitions: 1,
                name: 'run-canvas-spec',
                feed: {
                    id: 7,
                    name: 'API',
                    module: 147,
                },
                config: {
                    fields: [
                        {
                            name: 'numero',
                            type: 'number',
                        },
                        {
                            name: 'areWeDoneYet',
                            type: 'boolean',
                        },
                    ],
                },
                description: 'Stream for integration test RunCanvasSpec',
                uiChannel: false,
                dateCreated: '2017-11-10T16:43:01Z',
                lastUpdated: '2017-11-10T16:43:01Z',
            },
        ]

        moxios.wait(() => {
            const request = moxios.requests.mostRecent()
            request.respondWith({
                status: 200,
                response: data,
            })

            assert.equal(request.config.method, 'get')
            assert.equal(request.config.url, `${process.env.STREAMR_API_URL}/streams?operation=SHARE&uiChannel=false`)
        })

        const result = await services.getStreams()
        assert.deepStrictEqual(result, data)
    })
})
