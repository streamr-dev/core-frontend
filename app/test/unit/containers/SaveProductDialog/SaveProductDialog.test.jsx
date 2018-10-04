import React from 'react'
import { shallow } from 'enzyme'
import sinon from 'sinon'
// import assert from 'assert-diff'

import { SaveProductDialog } from '$mp/containers/EditProductPage/SaveProductDialog'
// import * as updateContractProductActions from '$mp/modules/updateContractProduct/actions'
// import * as editProductActions from '$mp/modules/editProduct/actions'
// import * as modalActions from '$mp/modules/modals/actions'
// import { transactionStates } from '$mp/utils/constants'
// import SaveProductDialogComponent from '$mp/components/Modal/SaveProductDialog'

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
    /* const contractProduct = {
        id: 'product-1',
        pricePerSecond: 1000,
        beneficiaryAddress: 'test1',
        priceCurrency: 'DATA',
    } */

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
            onCancel: sandbox.spy(),
            redirect: sandbox.spy(),

        }
    })

    afterEach(() => {
        sandbox.restore()
    })

    describe('render()', () => {
        it('renders the null if no step is given', () => {
            wrapper = shallow(<SaveProductDialog {...props} />)
            expect(wrapper.html()).toEqual(null)
        })
    })
})
