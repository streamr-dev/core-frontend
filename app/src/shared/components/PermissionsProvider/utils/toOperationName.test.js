import ton from './toOperationName'

it('generates operation name and is case insensitive', () => {
    expect(ton('EDIT')).toBe('canEdit')
    expect(ton('edit')).toBe('canEdit')
})

it('knows how to convert operation name into itself', () => {
    expect(ton('canEdit')).toBe('canEdit')
})
