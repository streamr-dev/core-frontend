import * as Sentry from '@sentry/browser'
import { RewriteFrames } from '@sentry/integrations'
import LogRocket from 'logrocket'
import { Severity } from '@sentry/browser'
import getCoreConfig from '$app/src/getters/getCoreConfig'
type ErrorServiceId = string
type ErrorService = {
    id: ErrorServiceId
    init?: (...args: Array<any>) => any
    reportError?: (...args: Array<any>) => any
    getMiddleware?: (...args: Array<any>) => any,
    reportWarning?: (...args: Array<any>) => any
}
// TODO add typing
export class Analytics {
    services: {[key: string]: any} = {}
    register({ id, init, reportError, getMiddleware }: ErrorService): void {
        if (!id) {
            throw new Error('Service has no id!')
        }

        if (this.services[id]) {
            throw new Error(`Service ${id} already exists!`)
        }

        this.services[id] = {
            id,
            init: typeof init === 'function' ? init : undefined,
            reportError: typeof reportError === 'function' ? reportError : undefined,
            getMiddleware: typeof getMiddleware === 'function' ? getMiddleware : undefined,
        }

        if (this.services[id].init) {
            this.services[id].init()
        }
    }
    deregister (id: ErrorServiceId): void {
        delete this.services[id]
    }
    reportError(error: Error, extra: Record<string, any> = {}): void {
        Object.keys(this.services).forEach(
            (id) => this.services[id].reportError && this.services[id].reportError(error, extra),
        )
    }
    reportWarning(error: Error, extra: Record<string, any> = {}): void {
        Object.keys(this.services).forEach(
            (id) => this.services[id].reportWarning && this.services[id].reportWarning(error, extra),
        )
    }
    getMiddlewares(): any {
        return Object.keys(this.services).reduce(
            (result, id) => [
                ...result,
                ...(this.services[id].getMiddleware ? [this.services[id].getMiddleware()] : []),
            ],
            [],
        )
    }
}
const analytics = new Analytics()
const { streamrUrl, platformOriginUrl } = getCoreConfig()

if (process.env.SENTRY_DSN) {
    analytics.register({
        id: 'Sentry',
        init: () =>
            Sentry.init({
                dsn: process.env.SENTRY_DSN,
                release: process.env.VERSION,
                environment: process.env.SENTRY_ENVIRONMENT,
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                integrations: [new RewriteFrames()],
                whitelistUrls: [
                    window.location.origin,
                    process.env.PLATFORM_PUBLIC_PATH,
                    platformOriginUrl,
                    streamrUrl,
                ].filter(Boolean),
                debug: true,
            }),
        reportError: (error: Error, extra: Record<string, any> = {}) => {
            Sentry.withScope((scope) => {
                scope.setTag('error_boundary', true)

                if (extra) {
                    scope.setExtras(extra)
                }

                Sentry.captureException(error)
            })
        },
        reportWarning: (error: Error, extra: Record<string, any> = {}) => {
            console.warn({
                error,
                extra,
            })
            // eslint-disable-line no-console
            Sentry.withScope((scope) => {
                scope.setTag('error_boundary', true)

                if (extra) {
                    scope.setExtras(extra)
                }

                scope.setLevel(Severity.Warning)
                Sentry.captureException(error)
            })
        },
    })
}

// empty the request body for these paths
const urlBlackList = ['/api/v2/login/password']

if (process.env.LOGROCKET_SLUG) {
    analytics.register({
        id: 'LogRocket',
        init: () => {
            LogRocket.init(process.env.LOGROCKET_SLUG, {
                network: {
                    requestSanitizer: (request: any) => {
                        const requestUrl = request.url.toLowerCase()

                        // if the url contains one of the blacklisted paths
                        if (urlBlackList.some((search) => requestUrl.indexOf(search) !== -1)) {
                            // scrub out the body
                            request.body = null
                        }

                        return request
                    },
                },
            })
        },
        reportError: (error: Error, extra: Record<string, any> = {}) => {
            LogRocket.captureException(error, {
                extra,
            })
        },
        getMiddleware: () => LogRocket.reduxMiddleware(),
    })
}

export default analytics
