import EventEmitter from 'events'
import React from 'react'
import { act } from 'react-dom/test-utils'
import { mount } from 'enzyme'
import sinon from 'sinon'
import BN from 'bignumber.js'

import Transaction from '$shared/utils/Transaction'
import usePurchase, { actionsTypes } from '../usePurchase'
import * as contractProductServices from '$mp/modules/contractProduct/services'
import * as dataUnionServices from '$mp/modules/dataUnion/services'
import * as transactionActions from '$mp/modules/transactions/actions'
import * as productServices from '$mp/modules/product/services'

import { transactionStates, transactionTypes } from '$shared/utils/constants'

jest.mock('react-redux', () => ({
    useDispatch: jest.fn().mockImplementation(() => (action) => action),
}))

describe('usePurchase', () => {
    let sandbox

    beforeAll(() => {
        // don't show error as console.error
        jest.spyOn(console, 'error')
        console.error.mockImplementation((...args) => console.warn(...args))
    })

    beforeEach(() => {
        sandbox = sinon.createSandbox()
    })

    afterEach(() => {
        sandbox.restore()
    })

    afterAll(() => {
        console.error.mockRestore()
    })

    describe('input data', () => {
        it('throws an error if contract product not found', async () => {
            let result
            function Test() {
                result = usePurchase()
                return null
            }

            mount((
                <Test />
            ))

            await act(async () => {
                try {
                    await result.purchase()
                    expect(true).toBe(false) // shouldn't come here
                } catch (e) {
                    expect(e).toBeTruthy()
                    expect(e.message).toBe('no product')
                }
            })
        })
    })
})
