import defaults from 'lodash/defaults'
import type { Filter } from '$userpages/flowtype/common-types'
type FilterDefaults = {
    sortBy?: string;
    search?: string;
    order?: string;
}
export const getParamsForFilter = (filter: Filter | null | undefined, defaultValues: FilterDefaults = {}) => {
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
