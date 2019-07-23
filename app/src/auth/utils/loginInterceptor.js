/**
 * Redirect to login when axios calls fail to authenticate.
 */

import axios from 'axios'
import routes from '$routes'

const meURL = `${process.env.STREAMR_API_URL}/users/me`

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
    // never redirect back to login after logging in
    redirect = (redirect && redirect !== routes.login()) ? redirect : undefined
    return redirect
}

export default function installInterceptor(instance = axios) {
    // add global axios interceptor
    // redirect to login page on 401 response
    instance.interceptors.response.use((response) => response, (error) => {
        if (shouldRedirect(error)) {
            const redirect = getRedirect()
            window.location = routes.login(redirect ? {
                redirect,
            } : {})
        }
        // always throw error anyway
        // caller shouldn't succeed
        throw error
    })

    return instance
}
