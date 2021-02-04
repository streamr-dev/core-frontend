import React from 'react'
import { mount } from 'enzyme'

import useDataUnionStats from '../useDataUnionStats'

describe('useDataUnionStats', () => {
    let dateNowSpy
    const DATE_NOW = 1609243200000 // 2020-12-29T12:00:00.000Z

    beforeAll(() => {
        dateNowSpy = jest.spyOn(Date, 'now').mockImplementation(() => DATE_NOW)
    })

    afterAll(() => {
        dateNowSpy.mockReset()
        dateNowSpy.mockRestore()
    })

    it('returns all stats as loading by default', () => {
        let stats

        function Test() {
            stats = useDataUnionStats()

            return null
        }

        mount(<Test />)

        expect(stats).toStrictEqual([{
            id: 'revenue',
            loading: true,
            unit: 'DATA',
        }, {
            id: 'members',
            loading: true,
        }, {
            id: 'averageRevenue',
            loading: true,
            unit: 'DATA',
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

    it('updates total earnings', () => {
        let stats

        function Test() {
            stats = useDataUnionStats({
                totalEarnings: 123000000000000000000,
            })

            return null
        }

        mount(<Test />)

        expect(stats).toStrictEqual([{
            id: 'revenue',
            loading: false,
            unit: 'DATA',
            value: '123',
        }, {
            id: 'members',
            loading: true,
        }, {
            id: 'averageRevenue',
            loading: true,
            unit: 'DATA',
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

    it('updates subscriber count', () => {
        let stats

        function Test() {
            stats = useDataUnionStats({
                subscriberCount: 15,
            })

            return null
        }

        mount(<Test />)

        expect(stats).toStrictEqual([{
            id: 'revenue',
            loading: true,
            unit: 'DATA',
        }, {
            id: 'members',
            loading: true,
        }, {
            id: 'averageRevenue',
            loading: true,
            unit: 'DATA',
        }, {
            id: 'subscribers',
            loading: false,
            value: 15,
        }, {
            id: 'revenueShare',
            unit: '%',
            loading: true,
        }, {
            id: 'created',
            loading: true,
        }])
    })

    it('updates subscriber count', () => {
        let stats

        function Test() {
            stats = useDataUnionStats({
                subscriberCount: 15,
            })

            return null
        }

        mount(<Test />)

        expect(stats).toStrictEqual([{
            id: 'revenue',
            loading: true,
            unit: 'DATA',
        }, {
            id: 'members',
            loading: true,
        }, {
            id: 'averageRevenue',
            loading: true,
            unit: 'DATA',
        }, {
            id: 'subscribers',
            loading: false,
            value: 15,
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
        let stats

        function Test() {
            stats = useDataUnionStats({
                adminFee: '0.4',
            })

            return null
        }

        mount(<Test />)

        expect(stats).toStrictEqual([{
            id: 'revenue',
            loading: true,
            unit: 'DATA',
        }, {
            id: 'members',
            loading: true,
        }, {
            id: 'averageRevenue',
            loading: true,
            unit: 'DATA',
        }, {
            id: 'subscribers',
            loading: true,
        }, {
            id: 'revenueShare',
            unit: '%',
            loading: false,
            value: '60',
        }, {
            id: 'created',
            loading: true,
        }])
    })

    it('updates created date', () => {
        let stats

        function Test() {
            stats = useDataUnionStats({
                created: '2020-12-29T12:00:00.000Z',
            })

            return null
        }

        mount(<Test />)

        expect(stats).toStrictEqual([{
            id: 'revenue',
            loading: true,
            unit: 'DATA',
        }, {
            id: 'members',
            loading: true,
        }, {
            id: 'averageRevenue',
            loading: true,
            unit: 'DATA',
        }, {
            id: 'subscribers',
            loading: true,
        }, {
            id: 'revenueShare',
            unit: '%',
            loading: true,
        }, {
            id: 'created',
            loading: false,
            value: new Date('12/29/2020').toLocaleDateString(),
        }])
    })

    it('updates members count', () => {
        let stats

        const props = {
            memberCount: {
                total: 10,
                active: 5,
            },
        }
        function Test() {
            stats = useDataUnionStats(props)

            return null
        }

        mount(<Test />)

        expect(stats).toStrictEqual([{
            id: 'revenue',
            loading: true,
            unit: 'DATA',
        }, {
            id: 'members',
            loading: false,
            value: 5,
        }, {
            id: 'averageRevenue',
            loading: true,
            unit: 'DATA',
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
        let stats

        const props = {
            totalEarnings: 100000000000000000000,
            created: '2019-12-29T12:00:00.000Z',
            memberCount: {
                total: 10,
                active: 5,
            },
        }
        function Test() {
            stats = useDataUnionStats(props)

            return null
        }

        mount(<Test />)

        expect(stats).toStrictEqual([{
            id: 'revenue',
            loading: false,
            unit: 'DATA',
            value: '100',
        }, {
            id: 'members',
            loading: false,
            value: 5,
        }, {
            id: 'averageRevenue',
            loading: false,
            unit: 'DATA',
            value: '0.8',
        }, {
            id: 'subscribers',
            loading: true,
        }, {
            id: 'revenueShare',
            unit: '%',
            loading: true,
        }, {
            id: 'created',
            loading: false,
            value: new Date('12/29/2019').toLocaleDateString(),
        }])
    })
})
