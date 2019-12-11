// @flow

import React, { Component, type Context as ReactContext } from 'react'
import { connect } from 'react-redux'

import type { Node, ComponentType } from 'react'
import StreamrClient from 'streamr-client'

import type { StoreState } from '$shared/flowtype/store-state'
import { selectAuthApiKeyId } from '$shared/modules/resourceKey/selectors'
import { getUserData } from '$shared/modules/user/actions'
import { getMyResourceKeys } from '$shared/modules/resourceKey/actions'

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

const { Provider, Consumer } = (React.createContext({}): ReactContext<StreamrClient>)

export const mapStateToProps = (state: StoreState) => ({
    keyId: selectAuthApiKeyId(state),
})

function initClient(keyId: ?string) {
    if (!keyId) {
        return
    }

    return new StreamrClient({
        url: process.env.STREAMR_WS_URL,
        restUrl: process.env.STREAMR_API_URL,
        auth: {
            apiKey: keyId,
        },
        autoConnect: true,
        autoDisconnect: false,
    })
}

function mapDispatchToProps(dispatch) {
    return {
        load() {
            dispatch(getUserData())
            dispatch(getMyResourceKeys())
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
            {(client) => !!client && <Child {...props} client={client} />}
        </Consumer>
    )
}

export { Provider, Consumer }
