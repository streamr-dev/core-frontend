import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import styled from 'styled-components'
import merge from 'lodash/merge'

import useIsMounted from '$shared/hooks/useIsMounted'
import { selectRelatedProductList } from '$mp/modules/relatedProducts/selectors'
import { SM, LG } from '$shared/utils/styled'
import useContractProducts from '$shared/hooks/useContractProducts'

import Products, { MarketplaceProductCol } from '$mp/components/Products'

const RelatedProductsContainer = styled(Products)`
    @media (min-width: ${SM}px) and (max-width: ${LG}px) {
        ${MarketplaceProductCol}:last-child {
            display: none;
        }
    }
`

const RelatedProducts = () => {
    const relatedProducts = useSelector(selectRelatedProductList)
    const isMounted = useIsMounted()
    const { load: loadContractProducts } = useContractProducts()
    const [contractProducts, setContractProducts] = useState([])

    useEffect(() => {
        const load = async () => {
            const cps = await loadContractProducts(relatedProducts)
            if (isMounted()) {
                setContractProducts(cps)
            }
        }
        load()
    }, [loadContractProducts, relatedProducts, isMounted])

    if (!relatedProducts || relatedProducts.length < 1) {
        return null
    }

    const products = relatedProducts.slice(0, 3)

    return (
        <RelatedProductsContainer
            header="Related products"
            products={products.map((p) => {
                const contractProd = contractProducts.find((cp) => cp.id === p.id)
                const pricingTokenAddress = contractProd ? contractProd.pricingTokenAddress : null

                return merge({}, p, {
                    pricingTokenAddress,
                })
            })}
            type="relatedProducts"
        />
    )
}

export default RelatedProducts
