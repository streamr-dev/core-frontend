import React, { ReactNode } from 'react'
import NotificationSystem from 'react-notification-system'
import { Context as ModalContext } from '$shared/contexts/ModalPortal'
import type { Ref } from '$shared/types/common-types'
import '$shared/types/common-types'
import Notification from '$shared/utils/Notification'
import TransactionNotification from './TransactionNotification'
import BasicNotification from './BasicNotification'
import styles from './notificationStyles'
import CustomNotification from './CustomNotification'

type Dismissible = 'both' | 'click' | 'none'

type System = {
    addNotification: (notificationParams: {
        uid: number,
        title: string,
        message: string,
        dismissible: Dismissible,
        autoDismiss: number,
        position: string,
        level: string,
        onRemove: () => void,
        children: ReactNode,
    }) => void
    clearNotifications: () => void
    state: {
        notifications: Array<any>
    }
}
type Props = {
    noAnimation?: boolean
}
type State = {
    notifications: Array<Notification>
}

const getNotificationComponent = (notification: Notification): ReactNode => {
    if (notification.txHash) {
        return <TransactionNotification txHash={notification.txHash} />
    } else if (notification.children != null) {
        return (
            <CustomNotification>
                {notification.children}
            </CustomNotification>
        )
    }

    return (
        <BasicNotification
            title={notification.title || ''}
            icon={notification.icon}
            description={notification.description || ''}
        />
    )
}

class Notifications extends React.Component<Props, State> {
    static contextType = ModalContext
    static defaultProps = {
        noAnimation: false,
    }
    state = {
        notifications: [],
    }
    system: Ref<NotificationSystem> = React.createRef()

    componentDidMount() {
        Notification.subscribeToAdd(this.addNotification)
        Notification.subscribeToClose((n) => {
            if (this.system.current) {
                this.system.current.removeNotification(n.id)
            }
        })
    }

    componentDidUpdate() {
        [...this.state.notifications].reverse().forEach(this.showNotification)
    }

    componentWillUnmount() {
        Notification.unsubscribe(this.addNotification)
    }

    showNotification = (notification: Notification): void => {
        const system: System | null | undefined = this.system.current as System

        if (system) {
            // react-notification-system recognizes existing entries
            // and does not show the same item twice, FYI.
            system.addNotification({
                uid: notification.id,
                title: notification.title,
                message: notification.description,
                autoDismiss: notification.autoDismissAfter,
                dismissible: notification.dismissible ? 'both' : 'none',
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
            notifications: [notification, ...notifications],
        }))
    }

    removeNotification = (id: number): void => {
        this.setState(({ notifications }) => ({
            notifications: notifications.filter((notification) => notification.id !== id),
        }))
    }

    render() {
        return (
            <div>
                <NotificationSystem style={styles} ref={this.system} noAnimation={this.props.noAnimation} />
            </div>
        )
    }
}

export default Notifications
