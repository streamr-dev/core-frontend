// @flow

import type {Category} from '../category-types.js'
import type {ErrorInUi} from '../common-types'

export type CategoryState = {
    byId: {
        [$ElementType<Category, 'id'>]: Category & {
            fetchingProducts?: boolean
        }
    },
    fetching: boolean,
    error: ?ErrorInUi
}
