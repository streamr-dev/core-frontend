// @flow

import React, { useMemo } from 'react'
import { useSelector } from 'react-redux'
import { I18n } from 'react-redux-i18n'

import useProduct from '$mp/containers/ProductController/useProduct'
import useContractProduct from '$mp/containers/ProductController/useContractProduct'
import usePending from '$shared/hooks/usePending'
import { selectCategory } from '$mp/modules/product/selectors'
import { ago } from '$shared/utils/time'

import DescriptionComponent from '$mp/components/ProductPage/Description'

type Props = {
    isProductFree: boolean,
}

const Description = ({ isProductFree }: Props) => {
    const product = useProduct()
    const contractProduct = useContractProduct()
    const category = useSelector(selectCategory)
    const { isPending } = usePending('contractProduct.LOAD_SUBSCRIPTION')
    const { purchaseTimestamp, subscriberCount } = contractProduct || {}

    const sidebar = useMemo(() => ({
        category: {
            title: I18n.t('editProductPage.sidebar.category'),
            loading: !category,
            value: category && category.name,
        },
        ...(!isProductFree ? { // Temporarily hide active subscribers info for free products while the backend does not support it.
            subscriberCount: {
                title: I18n.t('editProductPage.sidebar.activeSubscribers'),
                loading: isPending,
                value: subscriberCount || 0,
            },
            purchaseTimestamp: {
                title: I18n.t('editProductPage.sidebar.mostRecentPurchase'),
                loading: isPending,
                value: purchaseTimestamp != null ? ago(new Date(purchaseTimestamp), true) : '-',
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
