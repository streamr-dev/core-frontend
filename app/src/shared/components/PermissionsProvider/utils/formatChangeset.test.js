import { EDIT, PUBLISH } from '../operations'
import f from './formatChangeset'

describe('formatChangeset', () => {
    it('formats user and permission collections properly', () => {
        const [userIds, permissions] = f({
            bar: EDIT,
            foo: EDIT + PUBLISH,
        })

        const barAt = userIds.indexOf('bar')

        expect(barAt).not.toEqual(-1)

        const fooAt = userIds.indexOf('foo')

        expect(fooAt).not.toEqual(-1)

        expect(permissions[fooAt]).toEqual({
            canEdit: true,
            canPublish: true,
        })

        expect(permissions[barAt]).toEqual({
            canEdit: true,
        })
    })
})
