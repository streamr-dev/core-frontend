// @flow

import React, { useEffect } from 'react'
import { isDataUnionProduct, isPaidProduct } from '$mp/utils/product'
import useProduct from '$mp/containers/ProductController/useProduct'
import useDataUnion from '$mp/containers/ProductController/useDataUnion'
import useContractProduct from '$mp/containers/ProductController/useContractProduct'
import { isEthereumAddress } from '$mp/utils/validate'
import Terms from '$mp/components/ProductPage/Terms'
import ProductPage from '$shared/components/ProductPage'
import Segment from '$shared/components/Segment'
import useDataUnionStats from './useDataUnionStats'
import useDataUnionServerStats from './useDataUnionServerStats'

import Hero from './Hero'
import Description from './Description'
import DataUnionStats from './DataUnionStats'
import Streams from './Streams'
import RelatedProducts from './RelatedProducts'

const ProductDetailsPage = () => {
    const product = useProduct()
    const contractProduct = useContractProduct()

    const { subscriberCount } = contractProduct || {}
    const { created, adminFee, dataUnionDeployed, beneficiaryAddress } = product
    const isDataUnion = !!(product && isDataUnionProduct(product))
    const isProductFree = !!(product && !isPaidProduct(product))
    const isDuDeployed = !!isDataUnion && !!dataUnionDeployed && isEthereumAddress(beneficiaryAddress)

    const { startPolling, stopPolling, totalEarnings, memberCount } = useDataUnionServerStats()
    const stats = useDataUnionStats({
        beneficiaryAddress,
        created,
        adminFee,
        subscriberCount,
        totalEarnings,
        memberCount,
    })
    const dataUnion = useDataUnion()

    const { joinPartStreamId } = dataUnion || {}

    useEffect(() => {
        if (isDataUnion) {
            startPolling(beneficiaryAddress)

            return () => stopPolling()
        }

        return () => {}
    }, [startPolling, stopPolling, isDataUnion, beneficiaryAddress])

    return (
        <ProductPage>
            <ProductPage.Hero>
                <ProductPage.Container>
                    <ProductPage.Container>
                        <Hero />
                        <ProductPage.Separator />
                        <Description isProductFree={isProductFree} />
                    </ProductPage.Container>
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
                <Terms product={product} />
                <ProductPage.Container>
                    <Segment>
                        <RelatedProducts />
                    </Segment>
                </ProductPage.Container>
                <Segment />
            </ProductPage.Container>
        </ProductPage>
    )
}

export default ProductDetailsPage
