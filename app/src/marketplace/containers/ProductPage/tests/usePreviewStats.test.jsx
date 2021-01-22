import React from 'react'
import { act } from 'react-dom/test-utils'
import { mount } from 'enzyme'

import usePreviewStats from '../usePreviewStats'

const initialState = [{
    id: 'revenue',
    unit: 'DATA',
    loading: true,
}, {
    id: 'members',
    loading: true,
}, {
    id: 'averageRevenue',
    unit: 'DATA',
    loading: true,
}, {
    id: 'subscribers',
    loading: true,
}, {
    id: 'revenueShare',
    unit: '%',
    loading: true,
}, {
    id: 'created',
    loading: true,
}]

describe('usePreviewStats', () => {
    const DATE_NOW = 1602151200000
    let dateNowSpy

    beforeAll(() => {
        dateNowSpy = jest.spyOn(Date, 'now').mockImplementation(() => DATE_NOW)
    })

    afterAll(() => {
        dateNowSpy.mockReset()
        dateNowSpy.mockRestore()
    })

    it('returns initial value', () => {
        let result
        function Test() {
            result = usePreviewStats()
            return null
        }
        mount((
            <Test />
        ))

        expect(result).toStrictEqual(initialState)
    })

    it('updates subscriber count', () => {
        let result
        function Test(props) {
            result = usePreviewStats(props)
            return null
        }
        const el = mount((
            <Test />
        ))

        expect(result).toStrictEqual(initialState)

        act(() => {
            el.setProps({
                subscriberCount: 4,
            })
        })

        expect(result).toStrictEqual([{
            id: 'revenue',
            unit: 'DATA',
            loading: true,
        }, {
            id: 'members',
            loading: true,
        }, {
            id: 'averageRevenue',
            unit: 'DATA',
            loading: true,
        }, {
            id: 'subscribers',
            value: 4,
            loading: false,
        }, {
            id: 'revenueShare',
            unit: '%',
            loading: true,
        }, {
            id: 'created',
            loading: true,
        }])
    })

    it('updates revenue share', () => {
        let result
        function Test(props) {
            result = usePreviewStats(props)
            return null
        }
        const el = mount((
            <Test />
        ))

        expect(result).toStrictEqual(initialState)

        act(() => {
            el.setProps({
                adminFee: '0.6',
            })
        })

        expect(result).toStrictEqual([{
            id: 'revenue',
            unit: 'DATA',
            loading: true,
        }, {
            id: 'members',
            loading: true,
        }, {
            id: 'averageRevenue',
            unit: 'DATA',
            loading: true,
        }, {
            id: 'subscribers',
            loading: true,
        }, {
            id: 'revenueShare',
            value: '40',
            unit: '%',
            loading: false,
        }, {
            id: 'created',
            loading: true,
        }])
    })

    it('updates created date', () => {
        let result
        function Test(props) {
            result = usePreviewStats(props)
            return null
        }
        const el = mount((
            <Test />
        ))

        expect(result).toStrictEqual(initialState)

        act(() => {
            el.setProps({
                created: 1580983200000,
            })
        })

        expect(result).toStrictEqual([{
            id: 'revenue',
            unit: 'DATA',
            loading: true,
        }, {
            id: 'members',
            loading: true,
        }, {
            id: 'averageRevenue',
            unit: 'DATA',
            loading: true,
        }, {
            id: 'subscribers',
            loading: true,
        }, {
            id: 'revenueShare',
            unit: '%',
            loading: true,
        }, {
            id: 'created',
            value: '2/6/2020',
            loading: false,
        }])
    })

    it('updates revenue', () => {
        let result
        function Test(props) {
            result = usePreviewStats(props)
            return null
        }
        const el = mount((
            <Test />
        ))

        expect(result).toStrictEqual(initialState)

        act(() => {
            el.setProps({
                totalEarnings: '123456700000000000000',
            })
        })

        expect(result).toStrictEqual([{
            id: 'revenue',
            value: '123',
            unit: 'DATA',
            loading: false,
        }, {
            id: 'members',
            loading: true,
        }, {
            id: 'averageRevenue',
            unit: 'DATA',
            loading: true,
        }, {
            id: 'subscribers',
            loading: true,
        }, {
            id: 'revenueShare',
            unit: '%',
            loading: true,
        }, {
            id: 'created',
            loading: true,
        }])
    })

    it('updates members', () => {
        let result
        function Test(props) {
            result = usePreviewStats(props)
            return null
        }
        const el = mount((
            <Test />
        ))

        expect(result).toStrictEqual(initialState)

        act(() => {
            el.setProps({
                memberCount: {
                    active: 8,
                },
            })
        })

        expect(result).toStrictEqual([{
            id: 'revenue',
            unit: 'DATA',
            loading: true,
        }, {
            id: 'members',
            value: 8,
            loading: false,
        }, {
            id: 'averageRevenue',
            unit: 'DATA',
            loading: true,
        }, {
            id: 'subscribers',
            loading: true,
        }, {
            id: 'revenueShare',
            unit: '%',
            loading: true,
        }, {
            id: 'created',
            loading: true,
        }])
    })

    it('updates average revenue', () => {
        let result
        function Test(props) {
            result = usePreviewStats(props)
            return null
        }
        const el = mount((
            <Test />
        ))

        expect(result).toStrictEqual(initialState)

        act(() => {
            el.setProps({
                totalEarnings: '123456700000000000000',
                created: 1580983200000,
                memberCount: {
                    total: 10,
                    active: 8,
                },
            })
        })

        expect(result).toStrictEqual([{
            id: 'revenue',
            value: '123',
            unit: 'DATA',
            loading: false,
        }, {
            id: 'members',
            value: 8,
            loading: false,
        }, {
            id: 'averageRevenue',
            value: '1.5',
            unit: 'DATA',
            loading: false,
        }, {
            id: 'subscribers',
            loading: true,
        }, {
            id: 'revenueShare',
            unit: '%',
            loading: true,
        }, {
            id: 'created',
            value: '2/6/2020',
            loading: false,
        }])
    })
})
