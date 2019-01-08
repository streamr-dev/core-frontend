import sinon from 'sinon'
import Notification from '$shared/utils/Notification'

describe(Notification, () => {
    describe('id', () => {
        let clock

        beforeEach(() => {
            clock = sinon.useFakeTimers(new Date())
        })

        afterEach(() => {
            clock.restore()
        })

        it('generates unique IDs', () => {
            expect(new Notification({}).id).not.toEqual(new Notification({}).id)
        })
    })

    it('subscribes to PUSH events; emits PUSH event; unsubscribes from PUSH event', () => {
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
