/* eslint-disable global-require */
import setTempEnv from '$app/test/test-utils/setTempEnv'

describe('getPlatformOriginUrl with PLATFORM_ORIGIN_URL defined', () => {
    setTempEnv({
        PLATFORM_ORIGIN_URL: 'url',
    })

    it('returns correct url', () => {
        const { default: getter } = require('$app/src/getters/getPlatformOriginUrl')
        expect(getter()).toEqual('url')
    })
})

describe('getPlatformOriginUrl no PLATFORM_ORIGIN_URL given', () => {
    setTempEnv({
        PLATFORM_ORIGIN_URL: '',
        STREAMR_DOCKER_DEV_HOST: 'host',
    })

    it('returns correct default url', () => {
        const { default: getter } = require('$app/src/getters/getPlatformOriginUrl')
        expect(getter()).toEqual('http://host')
    })
})
