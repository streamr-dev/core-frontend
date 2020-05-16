// @flow

/* eslint-disable react/no-unused-state */

import React, { type Node, useEffect, useState, useMemo } from 'react'
import Context from '$auth/contexts/Session'
import { store, retrieve } from '$shared/utils/sessionToken'

type Props = {
    children: Node,
}

function SessionProvider(props: Props) {
    const { children } = props

    const [token, setSessionToken] = useState(retrieve())

    useEffect(() => {
        // update storage when token changes
        store(token)
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
