// @flow

import React, { Component } from 'react'
import { connect } from 'react-redux'

import type { Node, ComponentType } from 'react'
import StreamrClient from 'streamr-client'

import type { KeyState } from '../../flowtype/states/key-state'
import { getKeyId } from '../../modules/key/selectors'
import { getUserData } from '$mp/modules/user/actions'
import { getResourceKeys } from '../../modules/key/actions'

export type { StreamrClient }

type Props = {
    keyId: ?string,
    children?: Node,
    load: Function
}

type State = {
    keyId?: string,
    client?: StreamrClient
}

export type ClientProp = {
    client: StreamrClient
}

let didWarnAboutChangingClient = false

function warnAboutChangingClient() {
    if (didWarnAboutChangingClient) {
        return
    }
    didWarnAboutChangingClient = true

    console.warn('<StreamrClientProvider> does not support changing `keyId` on the fly.')
}

const { Provider, Consumer } = React.createContext({})

export const mapStateToProps = (state: { key: ?KeyState }) => ({
    keyId: getKeyId(state),
})

function initClient(keyId: ?string) {
    if (!keyId) {
        return
    }

    return new StreamrClient({
        url: process.env.STREAMR_WS_URL,
        authKey: keyId,
        autoconnect: true,
        autoDisconnect: false,
    })
}

function mapDispatchToProps(dispatch) {
    return {
        load() {
            dispatch(getUserData())
            dispatch(getResourceKeys('USER', 'me'))
        },
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps,
    null,
    {
        pure: false,
    },
)(class StreamrClientProvider extends Component<Props, State> {
    state = {}

    componentDidMount() {
        this.props.load()
    }

    static getDerivedStateFromProps({ keyId }, state) {
        if (state.client && keyId !== state.keyId) {
            warnAboutChangingClient()
            return null
        }

        if (state.client) {
            return null
        }

        if (!keyId) {
            return null
        }

        return {
            keyId,
            client: initClient(keyId),
        }
    }

    render() {
        return (
            <Provider value={this.state.client}>
                {this.props.children}
            </Provider>
        )
    }
})

export function withClient<Props: {}>(Child: ComponentType<Props>): ComponentType<$Diff<Props, { client: StreamrClient }>> {
    return (props: Props) => (
        <Consumer>
            {(client) => !!client && <Child client={client} {...props} />}
        </Consumer>
    )
}

export { Provider, Consumer }
