import { GET, EDIT } from '../operations'
import lookup from './lookup'

it('checks if operation is incl. in the given combination', () => {
    expect(lookup(GET, 'GET')).toBe(true)
    expect(lookup(EDIT, 'EDIT')).toBe(true)
    expect(lookup(GET, 'EDIT')).toBe(false)
    expect(lookup(EDIT, 'GET')).toBe(false)
    expect(lookup(GET + EDIT, 'GET')).toBe(true)
    expect(lookup(GET + EDIT, 'EDIT')).toBe(true)
})
