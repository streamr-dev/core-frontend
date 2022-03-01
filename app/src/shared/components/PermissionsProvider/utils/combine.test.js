import address0 from '$utils/address0'
import { PUBLISH, EDIT, DELETE, SUBSCRIBE } from '../operations'
import combine from './combine'

it('turns permissions into combinations', () => {
    const c = combine({
        FOO: ['publish', 'edit', 'delete'],
        BAR: ['publish'],
        [address0]: ['publish', 'subscribe'],
    })

    expect(c.foo).toBe(PUBLISH + EDIT + DELETE)

    expect(c.bar).toBe(PUBLISH)

    expect(c[address0]).toBe(PUBLISH + SUBSCRIBE)
})

it('ignores duplicates', () => {
    const c = combine({
        FOO: ['edit', 'edit', 'subscribe'],
    })

    expect(c.foo).toBe(SUBSCRIBE + EDIT)
})

it('turns empty permissions into empty combinations', () => {
    expect(combine([])).toEqual({})
})

it('ignores empty ones', () => {
    const c = combine({
        foo: [],
    })

    expect(({}).hasOwnProperty.call(c, 'foo')).toBe(false)
})
