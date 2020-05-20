// @flow

/* eslint-disable react/no-unused-state */

import React, { type Node, useEffect, useState, useMemo } from 'react'
import Context from '$auth/contexts/Session'
import { setToken, getToken } from '$shared/utils/sessionToken'

type Props = {
    children: Node,
}

function SessionProvider(props: Props) {
    const { children } = props

    const [token, setSessionToken] = useState(getToken())

    useEffect(() => {
        // update storage when token changes
        setToken(token)
    }, [token])

    const sessionProvider = useMemo(() => ({
        setSessionToken,
        token,
    }), [setSessionToken, token])

    return (
        <Context.Provider value={sessionProvider}>
            {children}
        </Context.Provider>
    )
}

export default SessionProvider
