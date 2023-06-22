import { numberShortener } from '$shared/utils/numberShortener'

describe('numberShortener', () => {
    it('should not shorten if the value is below 1000 or 10000', () => {
        expect(numberShortener(500, 'thousands')).toStrictEqual('500')
        expect(numberShortener(25000, 'millions')).toStrictEqual('25000')
    })

    it('should shorten from millions', () => {
        expect(numberShortener(40000000, 'millions')).toStrictEqual('40M')
        expect(numberShortener(2000000, 'millions')).toStrictEqual('2M')
        expect(numberShortener(2300000, 'millions')).toStrictEqual('2M')
        expect(numberShortener(2700000, 'millions')).toStrictEqual('3M')
        expect(numberShortener(250000, 'millions')).toStrictEqual('250000')
    })

    it('should shorten from thousands', () => {
        expect(numberShortener(51000000, 'thousands')).toStrictEqual('51M')
        expect(numberShortener(550000, 'thousands')).toStrictEqual('550K')
        expect(numberShortener(1200, 'thousands')).toStrictEqual('1K')
    })
})
