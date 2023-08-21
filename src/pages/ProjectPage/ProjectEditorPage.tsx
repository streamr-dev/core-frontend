import React from 'react'
import Helmet from '~/components/Helmet'
import Layout from '~/shared/components/Layout'
import {
    useIsNewProject,
    useIsProjectBusy,
    useProject,
} from '~/shared/stores/projectEditor'
import { getProjectTypeTitle } from '~/getters'
import { DetailsPageHeader } from '~/shared/components/DetailsPageHeader'
import ProjectLinkTabs from '~/pages/ProjectPage/ProjectLinkTabs'
import LoadingIndicator from '~/shared/components/LoadingIndicator'
import { ProjectType } from '~/shared/types'
import { ProjectPageContainer } from '~/shared/components/ProjectPage'
import { ProjectHeroContainer } from '~/marketplace/containers/ProjectPage/Hero/ProjectHero2.styles'
import EditorNav from './EditorNav'

export default function ProjectEditorPage() {
    const { type, creator } = useProject({ hot: true })

    const isNew = useIsNewProject()

    const busy = useIsProjectBusy()

    return (
        <Layout gray nav={<EditorNav />}>
            <Helmet title={isNew ? 'Create a new project' : 'Edit project'} />
            <DetailsPageHeader
                pageTitle={
                    !!creator && (
                        <>
                            {getProjectTypeTitle(type)} by
                            <strong>&nbsp;{creator} </strong>
                        </>
                    )
                }
                rightComponent={<ProjectLinkTabs />}
            />
            <LoadingIndicator loading={busy} />
            <ProjectPageContainer>
                <ProjectHeroContainer overflowVisible={true}>
                    {/* <CoverImage /> */}
                    {/* <ProjectName /> */}
                    {/* <ProjectDescription /> */}
                    {/* <ProjectDetails /> */}
                </ProjectHeroContainer>
                {type === ProjectType.PaidData && (
                    <>
                        {/* <WhiteBox> */}
                        {/* <SalePointSelector nonEditableSalePointChains={nonEditableSalePointChains} /> */}
                        {/* </WhiteBox> */}
                    </>
                )}
                {type === ProjectType.DataUnion && (
                    <>
                        {/* <WhiteBox> */}
                        {/* <DataUnionChainSelector /> */}
                        {/* </WhiteBox> */}
                        {/* <WhiteBoxWithMargin> */}
                        {/* <DataUnionTokenSelector /> */}
                        {/* <DataUnionFee /> */}
                        {/* </WhiteBoxWithMargin> */}
                    </>
                )}
                {/* <WhiteBoxWithMargin> */}
                {/* <StreamSelector /> */}
                {/* </WhiteBoxWithMargin> */}
                {/* <WhiteBoxWithMargin> */}
                {/* <TermsOfUse /> */}
                {/* </WhiteBoxWithMargin> */}
                {/* <TransparentBoxWithMargin> */}
                {/* <DeleteProject /> */}
                {/* </TransparentBoxWithMargin> */}
                {/* {busy && <EditorOverlay />} */}
            </ProjectPageContainer>
        </Layout>
    )
}
