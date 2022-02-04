import { EDIT } from '../operations'
import toi from './toOperationId'

it('converts operation NAME into its numeric representation', () => {
    expect(toi('canEdit')).toBe(EDIT)
})

it('converts operation KEY into its numeric representation', () => {
    expect(toi('EDIT')).toBe(EDIT)
})

it('is case insensitive', () => {
    expect(toi('edit')).toBe(EDIT)
    expect(toi('CANEDIT')).toBe(EDIT)
})

it('converts unknown operation into undefined', () => {
    expect(toi('FOO')).not.toBeDefined()
    expect(toi('canFOO')).not.toBeDefined()
})
