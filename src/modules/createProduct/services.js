// @flow

import { post } from '../../utils/api'
import { formatApiUrl } from '../../utils/url'
import { mapProductToApi } from '../../utils/product'
import type { ApiResult } from '../../flowtype/common-types'
import type { Product, ProductId } from '../../flowtype/product-types'

export const postProduct = (product: Product): ApiResult<Product> => post(formatApiUrl('products'), mapProductToApi(product))

export const postImage = (id: ProductId, image: File): ApiResult<string> => {
    const options = {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    }

    const data = new FormData()
    data.append('file', image, image.name)

    return post(formatApiUrl('products', id, 'images'), data, options)
}
