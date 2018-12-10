// @flow

import React from 'react'
import { connect } from 'react-redux'
import NotificationSystem from 'react-notification-system'

import Modal from '$shared/components/Modal'
import BasicNotification from '../../components/Notifications/Basic'
import { selectNotifications } from '../../modules/notifications/selectors'
import { hideNotification } from '../../modules/notifications/actions'

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
}

type DispatchProps = {
    hideNotification: (id: number) => void,
}

type Props = StateProps & DispatchProps

export class Notifications extends React.Component<Props> {
    componentWillReceiveProps(nextProps: Props) {
        const { notifications } = nextProps
        const existingNotifications = this.notificationSystem != null ? this.notificationSystem.state.notifications : []
        // FIXME: inModalOpen used to be a prop. We don't have it anymore. Current way (via Modal.isOpen()) won't
        //        affect notifications when the modal shows up. It's not a prop, it won't cause re-render or
        //        a call to componentWillReceiveProps. This needs to up adjusted. — Mariusz
        const isModalOpen = Modal.isOpen()

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
                            if (!isModalOpen) {
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
                DefaultStyle: { // Applied to every notification, regardless of the notification level
                    width: 'auto',
                },
                info: {
                    width: 'auto',
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
})

export const mapDispatchToProps = (dispatch: Function): DispatchProps => ({
    hideNotification: (id: number) => dispatch(hideNotification(id)),
})

export default connect(mapStateToProps, mapDispatchToProps)(Notifications)
