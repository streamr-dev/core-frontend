// @flow

import { get } from '../../utils/api'
import { formatApiUrl } from '../../utils/url'
import type { ApiResult } from '../../flowtype/common-types'
import type { Category } from '../../flowtype/category-types'

export const getCategories = (includeEmpty: boolean): ApiResult<Array<Category>> => get(formatApiUrl('categories', {
    includeEmpty,
}))
