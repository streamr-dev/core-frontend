// @flow

import Raven from 'raven-js'
import LogRocket from 'logrocket'

type ErrorServiceId = string
type ErrorService = {
    id: ErrorServiceId,
    init?: Function,
    reportError?: Function,
    getMiddleware?: Function,
}

class Analytics {
    services = {}

    register = ({ id, init, reportError, getMiddleware }: ErrorService) => {
        if (this.services[id]) {
            throw new Error(`Service ${id} already exists!`)
        }

        this.services[id] = {
            id,
            init: (typeof init === 'function') ? init : undefined,
            reportError: (typeof reportError === 'function') ? reportError : undefined,
            getMiddleware: (typeof getMiddleware === 'function') ? getMiddleware : undefined,
        }

        if (this.services[id].init) {
            this.services[id].init()
        }
    }

    deregister = (id: ErrorServiceId) => {
        delete this.services[id]
    }

    reportError = (error: Error, extra: Object = {}) => {
        Object.keys(this.services).forEach((id) => this.services[id].reportError && this.services[id].reportError(error, extra))
    }

    getMiddlewares = () => Object.keys(this.services).reduce((result, id) => ([
        ...result,
        ...(this.services[id].getMiddleware ? [this.services[id].getMiddleware()] : []),
    ]), [])
}

const analytics = new Analytics()

if (process.env.SENTRY_URL) {
    analytics.register({
        id: 'Sentry',
        init: () => {
            Raven.config(process.env.SENTRY_URL, {
                release: process.env.VERSION || 'development',
            }).install()
        },
        reportError: (error: Error, extra: Object = {}) => {
            Raven.captureException(error, {
                extra,
            })
        },
    })
}

if (process.env.LOGROCKET_SLUG) {
    analytics.register({
        id: 'LogRocket',
        init: () => {
            LogRocket.init(process.env.LOGROCKET_SLUG)
        },
        reportError: (error: Error, extra: Object = {}) => {
            LogRocket.captureException(error, {
                extra,
            })
        },
        getMiddleware: () => LogRocket.reduxMiddleware(),
    })
}

export default analytics
