// @flow
import { handleActions } from 'redux-actions'
import merge from 'lodash/merge'

import { UPDATE_ENTITIES } from './constants'
import type { EntitiesState } from '../../flowtype/store-state'
import type { UpdateEntitiesAction } from './types'

const initialState: EntitiesState = {
    categories: {},
    products: {},
}

const reducer: (EntitiesState) => EntitiesState = handleActions({
    [UPDATE_ENTITIES]: (state: EntitiesState, action: UpdateEntitiesAction) => merge({}, state, action.payload.entities),
}, initialState)

export default reducer
