import React, { FunctionComponent, ReactNode } from 'react'
import {Redirect, useLocation} from "react-router-dom"
import {useIsAuthenticated} from "$auth/hooks/useIsAuthenticated"
import routes from '$routes'

export const UserIsAuthenticatedRoute: FunctionComponent<{children: ReactNode}> = ({children}) => {
    const {pathname, search} = useLocation()
    const isAuthenticated = useIsAuthenticated()
    return isAuthenticated
        ? <>{children}</>
        : <Redirect to={routes.auth.login({redirectTo: encodeURIComponent(pathname + search)})}/>
}

export const UserIsNotAuthenticatedRoute: FunctionComponent<{children: ReactNode}> = ({children}) => {
    const {search} = useLocation()
    const redirectFromParams = new URLSearchParams(search).get('redirectTo')
    const redirect = redirectFromParams ? decodeURIComponent(redirectFromParams) : routes.root()
    const isAuthenticated = useIsAuthenticated()
    return isAuthenticated ? <Redirect to={redirect}/> : <>{children}</>
}
