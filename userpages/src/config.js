// @flow

const isProd = process.env.NODE_ENV === 'production'

// TODO: add more stuff here (e.g. apiUrl)
module.exports = {
    wsUrl: process.env.WS_URL || (isProd && 'wss://www.streamr.com/api/v1/ws') || 'ws://127.0.0.1:8890/api/v1/ws',
    restUrl: process.env.REST_URL || (isProd && 'https://www.streamr.com/api/v1') || 'http://127.0.0.1:8890/api/v1',
}
