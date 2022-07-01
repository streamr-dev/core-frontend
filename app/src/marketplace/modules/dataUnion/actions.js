// @flow

import { createAction } from 'redux-actions'
import { denormalize } from 'normalizr'

import { dataUnionSchema, dataUnionStatSchema, productsSchema } from '$shared/modules/entities/schema'
import { handleEntities } from '$shared/utils/entities'
import type { ErrorInUi, ReduxActionCreator } from '$shared/flowtype/common-types'
import type { DataUnionId, DataUnionSecretId, ProductIdList } from '$mp/flowtype/product-types'
import { selectEntities } from '$shared/modules/entities/selectors'
import { isDataUnionProduct } from '$mp/utils/product'
import { isEthereumAddress } from '$mp/utils/validate'
import { getChainIdFromApiString } from '$shared/utils/chains'
import * as services from './services'
import {
    GET_DATA_UNION_REQUEST,
    GET_DATA_UNION_SUCCESS,
    GET_DATA_UNION_FAILURE,
    GET_DATA_UNION_STATS_REQUEST,
    GET_DATA_UNION_STATS_SUCCESS,
    GET_DATA_UNION_STATS_FAILURE,
    SET_DATA_UNION_SECRETS,
    ADD_DATA_UNION_SECRET,
    REMOVE_DATA_UNION_SECRET,
    GET_ALL_DATA_UNION_STATS_REQUEST,
    RESET_DATA_UNION,
    RESET_DATA_UNION_STATS,
} from './constants'
import type {
    DataUnionIdActionCreator,
    DataUnionIdsActionCreator,
    DataUnionErrorActionCreator,
    DataUnionSecretsActionCreator,
    DataUnionSecretActionCreator,
} from './types'
import { selectDataUnionDeployedIds } from './selectors'

const getDataUnionRequest: DataUnionIdActionCreator = createAction(
    GET_DATA_UNION_REQUEST,
    (id: DataUnionId) => ({
        id,
    }),
)

const getDataUnionSuccess: DataUnionIdActionCreator = createAction(
    GET_DATA_UNION_SUCCESS,
    (id: DataUnionId) => ({
        id,
    }),
)

const getDataUnionFailure: DataUnionErrorActionCreator = createAction(
    GET_DATA_UNION_FAILURE,
    (id: DataUnionId, error: ErrorInUi) => ({
        id,
        error,
    }),
)

const getDataUnionStatsRequest: DataUnionIdActionCreator = createAction(
    GET_DATA_UNION_STATS_REQUEST,
    (id: DataUnionId) => ({
        id,
    }),
)

const getDataUnionStatsSuccess: DataUnionIdActionCreator = createAction(
    GET_DATA_UNION_STATS_SUCCESS,
    (id: DataUnionId) => ({
        id,
    }),
)

const getDataUnionStatsFailure: DataUnionErrorActionCreator = createAction(
    GET_DATA_UNION_STATS_FAILURE,
    (id: DataUnionId, error: ErrorInUi) => ({
        id,
        error,
    }),
)

export const setDataUnionSecrets: DataUnionSecretsActionCreator = createAction(
    SET_DATA_UNION_SECRETS,
    (id: DataUnionId, secrets: Array<DataUnionSecretId>) => ({
        id,
        secrets,
    }),
)

export const addDataUnionSecret: DataUnionSecretActionCreator = createAction(
    ADD_DATA_UNION_SECRET,
    (id: DataUnionId, secret: DataUnionSecretId) => ({
        id,
        secret,
    }),
)

export const removeDataUnionSecret: DataUnionSecretActionCreator = createAction(
    REMOVE_DATA_UNION_SECRET,
    (id: DataUnionId, secret: DataUnionSecretId) => ({
        id,
        secret,
    }),
)

const getAllDataUnionStatsRequest: DataUnionIdsActionCreator = createAction(
    GET_ALL_DATA_UNION_STATS_REQUEST,
    (ids: Array<DataUnionId>) => ({
        ids,
    }),
)

export const resetDataUnion: ReduxActionCreator = createAction(RESET_DATA_UNION)
export const resetDataUnionStats: ReduxActionCreator = createAction(RESET_DATA_UNION_STATS)

export const getDataUnionById = (dataUnionId: DataUnionId, chainId: number) => async (dispatch: Function) => {
    const id = dataUnionId.toLowerCase()
    dispatch(getDataUnionRequest(id))

    try {
        const result = await services.getDataUnion(id, chainId, true)
        handleEntities(dataUnionSchema, dispatch)(result)
        dispatch(getDataUnionSuccess(id))
    } catch (e) {
        dispatch(getDataUnionFailure(id, e))
    }
}

export const getDataUnionStats = (dataUnionId: DataUnionId, chainId: number) => async (dispatch: Function) => {
    const id = dataUnionId.toLowerCase()
    dispatch(getDataUnionStatsRequest(id))

    try {
        const result = await services.getDataUnionStats(id, chainId)
        result.id = id
        handleEntities(dataUnionStatSchema, dispatch)(result)
        dispatch(getDataUnionStatsSuccess(id))
    } catch (e) {
        dispatch(getDataUnionStatsFailure(id, e))

        throw e
    }
}

let dataUnionStatsCancel = () => null

export const cancelDataUnionStatsFetch = () => {
    dataUnionStatsCancel()
}

export const startUpdateDataUnionStats = (productIds: ProductIdList) => (dispatch: Function, getState: Function) => {
    let cancelled = false
    const state = getState()
    const entities = selectEntities(state)
    const products = denormalize(productIds, productsSchema, entities)

    const fetchStats = async () => {
        for (let index = 0; index < productIds.length && !cancelled; index += 1) {
            try {
                const product = products.find((p) => p.id === productIds[index])

                if (product == null) {
                    break
                }

                const chainId = getChainIdFromApiString(product.chain)
                const dataunionId = product.beneficiaryAddress
                // eslint-disable-next-line no-await-in-loop
                await dispatch(getDataUnionStats(dataunionId, chainId))
            } catch (e) {
                // ignore error and continue
            }
        }
    }

    fetchStats()

    return () => {
        cancelled = true
    }
}

export const updateDataUnionStats = (productIds: ProductIdList) => (dispatch: Function, getState: Function) => {
    dataUnionStatsCancel()

    const state = getState()
    const entities = selectEntities(state)
    const products = denormalize(productIds, productsSchema, entities)
    const alreadyLoaded = new Set(selectDataUnionDeployedIds(state))

    const dataUnionIds = (products || [])
        .reduce((result, { type, beneficiaryAddress }) => {
            const id = (beneficiaryAddress || '').toLowerCase()

            if (isDataUnionProduct(type) && isEthereumAddress(id) && !alreadyLoaded.has(id)) {
                return [
                    ...result,
                    id,
                ]
            }

            return result
        }, [])

    dispatch(getAllDataUnionStatsRequest(dataUnionIds))
    dataUnionStatsCancel = dispatch(startUpdateDataUnionStats(productIds))
}
