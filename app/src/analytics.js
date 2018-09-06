// @flow

import Raven from 'raven-js'

Raven.config('https://e012761929d24baa96ca82772f60b395@sentry.io/1203154', {
    release: process.env.VERSION || 'development',
}).install()
