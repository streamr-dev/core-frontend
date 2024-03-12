import { humanize } from './time'
describe('time utils', () => {
    describe('humanize', () => {
        it('makes durations human readable', () => {
            expect(humanize(1)).toBe('1 second')
            expect(humanize(2)).toBe('2 seconds')
            expect(humanize(60)).toBe('1 minute')
            expect(humanize(10 * 60)).toBe('10 minutes')
            expect(humanize(60 * 60)).toBe('1 hour')
            expect(humanize(5 * 60 * 60)).toBe('5 hours')
            expect(humanize(24 * 60 * 60)).toBe('1 day')
            expect(humanize(2 * 24 * 60 * 60)).toBe('2 days')
            expect(humanize(7 * 24 * 60 * 60)).toBe('1 week')
            expect(humanize(14 * 24 * 60 * 60)).toBe('2 weeks')
        })
    })
})
