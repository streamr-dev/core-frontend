// @flow

import { get } from '$shared/utils/api'
import { formatApiUrl } from '$shared/utils/url'
import type { ApiResult } from '$shared/flowtype/common-types'
import type { Category } from '../../flowtype/category-types'

export const getCategories = (includeEmpty: boolean): ApiResult<Array<Category>> => get({
    url: formatApiUrl('categories', {
        includeEmpty,
    }),
    useAuthorization: false,
})
