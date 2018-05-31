// @flow

import { get } from '../../utils/api'
import { formatApiUrl } from '../../utils/url'

import type { ApiResult } from '../../flowtype/common-types'
import type { Filter, ProductListPageWrapper } from '../../flowtype/product-types'
import { mapProductFromApi } from '../../utils/product'
import { productStates } from '../../utils/constants'

export const getProducts = (filter: Filter, pageSize: number, offset: number): ApiResult<ProductListPageWrapper> => (
    get(formatApiUrl('products', {
        ...filter,
        publicAccess: true,
        grantedAccess: false,
        states: productStates.DEPLOYED,
        max: pageSize + 1, // query 1 extra element to determine if we should show "load more" button
        offset,
    }))
        .then((products) => ({
            products: products.splice(0, pageSize).map(mapProductFromApi),
            hasMoreProducts: products.length > 0,
        }))
)
