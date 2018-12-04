// @flow

import type { Filter } from '$userpages/flowtype/common-types'

type FilterDefaults = {
    sortBy?: string,
    search?: string,
    order?: string,
}

export const getParamsForFilter = (filter: ?Filter, defaultValues?: FilterDefaults) => {
    let params = {
        adhoc: false,
        sortBy: (filter && filter.sortBy) || (defaultValues && defaultValues.sortBy) || null,
        search: (filter && filter.search) || (defaultValues && defaultValues.search) || null,
        order: (filter && filter.order) || (defaultValues && defaultValues.order) || 'desc',
    }

    if (filter && filter.key && filter.value) {
        params = {
            ...params,
            [filter.key]: filter.value,
        }
    }

    return params
}
