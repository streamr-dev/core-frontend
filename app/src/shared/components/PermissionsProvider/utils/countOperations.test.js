import { EDIT, DELETE, PUBLISH, SUBSCRIBE, GRANT } from '../operations'
import countOperations from './countOperations'

it('gives zero for empty combination', () => {
    expect(countOperations(0)).toBe(0)
})

it('gives a number of combined operations', () => {
    expect(countOperations(PUBLISH)).toBe(1)
    expect(countOperations(PUBLISH + GRANT)).toBe(2)
    expect(countOperations(PUBLISH + EDIT + DELETE + SUBSCRIBE + GRANT)).toBe(5)
})
