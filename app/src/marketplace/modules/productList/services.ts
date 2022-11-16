import { get } from '$shared/utils/api'
import type { ApiResult } from '$shared/types/common-types'
import routes from '$routes'
import type { Filter, ProjectListPageWrapper } from '../../types/project-types'
import { mapProductFromApi } from '../../utils/product'
export const getProducts = (filter: Filter, pageSize: number, offset: number): ApiResult<ProjectListPageWrapper> =>
    get({
        url: routes.api.products.index({
            ...filter,
            publicAccess: true,
            grantedAccess: false,
            max: pageSize + 1,
            // query 1 extra element to determine if we should show "load more" button
            offset,
        }),
        useAuthorization: false,
    }).then((products) => ({
        products: products.splice(0, pageSize).map(mapProductFromApi),
        hasMoreProducts: products.length > 0,
    }))
