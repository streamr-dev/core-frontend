// @flow

import React, { type Node } from 'react'
import NotificationSystem from 'react-notification-system'

import BasicNotification from './Basic'
import TransactionNotification from './Transaction'
import ModalContext from '$shared/contexts/Modal'
import Notification from '$shared/utils/Notification'
import styles from './notifications'

type System = {
    addNotification: (any) => void,
    clearNotifications: () => void,
    state: {
        notifications: Array<any>,
    },
}

type Props = {}

type State = {
    notifications: Array<Notification>,
}

const getNotificationComponent = (notification: Notification): Node => (
    notification.isTx() ? (
        <TransactionNotification
            txHash={notification.txHash}
        />
    ) : (
        <BasicNotification
            title={notification.title || ''}
            icon={notification.icon}
        />
    )
)

class Notifications extends React.Component<Props, State> {
    static contextType = ModalContext

    state = {
        notifications: [],
    }

    componentDidMount() {
        Notification.subscribe(this.addNotification)
    }

    componentDidUpdate() {
        const system: ?System = this.system.current
        const { isModalOpen } = this.context
        const { notifications } = this.state

        if (system) {
            if (isModalOpen) {
                system.clearNotifications()
            } else {
                // Recent notifications are displayed on top and `state.notifications` collecton
                // respects that (new ones are prepended). We have to revert the order when
                // we restore entries.
                [...notifications].reverse().forEach(this.showNotification)
            }
        }
    }

    componentWillUnmount() {
        Notification.unsubscribe(this.addNotification)
    }

    showNotification = (notification: Notification): void => {
        const system: ?System = this.system.current

        if (system) {
            system.addNotification({
                uid: notification.id,
                title: notification.title,
                message: notification.description,
                autoDismiss: notification.autoDismissAfter(),
                position: 'bl',
                level: 'info',
                onRemove: () => {
                    // We're checking `this.context.isModalOpen` here because we need the most recent
                    // value of the flag on every `onRemove` call.
                    if (!this.context.isModalOpen) {
                        this.remove(notification.id)
                    }
                },
                children: getNotificationComponent(notification),
            })
        }
    }

    addNotification = (notification: Notification): void => {
        const system: ?System = this.system.current

        if (system) {
            this.setState(({ notifications }) => ({
                notifications: [
                    notification,
                    ...notifications,
                ],
            }), () => {
                this.showNotification(notification)
            })
        }
    }

    remove = (id: number): void => {
        this.setState(({ notifications }) => ({
            notifications: notifications.filter((notification) => notification.id !== id),
        }))
    }

    system = React.createRef()

    render() {
        return <NotificationSystem style={styles} ref={this.system} />
    }
}

export default Notifications
