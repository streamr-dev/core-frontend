// @flow

import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { getCategories } from '$mp/modules/categories/actions'
import { selectAllCategories, selectFetchingCategories, selectCategoriesError } from '$mp/modules/categories/selectors'

type Props = {
    children: Function,
}

const AvailableCategories = ({ children }: Props) => {
    if (!children || typeof children !== 'function') {
        throw new Error('children needs to be a function!')
    }

    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(getCategories(true))
    }, [dispatch])

    const categories = useSelector(selectAllCategories)
    const fetching = useSelector(selectFetchingCategories)
    const error = useSelector(selectCategoriesError)

    return children ? children({
        fetching,
        categories,
        error,
    }) : null
}

export default AvailableCategories
