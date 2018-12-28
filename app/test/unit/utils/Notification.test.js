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

    describe('isTx', () => {
        const isTx = (value) => (
            new Notification({
                txHash: value,
            }).isTx()
        )

        it('is true if txHash is present', () => {
            expect(isTx(null)).toEqual(false)
            expect(isTx('')).toEqual(false)
            expect(isTx(0)).toEqual(false)
            expect(isTx(false)).toEqual(false)
            expect(isTx('0')).toEqual(true)
            expect(isTx('0x1337')).toEqual(true)
        })
    })

    describe('autoDismissAfter', () => {
        const autoDismissAfter = (isTx) => {
            const notification = new Notification({})
            sinon.stub(notification, 'isTx').callsFake(() => isTx)
            return notification.autoDismissAfter()
        }

        it('is 0 if isTx is true', () => {
            expect(autoDismissAfter(true)).toEqual(0)
            expect(autoDismissAfter(false)).toBeGreaterThan(0)
        })
    })
})
