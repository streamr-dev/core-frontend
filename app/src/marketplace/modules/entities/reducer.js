// @flow

import { handleActions } from 'redux-actions'
import merge from 'lodash/merge'

import type { EntitiesState } from '../../flowtype/store-state'

import { UPDATE_ENTITIES } from './constants'
import type { UpdateEntitiesAction } from './types'

export const initialState: EntitiesState = {
    categories: {},
    products: {},
    contractProducts: {},
    streams: {},
    relatedProducts: {},
    subscriptions: {},
}

const reducer: (EntitiesState) => EntitiesState = handleActions({
    [UPDATE_ENTITIES]: (state: EntitiesState, action: UpdateEntitiesAction) => merge({}, state, action.payload.entities),
}, initialState)

export default reducer
