import { normalize } from 'normalizr'

import * as actions from '$shared/modules/entities/actions'
import * as constants from '$shared/modules/entities/constants'
import * as schemas from '$shared/modules/entities/schema'

import mockStore from '$testUtils/mockStoreProvider'

describe('entities - actions', () => {
    describe('updateEntities', () => {
        it('updates entities succesfully', () => {
            const categories = [
                {
                    id: 1,
                    name: 'Category 1',
                },
                {
                    id: 2,
                    name: 'Category 2',
                },
            ]
            const products = [
                {
                    id: '123456789',
                    title: 'Product 1',
                },
                {
                    id: '1011121314',
                    title: 'Product 2',
                },
            ]
            const { entities: categoryEntities } = normalize(categories, schemas.categoriesSchema)
            const { entities: productEntities } = normalize(products, schemas.productsSchema)

            const store = mockStore()
            store.dispatch(actions.updateEntities(productEntities))
            store.dispatch(actions.updateEntities(categoryEntities))

            const expectedActions = [
                {
                    type: constants.UPDATE_ENTITIES,
                    payload: {
                        entities: productEntities,
                    },
                },
                {
                    type: constants.UPDATE_ENTITIES,
                    payload: {
                        entities: categoryEntities,
                    },
                },
            ]
            expect(store.getActions()).toStrictEqual(expectedActions)
        })
    })
})
