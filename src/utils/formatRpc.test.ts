import getConfig from '~/getters/getConfig'
import f from './formatRpc'
jest.mock('~//getters/getConfig', () => ({
    __esModule: true,
    default: jest.fn(),
}))
describe('formatRpc', () => {
    beforeEach(() => {
        ;(getConfig as any).mockImplementation(() => ({
            client: {
                chainTimeout: 42,
            },
        }))
    })
    it('forwards nullish "RPCs"', () => {
        expect(f(null)).toBe(null)
        expect(f(undefined)).toBe(undefined)
        expect(f('')).toBe('')
    })
    it('formats empty RPC info', () => {
        expect(
            f({
                rpcs: [{}],
            }),
        ).toMatchObject({
            rpcs: [
                {
                    timeout: 42,
                    url: undefined,
                },
            ],
        })
    })
    it('formats urls and timeouts', () => {
        expect(
            f({
                rpcs: [
                    {
                        timeout: 1,
                        url: 'url',
                    },
                ],
            }),
        ).toMatchObject({
            rpcs: [
                {
                    timeout: 1,
                    url: 'url',
                },
            ],
        })
    })
    it('forwards custom RPC props', () => {
        expect(
            f({
                customRpcField: 'value',
                rpcs: [],
            }),
        ).toMatchObject({
            customRpcField: 'value',
            rpcs: [],
        })
    })
})
