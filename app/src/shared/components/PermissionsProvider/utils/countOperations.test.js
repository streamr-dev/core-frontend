import { GET, EDIT, DELETE, PUBLISH, SUBSCRIBE, STARTSTOP, INTERACT, SHARE } from '../operations'
import countOperations from './countOperations'

it('gives zero for empty combination', () => {
    expect(countOperations(0)).toBe(0)
})

it('gives a number of combined operations', () => {
    expect(countOperations(GET)).toBe(1)
    expect(countOperations(GET + SHARE)).toBe(2)
    expect(countOperations(GET + EDIT + DELETE + PUBLISH + SUBSCRIBE + STARTSTOP + INTERACT + SHARE)).toBe(8)
})
