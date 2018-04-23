// @flow

import { connectedRouterRedirect, connectedReduxRedirect } from 'redux-auth-wrapper/history4/redirect'
import locationHelperBuilder from 'redux-auth-wrapper/history4/locationHelper'

import { selectLoginKey, selectFetchingExternalLogin, selectFetchingLoginKey } from '../modules/user/selectors'
import { startExternalLogin } from '../modules/user/actions'

export const userIsAuthenticated = connectedReduxRedirect({
    redirectPath: 'NOT_USED_BUT_MUST_PROVIDE',
    authenticatingSelector: (state) => selectFetchingLoginKey(state) || selectFetchingExternalLogin(state),
    // If selector is true, wrapper will not redirect
    // For example let's check that state contains user data
    authenticatedSelector: (state) => selectLoginKey(state) !== null,
    // A nice display name for this check
    wrapperDisplayName: 'UserIsAuthenticated',
    redirectAction: (newLoc) => (dispatch) => {
        const accessedPath = new URLSearchParams(newLoc.search).get('redirect')
        let redirect = `${process.env.MARKETPLACE_URL}/login/external?redirect=${accessedPath}`

        // Make sure we have a forward slash at the end because
        // otherwise redirection will not work
        if (!redirect.endsWith('/')) {
            redirect += '/'
        }

        const url = `${process.env.LOGIN_URL}?redirect=${encodeURIComponent(redirect)}`
        dispatch(startExternalLogin())

        // We cannot use 'push' or 'replace' since we are redirecting
        // outside of this application
        window.location.assign(url)
    },
})

const locationHelper = locationHelperBuilder({})

export const userIsNotAuthenticated = connectedRouterRedirect({
    // This sends the user either to the query param route if we have one, or to
    // the landing page if none is specified and the user is already logged in
    redirectPath: (state, ownProps) => locationHelper.getRedirectQueryParam(ownProps) || '/',
    // This prevents us from adding the query parameter when we send the user away from the login page
    allowRedirectBack: false,
    // If selector is true, wrapper will not redirect
    // So if there is no user data, then we show the page
    authenticatedSelector: (state) => selectLoginKey(state) === null,
    // A nice display name for this check
    wrapperDisplayName: 'UserIsNotAuthenticated',
})
