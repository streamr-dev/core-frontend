import React from 'react'
import { shallow } from 'enzyme'
import sinon from 'sinon'
import assert from 'assert-diff'

import { SaveProductDialog, mapStateToProps, mapDispatchToProps } from '$mp/containers/deprecated/EditProductPage/SaveProductDialog'
import { saveProductSteps } from '$mp/utils/constants'
import { transactionStates } from '$shared/utils/constants'
import SaveProductDialogComponent from '$mp/components/deprecated/SaveProductDialog'
import SaveContractProductDialogComponent from '$mp/components/Modal/SaveContractProductDialog'
import * as saveProductDialogActions from '$mp/modules/deprecated/saveProductDialog/actions'

describe('SaveProductDialog', () => {
    let wrapper
    let props
    let sandbox

    const product = {
        id: 'product-1',
        name: 'Product 1',
        description: 'Description',
        pricePerSecond: 1000,
        beneficiaryAddress: 'test1',
        priceCurrency: 'DATA',
    }

    beforeEach(() => {
        sandbox = sinon.createSandbox()

        props = {
            step: null,
            editProduct: product,
            contractProduct: null,
            updateFinished: false,
            contractUpdateError: null,
            contractTransaction: null,
            contractTransactionState: null,
            updateTransactionState: null,
            resetSaveDialog: sandbox.spy(),
            saveProduct: sandbox.spy(),
            onClose: sandbox.spy(),
            redirect: sandbox.spy(),

        }
    })

    afterEach(() => {
        sandbox.restore()
    })

    it('maps state to props', () => {
        const error = {
            message: 'error',
        }
        const transaction = {
            id: 'test',
        }
        const state = {
            saveProductDialog: {
                step: saveProductSteps.START,
                updateFinished: false,
            },
            updateContractProduct: {
                error,
                modifyTx: 'test',
            },
            entities: {
                transactions: {
                    test: transaction,
                },
            },
            editProduct: {
                transactionState: transactionStates.STARTED,
            },
        }
        const expectedProps = {
            step: saveProductSteps.CONFIRM,
            updateFinished: false,
            contractUpdateError: error,
            contractTransaction: transaction,
            updateTransactionState: transactionStates.STARTED,
        }

        assert.deepStrictEqual(mapStateToProps(state), expectedProps)
    })

    it('maps actions to props', () => {
        const dispatchStub = sandbox.stub().callsFake((action) => action)
        const resetSaveDialogStub = sandbox.stub(saveProductDialogActions, 'resetSaveDialog')
        const saveProductStub = sandbox.stub(saveProductDialogActions, 'saveProduct')

        const actions = mapDispatchToProps(dispatchStub, props)

        actions.resetSaveDialog()
        actions.saveProduct()

        expect(dispatchStub.callCount).toEqual(2)
        expect(resetSaveDialogStub.calledOnce).toEqual(true)
        expect(saveProductStub.calledOnce).toEqual(true)
    })

    describe('render()', () => {
        it('renders the null if no step is given', () => {
            wrapper = shallow(<SaveProductDialog {...props} />)
            expect(wrapper.html()).toEqual(null)
        })

        it('renders SaveProductDialog component when started', () => {
            props = {
                ...props,
                step: saveProductSteps.STARTED,
            }
            wrapper = shallow(<SaveProductDialog {...props} />)
            expect(wrapper.find(SaveProductDialogComponent).length).toEqual(1)
        })

        it('renders SaveProductDialog component when saving to API', () => {
            props = {
                ...props,
                step: saveProductSteps.SAVE,
            }
            wrapper = shallow(<SaveProductDialog {...props} />)
            expect(wrapper.find(SaveProductDialogComponent).length).toEqual(1)
        })

        it('renders SaveProductDialog component when saving to contract', () => {
            props = {
                ...props,
                step: saveProductSteps.TRANSACTION,
            }
            wrapper = shallow(<SaveProductDialog {...props} />)
            expect(wrapper.find(SaveContractProductDialogComponent).length).toEqual(1)
        })

        it('passes correct transaction state when saving to contract and contract transaction is not started', () => {
            props = {
                ...props,
                step: saveProductSteps.TRANSACTION,
                contractTransaction: null,
            }
            wrapper = shallow(<SaveProductDialog {...props} />)
            expect(wrapper.find(SaveContractProductDialogComponent).length).toEqual(1)
            expect(wrapper.find(SaveContractProductDialogComponent).prop('transactionState')).toEqual(transactionStates.STARTED)
        })

        it('passes correct transaction state when saving to contract and contract transaction is started', () => {
            props = {
                ...props,
                step: saveProductSteps.TRANSACTION,
                contractTransaction: {
                    id: 'test',
                    state: transactionStates.PENDING,
                },
            }
            wrapper = shallow(<SaveProductDialog {...props} />)
            expect(wrapper.find(SaveContractProductDialogComponent).length).toEqual(1)
            expect(wrapper.find(SaveContractProductDialogComponent).prop('transactionState')).toEqual(transactionStates.PENDING)
        })

        it('passes correct transaction state when saving to contract and there is an error', () => {
            props = {
                ...props,
                step: saveProductSteps.TRANSACTION,
                contractUpdateError: {
                    message: 'error',
                },
            }
            wrapper = shallow(<SaveProductDialog {...props} />)
            expect(wrapper.find(SaveContractProductDialogComponent).length).toEqual(1)
            expect(wrapper.find(SaveContractProductDialogComponent).prop('transactionState')).toEqual(transactionStates.FAILED)
        })
    })

    it('resets dialog state and starts saving on mount', () => {
        wrapper = shallow(<SaveProductDialog {...props} />)
        expect(props.resetSaveDialog.calledOnce).toEqual(true)
        expect(props.saveProduct.calledOnce).toEqual(true)
    })

    it('redirects when update has finished', (done) => {
        wrapper = shallow(<SaveProductDialog {...props} />)
        wrapper.setProps({
            updateFinished: true,
        })

        setTimeout(() => {
            expect(props.redirect.calledOnce).toEqual(true)
            done()
        }, 2000)
    })
})
