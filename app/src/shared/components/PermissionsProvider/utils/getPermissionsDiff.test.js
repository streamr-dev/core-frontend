import address0 from '$utils/address0'
import { SUBSCRIBE, PUBLISH, EDIT, DELETE, GRANT } from '../operations'
import gpd from './getPermissionsDiff'
import combine from './combine'

it('generates correct additions', () => {
    const diff = gpd({}, {
        [address0]: SUBSCRIBE + PUBLISH,
        BAR: GRANT,
        FOO: SUBSCRIBE + DELETE,
    })

    expect(diff.grant).toHaveLength(5)

    expect(diff.grant).toContainEqual([address0, 'canSubscribe'])

    expect(diff.grant).toContainEqual([address0, 'canPublish'])

    expect(diff.grant).toContainEqual(['BAR', 'canGrant'])

    expect(diff.grant).toContainEqual(['FOO', 'canSubscribe'])

    expect(diff.grant).toContainEqual(['FOO', 'canDelete'])

    expect(diff.revoke).toEqual([])
})

it('generates empty diff when there is nothing to add nor remove', () => {
    const rawPermissions = {
        FOO: ['canPublish'],
    }

    expect(gpd(combine(rawPermissions), {})).toEqual({
        grant: [],
        revoke: [],
    })
})

it('generates correct deletions', () => {
    const rawPermissions = {
        [address0]: ['canPublish', 'canSubscribe'],
        BAR: ['canPublish'],
        FOO: ['canEdit', 'canSubscribe'],
    }

    const diff = gpd(combine(rawPermissions), {
        [address0]: undefined,
        BAR: undefined,
        FOO: undefined,
    })

    expect(diff.revoke).toHaveLength(5)

    expect(diff.revoke).toContainEqual([address0, 'canSubscribe'])

    expect(diff.revoke).toContainEqual([address0, 'canPublish'])

    expect(diff.revoke).toContainEqual(['BAR', 'canPublish'])

    expect(diff.revoke).toContainEqual(['FOO', 'canSubscribe'])

    expect(diff.revoke).toContainEqual(['FOO', 'canEdit'])

    expect(diff.grant).toEqual([])
})

it('generates complete diff', () => {
    const rawPermissions = {
        [address0]: ['canPublish'],
        FOO: ['canSubscribe'],
    }

    const diff = gpd(combine(rawPermissions), {
        [address0]: SUBSCRIBE + PUBLISH,
        BAR: SUBSCRIBE,
        FOO: EDIT,
    })

    expect(diff.grant).toHaveLength(3)

    expect(diff.grant).toContainEqual([address0, 'canSubscribe'])

    expect(diff.grant).toContainEqual(['BAR', 'canSubscribe'])

    expect(diff.grant).toContainEqual(['FOO', 'canEdit'])

    expect(diff.revoke).toHaveLength(1)

    expect(diff.revoke).toContainEqual(['FOO', 'canSubscribe'])
})
