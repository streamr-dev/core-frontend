import NoModalRootError from '$shared/errors/NoModalRootError'
describe(NoModalRootError, () => {
    it('extends Error', () => {
        expect(new NoModalRootError()).toBeInstanceOf(Error)
    })
    it('is instance of itself', () => {
        expect(new NoModalRootError()).toBeInstanceOf(NoModalRootError)
    })
    it('comes with a canned message', () => {
        expect(new NoModalRootError().message).toMatch(/root element for modals is missing/i)
    })
})
