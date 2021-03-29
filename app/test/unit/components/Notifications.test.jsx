import React from 'react'
import { mount, shallow } from 'enzyme'
import NotificationSystem from 'react-notification-system'

import Notification from '$shared/utils/Notification'
import Notifications from '$shared/components/Notifications'
import BasicNotification from '$shared/components/Notifications/BasicNotification'
import TransactionNotification from '$shared/components/Notifications/TransactionNotification'

describe(Notifications, () => {
    afterEach(() => {
        jest.clearAllMocks()
        jest.restoreAllMocks()
    })

    describe('mounting/unmounting', () => {
        it('starts listening for notifications on mount', () => {
            jest.spyOn(Notification, 'subscribe').mockImplementation()
            const notifications = shallow(<Notifications />)
            expect(Notification.subscribe).toHaveBeenCalledTimes(1)
            expect(Notification.subscribe).toBeCalledWith(notifications.instance().addNotification)
        })

        it('stops listening for notifications before unmount', () => {
            jest.spyOn(Notification, 'unsubscribe').mockImplementation()
            const notifications = shallow(<Notifications />)
            notifications.unmount()
            expect(Notification.unsubscribe).toHaveBeenCalledTimes(1)
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
            jest.spyOn(instance, 'showNotification').mockImplementation()
            addNotification(new Notification({
                title: 'Message',
            }))
            expect(instance.showNotification).toHaveBeenCalledTimes(1)
            expect(instance.showNotification.mock.calls[0][0]).toMatchObject({
                title: 'Message',
            })
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

            jest.spyOn(system, 'addNotification').mockImplementation()
            showNotification(notification)
            expect(system.addNotification).toHaveBeenCalledTimes(1)
            expect(system.addNotification.mock.calls[0][0]).toMatchObject({
                uid: 1337,
                title: 'Message',
                message: null,
                autoDismiss: 5,
                children: {
                    type: BasicNotification,
                },
            })
        })

        it('shows a transaction notification', () => {
            const system = notifications.find(NotificationSystem).instance()
            const notification = new Notification({
                txHash: '0x1403',
                autoDismiss: false,
            })
            notification.id = 1337

            jest.spyOn(system, 'addNotification').mockImplementation()
            showNotification(notification)
            expect(system.addNotification).toHaveBeenCalledTimes(1)
            expect(system.addNotification.mock.calls[0][0]).toMatchObject({
                uid: 1337,
                title: '',
                message: null,
                autoDismiss: 0,
                children: {
                    type: TransactionNotification,
                },
            })
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
})
