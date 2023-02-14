import { createAction } from 'redux-actions'
import { normalize } from 'normalizr'
import debounce from 'lodash/debounce'
import { productsSchema } from '$shared/modules/entities/schema'
import { updateEntities } from '$shared/modules/entities/actions'
import type { ErrorInUi, ReduxActionCreator } from '$shared/types/common-types'
import type { Filter, ProjectIdList } from '../../types/project-types'
import type { StoreState } from '../../types/store-state'
import { selectFilter, selectPageSize, selectOffset } from './selectors'
import {
    GET_PRODUCTS_REQUEST,
    GET_PRODUCTS_SUCCESS,
    GET_PRODUCTS_FAILURE,
    UPDATE_FILTER,
    CLEAR_FILTERS,
    CLEAR_PRODUCT_LIST,
    UPDATE_PROJECTS_AUTHOR_FILTER
} from './constants'
import * as api from './services'
import type {
    ProductsActionCreator,
    ProductsErrorActionCreator,
    FilterActionCreator,
    ProjectsAuthorFilterActionCreator
} from './types'
const getProductsRequest: ReduxActionCreator = createAction(GET_PRODUCTS_REQUEST)
const getProductsSuccess: ProductsActionCreator = createAction(GET_PRODUCTS_SUCCESS, (products: ProjectIdList, hasMore: boolean) => ({
    products,
    hasMore,
}))
const getProductsFailure: ProductsErrorActionCreator = createAction(GET_PRODUCTS_FAILURE, (error: ErrorInUi) => ({
    error,
}))
const clearProductList: ReduxActionCreator = createAction(CLEAR_PRODUCT_LIST)

const doGetProducts = (
    replace: boolean | null | undefined = false,
    dispatch: (...args: Array<any>) => any,
    getState: () => StoreState,
) => {
    const state = getState()
    const filter = selectFilter(state)
    const pageSize = selectPageSize(state)
    let offset = selectOffset(state)

    // If we are replacing, reset the offset before API call
    if (replace) {
        offset = 0
    }

    dispatch(getProductsRequest())
    return api.getProducts(filter, pageSize, offset).then(
        (data) => {
            const { result, entities } = normalize(data.products, productsSchema)

            if (replace) {
                dispatch(clearProductList())
            }

            dispatch(updateEntities(entities))
            dispatch(getProductsSuccess(result, data.hasMoreProducts))
            return result
        },
        (error) => {
            dispatch(getProductsFailure(error))
        },
    )
}

type GetProducts = {
    replace?: boolean
    onSuccess?: (...args: Array<any>) => any
    onError?: (...args: Array<any>) => any
}
// We need to define the debounced fetch here so that we have only one reference to it
// https://gist.github.com/krstffr/245fe83885b597aabaf06348220c2fe9
const doGetProductsDebounced = debounce(
    ({ replace, onSuccess, onError }: GetProducts, dispatch: (...args: Array<any>) => any, getState: () => StoreState) =>
        doGetProducts(replace, dispatch, getState).then(onSuccess).catch(onError),
    500,
)
// Use a debounced fetch because this action is dispatched when the user is typing
// (we cannot use here `getProductsDebounced = () => debounce(...)` because that would
// return a new instance every time `getProductsDebounced` is called).
// TODO add typing
export const getProductsDebounced = (options: GetProducts): any => doGetProductsDebounced.bind(null, options)
export const getProducts = (
    replace?: boolean | null | undefined
): (dispatch: (...args: Array<any>) => any, getState: () => StoreState) => Promise<any> => doGetProducts.bind(null, replace)
export const updateFilter: FilterActionCreator = createAction(UPDATE_FILTER, (filter: Filter) => ({
    filter,
}))
export const clearFilters: ReduxActionCreator = createAction(CLEAR_FILTERS)
export const updateProjectsAuthorFilter: ProjectsAuthorFilterActionCreator
    = createAction(UPDATE_PROJECTS_AUTHOR_FILTER, (onlyMyProjects: boolean) => ({onlyMyProjects}))
