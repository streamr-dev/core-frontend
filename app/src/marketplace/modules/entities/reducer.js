// @flow

import { handleActions } from 'redux-actions'
import mergeWith from 'lodash/mergeWith'
import isArray from 'lodash/isArray'

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
    transactions: {},
}

// Empty arrays do not replace the destination value by default, use customizer to handle
// that special case. If customizer returns undefined, merging is handled by the default method instead
const mergeCustomizer = (obj, src) => ((isArray(src) && src.length <= 0) ? src : undefined)

const reducer: (EntitiesState) => EntitiesState = handleActions({
    [UPDATE_ENTITIES]: (state: EntitiesState, action: UpdateEntitiesAction) => mergeWith({}, state, action.payload.entities, mergeCustomizer),
}, initialState)

export default reducer
