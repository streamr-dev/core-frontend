import { GET, EDIT, DELETE, SUBSCRIBE } from '../operations'
import combine from './combine'

it('turns permissions into combinations', () => {
    const c = combine([{
        operation: 'stream_get',
        user: 'FOO',
    }, {
        operation: 'stream_edit',
        user: 'FOO',
    }, {
        operation: 'stream_delete',
        user: 'FOO',
    }, {
        operation: 'stream_get',
        user: 'BAR',
    }, {
        operation: 'stream_get',
        anonymous: true,
    }, {
        operation: 'stream_subscribe',
        anonymous: true,
    }])

    expect(c.FOO).toBe(GET + EDIT + DELETE)

    expect(c.BAR).toBe(GET)

    expect(c.anonymous).toBe(GET + SUBSCRIBE)
})

it('makes anonymous flag take precedence over user', () => {
    const c = combine([{
        operation: 'stream_get',
        user: 'FOO',
        anonymous: true,
    }])

    expect(c.anonymous).toBe(GET)

    expect(({}).hasOwnProperty.call(c, 'FOO')).toBe(false)
})

it('ignores duplicates', () => {
    const c = combine([{
        operation: 'stream_get',
        user: 'FOO',
    }, {
        operation: 'stream_edit',
        user: 'FOO',
    }, {
        operation: 'stream_edit',
        user: 'FOO',
    }])

    expect(c.FOO).toBe(GET + EDIT)
})

it('turns empty permissions into empty combinations', () => {
    expect(combine([])).toEqual({})
})
