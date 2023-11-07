import * as utils from '.'
import { BNish } from './bn'

describe('abbr', () => {
    it('abbreviates any big numberish value', () => {
        function abbr(value: BNish) {
            return utils.abbr(value, { fractionalLength: 3 })
        }

        expect(abbr('0')).toEqual('0')

        expect(abbr('0.10')).toEqual('0.1')

        expect(abbr('1.2345678910111213')).toEqual('1.234')

        expect(abbr('12.345678910111213')).toEqual('12.345')

        expect(abbr('123.45678910111213')).toEqual('123.456')

        expect(abbr('1234.5678910111213')).toEqual('1.234k')

        expect(abbr('12345.678910111213')).toEqual('12.345k')

        expect(abbr('123456.78910111213')).toEqual('123.456k')

        expect(abbr('1234567.8910111213')).toEqual('1.234M')

        expect(abbr('12345678.910111213')).toEqual('12.345M')

        expect(abbr('123456789.10111213')).toEqual('123.456M')

        expect(abbr('1234567891.0111213')).toEqual('1.234G')

        expect(abbr('12345678910.111213')).toEqual('12.345G')

        expect(abbr('123456789101.11213')).toEqual('123.456G')

        expect(abbr('1234567891011.1213')).toEqual('1.234T')

        expect(abbr('12345678910111.213')).toEqual('12.345T')

        expect(abbr('123456789101112.13')).toEqual('123.456T')

        expect(abbr('1234567891011121.3')).toEqual('1.234P')

        expect(abbr('1234567891011121.3141516')).toEqual('1.234P')

        expect(abbr('12345678910111213.141516')).toEqual('12.345P')

        expect(abbr('123456789101112131.41516')).toEqual('123.456P')

        expect(abbr('1234567891011121314.1516')).toEqual('1234.567P')
    })

    it('does not strip fractional zeros if told not to', () => {
        expect(utils.abbr('1000', { stripFractionalZeros: false })).toEqual('1.00k')

        expect(utils.abbr('0.10', { stripFractionalZeros: false })).toEqual('0.10')
    })

    it('formats veeery small amounts, too', () => {
        expect(utils.abbr('0.000000000000000001', { fractionalLength: 18 })).toEqual(
            '0.000000000000000001',
        )
    })

    it('supports negative values', () => {
        expect(utils.abbr('-1000')).toEqual('-1k')

        expect(utils.abbr('-1234')).toEqual('-1.23k')

        expect(utils.abbr('-1234567891011121314.1516')).toEqual('-1234.56P')
    })

    it('handles weird values', () => {
        expect(() => utils.abbr(NaN)).toThrowError(/invalid value/i)

        expect(() => utils.abbr('')).toThrowError(/invalid value/i)
    })

    it('handles different `fractionalLength` correctly', () => {
        expect(utils.abbr(1111, { fractionalLength: 0 })).toEqual('1k')

        expect(utils.abbr(1111, { fractionalLength: 1 })).toEqual('1.1k')

        expect(utils.abbr(1111, { fractionalLength: -999 })).toEqual('1k')
    })
})
