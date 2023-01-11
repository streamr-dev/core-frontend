import { Operation } from '../operations'
import f from './formatAssignments'
describe('formatAssignments', () => {
    it('formats user and permission collections properly', () => {
        const assignments = f({
            bar: Operation.Edit,
            foo: Operation.Edit | Operation.Publish,
        })
        const bar = assignments.find(({ user }: {user: string}) => user === 'bar')
        expect(bar.permissions).toEqual(['edit'])
        const foo = assignments.find(({ user }: {user: string}) => user === 'foo')
        expect(foo.permissions.sort()).toEqual(['edit', 'publish'])
        expect(assignments.length).toEqual(2)
    })
})
