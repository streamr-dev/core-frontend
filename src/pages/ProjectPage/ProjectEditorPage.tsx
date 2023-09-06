import React from 'react'
import styled from 'styled-components'
import Layout from '~/components/Layout'
import {
    useIsNewProject,
    useIsProjectBusy,
    useProject,
    useUpdateProject,
} from '~/shared/stores/projectEditor'
import { getProjectTypeTitle } from '~/getters'
import { DetailsPageHeader } from '~/shared/components/DetailsPageHeader'
import ProjectLinkTabs from '~/pages/ProjectPage/ProjectLinkTabs'
import LoadingIndicator from '~/shared/components/LoadingIndicator'
import { ProjectType } from '~/shared/types'
import { ProjectPageContainer } from '~/shared/components/ProjectPage'
import EditorNav from './EditorNav'
import ColoredBox from '~/components/ColoredBox'
import TermsOfUse from '~/pages/ProjectPage/TermsOfUse'
import Button from '~/shared/components/Button'
import EditorHero from './EditorHero'
import EditorStreams from './EditorStreams'

export default function ProjectEditorPage() {
    const { type, creator } = useProject({ hot: true })

    const isNew = useIsNewProject()

    const busy = useIsProjectBusy()

    return (
        <Layout
            nav={<EditorNav />}
            pageTitle={isNew ? 'Create a new project' : 'Edit project'}
        >
            <DetailsPageHeader
                pageTitle={
                    !!creator && (
                        <>
                            {getProjectTypeTitle(type)} by
                            <strong>&nbsp;{creator}</strong>
                        </>
                    )
                }
                rightComponent={<ProjectLinkTabs />}
            />
            <LoadingIndicator loading={busy} />
            <ProjectPageContainer>
                <Segment>
                    <EditorHero />
                </Segment>
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
                <Segment>
                    <ColoredBox $pad>
                        <Content>
                            <h2>Add streams</h2>
                        </Content>
                        <EditorStreams />
                    </ColoredBox>
                </Segment>
                <Segment>
                    <ColoredBox $pad>
                        <Content>
                            <h2>Set terms of use</h2>
                            <p>
                                Indicate the terms of use you prefer, either simply, by
                                checking the appropriate boxes below to&nbsp;show usage
                                types are permitted, or optionally, give more detail by
                                providing a link to your own terms of use document.
                            </p>
                            <TermsOfUse />
                        </Content>
                    </ColoredBox>
                </Segment>
                {!isNew && (
                    <Segment>
                        <ColoredBox
                            $borderColor="#cdcdcd"
                            $backgroundColor="transparent"
                            $pad
                        >
                            <Content>
                                <h2>Delete project</h2>
                                <p>
                                    Delete this project forever. You can&apos;t undo this.
                                </p>
                            </Content>
                            <Button
                                kind="destructive"
                                onClick={async () => {
                                    try {
                                        /**
                                         * 1. async-delete the project.
                                         * 2. Redirect away.
                                         */
                                    } catch (e) {
                                        console.warn('Failed to delete a project', e)
                                    }
                                }}
                            >
                                Delete
                            </Button>
                        </ColoredBox>
                    </Segment>
                )}
            </ProjectPageContainer>
        </Layout>
    )
}

const Segment = styled.div`
    & + & {
        margin-top: 24px;
    }

    h2 {
        font-size: 34px;
        line-height: 34px;
        font-weight: 400;
    }

    p {
        font-size: 16px;
    }

    h2,
    p {
        margin: 0 0 28px;
    }
`

const Content = styled.div`
    max-width: 678px;
`
