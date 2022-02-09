import address0 from '$utils/address0'
import { SUBSCRIBE, PUBLISH, EDIT, DELETE, GRANT } from '../operations'
import gpd from './getPermissionsDiff'
import combine from './combine'

it('generates correct additions', () => {
    const diff = gpd({}, {
        [address0]: SUBSCRIBE + PUBLISH,
        bar: GRANT,
        foo: SUBSCRIBE + DELETE,
    })

    expect(diff.grant).toHaveLength(5)

    expect(diff.grant).toContainEqual([address0, 'canSubscribe'])

    expect(diff.grant).toContainEqual([address0, 'canPublish'])

    expect(diff.grant).toContainEqual(['bar', 'canGrant'])

    expect(diff.grant).toContainEqual(['foo', 'canSubscribe'])

    expect(diff.grant).toContainEqual(['foo', 'canDelete'])

    expect(diff.revoke).toEqual([])
})

it('generates empty diff when there is nothing to add nor remove', () => {
    const rawPermissions = {
        FOO: ['canPublish'],
    }

    expect(gpd(combine(rawPermissions), {})).toEqual({
        grant: [],
        revoke: [],
        revokeAll: [],
    })
})

it('generates correct deletions', () => {
    const rawPermissions = {
        [address0]: ['canPublish', 'canSubscribe'],
        BAR: ['canPublish'],
        FOO: ['canEdit', 'canSubscribe'],
        XO: ['canEdit', 'canSubscribe'],
    }

    const diff = gpd(combine(rawPermissions), {
        [address0]: undefined,
        bar: undefined,
        foo: undefined,
        xo: EDIT,
    })

    expect(diff.revoke).toHaveLength(1)

    expect(diff.revoke).toContainEqual(['xo', 'canSubscribe'])

    expect(diff.revokeAll.sort()).toEqual([address0, 'bar', 'foo'].sort())

    expect(diff.grant).toEqual([])
})

it('generates complete diff', () => {
    const rawPermissions = {
        [address0]: ['canPublish'],
        FOO: ['canSubscribe'],
    }

    const diff = gpd(combine(rawPermissions), {
        [address0]: SUBSCRIBE + PUBLISH,
        bar: SUBSCRIBE,
        foo: EDIT,
    })

    expect(diff.grant).toHaveLength(3)

    expect(diff.grant).toContainEqual([address0, 'canSubscribe'])

    expect(diff.grant).toContainEqual(['bar', 'canSubscribe'])

    expect(diff.grant).toContainEqual(['foo', 'canEdit'])

    expect(diff.revoke).toHaveLength(1)

    expect(diff.revoke).toContainEqual(['foo', 'canSubscribe'])
})
