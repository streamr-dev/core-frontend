import { Operation } from '../operations'
import countOperations from './countOperations'
it('gives zero for empty combination', () => {
    expect(countOperations(0)).toBe(0)
})
it('gives a number of combined operations', () => {
    expect(countOperations(Operation.Publish)).toBe(1)
    expect(countOperations(Operation.Publish | Operation.Grant)).toBe(2)
    expect(countOperations(Operation.Publish + Operation.Edit + Operation.Delete + Operation.Subscribe + Operation.Grant)).toBe(5)
})