// @flow

import React from 'react'
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
import ProductPage from '$shared/components/ProductPage'

const ProductDetailsPage = () => {
    const product = useProduct()
    const isDataUnion = !!(product && isDataUnionProduct(product))
    const isProductFree = !!(product && !isPaidProduct(product))
    const isDuDeployed = !!isDataUnion && !!product.dataUnionDeployed && isEthereumAddress(product.beneficiaryAddress)

    const { stats, memberCount } = useDataUnionStats()
    const dataUnion = useDataUnion()

    const { joinPartStreamId } = dataUnion || {}

    return (
        <ProductPage>
            <ProductPage.Hero>
                <ProductPage.Container>
                    <Hero />
                    <ProductPage.Separator />
                    <Description isProductFree={isProductFree} />
                </ProductPage.Container>
            </ProductPage.Hero>
            <ProductPage.Container>
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
            </ProductPage.Container>
        </ProductPage>
    )
}

export default ProductDetailsPage
