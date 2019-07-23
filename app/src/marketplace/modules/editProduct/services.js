// @flow

import { put, post } from '$shared/utils/api'
import { mapProductFromApi, mapProductToApi, isPaidAndNotPublishedProduct } from '../../utils/product'
import { formatApiUrl } from '$shared/utils/url'
import type { ApiResult } from '$shared/flowtype/common-types'
import type { EditProduct, Product, ProductId, ProductType } from '../../flowtype/product-types'

export const putProduct = (data: EditProduct, id: ProductId): ApiResult<Product> => {
    const isPaidAndNotPublished = isPaidAndNotPublishedProduct(data)

    return put(formatApiUrl('products', id), isPaidAndNotPublished ? mapProductToApi(data) : data)
        .then(mapProductFromApi)
}

export const postProduct = (product: Product): ApiResult<Product> => post(formatApiUrl('products'), mapProductToApi(product))
    .then(mapProductFromApi)

export const postEmptyProduct = (type: ProductType): ApiResult<Product> => {
    const product = {
        type,
    }

    return post(formatApiUrl('products'), product)
        .then(mapProductFromApi)
}

export const postImage = (id: ProductId, image: File): ApiResult<EditProduct> => {
    const options = {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    }

    const data = new FormData()
    data.append('file', image, image.name)

    return post(formatApiUrl('products', id, 'images'), data, options).then(mapProductFromApi)
}
