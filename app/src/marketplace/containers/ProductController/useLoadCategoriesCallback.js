// @flow

import { useCallback } from 'react'
import { useDispatch } from 'react-redux'

import usePending from '$shared/hooks/usePending'

import { getCategories } from '$mp/modules/categories/actions'

export default function useLoadCategoriesCallback() {
    const dispatch = useDispatch()
    const { wrap } = usePending('categories.LOAD')

    return useCallback(async (includeEmpty: boolean = true) => (
        wrap(async () => {
            await dispatch(getCategories(includeEmpty))
        })
    ), [wrap, dispatch])
}
