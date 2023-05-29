import React, { ReactNode, useLayoutEffect, useState } from 'react'
import { createBrowserHistory } from 'history'
import { Router } from 'react-router-dom'

export const history = createBrowserHistory({ window })

interface HubRouterProps {
    children?: ReactNode
}

export function HubRouter(props: HubRouterProps) {
    const [state, setState] = useState({
        action: history.action,
        location: history.location,
    })

    useLayoutEffect(() => {
        return history.listen(setState)
    }, [])

    return (
        <Router
            {...props}
            location={state.location}
            navigationType={state.action}
            navigator={history}
        />
    )
}
