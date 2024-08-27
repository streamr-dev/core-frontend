import { init } from '@sentry/react'

if (process.env.SENTRY_DSN) {
    init({
        dsn: process.env.SENTRY_DSN,
        release: process.env.VERSION,
        environment: process.env.SENTRY_ENVIRONMENT,
        debug: true,
    })
}
