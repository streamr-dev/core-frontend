import * as all from '$shared/modules/entities/selectors'
import { StoreState } from '$shared/types/store-state'
const state: Partial<StoreState> = {
    entities: {
        categories: {
            1: {
                id: '1',
                name: 'Category 1',
                imageUrl: ''
            },
            2: {
                id: '2',
                name: 'Category 2',
                imageUrl: ''
            },
        },
    },
}
describe('entities - selectors', () => {
    it('selects entities', () => {
        expect(all.selectEntities(state as StoreState)).toStrictEqual(state.entities)
    })
})
