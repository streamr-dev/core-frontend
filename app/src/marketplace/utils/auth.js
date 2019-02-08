// @flow

import { connectedRouterRedirect, connectedReduxRedirect } from 'redux-auth-wrapper/history4/redirect'
import locationHelperBuilder from 'redux-auth-wrapper/history4/locationHelper'
import queryString from 'query-string'

import { selectUserData, isAuthenticating } from '$shared/modules/user/selectors'
import { startExternalLogin } from '$shared/modules/user/actions'

import { getLoginUrl } from './login'

export const doExternalLogin = (accessedPath: string) => {
    // Use browser's native redirection for external redirect
    // Use .replace to skip recording a needless step which would break native Back function
    window.location.replace(getLoginUrl(accessedPath))
}

export const userIsAuthenticated = connectedReduxRedirect({
    redirectPath: 'NOT_USED_BUT_MUST_PROVIDE',
    authenticatingSelector: isAuthenticating,
    // If selector is true, wrapper will not redirect
    // For example let's check that state contains user data
    authenticatedSelector: (state) => selectUserData(state),
    // A nice display name for this check
    wrapperDisplayName: 'UserIsAuthenticated',
    redirectAction: (newLoc) => (dispatch) => {
        const accessedPath = queryString.parse(newLoc.search).redirect
        dispatch(startExternalLogin())
        doExternalLogin(accessedPath)
    },
})

const locationHelper = locationHelperBuilder({})

export const userIsNotAuthenticated = connectedRouterRedirect({
    authenticatingSelector: isAuthenticating,
    // This sends the user either to the query param route if we have one, or to
    // the landing page if none is specified and the user is already logged in
    redirectPath: (state, ownProps) => locationHelper.getRedirectQueryParam(ownProps) || '/',
    // This prevents us from adding the query parameter when we send the user away from the login page
    allowRedirectBack: false,
    // If selector is true, wrapper will not redirect
    // So if there is no user data, then we show the page
    authenticatedSelector: (state) => !selectUserData(state),
    // A nice display name for this check
    wrapperDisplayName: 'UserIsNotAuthenticated',
})
