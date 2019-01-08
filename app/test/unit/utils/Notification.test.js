import sinon from 'sinon'
import Notification from '$shared/utils/Notification'

describe(Notification, () => {
    describe('push/subscribe/unsubscribe', () => {
        it('emits PUSH event with a Notification instance as an argument', () => {
            const handler = sinon.spy()
            Notification.subscribe(handler)
            Notification.push({
                title: 'Title',
            })
            Notification.unsubscribe(handler)
            Notification.push({
                title: 'Title 2',
            })
            sinon.assert.calledOnce(handler)
            sinon.assert.calledWith(handler, sinon.match.instanceOf(Notification))
            sinon.assert.calledWith(handler, sinon.match.has('title', 'Title'))
        })
    })

    describe('autoDismissAfter', () => {
        it('is 0 if isTx is true', () => {
            expect(new Notification({}).autoDismissAfter).toBeGreaterThan(0)
            expect(new Notification({
                autoDismiss: true,
            }).autoDismissAfter).toBeGreaterThan(0)
            expect(new Notification({
                autoDismiss: false,
            }).autoDismissAfter).toEqual(0)
        })
    })
})
