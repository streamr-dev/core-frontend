import moxios from 'moxios'

import * as services from '$mp/modules/streams/services'

describe('streams - services', () => {
    beforeEach(() => {
        moxios.install()
    })

    afterEach(() => {
        moxios.uninstall()
    })

    it('gets list streams', async () => {
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

        const client = {
            listStreams: () => Promise.resolve(data),
        }

        const result = await services.getStreams(client)
        expect(result.streams).toStrictEqual(data)
        expect(result.hasMoreResults).toBe(false)
    })

    it('allows to override default parameters', async () => {
        const client = {
            listStreams: jest.fn(() => Promise.resolve([])),
        }

        await services.getStreams(client, {
            operation: 'test',
            uiChannel: true,
        })

        expect(client.listStreams).toBeCalledWith({
            operation: 'test',
            uiChannel: true,
        })
    })

    it('returns paged results', async () => {
        /* eslint-disable object-curly-newline */
        const data = [
            { id: '1' },
            { id: '2' },
            { id: '3' },
            { id: '4' },
            { id: '5' },
            { id: '6' },
            { id: '7' },
            { id: '8' },
            { id: '9' },
            { id: '10' },
        ]
        /* eslint-enable object-curly-newline */

        const client = {
            listStreams: () => Promise.resolve([...data.slice(0, 6)]),
        }

        const result = await services.getStreams(client, {
            offset: 0,
            max: 5,
        })
        expect(result.streams).toStrictEqual(data.slice(0, 5))
        expect(result.hasMoreResults).toBe(true)
    })

    it('returns false when no more results available', async () => {
        process.env.STREAMR_API_URL = 'TEST_STREAMR_API_URL'
        /* eslint-disable object-curly-newline */
        const data = [
            { id: '1' },
            { id: '2' },
            { id: '3' },
            { id: '4' },
            { id: '5' },
            { id: '6' },
            { id: '7' },
            { id: '8' },
            { id: '9' },
            { id: '10' },
        ]
        /* eslint-enable object-curly-newline */

        const client = {
            listStreams: () => Promise.resolve([...data.slice(5, 10)]),
        }

        const result = await services.getStreams(client, {
            offset: 5,
            max: 5,
        })
        expect(result.streams).toStrictEqual(data.slice(5, 10))
        expect(result.hasMoreResults).toBe(false)
    })

    it('returns all streams from paged results', async () => {
        process.env.STREAMR_API_URL = 'TEST_STREAMR_API_URL'
        const allStreams = Array.from({
            length: 1500,
        }, (v, i) => ({
            id: `stream-${i + 1}`,
        }))

        const client = {
            listStreams: jest.fn()
                .mockImplementationOnce(() => Promise.resolve(allStreams.slice(0, 1000)))
                .mockImplementationOnce(() => Promise.resolve(allStreams.slice(999))),
        }

        const result = await services.getAllStreams(client)
        expect(result).toStrictEqual(allStreams)
        expect(client.listStreams.mock.calls.length).toBe(2)
        expect(client.listStreams.mock.calls[0][0]).toStrictEqual({
            max: 1000,
            offset: 0,
            operation: 'STREAM_SHARE',
            uiChannel: false,
        })
        expect(client.listStreams.mock.calls[1][0]).toStrictEqual({
            max: 1000,
            offset: 999,
            operation: 'STREAM_SHARE',
            uiChannel: false,
        })
    })
})
