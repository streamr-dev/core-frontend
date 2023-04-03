import { get } from '$shared/utils/api'
import { ApiResult } from '$shared/types/common-types'
import routes from '$routes'
import { Filter, ProjectListPageWrapper } from '../../types/project-types'
import { mapProductFromApi } from '../../utils/product'
export const getProducts = (filter: Filter, pageSize: number, offset: number): ApiResult<ProjectListPageWrapper> => {
    const route = routes.api.projects.index
    const params: Record<string,any> = {}
    return get({
        url: route({
            ...filter,
            ...params,
            max: pageSize + 1,
            // query 1 extra element to determine if we should show "load more" button
            offset,
        }),
    }).then((products) => ({
        products: products.splice(0, pageSize).map(mapProductFromApi),
        hasMoreProducts: products.length > 0,
    }))
}
