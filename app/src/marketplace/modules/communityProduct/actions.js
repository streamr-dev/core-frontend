// @flow

import { createAction } from 'redux-actions'

import { communityProductSchema, communityProductsSchema } from '$shared/modules/entities/schema'
import { handleEntities } from '$shared/utils/entities'
import type { ErrorInUi, ReduxActionCreator } from '$shared/flowtype/common-types'
import type { CommunityId } from '$mp/flowtype/product-types'
import * as services from './services'
import {
    GET_COMMUNITY_REQUEST,
    GET_COMMUNITY_SUCCESS,
    GET_COMMUNITY_FAILURE,
    GET_ALL_COMMUNITY_STATS_REQUEST,
    GET_ALL_COMMUNITY_STATS_SUCCESS,
    GET_ALL_COMMUNITY_STATS_FAILURE,
} from './constants'
import type {
    CommunityIdActionCreator,
    CommunityIdsActionCreator,
    CommunityErrorActionCreator,
    CommunityStatsErrorActionCreator,
} from './types'

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

const getCommunityFailure: CommunityErrorActionCreator = createAction(
    GET_COMMUNITY_FAILURE,
    (id: CommunityId, error: ErrorInUi) => ({
        id,
        error,
    }),
)

const getAllCommunityStatsRequest: ReduxActionCreator = createAction(GET_ALL_COMMUNITY_STATS_REQUEST)

const getAllCommunityStatsSuccess: CommunityIdsActionCreator = createAction(
    GET_ALL_COMMUNITY_STATS_SUCCESS,
    (ids: Array<CommunityId>) => ({
        ids,
    }),
)

const getAllCommunityStatsFailure: CommunityStatsErrorActionCreator = createAction(
    GET_ALL_COMMUNITY_STATS_FAILURE,
    (error: ErrorInUi) => ({
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

export const getAllCommunityStats = () => async (dispatch: Function) => {
    dispatch(getAllCommunityStatsRequest())

    try {
        const result = await services.getCommunities()
        const ids = handleEntities(communityProductsSchema, dispatch)(result)
        dispatch(getAllCommunityStatsSuccess(ids))
    } catch (e) {
        dispatch(getAllCommunityStatsFailure(e))
    }
}
