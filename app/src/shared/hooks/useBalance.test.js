import React from 'react'
import BN from 'bignumber.js'
import sinon from 'sinon'

import * as utils from '$mp/utils/web3'

import { getBalance, BalanceType } from './useBalance'

describe('getBalance', () => {
    let sandbox

    beforeEach(() => {
        sandbox = sinon.createSandbox()
    })

    afterEach(() => {
        sandbox.restore()
        sandbox.reset()
    })

    it('gets ETH balance', async () => {
        sandbox.stub(utils, 'getEthBalance').callsFake(() => '123')

        const balance = await getBalance('testAccount', BalanceType.ETH)

        expect(balance).toBe('123')
    })

    it('gets token balance', async () => {
        sandbox.stub(utils, 'getDataTokenBalance').callsFake(() => '123')

        const balance = await getBalance('testAccount', BalanceType.DATA)
        expect(balance).toBe('123')
    })

    it('throws an error if type is unknown', async () => {
        let balance
        let error
        try {
            balance = await getBalance('testAccount', 'someToken')
        } catch (e) {
            error = e
        }

        expect(error).toBeDefined()
        expect(balance).not.toBeDefined()
    })
})
