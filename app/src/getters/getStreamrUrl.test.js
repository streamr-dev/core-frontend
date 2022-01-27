/* eslint-disable global-require */
import setTempEnv from '$app/test/test-utils/setTempEnv'

describe('getStreamrUrl with STREAMR_URL defined', () => {
    setTempEnv({
        STREAMR_URL: 'url',
    })

    it('returns correct url', () => {
        const { default: getter } = require('$app/src/getters/getStreamrUrl')
        expect(getter()).toEqual('url')
    })
})

describe('getStreamrUrl no STREAMR_URL given', () => {
    setTempEnv({
        STREAMR_URL: '',
        STREAMR_DOCKER_DEV_HOST: 'host',
    })

    it('returns correct default url', () => {
        const { default: getter } = require('$app/src/getters/getStreamrUrl')
        expect(getter()).toEqual('http://host')
    })
})

describe('getStreamrUrl no STREAMR_URL nor STREAMR_DOCKER_DEV_HOST given', () => {
    setTempEnv({
        STREAMR_URL: '',
        STREAMR_DOCKER_DEV_HOST: '',
    })

    it('returns correct über-default url', () => {
        const { default: getter } = require('$app/src/getters/getStreamrUrl')
        expect(getter()).toEqual('http://localhost')
    })
})
