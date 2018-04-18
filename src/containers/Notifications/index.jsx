// @flow

import React from 'react'
import { connect } from 'react-redux'
import NotificationSystem from 'react-notification-system'
import TransactionNotification from './Transaction'
import BasicNotification from '../../components/Notifications/Basic'
import { selectNotifications } from '../../modules/notifications/selectors'
import { hideNotification } from '../../modules/notifications/actions'

import type { StoreState } from '../../flowtype/store-state'
import type { Notification } from '../../flowtype/common-types'

type NotificationSystemType = {
    addNotification: (options: any) => void,
    removeNotification: (id: any) => void,
    clearNotifications: () => void,
    state: {
        notifications: Array<any>,
    }
}

type StateProps = {
    notifications: Array<Notification>,
}

type DispatchProps = {
    hideNotification: (id: number) => void,
}

type Props = StateProps & DispatchProps

const mapStateToProps = (state: StoreState): StateProps => ({
    notifications: selectNotifications(state),
})

const mapDispatchToProps = (dispatch: Function): DispatchProps => ({
    hideNotification: (id: number) => dispatch(hideNotification(id)),
})

class Notifications extends React.Component<Props> {
    componentWillReceiveProps(nextProps) {
        const { notifications } = nextProps
        const existingNotifications = this.notificationSystem != null ? this.notificationSystem.state.notifications : []

        if (notifications.length > 0) {
            (existingNotifications).forEach((notification) => {
                if (notifications.map((n) => n.id).indexOf(notification.uid) < 0) {
                    if (this.notificationSystem) {
                        this.notificationSystem.removeNotification(notification.uid)
                    }
                }
            })

            notifications.forEach((n) => {
                if (this.notificationSystem) {
                    this.notificationSystem.addNotification({
                        uid: n.id,
                        title: n.title,
                        message: n.description,
                        autoDismiss: 0,
                        position: 'bl',
                        level: 'info',
                        onRemove: () => {
                            this.props.hideNotification(n.id)
                        },
                        children: this.getComponentForNotification(n),
                    })
                }
            })
        }

        if ((this.props.notifications !== notifications) && notifications.length === 0 && this.notificationSystem) {
            this.notificationSystem.clearNotifications()
        }
    }

    shouldComponentUpdate(nextProps) {
        return this.props !== nextProps
    }

    getComponentForNotification = (notification) => {
        if (notification.txHash) {
            return (
                <TransactionNotification
                    txHash={notification.txHash}
                />
            )
        }

        return (
            <BasicNotification
                title={notification.title}
            />
        )
    }

    notificationSystem: ?NotificationSystemType

    render() {
        const style = {
            NotificationItem: {
                info: {
                    borderTop: 0,
                    padding: '15px',
                    backgroundColor: 'white',
                    color: 'black',
                    WebkitBoxShadow: '0 0 10px rgba(0, 0, 0, 0.7)',
                    MozBoxShadow: '0 0 10px rgba(0, 0, 0, 0.7)',
                    boxShadow: '0 0 10px rgba(0, 0, 0, 0.7)',
                },
            },
            Title: {
                DefaultStyle: {
                    display: 'none',
                },
            },
            MessageWrapper: {
                DefaultStyle: {
                    display: 'none',
                },
            },
            Dismiss: {
                DefaultStyle: {
                    display: 'none',
                },
            },
        }

        return (
            <NotificationSystem
                style={style}
                ref={
                    (ref) => {
                        this.notificationSystem = ref
                    }
                }
            />
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Notifications)
