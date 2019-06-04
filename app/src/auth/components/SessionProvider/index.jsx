// @flow

/* eslint-disable react/no-unused-state */

import React, { type Node } from 'react'

import Context, { type Props as State } from '$auth/contexts/Session'
import { isLocalStorageAvailable } from '$shared/utils/storage'

const SESSION_TOKEN_KEY = 'session.token'

type Props = {
    children: Node,
}

const storage = isLocalStorageAvailable() ? window.localStorage : null

class SessionProvider extends React.Component<Props, State> {
    static token(): ?string {
        if (storage) {
            return storage.getItem(SESSION_TOKEN_KEY) || null
        }
        return null
    }

    static storeToken(value?: ?string) {
        if (storage) {
            if (!value) {
                storage.removeItem(SESSION_TOKEN_KEY)
            } else {
                storage.setItem(SESSION_TOKEN_KEY, value)
            }
        }
    }

    state = {
        setSessionToken: this.setSessionToken.bind(this),
        token: this.constructor.token(),
    }

    setSessionToken(token: ?string) {
        this.constructor.storeToken(token)
        this.setState({
            token,
        })
    }

    render() {
        const { children } = this.props

        return (
            <Context.Provider
                value={this.state}
            >
                {children}
            </Context.Provider>
        )
    }
}

export default SessionProvider
