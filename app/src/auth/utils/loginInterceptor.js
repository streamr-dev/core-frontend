/**
 * Redirect to login when axios calls fail to authenticate.
 */

import axios from 'axios'
import routes from '$routes'
import { formatApiUrl } from '$shared/utils/url'
import { matchPath } from 'react-router-dom'

function shouldRedirect(error) {
    // ignore redirect to login logic for login route
    if (window.location.pathname === routes.login()) { return false }
    // no redirects for embeds
    if (matchPath(window.location.pathname, {
        path: routes.canvasEmbed(),
    })) {
        return false
    }

    // no redirects for canvases
    if (matchPath(window.location.pathname, {
        path: routes.canvasEditor(),
    })) {
        return false
    }

    if (error.response && error.response.status === 401) {
        const url = new window.URL(error.config.url)
        const me = new window.URL(formatApiUrl('users', 'me'))
        // shouldn't redirect if hitting /users/me api, 401 normal, signals logged out
        if (me.pathname === url.pathname && me.origin === url.origin && error.config.method === 'get') {
            return false
        }
        return true
    }
    return false
}

function getRedirect() {
    const redirect = window.location.href.slice(window.location.origin.length)
    const redirectPath = window.location.pathname
    if (!redirect) { return undefined }

    switch (redirectPath) {
        // never redirect back to login/logout/error/404 after logging in
        case routes.login():
        case routes.logout():
        case routes.error():
        case routes.notFound():
            return undefined
        default:
            return redirect
    }
}

function wait(delay) {
    return new Promise((resolve) => setTimeout(resolve, delay))
}

async function loginRedirect() {
    const redirectPath = window.location.pathname
    if (redirectPath === routes.logout()) {
        // if user is on logout route, just redirect to root
        window.location = routes.root()
    } else {
        const redirect = getRedirect()
        window.location = routes.login(redirect ? {
            redirect,
        } : {})
    }
    await wait(3000) // stall a moment to let redirect happen
}

async function notFoundRedirect() {
    window.location = routes.notFound()
    await wait(3000) // stall a moment to let redirect happen
}

function isLoggedInError(err) {
    if (!err || !err.response || !err.response.data) { return false }
    return err.response.data.user && err.response.data.user !== '<not authenticated>'
}

export async function handleLoadError(err) {
    if (!err.response) { throw err } // unexpected error
    // server issues
    if (err.response.status >= 500) {
        throw err
    }

    if (err.response.status === 404) {
        await notFoundRedirect()
    }

    if (err.response.status === 403 || err.response.status === 401) {
        // if already logged in and no access, do not redirect to login
        if (isLoggedInError(err)) {
            await notFoundRedirect() // redirect to not found
        } else {
            await loginRedirect()
        }
    }

    throw err
}

export default function installInterceptor(instance = axios) {
    // add global axios interceptor
    // redirect to login page on 401 response
    instance.interceptors.response.use((response) => response, async (error) => {
        if (shouldRedirect(error)) {
            await loginRedirect()
        }
        // always throw error anyway
        // caller shouldn't succeed
        throw error
    })

    return instance
}
