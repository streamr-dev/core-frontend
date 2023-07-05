import { truncateNumber } from '~/shared/utils/truncateNumber'

describe('truncateNumber', () => {
    it('should not shorten if the value is below 1000 or 10000', () => {
        expect(truncateNumber(500, 'thousands')).toStrictEqual('500')
        expect(truncateNumber(25000, 'millions')).toStrictEqual('25000')
    })

    it('should shorten from millions', () => {
        expect(truncateNumber(40000000, 'millions')).toStrictEqual('40M')
        expect(truncateNumber(2000000, 'millions')).toStrictEqual('2M')
        expect(truncateNumber(2300000, 'millions')).toStrictEqual('2M')
        expect(truncateNumber(2700000, 'millions')).toStrictEqual('3M')
        expect(truncateNumber(250000, 'millions')).toStrictEqual('250000')
    })

    it('should shorten from thousands', () => {
        expect(truncateNumber(51000000, 'thousands')).toStrictEqual('51M')
        expect(truncateNumber(550000, 'thousands')).toStrictEqual('550K')
        expect(truncateNumber(1200, 'thousands')).toStrictEqual('1K')
    })
})
