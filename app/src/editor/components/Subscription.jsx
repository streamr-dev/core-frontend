import React, { Component } from 'react'
import { connect } from 'react-redux'

import StreamrClient from 'streamr-client'
import { selectAuthApiKeyId } from '$shared/modules/resourceKey/selectors'

const MessageTypes = {
    Done: 'D',
    Error: 'E',
    Notification: 'N',
    ModuleWarning: 'MW',
}

class Subscription extends Component {
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
        const {
            uiChannel,
            authKey,
            resendAll,
            resendFrom,
            resendFromTime,
            resendLast,
        } = this.props

        this.unsubscribe()

        const { id } = uiChannel
        this.client = new StreamrClient({
            url: process.env.STREAMR_WS_URL,
            auth: {
                apiKey: authKey,
            },
            autoConnect: true,
            autoDisconnect: true,
        })

        this.subscription = this.client.subscribe({
            stream: id,
            resend_all: resendAll != null ? !!resendAll : undefined,
            resend_last: resendLast != null ? resendLast : undefined,
            resend_from: resendFrom != null ? resendFrom : undefined,
            resend_from_time: resendFromTime != null ? resendFromTime : undefined,
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
}

const mapStateToProps = (state) => ({
    authKey: selectAuthApiKeyId(state),
})

export const withAuthKey = connect(mapStateToProps)

export default withAuthKey((props) => {
    if (!props.authKey) { return null } // wait for authKey
    // create new subscription if uiChannel or resendAll changes
    const key = props.authKey + (props.uiChannel && props.uiChannel.id) + props.resendAll
    return (
        <Subscription key={key} {...props} />
    )
})
