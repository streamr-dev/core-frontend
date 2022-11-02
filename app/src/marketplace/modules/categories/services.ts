import { get } from '$shared/utils/api'
import type { ApiResult } from '$shared/types/common-types'
import routes from '$routes'
import type { Category } from '../../types/category-types'
export const getCategories = (includeEmpty: boolean): ApiResult<Array<Category>> =>
    get({
        url: routes.api.categories({
            includeEmpty,
        }),
        useAuthorization: false,
    })
