/* eslint-disable global-require */
import setTempEnv from '$app/test/test-utils/setTempEnv'

describe('getMainChainConfig with ETHEREUM_SERVER_URL defined', () => {
    setTempEnv({
        ETHEREUM_SERVER_URL: 'url',
        TEST_TIMEOUT: '1337',
    })

    it('returns correct connection info', () => {
        const { default: getter } = require('$app/src/getters/getMainChainConfig')
        expect(getter().url).toEqual('url')
        expect(getter().timeout).toEqual(1337)
    })
})

describe('getMainChainConfig no ETHEREUM_SERVER_URL given', () => {
    setTempEnv({
        ETHEREUM_SERVER_URL: '',
        STREAMR_DOCKER_DEV_HOST: 'host',
    })

    it('returns correct connection info', () => {
        const { default: getter } = require('$app/src/getters/getMainChainConfig')
        expect(getter().url).toEqual('http://host:8545')
        expect(getter().timeout).toBe(undefined)
    })
})
