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
import { ProjectType, SalePoint } from '~/shared/types'
import { ProjectPageContainer } from '~/shared/components/ProjectPage'
import EditorNav from './EditorNav'
import ColoredBox from '~/components/ColoredBox'
import TermsOfUse from '~/pages/ProjectPage/TermsOfUse'
import Button from '~/shared/components/Button'
import EditorHero from './EditorHero'
import EditorStreams from './EditorStreams'
import SalePointSelector from '~/components/SalePointSelector'
import { getConfigForChain } from '~/shared/web3/config'
import DataUnionPayment from './DataUnionPayment'
import { formatChainName } from '~/shared/utils/chains'
import SalePointTokenSelector from '~/components/SalePointSelector/SalePointTokenSelector'
import { DESKTOP } from '~/shared/utils/styled'
import DataUnionFee from './DataUnionFee'
import { DataUnionOption } from '~/components/SalePointSelector/SalePointOption'

export default function ProjectEditorPage() {
    const { type, creator, salePoints } = useProject({ hot: true })

    const isNew = useIsNewProject()

    const busy = useIsProjectBusy()

    const update = useUpdateProject()

    function onSalePointChange(value: SalePoint) {
        update((project) => {
            const { name: chainName } = getConfigForChain(value.chainId)

            if (project.salePoints[chainName]?.readOnly) {
                return
            }

            project.salePoints[chainName] = value

            if (project.type !== ProjectType.DataUnion) {
                return
            }

            Object.values(project.salePoints).forEach((salePoint) => {
                if (!salePoint?.enabled || salePoint === value) {
                    return
                }

                salePoint.enabled = false
            })
        })
    }

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
                    <Segment>
                        <ColoredBox $pad>
                            <Content>
                                <h2>Select chains</h2>
                                <p>
                                    Access to the project data can be purchased on the
                                    selected chains. You can set the payment token, price,
                                    and beneficiary address on each chain separately.
                                </p>
                            </Content>
                            <Content $desktopMaxWidth="728px">
                                <SalePointSelector
                                    salePoints={salePoints}
                                    onSalePointChange={onSalePointChange}
                                />
                            </Content>
                        </ColoredBox>
                    </Segment>
                )}
                {type === ProjectType.DataUnion && (
                    <DataUnionPayment>
                        {(salePoint) => (
                            <>
                                <Segment>
                                    <ColoredBox $pad>
                                        <Content>
                                            <h2>Select chain</h2>
                                            <p>Select the chain for your Data Union.</p>
                                        </Content>
                                        <Content $desktopMaxWidth="728px">
                                            <SalePointSelector
                                                salePoints={salePoints}
                                                onSalePointChange={onSalePointChange}
                                                renderer={DataUnionOption}
                                            />
                                        </Content>
                                    </ColoredBox>
                                </Segment>
                                <Segment>
                                    <ColoredBox $pad>
                                        <Content>
                                            <h2>
                                                {salePoint ? (
                                                    <>
                                                        Set the payment token and price
                                                        on&nbsp;the&nbsp;
                                                        {formatChainName(
                                                            getConfigForChain(
                                                                salePoint.chainId,
                                                            ).name,
                                                        )}{' '}
                                                        chain
                                                    </>
                                                ) : (
                                                    <>Set the payment token and price</>
                                                )}
                                            </h2>
                                            <p>
                                                You can set a price for others to access
                                                the streams in your project. The price can
                                                be set in DATA or any other ERC-20 token.
                                            </p>
                                        </Content>
                                        {salePoint ? (
                                            <Content $desktopMaxWidth="728px">
                                                <SalePointTokenSelector
                                                    salePoint={salePoint}
                                                    onSalePointChange={onSalePointChange}
                                                />
                                            </Content>
                                        ) : (
                                            <>Select a chain first!</>
                                        )}
                                    </ColoredBox>
                                </Segment>
                                <Segment>
                                    <ColoredBox $pad>
                                        <Content>
                                            <h2>Data Union admin fee</h2>
                                        </Content>
                                        <Content $desktopMaxWidth="728px">
                                            <DataUnionFee />
                                        </Content>
                                    </ColoredBox>
                                </Segment>
                            </>
                        )}
                    </DataUnionPayment>
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
                        </Content>
                        <Content $desktopMaxWidth="728px">
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
        font-weight: 400;
        line-height: 1.5em;
        margin: 0 0 28px;
    }

    h2 + p {
        font-size: 16px;
        margin-bottom: 40px;
    }
`

const Content = styled.div<{ $desktopMaxWidth?: string }>`
    @media ${DESKTOP} {
        max-width: ${({ $desktopMaxWidth = '678px' }) => $desktopMaxWidth};
    }
`
