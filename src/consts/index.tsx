import React, { ReactNode, useLayoutEffect, useState } from 'react'
import { BrowserHistory, createBrowserHistory } from 'history'
import { Router } from 'react-router-dom'

export const history = createBrowserHistory({ window })

interface HubRouterProps {
    history?: BrowserHistory
    children?: ReactNode
}

/**
 * Custom browser Router that allows us to access `history`.
 */
export function HubRouter({ history: historyProp = history, ...props }: HubRouterProps) {
    const [state, setState] = useState({
        action: historyProp.action,
        location: historyProp.location,
    })

    useLayoutEffect(() => {
        return historyProp.listen(setState)
    }, [historyProp])

    return (
        <Router
            {...props}
            location={state.location}
            navigationType={state.action}
            navigator={historyProp}
        />
    )
}

export const MaxSearchPhraseLength = 250
