import defaults from 'lodash/defaults'
import type { Filter, SortOrder } from '$userpages/types/common-types'
type FilterDefaults = {
    sortBy?: string
    search?: string
    order?: string
}
export const getParamsForFilter = (
    filter: Filter | null | undefined,
    defaultValues: FilterDefaults = {},
): Record<string, string | boolean | SortOrder> => {
    // special handling for key+value
    const { key, value, ...filterOptions } = filter || {}
    const options = defaults({}, filterOptions, defaultValues, {
        order: 'desc',
    })
    return {
        ...options,
        ...(key && value
            ? {
                [key]: value,
            }
            : {}),
    }
}
