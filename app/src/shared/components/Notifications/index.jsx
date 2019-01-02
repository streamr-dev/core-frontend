// @flow

import React, { type Node } from 'react'
import NotificationSystem from 'react-notification-system'

import BasicNotification from './BasicNotification'
import TransactionNotification from './TransactionNotification'
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
        const { isModalOpen } = this.context

        if (isModalOpen) {
            this.hideNotifications()
        } else {
            this.showNotifications()
        }
    }

    componentWillUnmount() {
        Notification.unsubscribe(this.addNotification)
    }

    showNotification = (notification: Notification): void => {
        const system: ?System = this.system.current

        if (system) {
            // react-notification-system recognizes existing entries
            // and does not show the same item twice, FYI.
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
                        this.removeNotification(notification.id)
                    }
                },
                children: getNotificationComponent(notification),
            })
        }
    }

    addNotification = (notification: Notification): void => {
        this.setState(({ notifications }) => ({
            notifications: [
                notification,
                ...notifications,
            ],
        }))
    }

    hideNotifications = () => {
        const system: ?System = this.system.current

        if (system) {
            system.clearNotifications()
        }
    }

    showNotifications = () => {
        // Recent notifications are displayed on top and `state.notifications` collecton
        // respects that (new ones are prepended). We have to revert the order when
        // we restore entries.
        [...this.state.notifications].reverse().forEach(this.showNotification)
    }

    removeNotification = (id: number): void => {
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
