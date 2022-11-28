import React, { useEffect } from 'react'
import { isDataUnionProduct } from '$mp/utils/product'
import { useController } from '$mp/containers/ProductController'
import useDataUnion from '$mp/containers/ProductController/useDataUnion'
import useContractProduct from '$mp/containers/ProductController/useContractProduct'
import { isEthereumAddress } from '$mp/utils/validate'
import Terms from '$mp/components/ProductPage/Terms'
import ProjectPage, {
    ProjectPageContainer,
    ProjectPageHero
} from '$shared/components/ProjectPage'
import Segment from '$shared/components/Segment'
import { getChainIdFromApiString } from '$shared/utils/chains'
import useDataUnionServerStats from './useDataUnionServerStats'
import Description from './Description'
import DataUnionStats from './DataUnionStats'
import Streams from './Streams'
import RelatedProducts from './RelatedProducts'
import usePreviewStats from './usePreviewStats'
import { ProjectHero2 } from './Hero/ProjectHero2'

const ProjectDetailsPage = () => {
    const { product } = useController()
    const chainId = getChainIdFromApiString(product.chain)
    const contractProduct = useContractProduct()
    const { subscriberCount } = contractProduct || {}
    const { created, adminFee, dataUnionDeployed, beneficiaryAddress } = product
    const isDataUnion = !!(product && isDataUnionProduct(product))
    const isDuDeployed = !!isDataUnion && !!dataUnionDeployed && isEthereumAddress(beneficiaryAddress)
    const { startPolling, stopPolling, totalEarnings, memberCount } = useDataUnionServerStats()
    const stats = usePreviewStats({
        beneficiaryAddress,
        created,
        adminFee,
        subscriberCount,
        totalEarnings,
        memberCount,
    })
    const dataUnion = useDataUnion()
    useEffect(() => {
        if (isDataUnion) {
            startPolling(beneficiaryAddress, chainId)
            return () => stopPolling()
        }

        return () => {}
    }, [startPolling, stopPolling, isDataUnion, beneficiaryAddress, chainId])
    return (
        <ProjectPage>
            <ProjectPageHero>
                <ProjectPageContainer>
                    <ProjectPageContainer>
                        <ProjectHero2 project={product}/>
                        <Description project={product} />
                    </ProjectPageContainer>
                </ProjectPageContainer>
            </ProjectPageHero>
            <ProjectPageContainer>
                {isDataUnion && (
                    <DataUnionStats
                        showDeploying={!isDuDeployed}
                        stats={stats}
                        memberCount={memberCount}
                        dataUnion={dataUnion}
                        chainId={chainId}
                    />
                )}
                <Streams />
                <Terms product={product} />
                <ProjectPageContainer>
                    <Segment>
                        <RelatedProducts />
                    </Segment>
                </ProjectPageContainer>
                <Segment />
            </ProjectPageContainer>
        </ProjectPage>
    )
}

export default ProjectDetailsPage
