import { INVALID_TIMESTAMP } from '../hooks/useLastMessageTimestamp'
import getStreamActivityStatus from './getStreamActivityStatus'

const now = () => new Date().getTime()

const ONE_MINUTE = 60 * 1000

describe('getStreamActivityStatus', () => {
    it('gives INACTIVE if inactivityThresholdHours is undefined', () => {
        expect(getStreamActivityStatus(now(), undefined).id).toEqual('inactive')
    })

    it('gives ERROR if recentMessageTimestamp is invalid', () => {
        expect(getStreamActivityStatus(INVALID_TIMESTAMP, 48).id).toEqual('error')
    })

    it('gives OK if timestamp is within the threshold', () => {
        expect(getStreamActivityStatus(now(), 1).id).toEqual('ok')
    })

    it('gives INACTIVE if timestamp crossed the threshold', () => {
        expect(getStreamActivityStatus(now() - (ONE_MINUTE * 61), 1).id).toEqual('inactive')
    })
})
