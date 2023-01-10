import { Operation } from '../operations'
import lookup from './lookup'
it('checks if operation is incl. in the given combination', () => {
    expect(lookup(Operation.Subscribe, 'SUBSCRIBE')).toBe(true)
    expect(lookup(Operation.Edit, 'EDIT')).toBe(true)
    expect(lookup(Operation.Subscribe, 'EDIT')).toBe(false)
    expect(lookup(Operation.Edit, 'SUBSCRIBE')).toBe(false)
    expect(lookup(Operation.Subscribe | Operation.Edit, 'SUBSCRIBE')).toBe(true)
    expect(lookup(Operation.Subscribe | Operation.Edit, 'EDIT')).toBe(true)
})