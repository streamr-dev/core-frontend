import { getGlobalScope, init } from '@sentry/react'

if (process.env.SENTRY_DSN) {
    init({
        dsn: process.env.SENTRY_DSN,
        release: process.env.VERSION,
        environment: process.env.SENTRY_ENVIRONMENT,
        debug: true,
    })

    getGlobalScope().setExtras({
        '@streamr/sdk': process.env.STREAMR_SDK_VERSION,
        '@streamr/config': process.env.STREAMR_CONFIG_VERSION,
    })
}
