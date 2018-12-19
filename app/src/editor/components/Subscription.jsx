import React, { Component } from 'react'
import { connect } from 'react-redux'

import StreamrClient from 'streamr-client'
import { getKeyId } from '$userpages/modules/key/selectors'

const mapStateToProps = (state) => ({
    keyId: getKeyId(state),
})

const MessageTypes = {
    Done: 'D',
    Error: 'E',
    Notification: 'N',
    ModuleWarning: 'MW',
}

const Subscription = connect(mapStateToProps)(class Subscription extends Component {
    static defaultProps = {
        onMessage: Function.prototype,
        onUnsubscribe: Function.prototype,
    }

    componentDidMount() {
        this.autosubscribe()
    }

    componentDidUpdate() {
        this.autosubscribe()
    }

    componentWillUnmount() {
        this.unsubscribe()
    }

    autosubscribe() {
        if (this.isSubscribed) { return }
        const { isActive, uiChannel } = this.props
        if (isActive && uiChannel) {
            this.subscribe()
        } else {
            this.unsubscribe()
        }
    }

    subscribe() {
        const { uiChannel, keyId } = this.props
        this.unsubscribe()

        const { id } = uiChannel
        this.client = new StreamrClient({
            url: process.env.STREAMR_WS_URL,
            authKey: keyId,
            autoConnect: true,
            autoDisconnect: true,
        })

        this.subscription = this.client.subscribe({
            stream: id,
            resend_all: (this.props.resendAll ? true : undefined),
        }, async (message) => {
            if (!this.isSubscribed) { return }
            this.props.onMessage(message)
            if (message.type === MessageTypes.Done) {
                // unsubscribe when done
                this.unsubscribe()
            }
        })

        this.isSubscribed = true
    }

    unsubscribe() {
        if (!this.isSubscribed) { return }
        const { client, subscription } = this
        this.subscription = undefined
        this.client = undefined
        this.isSubscribed = false
        client.unsubscribe(subscription)
        client.disconnect()
        this.props.onUnsubscribe()
    }

    render() {
        return this.props.children || null
    }
})

export default (props) => {
    // create new subscription if uiChannel or resendAll changes
    const key = (props.uiChannel && props.uiChannel.id) + props.resendAll
    return (
        <Subscription key={key} {...props} />
    )
}
