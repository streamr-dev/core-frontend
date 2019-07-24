/**
 * Redirect to login when axios calls fail to authenticate.
 */

import axios from 'axios'
import routes from '$routes'
import { formatApiUrl } from '$shared/utils/url'

const meURL = formatApiUrl('users', 'me')

function shouldRedirect(error) {
    // ignore redirect to login logic for login route
    if (window.location.pathname === routes.login()) { return false }
    if (error.response && error.response.status === 401) {
        const url = new window.URL(error.config.url)
        const me = new window.URL(meURL)
        // shouldn't redirect if hitting /users/me api, 401 normal, signals logged out
        if (me.pathname === url.pathname && me.origin === url.origin && error.config.method === 'get') {
            return false
        }
        return true
    }
    return false
}

function getRedirect() {
    let redirect = window.location.href.slice(window.location.origin.length)
    const redirectPath = window.location.pathname
    // never redirect back to login after logging in
    redirect = (redirect && redirectPath !== routes.login()) ? redirect : undefined
    // never redirect to logout after logging in
    redirect = (redirect && redirectPath !== routes.logout()) ? redirect : undefined
    return redirect
}

function wait(delay) {
    return new Promise((resolve) => setTimeout(resolve, delay))
}

export default function installInterceptor(instance = axios) {
    // add global axios interceptor
    // redirect to login page on 401 response
    instance.interceptors.response.use((response) => response, async (error) => {
        if (shouldRedirect(error)) {
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
        // always throw error anyway
        // caller shouldn't succeed
        throw error
    })

    return instance
}
