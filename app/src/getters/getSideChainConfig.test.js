/* eslint-disable global-require */
import setTempEnv from '$app/test/test-utils/setTempEnv'

describe('getSideChainConfig with all vars defined', () => {
    setTempEnv({
        SIDE_CHAIN_ID: '42',
        SIDECHAIN_URL: 'url',
        TEST_TIMEOUT: '1337',
    })

    it('returns correct chain connection info', () => {
        const { default: getter } = require('$app/src/getters/getSideChainConfig')
        expect(getter().url).toEqual('url')
        expect(getter().timeout).toEqual(1337)
        expect(getter().chainId).toEqual(42)
    })
})

describe('getSideChainConfig driven by defaults', () => {
    setTempEnv({
        SIDE_CHAIN_ID: '',
        SIDECHAIN_URL: '',
        STREAMR_DOCKER_DEV_HOST: 'host',
    })

    it('returns correct default/dev chain connection info', () => {
        const { default: getter } = require('$app/src/getters/getSideChainConfig')
        expect(getter().url).toEqual('http://host:8546')
        expect(getter().timeout).toBe(undefined)
        expect(getter().chainId).toEqual(8997)
    })
})
