import address0 from '$utils/address0'
import { PUBLISH, EDIT, DELETE, SUBSCRIBE } from '../operations'
import combine from './combine'

it('turns permissions into combinations', () => {
    const c = combine({
        FOO: ['canPublish', 'canEdit', 'canDelete'],
        BAR: ['canPublish'],
        [address0]: ['canPublish', 'canSubscribe'],
    })

    expect(c.FOO).toBe(PUBLISH + EDIT + DELETE)

    expect(c.BAR).toBe(PUBLISH)

    expect(c[address0]).toBe(PUBLISH + SUBSCRIBE)
})

it('ignores duplicates', () => {
    const c = combine({
        FOO: ['canEdit', 'canEdit', 'canSubscribe'],
    })

    expect(c.FOO).toBe(SUBSCRIBE + EDIT)
})

it('turns empty permissions into empty combinations', () => {
    expect(combine([])).toEqual({})
})
