// @flow

import React, { useEffect } from 'react'
import { type Location } from 'react-router-dom'
import styled from 'styled-components'
import qs from 'query-string'
import { useDispatch } from 'react-redux'
import { replace } from 'connected-react-router'
import { postEmptyProduct } from '$mp/modules/deprecated/editProduct/services'
import LoadingIndicator from '$userpages/components/LoadingIndicator'
import routes from '$routes'
import { type ProductType } from '$mp/flowtype/product-types'
import useIsMounted from '$shared/hooks/useIsMounted'
import { productTypes } from '$mp/utils/constants'
import useFailure from '$shared/hooks/useFailure'

type Props = {
    className?: ?string,
    location: Location,
}

const sanitizedType = (type: ?string): ProductType => (
    productTypes[(type || '').toUpperCase()] || productTypes.NORMAL
)

const UnstyledNewProductPage = ({ className, location: { search } }: Props) => {
    const dispatch = useDispatch()

    const isMounted = useIsMounted()

    const fail = useFailure()

    useEffect(() => {
        const { type } = qs.parse(search)

        postEmptyProduct(sanitizedType(type))
            .then(({ id }) => {
                if (isMounted()) {
                    dispatch(replace(routes.editProduct({
                        id,
                        newProduct: true,
                    })))
                }
            }, fail)
    }, [dispatch, isMounted, search, fail])

    return (
        <LoadingIndicator className={className} loading />
    )
}

const NewProductPage = styled(UnstyledNewProductPage)`
    position: absolute;
    top: 0;
    height: 2px;
`

export default NewProductPage
