import { EDIT, PUBLISH } from '../operations'
import f from './formatChangeset'

describe('formatChangeset', () => {
    it('formats user and permission collections properly', () => {
        const [userIds, permissions] = f({
            bar: EDIT,
            foo: EDIT + PUBLISH,
        })

        expect([...userIds].sort()).toEqual(['bar', 'foo'])

        const foo = permissions[userIds.indexOf('foo')].sort()

        expect(foo).toEqual(['canEdit', 'canPublish'])

        const bar = permissions[userIds.indexOf('bar')]

        expect(bar).toEqual(['canEdit'])
    })
})
