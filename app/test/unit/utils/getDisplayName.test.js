import getDisplayName from '$app/src/utils/getDisplayName'

describe('getDisplayName', () => {
    it('defaults to "Component"', () => {
        expect(getDisplayName({
            name: null,
            displayName: null,
        })).toBe('Component')
    })

    it('gives name if available', () => {
        expect(getDisplayName({
            name: 'Name',
            displayName: null,
        })).toBe('Name')
    })

    it('gives displayName if available', () => {
        expect(getDisplayName({
            name: null,
            displayName: 'DisplayName',
        })).toBe('DisplayName')
    })
})
