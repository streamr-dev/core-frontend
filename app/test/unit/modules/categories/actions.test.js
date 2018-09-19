import assert from 'assert-diff'
import { normalize } from 'normalizr'
import sinon from 'sinon'
import mockStore from '../../../test-utils/mockStoreProvider'

import * as actions from '../../../../src/marketplace/modules/categories/actions'
import * as constants from '../../../../src/marketplace/modules/categories/constants'
import * as entityConstants from '../../../../src/marketplace/modules/entities/constants'
import * as services from '../../../../src/marketplace/modules/categories/services'
import { categoriesSchema } from '../../../../src/marketplace/modules/entities/schema'

describe('categories - actions', () => {
    let sandbox

    beforeEach(() => {
        sandbox = sinon.createSandbox()
    })

    afterEach(() => {
        sandbox.restore()
    })

    describe('getCategories', () => {
        it('gets categories succesfully', async () => {
            const categories = [
                {
                    id: 1,
                    name: 'Test 1',
                },
                {
                    id: 2,
                    name: 'Test 2',
                },
            ]
            const { result, entities } = normalize(categories, categoriesSchema)

            sandbox.stub(services, 'getCategories').callsFake(() => Promise.resolve(categories))

            const store = mockStore()
            await store.dispatch(actions.getCategories(true))

            const expectedActions = [
                {
                    type: constants.GET_CATEGORIES_REQUEST,
                },
                {
                    type: entityConstants.UPDATE_ENTITIES,
                    payload: {
                        entities,
                    },
                },
                {
                    type: constants.GET_CATEGORIES_SUCCESS,
                    payload: {
                        categories: result,
                    },
                },
            ]
            assert.deepStrictEqual(store.getActions(), expectedActions)
        })

        it('responds to errors', async () => {
            const error = new Error('Error')
            sandbox.stub(services, 'getCategories').callsFake(() => Promise.reject(error))

            const store = mockStore()
            await store.dispatch(actions.getCategories(true))

            const expectedActions = [
                {
                    type: constants.GET_CATEGORIES_REQUEST,
                },
                {
                    type: constants.GET_CATEGORIES_FAILURE,
                    error: true,
                    payload: error,
                },
            ]
            assert.deepStrictEqual(store.getActions(), expectedActions)
        })
    })
})
