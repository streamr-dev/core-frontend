// @flow

import { post } from '../../utils/api'
import { formatUrl } from '../../utils/url'
import type { ApiResult } from '../../flowtype/common-types'
import type { Product, ProductId } from '../../flowtype/product-types'

export const postProduct = (product: Product): ApiResult<Product> => post(formatUrl('products'), product)

export const postImage = (id: ProductId, image: File): ApiResult<string> => {
    const options = {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    }

    const data = new FormData()
    data.append('file', image, image.name)

    return post(formatUrl('products', id, 'image'), data, options)
}
