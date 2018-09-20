// @flow

import React from 'react'
import { connect } from 'react-redux'
import NotificationSystem from 'react-notification-system'

import BasicNotification from '../../components/Notifications/Basic'
import { selectNotifications } from '../../modules/notifications/selectors'
import { hideNotification } from '../../modules/notifications/actions'
import { selectIsModalOpen } from '../../modules/modals/selectors'

import type { StoreState } from '../../flowtype/store-state'
import type { Notification } from '../../flowtype/common-types'

import TransactionNotification from './Transaction'

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
    isModalOpen: boolean,
}

type DispatchProps = {
    hideNotification: (id: number) => void,
}

type Props = StateProps & DispatchProps

export class Notifications extends React.Component<Props> {
    componentWillReceiveProps(nextProps: Props) {
        const { notifications, isModalOpen } = nextProps
        const existingNotifications = this.notificationSystem != null ? this.notificationSystem.state.notifications : []

        if (notifications.length > 0 && !isModalOpen) {
            existingNotifications.forEach((notification) => {
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
                        autoDismiss: n.txHash ? 0 : 5, // seconds, 0 = no automatic dismiss
                        position: 'bl',
                        level: 'info',
                        onRemove: () => {
                            if (!this.props.isModalOpen) {
                                this.props.hideNotification(n.id)
                            }
                        },
                        children: this.getComponentForNotification(n),
                    })
                }
            })
        }

        if ((((this.props.notifications !== notifications) && notifications.length === 0) || isModalOpen) && this.notificationSystem) {
            this.notificationSystem.clearNotifications()
        }
    }

    getComponentForNotification = (notification: Notification) => {
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
                icon={notification.icon}
            />
        )
    }

    notificationSystem: ?NotificationSystemType

    render() {
        const style = {
            NotificationItem: {
                info: {
                    borderTop: 0,
                    padding: '16px',
                    backgroundColor: 'white',
                    color: 'black',
                    WebkitBoxShadow: '0 0 10px rgba(0, 0, 0, 0.2)',
                    MozBoxShadow: '0 0 10px rgba(0, 0, 0, 0.2)',
                    boxShadow: '0 0 10px rgba(0, 0, 0, 0.2)',
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

export const mapStateToProps = (state: StoreState): StateProps => ({
    notifications: selectNotifications(state),
    isModalOpen: selectIsModalOpen(state),
})

export const mapDispatchToProps = (dispatch: Function): DispatchProps => ({
    hideNotification: (id: number) => dispatch(hideNotification(id)),
})

export default connect(mapStateToProps, mapDispatchToProps)(Notifications)
