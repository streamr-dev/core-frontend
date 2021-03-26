import Notification from '$shared/utils/Notification'

describe(Notification, () => {
    describe('id', () => {
        it('generates unique IDs', () => {
            expect(new Notification({}).id).not.toEqual(new Notification({}).id)
        })
    })

    it('subscribes to PUSH events; emits PUSH event; unsubscribes from PUSH event', () => {
        const handler = jest.fn()
        Notification.subscribe(handler)
        Notification.push({
            title: 'Title',
        })
        Notification.unsubscribe(handler)
        Notification.push({
            title: 'Title 2',
        })
        expect(handler).toHaveBeenCalledTimes(1)
        expect(handler.mock.calls[0][0]).toBeInstanceOf(Notification)
        expect(handler.mock.calls[0][0].title).toBe('Title')
    })

    it('determines correct autoDismissAfter based on the autoDismiss flag parameter', () => {
        expect(new Notification({}).autoDismissAfter).toBeGreaterThan(0)
        expect(new Notification({
            autoDismiss: true,
        }).autoDismissAfter).toBeGreaterThan(0)
        expect(new Notification({
            autoDismiss: false,
        }).autoDismissAfter).toEqual(0)
    })
})
