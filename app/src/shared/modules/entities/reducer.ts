import { handleActions } from 'redux-actions'
import mergeWith from 'lodash/mergeWith'
import { EntitiesState } from '$shared/types/store-state'
import { UPDATE_ENTITIES } from './constants'
import { UpdateEntitiesAction } from './types'
export const initialState: EntitiesState = {
    categories: {},
    products: {},
    contractProducts: {},
    dataUnions: {},
    dataUnionStats: {},
    streams: {},
    relatedProducts: {},
    subscriptions: {},
    transactions: {},
    joinRequests: {},
    dataUnionSecrets: {},
    whitelistedAddresses: {},
}

// Arrays do not replace the destination value by default, use customizer to handle
// that special case. If customizer returns undefined, merging is handled by the default method instead
const mergeCustomizer = (obj: any, src: any) => (Array.isArray(src) ? src : undefined)

const reducer = handleActions<EntitiesState, UpdateEntitiesAction['payload'] | object>(
    {
        [UPDATE_ENTITIES]: (state: EntitiesState, action: UpdateEntitiesAction) =>
            mergeWith({}, state, action.payload.entities, mergeCustomizer),
    },
    initialState,
)
export default reducer
