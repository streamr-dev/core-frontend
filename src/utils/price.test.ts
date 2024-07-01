import { timeUnits } from '../shared/utils/timeUnit'
import { BN } from './bn'
import { convertPrice as cp } from './price'

describe('pricePerTimeUnit', () => {
    it('converts', () => {
        expect(cp(1n, timeUnits.second)).toEqual(1n)

        expect(cp(1n, timeUnits.minute)).toEqual(60n)

        expect(cp(1n, timeUnits.hour)).toEqual(3600n)

        expect(cp(1n, [2, timeUnits.hour])).toEqual(7200n)

        expect(cp([1n, timeUnits.second], timeUnits.second)).toEqual(1n)

        expect(cp([1n, timeUnits.second], timeUnits.minute)).toEqual(60n)

        expect(cp([1n, timeUnits.second], timeUnits.hour)).toEqual(3600n)

        expect(cp([1n, timeUnits.minute], timeUnits.hour)).toEqual(60n)

        expect(cp([1n, timeUnits.minute], [60, timeUnits.minute])).toEqual(60n)

        expect(cp([60n, timeUnits.minute], [1, timeUnits.second])).toEqual(1n)

        expect(cp([61n, timeUnits.minute], timeUnits.second)).toEqual(1n)
    })

    describe('rounding', () => {
        it('respects rounding mode', () => {
            expect(cp([91n, timeUnits.minute], timeUnits.second)).toEqual(2n)

            expect(
                cp([91n, timeUnits.minute], timeUnits.second, {
                    roundingMode: BN.ROUND_DOWN,
                }),
            ).toEqual(1n)
        })
    })
})
