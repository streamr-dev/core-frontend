import getConfig from '~/getters/getConfig'
import f from './formatTrackers'
jest.mock('~//getters/getConfig', () => ({
    __esModule: true,
    default: jest.fn(),
}))
describe('formatTrackers', () => {
    beforeEach(() => {
        ;(getConfig as any).mockImplementation(() => ({}))
    })
    it('forwards nullish values', () => {
        expect(f(null)).toBe(null)
        expect(f(undefined)).toBe(undefined)
        expect(f('')).toBe('')
    })
    it('formats a propper array of trackers', () => {
        const res = f([
            {
                httpUrl: 'http://url',
                that: 'this',
                wsUrl: 'ws://url',
            },
        ])
        expect(res).toHaveLength(1)
        expect(res[0]).toMatchObject({
            that: 'this',
            http: 'http://url',
            ws: 'ws://url',
        })
    })
})
