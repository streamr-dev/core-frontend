/* eslint-disable global-require */
import setTempEnv from '$app/test/test-utils/setTempEnv'

describe('getSidechainDataTokenAddress with TOKEN_ADDRESS_SIDECHAIN defined', () => {
    setTempEnv({
        TOKEN_ADDRESS_SIDECHAIN: 'addr',
    })

    it('returns correct data token address', () => {
        const { default: getter } = require('$app/src/getters/getSidechainDataTokenAddress')
        expect(getter()).toEqual('addr')
    })
})

describe('getSidechainDataTokenAddress no TOKEN_ADDRESS_SIDECHAIN given', () => {
    setTempEnv({
        TOKEN_ADDRESS_SIDECHAIN: '',
    })

    it('returns correct default/dev side chain data token address', () => {
        const { default: getter } = require('$app/src/getters/getSidechainDataTokenAddress')
        expect(getter()).toEqual('0x73Be21733CC5D08e1a14Ea9a399fb27DB3BEf8fF')
    })
})
