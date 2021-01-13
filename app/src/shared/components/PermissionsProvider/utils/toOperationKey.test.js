import tok from './toOperationKey'

it('converts operation name into key', () => {
    expect(tok('stream_get')).toBe('GET')
})

it('converts operation key into… key (smart enough, eh?)', () => {
    expect(tok('GET')).toBe('GET')
})

it('is case insensitive', () => {
    expect(tok('STREAM_GET')).toBe('GET')
    expect(tok('get')).toBe('GET')
})
