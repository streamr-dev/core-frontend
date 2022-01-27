/* eslint-disable global-require */
import setTempEnv from '$app/test/test-utils/setTempEnv'

describe('getMainChainId with MAIN_CHAIN_ID defined', () => {
    setTempEnv({
        MAIN_CHAIN_ID: '1',
    })

    it('returns correct chain id', () => {
        const { default: getter } = require('$app/src/getters/getMainChainId')
        expect(getter()).toEqual(1)
    })
})

describe('getMainChainId no MAIN_CHAIN_ID given', () => {
    setTempEnv({
        MAIN_CHAIN_ID: '',
    })

    it('returns correct default chain id', () => {
        const { default: getter } = require('$app/src/getters/getMainChainId')
        expect(getter()).toEqual(8995)
    })
})
