/* eslint-disable global-require */
import setTempEnv from '$app/test/test-utils/setTempEnv'

describe('getDataTokenAddress with TOKEN_ADDRESS defined', () => {
    setTempEnv({
        TOKEN_ADDRESS: 'addr',
    })

    it('returns correct data token address', () => {
        const { default: getter } = require('$app/src/getters/getDataTokenAddress')
        expect(getter()).toEqual('addr')
    })
})

describe('getDataTokenAddress no TOKEN_ADDRESS given', () => {
    setTempEnv({
        TOKEN_ADDRESS: '',
    })

    it('returns correct default/dev side chain data token address', () => {
        const { default: getter } = require('$app/src/getters/getDataTokenAddress')
        expect(getter()).toEqual('0xbAA81A0179015bE47Ad439566374F2Bae098686F')
    })
})
