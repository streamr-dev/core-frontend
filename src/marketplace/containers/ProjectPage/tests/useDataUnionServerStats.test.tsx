import React from 'react'
import { act } from 'react-dom/test-utils'
import { render } from '@testing-library/react'
import * as services from '~/marketplace/modules/dataUnion/services'
import useDataUnionServerStats from '../useDataUnionServerStats'
jest.mock('~/marketplace/modules/dataUnion/services', () => {
    return {
        getDataUnionStats: jest.fn(),
    }
})
jest.useFakeTimers()
describe('useDataUnionServerStats', () => {
    let getDataUnionStatsMock
    beforeEach(() => {
        getDataUnionStatsMock = jest.spyOn(services, 'getDataUnionStats')
        getDataUnionStatsMock.mockResolvedValue({
            totalEarnings: 123,
            memberCount: {
                total: 10,
                active: 5,
            },
        })
        jest.spyOn(console, 'warn').mockImplementation(() => {})
    })
    afterEach(() => {
        ;(services.getDataUnionStats as any).mockRestore()
        jest.clearAllTimers()
    })
    it('returns undefined earnings and member count by default', () => {
        let result

        function Test() {
            result = useDataUnionServerStats()
            return null
        }

        render(<Test />)
        expect(result.totalEarnings).toStrictEqual(undefined)
        expect(result.memberCount).toStrictEqual(undefined)
    })
    it('throws an error if startPolling is called without id', () => {
        let result

        function Test() {
            result = useDataUnionServerStats()
            return null
        }

        render(<Test />)
        expect(result.startPolling()).rejects.toThrow()
    })
    it('returns stats', async () => {
        let result

        function Test() {
            result = useDataUnionServerStats()
            return null
        }

        render(<Test />)
        await act(async () => {
            await result.startPolling('0x123', 8995)
        })
        expect(getDataUnionStatsMock).toBeCalledWith('0x123', 8995)
        expect(result.totalEarnings).toStrictEqual(123)
        expect(result.memberCount).toStrictEqual({
            total: 10,
            active: 5,
        })
    })
    it('throws an error if stats fetching fails with something other than 404 error', async () => {
        let result

        function Test() {
            result = useDataUnionServerStats()
            return null
        }

        render(<Test />)
        getDataUnionStatsMock = jest.fn(async () => {
            throw new Error('something happened')
        })
        ;(services.getDataUnionStats as any).mockImplementation(getDataUnionStatsMock)
        await act(async () => {
            try {
                await result.startPolling('0x123', 8995)
            } catch (e) {
                expect(e.message).toStrictEqual('something happened')
            }
        })
        expect(getDataUnionStatsMock).toBeCalledWith('0x123', 8995)
    })
    it('retries fetching if stats fetching fails with 404 error', async () => {
        let result

        function Test() {
            result = useDataUnionServerStats()
            return null
        }

        render(<Test />)
        getDataUnionStatsMock = jest.fn(async () => {
            const responseError = new Error('something happened')
            ;(responseError as any).statusCode = 404
            throw responseError
        })
        ;(services.getDataUnionStats as any).mockImplementation(getDataUnionStatsMock)
        await act(async () => {
            await result.startPolling('0x123', 8995)
        })
        jest.runAllTimers()
        expect(getDataUnionStatsMock).toBeCalledWith('0x123', 8995)
        expect(getDataUnionStatsMock).toHaveBeenCalledTimes(2)
    })
})
