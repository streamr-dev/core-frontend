import ton from './toOperationName'

it('generates operation name for given resource', () => {
    expect(ton('RESOURCE', 'GET')).toBe('resource_get')
})

it('is case insensitive', () => {
    expect(ton('RESOURCE', 'get')).toBe('resource_get')
    expect(ton('resource', 'GET')).toBe('resource_get')
    expect(ton('resource', 'get')).toBe('resource_get')
    expect(ton('RESOURCE', 'GET')).toBe('resource_get')
})

it('accepts operation name as the second argument', () => {
    expect(ton('RESOURCE', 'resource_get')).toBe('resource_get')
})

it('strips the second argument from its any resource types', () => {
    expect(ton('RESOURCE', 'ANYTHING_get')).toBe('resource_get')
})
