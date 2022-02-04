import { SUBSCRIBE, EDIT } from '../operations'
import lookup from './lookup'

it('checks if operation is incl. in the given combination', () => {
    expect(lookup(SUBSCRIBE, 'SUBSCRIBE')).toBe(true)
    expect(lookup(EDIT, 'EDIT')).toBe(true)
    expect(lookup(SUBSCRIBE, 'EDIT')).toBe(false)
    expect(lookup(EDIT, 'SUBSCRIBE')).toBe(false)
    expect(lookup(SUBSCRIBE + EDIT, 'SUBSCRIBE')).toBe(true)
    expect(lookup(SUBSCRIBE + EDIT, 'EDIT')).toBe(true)
})
