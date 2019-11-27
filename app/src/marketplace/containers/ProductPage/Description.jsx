// @flow

import React from 'react'
import { useSelector } from 'react-redux'
import Skeleton from 'react-loading-skeleton'

import useProduct from '$mp/containers/ProductController/useProduct'
import useContractProduct from '$mp/containers/ProductController/useContractProduct'
import usePending from '$shared/hooks/usePending'
import ProductContainer from '$shared/components/Container/Product'
import { ago } from '$shared/utils/time'
import { selectCategory } from '$mp/modules/product/selectors'

import CollapsedText from '$mp/components/ProductPage/CollapsedText'

import styles from './description.pcss'

const Description = () => {
    const product = useProduct()
    const contractProduct = useContractProduct()
    const category = useSelector(selectCategory)
    const { isPending } = usePending('contractProduct.LOAD_SUBSCRIPTION')
    const { purchaseTimestamp, subscriberCount } = contractProduct || {}

    return (
        <div className={styles.container}>
            <ProductContainer>
                <div className={styles.separator} />
                <div className={styles.additionalInfo}>
                    <CollapsedText text={product.description} className={styles.description} />
                    <div className={styles.info}>
                        <div>
                            <div className={styles.subheading}>Product category</div>
                            {category ? (
                                <div>{category.name}</div>
                            ) : <Skeleton />}
                        </div>
                        <div>
                            <div className={styles.subheading}>Active subscribers</div>
                            {!isPending ? (
                                <div>{subscriberCount || 0}</div>
                            ) : <Skeleton />}
                        </div>
                        <div>
                            <div className={styles.subheading}>Most recent purchase</div>
                            {!isPending ? (
                                <div>{purchaseTimestamp != null ? ago(new Date(purchaseTimestamp)) : '-'}</div>
                            ) : <Skeleton />}
                        </div>
                    </div>
                </div>
            </ProductContainer>
        </div>
    )
}

export default Description
