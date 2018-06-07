import assert from 'assert-diff'
import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import { normalize } from 'normalizr'

import * as actions from '../../../../modules/categories/actions'
import * as constants from '../../../../modules/categories/constants'
import * as entityConstants from '../../../../modules/entities/constants'
import * as services from '../../../../modules/categories/services'
import { categoriesSchema } from '../../../../modules/entities/schema'

const middlewares = [thunk]
const mockStore = configureMockStore(middlewares)

jest.mock('../../../../modules/categories/services')

describe('categories - actions', () => {
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

            services.getCategories = jest.fn(() => new Promise((resolve) => {
                resolve(categories)
            }))

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
            assert.deepEqual(store.getActions(), expectedActions)
        })

        it('responds to errors', async () => {
            services.getCategories = jest.fn(() => new Promise((resolve, reject) => {
                const error = new Error('Error')
                reject(error)
            }))

            const store = mockStore()
            await store.dispatch(actions.getCategories(true))

            const expectedActions = [
                {
                    type: constants.GET_CATEGORIES_REQUEST,
                },
                {
                    type: constants.GET_CATEGORIES_FAILURE,
                    error: true,
                    payload: {},
                },
            ]
            assert.deepEqual(store.getActions(), expectedActions)
        })
    })
})
