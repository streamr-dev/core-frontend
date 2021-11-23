// @flow

import React, { useMemo } from 'react'
import { useSelector } from 'react-redux'
import { titleize } from '@streamr/streamr-layout'
import { denormalize } from 'normalizr'

import { useController } from '$mp/containers/ProductController'
import useContractProduct from '$mp/containers/ProductController/useContractProduct'
import usePending from '$shared/hooks/usePending'
import { selectEntities } from '$shared/modules/entities/selectors'
import { categorySchema } from '$shared/modules/entities/schema'
import { ago } from '$shared/utils/time'

import DescriptionComponent from '$mp/components/ProductPage/Description'

type Props = {
    isProductFree: boolean,
}

const Description = ({ isProductFree }: Props) => {
    const { product } = useController()
    const contractProduct = useContractProduct()

    const entities = useSelector(selectEntities)
    const category = product && denormalize(product.category, categorySchema, entities)
    const { isPending } = usePending('contractProduct.LOAD_SUBSCRIPTION')
    const { purchaseTimestamp, subscriberCount } = contractProduct || {}

    const sidebar = useMemo(() => ({
        category: {
            title: 'Product category',
            loading: !category,
            value: category && category.name,
        },
        ...(!isProductFree ? { // Temporarily hide active subscribers info for free products while the backend does not support it.
            subscriberCount: {
                title: 'Active subscribers',
                loading: isPending,
                value: subscriberCount || 0,
            },
            purchaseTimestamp: {
                title: 'Last purchased',
                loading: isPending,
                value: purchaseTimestamp != null ? titleize(ago(new Date(purchaseTimestamp))) : '-',
            },
        } : {}),
    }), [category, isPending, subscriberCount, purchaseTimestamp, isProductFree])

    return (
        <DescriptionComponent
            description={product.description}
            sidebar={sidebar}
        />
    )
}

export default Description
