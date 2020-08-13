// @flow

import React from 'react'
import styled from 'styled-components'
import { isDataUnionProduct, isPaidProduct } from '$mp/utils/product'
import useProduct from '$mp/containers/ProductController/useProduct'
import useDataUnionStats from './useDataUnionStats'
import useDataUnion from '$mp/containers/ProductController/useDataUnion'
import { isEthereumAddress } from '$mp/utils/validate'

import Hero from './Hero'
import Description from './Description'
import DataUnionStats from './DataUnionStats'
import Streams from './Streams'
import RelatedProducts from './RelatedProducts'
import Terms from '$mp/components/ProductPage/Terms'
import Segment from '$shared/components/Segment'

import styles from './page.pcss'

const UnstyledProductDetailsPage = () => {
    const product = useProduct()
    const isDataUnion = !!(product && isDataUnionProduct(product))
    const isProductFree = !!(product && !isPaidProduct(product))
    const isDuDeployed = !!isDataUnion && !!product.dataUnionDeployed && isEthereumAddress(product.beneficiaryAddress)

    const { stats, memberCount } = useDataUnionStats()
    const dataUnion = useDataUnion()

    const { joinPartStreamId } = dataUnion || {}

    return (
        <div className={styles.productPage}>
            <Hero />
            <Description isProductFree={isProductFree} />
            {isDataUnion && (
                <DataUnionStats
                    showDeploying={!isDuDeployed}
                    stats={stats}
                    memberCount={memberCount}
                    joinPartStreamId={joinPartStreamId}
                />
            )}
            <Streams />
            <Terms
                product={product}
            />
            <RelatedProducts />
        </div>
    )
}

const ProductDetailsPage = styled(UnstyledProductDetailsPage)`
    color: black;
    padding-bottom: 3em;

    .container {
        max-width: 1110px;
    }

    ${Segment} {
        margin-top: 64px;
    }
`

export default ProductDetailsPage
