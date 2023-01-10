import { Operation } from '../operations'
import toi from './toOperationId'
it('converts operation NAME into its numeric representation', () => {
    expect(toi('canEdit')).toBe(Operation.Edit)
})
it('converts operation KEY into its numeric representation', () => {
    expect(toi('EDIT')).toBe(Operation.Edit)
})
it('is case insensitive', () => {
    expect(toi('edit')).toBe(Operation.Edit)
    expect(toi('CANEDIT')).toBe(Operation.Edit)
})
it('converts unknown operation into undefined', () => {
    expect(toi('FOO')).not.toBeDefined()
    expect(toi('canFOO')).not.toBeDefined()
})