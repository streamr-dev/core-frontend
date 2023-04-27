import { get } from '$shared/utils/api'
import { ApiResult } from '$shared/types/common-types'
import routes from '$routes'
import { mapAllProductsFromApi } from '../../utils/product'
import { Project } from '../../types/project-types'
export const getMyProducts = (params: any): ApiResult<Array<Project>> =>
    get({
        url: routes.api.currentUser.products(),
        options: {
            params,
        },
    }).then(mapAllProductsFromApi)
