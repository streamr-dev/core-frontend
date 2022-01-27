/* eslint-disable global-require */
import setTempEnv from '$app/test/test-utils/setTempEnv'

describe('getRestUrl with REST_URL defined', () => {
    setTempEnv({
        REST_URL: 'url',
    })

    it('returns correct url', () => {
        const { default: getter } = require('$app/src/getters/getRestUrl')
        expect(getter()).toEqual('url')
    })
})

describe('getRestUrl no REST_URL given', () => {
    setTempEnv({
        REST_URL: '',
        STREAMR_DOCKER_DEV_HOST: 'host',
    })

    it('returns correct default url', () => {
        const { default: getter } = require('$app/src/getters/getRestUrl')
        expect(getter()).toEqual('http://host/api/v1')
    })
})
