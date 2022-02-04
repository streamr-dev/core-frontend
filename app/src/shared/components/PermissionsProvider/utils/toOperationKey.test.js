import tok from './toOperationKey'

it('converts operation name into key', () => {
    expect(tok('canEdit')).toBe('EDIT')
})

it('converts operation key into… key (smart enough, eh?)', () => {
    expect(tok('EDIT')).toBe('EDIT')
})

it('is case insensitive', () => {
    expect(tok('CANEDIT')).toBe('EDIT')
    expect(tok('edit')).toBe('EDIT')
})
