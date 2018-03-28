// @flow

import { post, uploadImage } from '../../utils/api'
import { formatUrl } from '../../utils/url'
import type { ApiResult } from '../../flowtype/common-types'
import type { Product, ProductId } from '../../flowtype/product-types'

export const postProduct = (product: Product): ApiResult => post(formatUrl('products'), product)

export const postImage = (id: ProductId, image: File): ApiResult => uploadImage(formatUrl('products', id, 'image'), image)
