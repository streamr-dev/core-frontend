// @flow

import React, { type ComponentType, type Node } from 'react'

import Context from '$shared/contexts/Notification'
import { type Notification, type NotificationIcon } from '$mp/flowtype/common-types'
import { type Hash } from '$shared/flowtype/web3-types'

export type PassedProps = {
    addNotification: (string, ?NotificationIcon) => void,
    addTxNotification: (?Hash) => void,
}

type Props = {
    addNotification: (Notification) => void,
    children: (PassedProps) => Node,
}

/**
 * This cannot be a regular HOC, unfortunatelly. Setting `WithNotifications.contextType` to
 * `Context` results in redux store issues.
*/
class WithNotifications extends React.Component<Props> {
    addNotification = (title: string, icon: ?NotificationIcon): void => {
        const now = new Date()
        this.props.addNotification({
            id: now.getTime(),
            created: now,
            title,
            icon,
        })
    }

    addTxNotification = (txHash: ?Hash): void => {
        const now = new Date()
        this.props.addNotification({
            id: now.getTime(),
            created: now,
            txHash,
        })
    }

    render() {
        return this.props.children({
            addNotification: this.addNotification,
            addTxNotification: this.addTxNotification,
        })
    }
}

export default (WrappedComponent: ComponentType<any>) => (props: {}) => (
    <Context.Consumer>
        {({ addNotification: addRawNotification }) => (
            <WithNotifications addNotification={addRawNotification}>
                {({ addNotification, addTxNotification }) => (
                    <WrappedComponent
                        {...props}
                        addNotification={addNotification}
                        addTxNotification={addTxNotification}
                    />
                )}
            </WithNotifications>
        )}
    </Context.Consumer>
)
