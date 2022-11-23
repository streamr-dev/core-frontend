import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import styled from 'styled-components'
import merge from 'lodash/merge'
import useIsMounted from '$shared/hooks/useIsMounted'
import { selectRelatedProductList } from '$mp/modules/relatedProducts/selectors'
import { SM, LG } from '$shared/utils/styled'
import useContractProducts from '$shared/hooks/useContractProducts'
import ProjectsComponent, { MarketplaceProjectCol } from '$mp/components/Projects'
const RelatedProductsContainer = styled(ProjectsComponent)`
    @media (min-width: ${SM}px) and (max-width: ${LG}px) {
        ${MarketplaceProjectCol}:last-child {
            display: none;
        }
    }
`

const RelatedProducts = () => {
    const relatedProjects = useSelector(selectRelatedProductList)
    const isMounted = useIsMounted()
    const { load: loadContractProducts } = useContractProducts()
    const [contractProducts, setContractProducts] = useState([])
    useEffect(() => {
        const load = async () => {
            const cps = await loadContractProducts(relatedProjects)

            if (isMounted()) {
                setContractProducts(cps)
            }
        }

        load()
    }, [loadContractProducts, relatedProjects, isMounted])

    if (!relatedProjects || relatedProjects.length < 1) {
        return null
    }

    const projects = relatedProjects.slice(0, 3)
    return (
        <RelatedProductsContainer
            header="Related products"
            projects={projects.map((p) => {
                const contractProd = contractProducts.find((cp) => cp.id === p.id)
                const pricingTokenAddress = contractProd ? contractProd.pricingTokenAddress : null
                return merge({}, p, {
                    pricingTokenAddress,
                })
            })}
            type="relatedProjects"
        />
    )
}

export default RelatedProducts
