import assert from 'assert-diff'
import sinon from 'sinon'

import * as actions from '$mp/modules/deprecated/saveProductDialog/actions'
import * as constants from '$mp/modules/deprecated/saveProductDialog/constants'
import * as editProductActions from '$mp/modules/deprecated/editProduct/actions'
import * as contractProductActions from '$mp/modules/updateContractProduct/actions'
import * as contractProductSelectors from '$mp/modules/contractProduct/selectors'
import * as editProductSelectors from '$mp/modules/deprecated/editProduct/selectors'
import * as smartContractUtils from '$mp/utils/smartContract'
import { saveProductSteps } from '$mp/utils/constants'

import mockStore from '$testUtils/mockStoreProvider'

describe('saveProductDialog - actions', () => {
    let sandbox

    beforeEach(() => {
        sandbox = sinon.createSandbox()
    })

    afterEach(() => {
        sandbox.restore()
    })

    it('resets the save dialog state', () => {
        sandbox.stub(editProductActions, 'resetUpdateProductTransaction').callsFake(() => ({
            type: 'resetUpdateProductTransaction',
        }))
        sandbox.stub(contractProductActions, 'resetUpdateContractProductTransaction').callsFake(() => ({
            type: 'resetUpdateContractProductTransaction',
        }))
        const store = mockStore()
        store.dispatch(actions.resetSaveDialog())

        const expectedActions = [
            {
                type: constants.INIT_SAVE_DIALOG,
            },
            {
                type: 'resetUpdateProductTransaction',
            },
            {
                type: 'resetUpdateContractProductTransaction',
            },
        ]

        assert.deepStrictEqual(store.getActions(), expectedActions)
    })

    describe('saveProduct()', () => {
        it('starts the product saving when no contract product exists', () => {
            const contractProduct = null
            const editProduct = {
                pricePerSecond: '1',
                beneficiaryAddress: '0x123',
                priceCurrency: 'DATA',
            }
            sandbox.stub(contractProductSelectors, 'selectContractProduct').callsFake(() => contractProduct)
            sandbox.stub(editProductSelectors, 'selectEditProduct').callsFake(() => editProduct)
            sandbox.stub(smartContractUtils, 'isUpdateContractProductRequired').callsFake(() => false)
            sandbox.stub(editProductActions, 'updateProduct').callsFake(() => ({
                type: 'updateProduct',
            }))
            sandbox.stub(contractProductActions, 'updateContractProduct').callsFake(() => ({
                type: 'updateContractProduct',
            }))

            const store = mockStore()
            store.dispatch(actions.saveProduct())

            const expectedActions = [
                {
                    type: constants.SET_STEP,
                    payload: {
                        step: saveProductSteps.STARTED,
                    },
                },
                {
                    type: 'updateProduct',
                },
                {
                    type: constants.SET_STEP,
                    payload: {
                        step: saveProductSteps.SAVE,
                    },
                },
            ]

            assert.deepStrictEqual(store.getActions(), expectedActions)
        })

        it('starts the product saving when contract product exists but no need to update', () => {
            const contractProduct = {
                id: 'test',
                pricePerSecond: '1',
                beneficiaryAddress: '0x123',
                priceCurrency: 'DATA',
            }
            const editProduct = {
                pricePerSecond: '1',
                beneficiaryAddress: '0x123',
                priceCurrency: 'DATA',
            }
            sandbox.stub(contractProductSelectors, 'selectContractProduct').callsFake(() => contractProduct)
            sandbox.stub(editProductSelectors, 'selectEditProduct').callsFake(() => editProduct)
            sandbox.stub(smartContractUtils, 'isUpdateContractProductRequired').callsFake(() => false)
            sandbox.stub(editProductActions, 'updateProduct').callsFake(() => ({
                type: 'updateProduct',
            }))
            sandbox.stub(contractProductActions, 'updateContractProduct').callsFake(() => ({
                type: 'updateContractProduct',
            }))

            const store = mockStore()
            store.dispatch(actions.saveProduct())

            const expectedActions = [
                {
                    type: constants.SET_STEP,
                    payload: {
                        step: saveProductSteps.STARTED,
                    },
                },
                {
                    type: 'updateProduct',
                },
                {
                    type: constants.SET_STEP,
                    payload: {
                        step: saveProductSteps.SAVE,
                    },
                },
            ]

            assert.deepStrictEqual(store.getActions(), expectedActions)
        })

        it('starts the product saving when contract product exists and needs to update', () => {
            const contractProduct = {
                id: 'test',
                pricePerSecond: '1',
                beneficiaryAddress: '0x123',
                priceCurrency: 'DATA',
            }
            const editProduct = {
                pricePerSecond: '1',
                beneficiaryAddress: '0x123',
                priceCurrency: 'DATA',
            }
            sandbox.stub(contractProductSelectors, 'selectContractProduct').callsFake(() => contractProduct)
            sandbox.stub(editProductSelectors, 'selectEditProduct').callsFake(() => editProduct)
            sandbox.stub(smartContractUtils, 'isUpdateContractProductRequired').callsFake(() => true)
            sandbox.stub(editProductActions, 'updateProduct').callsFake(() => ({
                type: 'updateProduct',
            }))
            sandbox.stub(contractProductActions, 'updateContractProduct').callsFake(() => ({
                type: 'updateContractProduct',
            }))

            const store = mockStore()
            store.dispatch(actions.saveProduct())

            const expectedActions = [
                {
                    type: constants.SET_STEP,
                    payload: {
                        step: saveProductSteps.STARTED,
                    },
                },
                {
                    type: 'updateProduct',
                },
                {
                    type: constants.SET_STEP,
                    payload: {
                        step: saveProductSteps.TRANSACTION,
                    },
                },
                {
                    type: 'updateContractProduct',
                },
            ]

            assert.deepStrictEqual(store.getActions(), expectedActions)
        })
    })
})
