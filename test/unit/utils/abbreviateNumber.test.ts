import { abbreviateNumber } from '~/shared/utils/abbreviateNumber'

describe('abbreviateNumber', () => {
    it('should not shorten if the value is below 1000', () => {
        expect(abbreviateNumber(500)).toStrictEqual('500')
        expect(abbreviateNumber(1000)).toStrictEqual('1k')
        expect(abbreviateNumber(25000)).toStrictEqual('25k')
    })

    it('should round the number even if it is below 1000', () => {
        expect(abbreviateNumber(599.123, 1)).toStrictEqual('599.1')
    })

    it('should shorten from millions', () => {
        expect(abbreviateNumber(40000000)).toStrictEqual('40M')
        expect(abbreviateNumber(2000000)).toStrictEqual('2M')
        expect(abbreviateNumber(2300000)).toStrictEqual('2.3M')
        expect(abbreviateNumber(2700000)).toStrictEqual('2.7M')
    })

    it('should shorten from thousands', () => {
        expect(abbreviateNumber(550000)).toStrictEqual('550k')
        expect(abbreviateNumber(1200)).toStrictEqual('1.2k')
    })

    it('should take fractions into account', () => {
        expect(abbreviateNumber(5539, 1)).toStrictEqual('5.5k')
        expect(abbreviateNumber(5539, 2)).toStrictEqual('5.54k')
        expect(abbreviateNumber(1201, 2)).toStrictEqual('1.2k')
        expect(abbreviateNumber(1249, 2)).toStrictEqual('1.25k')
    })
})
