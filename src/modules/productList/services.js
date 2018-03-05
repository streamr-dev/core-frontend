// @flow

import { get } from '../../utils/api'
import { queryString } from '../../utils/url'

import type { ApiResult } from '../../flowtype/common-types'
import type { ProductId } from '../../flowtype/product-types'

export const getProducts = (searchText?: ?string, category?: ?string): ApiResult => {
    const queryParts = {}

    if (searchText) {
        queryParts.search = searchText
    }

    if (category) {
        queryParts.category = category
    }

    return get(`products?${queryString(queryParts)}`)
}

export const getProductById = (id: ProductId): ApiResult => get(`products/${id}`)
