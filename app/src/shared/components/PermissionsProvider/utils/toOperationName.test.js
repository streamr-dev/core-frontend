import ton from './toOperationName'

it('generates operation name and is case insensitive', () => {
    expect(ton('EDIT')).toBe('edit')
    expect(ton('edit')).toBe('edit')
})
