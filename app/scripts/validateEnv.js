const { object, string, number, lazy } = require('yup')

const nonNegativeNumberic = () => lazy((v) => (
    typeof v === 'string'
        ? string().required().matches(/^\d+$/)
        : number().required().min(0)
))

const envSchema = object({
    GOOGLE_ANALYTICS_ID: string().required(),
    PLATFORM_PUBLIC_PATH: string().required().url(),
    PORT: nonNegativeNumberic(),
    SENTRY_DSN: string().required().url(),
    SENTRY_ENVIRONMENT: string().required(),
    SENTRY_INDEXER_DSN: string().required().url(),
    SENTRY_ORG: string().required(),
    SENTRY_PROJECT: string().required(),
})

module.exports = (env) => (
    envSchema.validate(env)
)
