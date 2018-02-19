// @flow

import type {Category} from '../category-types.js'
import type {ErrorInUi} from '../common-types'

export type CategoryState = {
    byId: {|
        [$ElementType<Category, 'id'>]: Category
    |},
    fetching: boolean,
    error: ?ErrorInUi
}
