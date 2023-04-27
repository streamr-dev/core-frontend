import { get } from '$shared/utils/api'
import { ApiResult } from '$shared/types/common-types'
import routes from '$routes'
import { Category } from '../../types/category-types'
export const getCategories = (includeEmpty: boolean): ApiResult<Array<Category>> =>
    get({
        url: routes.api.categories({
            includeEmpty,
        })
    })
