import * as Sentry from '@sentry/browser'
import { RewriteFrames } from '@sentry/integrations'
import LogRocket from 'logrocket'
import { getEnvironmentConfig } from './getters/getEnvironmentConfig'

type ErrorService = {
    id: string
    init?: (...args: any[]) => void
    reportError?: (...args: any[]) => void
    getMiddleware?: (...args: any[]) => unknown
    reportWarning?: (...args: any[]) => void
}

export class Analytics {
    services: Record<string, ErrorService | undefined> = {}

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
            getMiddleware:
                typeof getMiddleware === 'function' ? getMiddleware : undefined,
        }

        this.services[id]?.init?.()
    }

    deregister(id: string): void {
        delete this.services[id]
    }

    reportError(error: Error, extra: Record<string, unknown> = {}): void {
        for (const id in this.services) {
            this.services[id]?.reportError?.(error, extra)
        }
    }

    reportWarning(error: Error, extra: Record<string, any> = {}): void {
        for (const id in this.services) {
            this.services[id]?.reportWarning?.(error, extra)
        }
    }

    getMiddlewares(): unknown[] {
        const middlewares: unknown[] = []

        for (const id in this.services) {
            const { getMiddleware } = this.services[id] || {}

            if (typeof getMiddleware === 'function') {
                middlewares.push(getMiddleware())
            }
        }

        return middlewares
    }
}

const analytics = new Analytics()

const { streamrUrl, platformOriginUrl } = getEnvironmentConfig()

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
                allowUrls: [
                    window.location.origin,
                    process.env.PLATFORM_PUBLIC_PATH || '',
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

                scope.setLevel('warning')
                Sentry.captureException(error)
            })
        },
    })
}

// empty the request body for these paths
const urlBlackList = ['/api/v2/login/password']

const { LOGROCKET_SLUG = '' } = process.env

if (LOGROCKET_SLUG) {
    analytics.register({
        id: 'LogRocket',
        init: () => {
            LogRocket.init(LOGROCKET_SLUG, {
                network: {
                    requestSanitizer: (request: any) => {
                        const requestUrl = request.url.toLowerCase()

                        // if the url contains one of the blacklisted paths
                        if (
                            urlBlackList.some(
                                (search) => requestUrl.indexOf(search) !== -1,
                            )
                        ) {
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
    })
}
