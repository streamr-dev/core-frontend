import * as all from '$shared/modules/entities/selectors'

const state = {
    test: true,
    categories: {},
    otherData: 42,
    entities: {
        categories: {
            '1': {
                id: 1,
                name: 'Category 1',
            },
            '2': {
                id: 2,
                name: 'Category 2',
            },
        },
        products: {
            '123456789': {
                id: '123456789',
                title: 'Product 1',
            },
            '1011121314': {
                id: '1011121314',
                title: 'Product 2',
            },
        },
    },
}

describe('entities - selectors', () => {
    it('selects entities', () => {
        expect(all.selectEntities(state)).toStrictEqual(state.entities)
    })
})
