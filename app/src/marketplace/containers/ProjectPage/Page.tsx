import React, {FunctionComponent, useEffect} from 'react'
import { isDataUnionProduct } from '$mp/utils/product'
import { useController } from '$mp/containers/ProductController'
import useDataUnion from '$mp/containers/ProductController/useDataUnion'
import useContractProduct from '$mp/containers/ProductController/useContractProduct'
import { isEthereumAddress } from '$mp/utils/validate'
import Terms from '$mp/components/ProductPage/Terms'
import ProjectPage, {
    ProjectPageContainer,
} from '$shared/components/ProjectPage'
import { getChainIdFromApiString } from '$shared/utils/chains'
import {useLoadedProject} from "$mp/contexts/LoadedProjectContext"
import useDataUnionServerStats from './useDataUnionServerStats'
import Description from './Description'
import DataUnionStats from './DataUnionStats'
import Streams from './Streams'
import usePreviewStats from './usePreviewStats'
import { ProjectHero2 } from './Hero/ProjectHero2'

const ProjectDetailsPage: FunctionComponent = () => {
    const {loadedProject: project} = useLoadedProject()
    const isDataUnion = !!(project && isDataUnionProduct(project))
    // const isDuDeployed = !!isDataUnion && !!dataUnionDeployed && isEthereumAddress(beneficiaryAddress)
    // const { startPolling, stopPolling, totalEarnings, memberCount } = useDataUnionServerStats()

    /*useEffect(() => {
        if (isDataUnion) {
            startPolling(beneficiaryAddress, chainId)
            return () => stopPolling()
        }

        return () => {}
    }, [startPolling, stopPolling, isDataUnion, beneficiaryAddress, chainId])*/
    return (
        <ProjectPage>
            <ProjectPageContainer>
                <ProjectHero2 project={project}/>
                <Description project={project} />
                <Streams project={project} />
                {/*{isDataUnion && (
                    <DataUnionStats
                        showDeploying={!isDuDeployed}
                        stats={stats}
                        memberCount={memberCount}
                        dataUnion={dataUnion}
                        chainId={chainId}
                    />
                )}*/}

                <Terms terms={project?.termsOfUse || {}} />
            </ProjectPageContainer>
        </ProjectPage>
    )
}

export default ProjectDetailsPage
