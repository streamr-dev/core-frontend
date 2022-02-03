import getConfig from '$app/src/getters/getConfig'
import f from './formatTrackers'

jest.mock('$app/src/getters/getConfig', () => ({
    __esModule: true,
    default: jest.fn(),
}))

describe('formatTrackers', () => {
    beforeEach(() => {
        getConfig.mockImplementation(() => ({}))
    })

    it('forwards nullish values', () => {
        expect(f(null)).toBe(null)
        expect(f()).toBe(undefined)
        expect(f('')).toBe('')
    })

    it('formats a propper array of trackers', () => {
        const res = f([{
            httpUrl: 'http://url',
            that: 'this',
            wsUrl: 'ws://url',
        }])

        expect(res).toHaveLength(1)

        expect(res[0]).toMatchObject({
            that: 'this',
            http: 'http://url',
            ws: 'ws://url',
        })
    })
})
