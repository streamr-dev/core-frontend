// @flow

import React, { type Node } from 'react'

import Context, { type Props as State } from '$auth/contexts/Session'
import { isLocalStorageAvailable } from '$shared/utils/storage'

const SESSION_TOKEN_KEY = 'session.token'

type Props = {
    children: Node,
}

class Session extends React.Component<Props, State> {
    static token(): ?string {
        if (isLocalStorageAvailable()) {
            return localStorage.getItem(SESSION_TOKEN_KEY) || null
        }
        return null
    }

    static storeToken(value?: ?string) {
        if (isLocalStorageAvailable()) {
            if (!value) {
                localStorage.removeItem(SESSION_TOKEN_KEY)
            } else {
                localStorage.setItem(SESSION_TOKEN_KEY, value)
            }
        }
    }

    state = {
        setSessionToken: this.setSessionToken.bind(this),
        token: Session.token(),
    }

    setSessionToken(token: ?string) {
        Session.storeToken(token)
        this.setState({
            token,
        })
    }

    render() {
        const { children } = this.props
        const { token, setSessionToken } = this.state

        return (
            <Context.Provider
                value={{
                    token,
                    setSessionToken,
                }}
            >
                {children}
            </Context.Provider>
        )
    }
}

export default Session
