import onInputChange from '$auth/utils/onInputChange'

describe('onInputChange', () => {
    it('calls the callback with name and value', () => {
        onInputChange((name, value) => {
            expect(name).toBe('myName')
            expect(value).toBe('myValue')
        })({
            target: {
                name: 'myName',
                value: 'myValue',
            },
        })
    })

    it('calls the callback with name and a boolean if the target type is checkbox', () => {
        onInputChange((name, value) => {
            expect(name).toBe('myName')
            expect(value).toBe(true)
        })({
            target: {
                type: 'checkbox',
                name: 'myName',
                checked: true,
            },
        })
    })

    it('lets you override the name', () => {
        onInputChange((name) => {
            expect(name).toBe('myCustomName')
        }, 'myCustomName')({
            target: {
                name: 'myName',
            },
        })
    })
})
