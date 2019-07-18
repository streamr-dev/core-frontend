// @flow

import BN from 'bignumber.js'

import axios from 'axios'
import routes from '$routes'

// add global axios interceptor
// redirect to login page on 401 response
axios.interceptors.response.use((response) => response, (error) => {
    if (error.response && error.response.status === 401 && window.location.pathname !== routes.login()) {
        let redirect = window.location.href.slice(window.location.origin.length)
        redirect = (redirect && redirect !== '/' && redirect !== routes.login()) ? redirect : undefined
        window.location = routes.login(redirect ? {
            redirect,
        } : {})
    }
    // otherwise ignore
    throw error
})

BN.config({
    DECIMAL_PLACES: 18,
})
