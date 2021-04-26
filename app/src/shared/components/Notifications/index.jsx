// @flow

import React, { type Node } from 'react'
import NotificationSystem from 'react-notification-system'

import { Context as ModalContext } from '$shared/contexts/ModalPortal'
import { type Ref } from '$shared/flowtype/common-types'
import Notification from '$shared/utils/Notification'
import TransactionNotification from './TransactionNotification'
import BasicNotification from './BasicNotification'
import styles from './notificationStyles'

type System = {
    addNotification: (any) => void,
    clearNotifications: () => void,
    state: {
        notifications: Array<any>,
    },
}

type Props = {
    noAnimation?: boolean,
}

type State = {
    notifications: Array<Notification>,
}

const getNotificationComponent = (notification: Notification): Node => (
    notification.txHash ? (
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

    static defaultProps = {
        noAnimation: false,
    }

    state = {
        notifications: [],
    }

    componentDidMount() {
        Notification.subscribe(this.addNotification)
    }

    componentDidUpdate() {
        [...this.state.notifications].reverse().forEach(this.showNotification)
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
                autoDismiss: notification.autoDismissAfter,
                position: 'bl',
                level: 'info',
                onRemove: () => {
                    this.removeNotification(notification.id)
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

    removeNotification = (id: number): void => {
        this.setState(({ notifications }) => ({
            notifications: notifications.filter((notification) => notification.id !== id),
        }))
    }

    system: Ref<NotificationSystem> = React.createRef()

    render() {
        return (
            <div>
                <NotificationSystem
                    style={styles}
                    ref={this.system}
                    noAnimation={this.props.noAnimation}
                />
            </div>
        )
    }
}

export default Notifications
