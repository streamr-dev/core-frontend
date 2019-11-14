// @flow

import { createAction } from 'redux-actions'

import { communityProductSchema } from '$shared/modules/entities/schema'
import { handleEntities } from '$shared/utils/entities'
import type { ErrorInUi } from '$shared/flowtype/common-types'
import type { CommunityId } from '$mp/flowtype/product-types'
import * as services from './services'
import {
    GET_COMMUNITY_REQUEST,
    GET_COMMUNITY_SUCCESS,
    GET_COMMUNITY_FAILURE,
} from './constants'
import type { CommunityIdActionCreator, CommunityErrorAction } from './types'

const getCommunityRequest: CommunityIdActionCreator = createAction(
    GET_COMMUNITY_REQUEST,
    (id: CommunityId) => ({
        id,
    }),
)

const getCommunitySuccess: CommunityIdActionCreator = createAction(
    GET_COMMUNITY_SUCCESS,
    (id: CommunityId) => ({
        id,
    }),
)

const getCommunityFailure: CommunityErrorAction = createAction(
    GET_COMMUNITY_FAILURE,
    (id: CommunityId, error: ErrorInUi) => ({
        id,
        error,
    }),
)

export const getCommunityById = (id: CommunityId) => async (dispatch: Function) => {
    dispatch(getCommunityRequest(id))

    try {
        const result = await services.getCommunityData(id, true)
        handleEntities(communityProductSchema, dispatch)(result)
        dispatch(getCommunitySuccess(id))
    } catch (e) {
        dispatch(getCommunityFailure(id, e))
    }
}
