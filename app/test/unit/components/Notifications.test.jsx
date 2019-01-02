import React from 'react'
import sinon from 'sinon'
import { mount, shallow } from 'enzyme'
import NotificationSystem from 'react-notification-system'

import Notification from '$shared/utils/Notification'
import Notifications from '$shared/components/Notifications'
import BasicNotification from '$shared/components/Notifications/BasicNotification'
import TransactionNotification from '$shared/components/Notifications/TransactionNotification'
import ModalContext from '$shared/contexts/Modal'

describe(Notifications, () => {
    const sandbox = sinon.createSandbox()

    afterEach(() => {
        sandbox.restore()
    })

    describe('mounting/unmounting', () => {
        it('starts listening for notifications on mount', () => {
            sandbox.stub(Notification, 'subscribe')
            const notifications = shallow(<Notifications />)
            sinon.assert.calledOnce(Notification.subscribe)
            sinon.assert.calledWith(Notification.subscribe, notifications.instance().addNotification)
        })

        it('stops listening for notifications before unmount', () => {
            sandbox.stub(Notification, 'unsubscribe')
            const notifications = shallow(<Notifications />)
            notifications.unmount()
            sinon.assert.calledOnce(Notification.unsubscribe)
        })
    })

    describe('addNotification', () => {
        let addNotification
        let notifications

        beforeEach(() => {
            notifications = shallow(<Notifications />);
            ({ addNotification } = notifications.instance())
        })

        it('prepends notification collection with the new entries', () => {
            expect(notifications.state('notifications')).toHaveLength(0)
            addNotification(new Notification({
                title: 'Message 1',
            }))
            addNotification(new Notification({
                title: 'Message 2',
            }))
            const items = notifications.state('notifications')
            expect(items).toHaveLength(2)
            expect(items[0]).toMatchObject({
                title: 'Message 2',
            })
            expect(items[1]).toMatchObject({
                title: 'Message 1',
            })
        })

        it('triggers showNotification', () => {
            const instance = notifications.instance()
            sandbox.stub(instance, 'showNotification')
            addNotification(new Notification({
                title: 'Message',
            }))
            sinon.assert.calledOnce(instance.showNotification)
            sinon.assert.calledWith(instance.showNotification, sinon.match.has('title', 'Message'))
        })
    })

    describe('showNotification', () => {
        let showNotification
        let notifications

        beforeEach(() => {
            notifications = mount(<Notifications />);
            ({ showNotification } = notifications.instance())
        })

        it('shows a basic notification', () => {
            const system = notifications.find(NotificationSystem).instance()
            const notification = new Notification({
                title: 'Message',
            })
            notification.id = 1337

            sandbox.stub(system, 'addNotification')
            showNotification(notification)
            sinon.assert.calledOnce(system.addNotification)
            sinon.assert.calledWith(system.addNotification, sinon.match.has('uid', 1337))
            sinon.assert.calledWith(system.addNotification, sinon.match.has('title', 'Message'))
            sinon.assert.calledWith(system.addNotification, sinon.match.has('message', null))
            sinon.assert.calledWith(system.addNotification, sinon.match.has('autoDismiss', 5))
            sinon.assert.calledWith(system.addNotification, sinon.match.has('children', sinon.match.has('type', BasicNotification)))
        })

        it('shows a transaction notification', () => {
            const system = notifications.find(NotificationSystem).instance()
            const notification = new Notification({
                txHash: '0x1403',
            })
            notification.id = 1337

            sandbox.stub(system, 'addNotification')
            showNotification(notification)
            sinon.assert.calledOnce(system.addNotification)
            sinon.assert.calledWith(system.addNotification, sinon.match.has('uid', 1337))
            sinon.assert.calledWith(system.addNotification, sinon.match.has('title', ''))
            sinon.assert.calledWith(system.addNotification, sinon.match.has('message', null))
            sinon.assert.calledWith(system.addNotification, sinon.match.has('autoDismiss', 0))
            sinon.assert.calledWith(system.addNotification, sinon.match.has('children', sinon.match.has('type', TransactionNotification)))
        })
    })

    describe('removeNotification', () => {
        let removeNotification
        let notifications

        beforeEach(() => {
            notifications = mount(<Notifications />);
            ({ removeNotification } = notifications.instance())
        })

        it('removes correct notification from the collection', () => {
            const notification0 = new Notification({
                title: 'Message 0',
            })
            notification0.id = 1337
            const notification1 = new Notification({
                title: 'Message 1',
            })
            notification0.id = 1403

            notifications.setState({
                notifications: [
                    notification0,
                    notification1,
                ],
            })

            expect(notifications.state('notifications')).toHaveLength(2)
            removeNotification(1403)
            const items = notifications.state('notifications')
            expect(items).toHaveLength(1)
            expect(items[0].title).toEqual('Message 1')
        })
    })

    describe('hideNotifications', () => {
        it('hides notifications in the UI', () => {
            const notifications = mount(<Notifications />)
            const system = notifications.find(NotificationSystem).instance()
            sandbox.stub(system, 'clearNotifications')
            notifications.instance().hideNotifications()
            sinon.assert.calledOnce(system.clearNotifications)
        })

        it('keeps notification instances in the state if isModalOpen is true', () => {
            const notifications = mount((
                <ModalContext.Provider
                    value={{
                        isModalOpen: true,
                        registerModal: null,
                        unregisterModal: null,
                    }}
                >
                    <Notifications />
                </ModalContext.Provider>
            )).find(Notifications)
            notifications.setState({
                notifications: [
                    new Notification({
                        title: 'Message 0',
                    }),
                    new Notification({
                        title: 'Message 1',
                    }),
                ],
            })
            const instance = notifications.instance()
            expect(notifications.state('notifications')).toHaveLength(2)
            expect(instance.context.isModalOpen).toEqual(true)
            instance.hideNotifications()
            expect(notifications.state('notifications')).toHaveLength(2)
        })

        it('removes notification instances from the state if isModalOpen is false', () => {
            const notifications = mount(<Notifications />)
            notifications.setState({
                notifications: [
                    new Notification({
                        title: 'Message 0',
                    }),
                    new Notification({
                        title: 'Message 1',
                    }),
                ],
            })
            const instance = notifications.instance()
            expect(notifications.state('notifications')).toHaveLength(2)
            expect(instance.context.isModalOpen).toEqual(false)
            instance.hideNotifications()
            expect(notifications.state('notifications')).toHaveLength(0)
        })
    })

    describe('showNotifications', () => {
        let showNotifications
        let notifications

        beforeEach(() => {
            notifications = mount(<Notifications />);
            ({ showNotifications } = notifications.instance())
        })

        it('shows notifications in the UI in correct order', () => {
            notifications.setState({
                notifications: [
                    new Notification({
                        title: 'Latest message',
                    }),
                    new Notification({
                        title: 'Message',
                    }),
                ],
            })
            const system = notifications.find(NotificationSystem).instance()
            sandbox.stub(system, 'addNotification')
            showNotifications()
            sinon.assert.calledTwice(system.addNotification)
            sinon.assert.calledWith(system.addNotification.firstCall, sinon.match.has('title', 'Message'))
            sinon.assert.calledWith(system.addNotification.lastCall, sinon.match.has('title', 'Latest message'))
        })
    })
})
