import React, {FunctionComponent} from 'react'
import { isDataUnionProduct } from '$mp/utils/product'
import Terms from '$mp/components/ProductPage/Terms'
import ProjectPage, {
    ProjectPageContainer,
} from '$shared/components/ProjectPage'
import {useLoadedProject} from "$mp/contexts/LoadedProjectContext"
import Description from './Description'
import Streams from './Streams'
import ProjectHero2 from './Hero/ProjectHero2'

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
                <Streams streams={project?.streams || []} />
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
