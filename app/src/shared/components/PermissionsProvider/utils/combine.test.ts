import address0 from '$utils/address0'
import { Operation } from '../operations'
import combine from './combine'
describe('Combine', () => {
    it('turns permissions into combinations', () => {
        const c = combine({
            FOO: ['publish', 'edit', 'delete'],
            BAR: ['publish'],
            [address0]: ['publish', 'subscribe'],
        })
        expect(c.foo).toBe(Operation.Publish | Operation.Edit | Operation.Delete)
        expect(c.bar).toBe(Operation.Publish)
        expect(c[address0]).toBe(Operation.Publish | Operation.Subscribe)
    })
    it('ignores duplicates', () => {
        const c = combine({
            FOO: ['edit', 'edit', 'subscribe'],
        })
        expect(c.foo).toBe(Operation.Subscribe | Operation.Edit)
    })
    it('turns empty permissions into empty combinations', () => {
        expect(combine({})).toEqual({})
    })
    it('ignores empty ones', () => {
        const c = combine({
            foo: [],
        })
        expect({}.hasOwnProperty.call(c, 'foo')).toBe(false)
    })
})
