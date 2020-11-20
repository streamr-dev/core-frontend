import { GET } from '../operations'
import toi from './toOperationId'

it('converts operation NAME into its numeric representation', () => {
    expect(toi('resource_get')).toBe(GET)
})

it('converts operation KEY into its numeric representation', () => {
    expect(toi('GET')).toBe(GET)
})

it('is case insensitive', () => {
    expect(toi('get')).toBe(GET)
    expect(toi('RESOURCE_GET')).toBe(GET)
})

it('converts unknown operation into undefined', () => {
    expect(toi('FOO')).not.toBeDefined()
    expect(toi('anything_foo')).not.toBeDefined()
})
