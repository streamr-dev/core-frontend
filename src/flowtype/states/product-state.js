// @flow

import type {Product} from '../product-types'
import type {ErrorInUi} from '../common-types'

export type ProductState = {
    byId: {
        [$ElementType<Product, 'id'>]: Product & {
            fetching?: ?boolean,
            error?: ?ErrorInUi
        }
    },
    fetching: boolean,
    error: ?ErrorInUi
}
