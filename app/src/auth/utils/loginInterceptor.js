/**
 * Redirect to login when axios calls fail to authenticate.
 */

import axios from 'axios'
import routes from '$routes'
import { matchPath } from 'react-router-dom'
import ResourceNotFoundError, { ResourceType } from '$shared/errors/ResourceNotFoundError'
import InvalidHexStringError from '$shared/errors/InvalidHexStringError'

function shouldRedirect(error) {
    // ignore redirect to login logic for login route
    if (window.location.pathname === routes.auth.login()) { return false }
    // no redirects for embeds
    if (matchPath(window.location.pathname, {
        path: routes.canvases.embed(),
    })) {
        return false
    }

    // no redirects for canvases
    if (matchPath(window.location.pathname, {
        path: routes.canvases.edit(),
    })) {
        return false
    }

    if (error.response && error.response.status === 401) {
        const { ignoreUnauthorized } = error.config

        if (ignoreUnauthorized) {
            return false
        }

        const url = new window.URL(error.config.url)
        const me = new window.URL(routes.api.currentUser.index())

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
        case routes.auth.login():
        case routes.auth.logout():
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
    if (redirectPath === routes.auth.logout()) {
        // if user is on logout route, just redirect to root
        window.location = routes.root()
    } else {
        const redirect = getRedirect()
        window.location = routes.auth.login(redirect ? {
            redirect,
        } : {})
    }
    await wait(3000) // stall a moment to let redirect happen
}

function isLoggedInError(err) {
    if (!err || !err.response || !err.response.data) { return false }
    return err.response.data.user && err.response.data.user !== '<not authenticated>'
}

export function canHandleLoadError(err) {
    if (!err.response) { return false }
    if (err.response.status === 404) { return true }
    if (err.response.status === 403) { return true }
    if (err.response.status === 401) { return true }
    return false
}

export async function handleLoadError({ error, ignoreUnauthorized = false } = {}) {
    if (error instanceof InvalidHexStringError) {
        throw new ResourceNotFoundError(ResourceType.PRODUCT, error.id)
    }

    const { status } = error.response || {}

    if (!status || status >= 500) {
        throw error
    }

    if (status === 404 || ([401, 403].includes(status) && (!!ignoreUnauthorized || isLoggedInError(error)))) {
        const data = error.response.data || {}
        throw new ResourceNotFoundError(data.type || data.resource, data.id)
    }

    if ([401, 403].includes(status)) {
        await loginRedirect()
    }

    throw error
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
