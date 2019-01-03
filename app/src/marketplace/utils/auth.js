// @flow

import { connectedRouterRedirect } from 'redux-auth-wrapper/history4/redirect'
import locationHelperBuilder from 'redux-auth-wrapper/history4/locationHelper'

import { selectUserData, isAuthenticating } from '$shared/modules/user/selectors'
import routes from '$routes'

export const userIsAuthenticated = connectedRouterRedirect({
    redirectPath: routes.login(),
    authenticatingSelector: isAuthenticating,
    // If selector is true, wrapper will not redirect
    // For example let's check that state contains user data
    authenticatedSelector: (state) => !!selectUserData(state),
    // A nice display name for this check
    wrapperDisplayName: 'UserIsAuthenticated',
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
