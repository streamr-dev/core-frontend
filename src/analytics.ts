import { init } from '@sentry/react'
import { getEnvironmentConfig } from './getters/getEnvironmentConfig'

const { streamrUrl, platformOriginUrl } = getEnvironmentConfig()

if (process.env.SENTRY_DSN) {
    init({
        dsn: process.env.SENTRY_DSN,
        release: process.env.VERSION,
        environment: process.env.SENTRY_ENVIRONMENT,
        allowUrls: [
            window.location.origin,
            process.env.PLATFORM_PUBLIC_PATH || '',
            platformOriginUrl,
            streamrUrl,
        ].filter(Boolean),
        debug: true,
    })
}
