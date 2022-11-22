import { get } from '$shared/utils/api'
import type { ApiResult } from '$shared/types/common-types'
import routes from '$routes'
import { mapAllProductsFromApi } from '../../utils/product'
import type { Project, ProjectId } from '../../types/project-types'
export const getRelatedProducts = (id: ProjectId, useAuthorization = true): ApiResult<Array<Project>> =>
    get({
        url: routes.api.products.related({
            id,
        }),
        useAuthorization,
    }).then(mapAllProductsFromApi)
