import { get } from '$shared/utils/api'
import type { ApiResult } from '$shared/types/common-types'
import { ProjectAuthor } from '$mp/types/store-state'
import routes from '$routes'
import type { Filter, ProjectListPageWrapper } from '../../types/project-types'
import { mapProductFromApi } from '../../utils/product'
export const getProducts = (filter: Filter, pageSize: number, offset: number, projectAuthor: ProjectAuthor): ApiResult<ProjectListPageWrapper> => {
    const onlyCurrentUserProjects = projectAuthor === 'currentUser'
    const route = onlyCurrentUserProjects ? routes.api.currentUser.products : routes.api.products.index
    const params: Record<string,any> = {}
    if (!onlyCurrentUserProjects) {
        params.publicAccess = true
        params.grantedAccess = false
    }
    return get({
        url: route({
            ...filter,
            ...params,
            max: pageSize + 1,
            // query 1 extra element to determine if we should show "load more" button
            offset,
        }),
        useAuthorization: onlyCurrentUserProjects,
    }).then((products) => ({
        products: products.splice(0, pageSize).map(mapProductFromApi),
        hasMoreProducts: products.length > 0,
    }))
}
