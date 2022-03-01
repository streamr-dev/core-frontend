import { EDIT, PUBLISH } from '../operations'
import f from './formatAssignments'

describe('formatAssignments', () => {
    it('formats user and permission collections properly', () => {
        const assignments = f({
            bar: EDIT,
            foo: EDIT + PUBLISH,
        })

        const bar = assignments.find(({ user }) => user === 'bar')

        expect(bar.permissions).toEqual(['edit'])

        const foo = assignments.find(({ user }) => user === 'foo')

        expect(foo.permissions.sort()).toEqual(['edit', 'publish'])

        expect(assignments.length).toEqual(2)
    })
})
