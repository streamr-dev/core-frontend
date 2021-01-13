import { GET, EDIT, DELETE, SHARE } from '../operations'
import gpd from './getPermissionsDiff'
import combine from './combine'

it('generates correct additions', () => {
    const diff = gpd('STREAM', [], {}, {
        FOO: GET + DELETE,
        BAR: SHARE,
        anonymous: GET + EDIT,
    })

    expect(diff.add).toHaveLength(5)

    expect(diff.del).toHaveLength(0)

    expect(diff.add).toContainEqual({
        operation: 'stream_get',
        user: 'FOO',
    })

    expect(diff.add).toContainEqual({
        operation: 'stream_delete',
        user: 'FOO',
    })

    expect(diff.add).toContainEqual({
        operation: 'stream_share',
        user: 'BAR',
    })

    expect(diff.add).toContainEqual({
        operation: 'stream_get',
        anonymous: true,
    })

    expect(diff.add).toContainEqual({
        operation: 'stream_edit',
        anonymous: true,
    })
})

it('generates empty diff when there is nothing to add nor remove', () => {
    const permissions = [{
        id: 1,
        operation: 'stream_get',
        user: 'FOO',
    }]

    expect(gpd('STREAM', permissions, combine(permissions), {})).toEqual({
        add: [],
        del: [],
    })
})

it('generates correct deletions', () => {
    const permissions = [{
        id: 1,
        operation: 'stream_get',
        user: 'FOO',
    }, {
        id: 2,
        operation: 'stream_edit',
        user: 'FOO',
    }, {
        id: 3,
        operation: 'stream_get',
        user: 'BAR',
    }, {
        id: 4,
        operation: 'stream_get',
        anonymous: true,
    }, {
        id: 5,
        operation: 'stream_edit',
        anonymous: true,
    }]

    const diff = gpd('STREAM', permissions, combine(permissions), {
        FOO: undefined,
        BAR: undefined,
        anonymous: undefined,
    })

    expect(diff.add).toHaveLength(0)

    expect(diff.del).toHaveLength(5)

    expect(diff.del).toContainEqual({
        id: 1,
        operation: 'stream_get',
        user: 'FOO',
    })

    expect(diff.del).toContainEqual({
        id: 2,
        operation: 'stream_edit',
        user: 'FOO',
    })

    expect(diff.del).toContainEqual({
        id: 3,
        operation: 'stream_get',
        user: 'BAR',
    })

    expect(diff.del).toContainEqual({
        id: 4,
        operation: 'stream_get',
        anonymous: true,
    })

    expect(diff.del).toContainEqual({
        id: 5,
        operation: 'stream_edit',
        anonymous: true,
    })
})

it('generates complete diff', () => {
    const permissions = [{
        id: 1,
        operation: 'stream_get',
        user: 'FOO',
    }, {
        id: 2,
        operation: 'stream_edit',
        anonymous: true,
    }]

    const diff = gpd('STREAM', permissions, combine(permissions), {
        FOO: EDIT,
        BAR: GET,
        anonymous: GET,
    })

    expect(diff.add).toHaveLength(3)

    expect(diff.del).toHaveLength(2)

    expect(diff.add).toContainEqual({
        operation: 'stream_edit',
        user: 'FOO',
    })

    expect(diff.add).toContainEqual({
        operation: 'stream_get',
        user: 'BAR',
    })

    expect(diff.add).toContainEqual({
        operation: 'stream_get',
        anonymous: true,
    })

    expect(diff.del).toContainEqual({
        id: 1,
        operation: 'stream_get',
        user: 'FOO',
    })

    expect(diff.del).toContainEqual({
        id: 2,
        operation: 'stream_edit',
        anonymous: true,
    })
})
