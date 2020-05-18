// @flow

import { get } from '$shared/utils/api'
import type { ApiResult } from '$shared/flowtype/common-types'
import type { Category } from '../../flowtype/category-types'
import routes from '$routes'

export const getCategories = (includeEmpty: boolean): ApiResult<Array<Category>> => get({
    url: routes.api.categories({
        includeEmpty,
    }),
    useAuthorization: false,
})
