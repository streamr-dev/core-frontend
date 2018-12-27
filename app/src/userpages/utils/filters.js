// @flow

import type { Filter } from '$userpages/flowtype/common-types'

type FilterDefaults = {
    sortBy?: string,
    search?: string,
    order?: string,
}

export const getParamsForFilter = (filter: ?Filter, defaultValues?: FilterDefaults) => {
    const { sortBy: defaultSortBy, search: defaultSearch, order: defaultOrder } = defaultValues || {}
    const {
        sortBy,
        search,
        order,
        key,
        value,
    } = filter || {}

    return {
        adhoc: false,
        sortBy: sortBy || defaultSortBy || null,
        search: search || defaultSearch || null,
        order: order || defaultOrder || 'desc',
        ...(key && value ? {
            [key]: value,
        } : {}),
    }
}
