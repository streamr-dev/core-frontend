import React, { FunctionComponent, useContext } from 'react'
import styled from 'styled-components'
import { ProjectPageContainer } from '$shared/components/ProjectPage'
import { ProjectHeroContainer } from '$mp/containers/ProjectPage/Hero/ProjectHero2.styles'
import { CoverImage } from '$mp/containers/ProjectEditing/CoverImage'
import ProjectName from '$mp/containers/ProjectEditing/ProjectName'
import ProjectDescription from '$mp/containers/ProjectEditing/ProjectDescription'
import { ProjectDetails } from '$mp/containers/ProjectEditing/ProjectDetails'
import { WhiteBox } from '$shared/components/WhiteBox'
import { ProjectStateContext } from '$mp/contexts/ProjectStateContext'
import { ProjectType } from '$shared/types'
import { StreamSelector } from '$mp/containers/ProjectEditing/StreamSelector'
import { TermsOfUse } from '$mp/containers/ProjectEditing/TermsOfUse'
import { SalePointSelector } from '$mp/containers/ProjectEditing/SalePointSelector/SalePointSelector'
import { DataUnionChainSelector } from '$mp/containers/ProjectEditing/DataUnionChainSelector/DataUnionChainSelector'
import { DataUnionTokenSelector } from '$mp/containers/ProjectEditing/DataUnionTokenSelector/DataUnionTokenSelector'
import { DataUnionFee } from '$mp/containers/ProjectEditing/DataUnionFee'
import {ProjectControllerContext} from "$mp/containers/ProjectEditing/ProjectController"

type ProjectEditorProps = {
    nonEditableSalePointChains?: number[] // array of chain ids
}

const WhiteBoxWithMargin = styled(WhiteBox)`
  margin-top: 24px;
`

const EditorOverlay = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  top: 2px;
  left: 0;
  background-color: white;
  opacity: 0.6;
`

export const ProjectEditor: FunctionComponent<ProjectEditorProps> = ({nonEditableSalePointChains = []}) => {
    const {state: project} = useContext(ProjectStateContext)
    const {publishInProgress} = useContext(ProjectControllerContext)

    return <ProjectPageContainer>
        <ProjectHeroContainer overflowVisible={true}>
            <CoverImage />
            <ProjectName/>
            <ProjectDescription/>
            <ProjectDetails/>
        </ProjectHeroContainer>
        {project.type === ProjectType.PaidData &&
            <WhiteBox>
                <SalePointSelector nonEditableSalePointChains={nonEditableSalePointChains}/>
            </WhiteBox>
        }
        {project.type === ProjectType.DataUnion && <>
            <WhiteBox>
                <DataUnionChainSelector/>
            </WhiteBox>
            <WhiteBoxWithMargin>
                <DataUnionTokenSelector/>
                <DataUnionFee/>
            </WhiteBoxWithMargin>
        </>}
        <WhiteBoxWithMargin>
            <StreamSelector />
        </WhiteBoxWithMargin>
        <WhiteBoxWithMargin>
            <TermsOfUse/>
        </WhiteBoxWithMargin>
        {publishInProgress && <EditorOverlay/>}
    </ProjectPageContainer>
}
