import getConfig from '$app/src/getters/getConfig'
import f from './formatRpc'

jest.mock('$app/src/getters/getConfig', () => ({
    __esModule: true,
    default: jest.fn(),
}))

describe('formatRpc', () => {
    beforeEach(() => {
        getConfig.mockImplementation(() => ({
            client: {
                chainTimeout: 42,
            },
        }))
    })

    it('forwards nullish "RPCs"', () => {
        expect(f(null)).toBe(null)
        expect(f()).toBe(undefined)
        expect(f('')).toBe('')
    })

    it('formats empty RPC info', () => {
        expect(f({})).toMatchObject({
            rpcs: [{
                timeout: 42,
                url: undefined,
            }],
        })
    })

    it('formats urls and timeouts', () => {
        expect(f({
            rpcs: [{
                timeout: 1,
                url: 'url',
            }],
        })).toMatchObject({
            rpcs: [{
                timeout: 1,
                url: 'url',
            }],
        })
    })

    it('forwards custom RPC props', () => {
        expect(f({
            rpcs: [{
                customRpcField: 'value',
            }],
        })).toMatchObject({
            rpcs: [{
                customRpcField: 'value',
                timeout: 42,
                url: undefined,
            }],
        })
    })
})
