import React, { useEffect, useMemo } from 'react'
import styled, { css } from 'styled-components'
import Layout from '$shared/components/Layout/Core'
import Button from '$shared/components/Button'
import { MarketplaceHelmet } from '$shared/components/Helmet'
import { DetailsPageHeader } from '$shared/components/DetailsPageHeader'
import { truncateStreamName } from '$shared/utils/text'
import { CopyButton } from "$shared/components/CopyButton/CopyButton"
import { DESKTOP, TABLET } from '$shared/utils/styled'
import { useCurrentDraft, useIsCurrentDraftBusy, useIsCurrentDraftClean, useStreamEditorStore } from '$shared/stores/streamEditor'
import usePreventNavigatingAway from '$shared/hooks/usePreventNavigatingAway'
import routes from '$routes'

export const getStreamDetailsLinkTabs = (streamId?: string) => {
    return [
        {
            label: 'Stream overview',
            href:  routes.streams.overview({id: streamId})
        },
        {
            label: 'Connect',
            href:  routes.streams.connect({id: streamId})
        },
        {
            label: 'Live data',
            href:  routes.streams.liveData({id: streamId})
        }
    ]
}

const Outer = styled.div`
    width: 100%;
    padding: 24px 24px 80px 24px;

    @media ${TABLET} {
        max-width: 1296px;
        margin: 0 auto;
        padding: 45px 40px 90px 40px;
    }

    @media ${DESKTOP} {
        padding: 60px 0px 130px 0px;
    }
`

type InnerProps = {
    fullWidth: boolean,
}

const Inner = styled.div<InnerProps>`
    display: grid;
    grid-template-columns: fit-content(680px) auto;
    border-radius: 16px;
    background-color: white;
    padding: 24px;
  
    ${({ fullWidth }) => fullWidth && css`
        grid-template-columns: auto;
    `}

    @media ${TABLET} {
        padding: 40px;
    }

    @media ${DESKTOP} {
        padding: 52px;
    }
`

const SaveButton = styled(Button)`
    width: fit-content;
    justify-self: right;
`

type ContainerBoxProps = {
    children?: React.ReactNode,
    disabled?: boolean,
    showSaveButton?: boolean
    fullWidth?: boolean
}

const TitleContainer = styled.div`
  display: flex;
  align-items: center;
`

function ContainerBox({ children, disabled, showSaveButton = true, fullWidth = false }: ContainerBoxProps) {
    return (
        <Outer>
            <Inner fullWidth={fullWidth}>
                <div>
                    {children}
                </div>
                {showSaveButton && <SaveButton
                    kind="primary"
                    type="submit"
                    disabled={disabled}
                >
                    Save
                </SaveButton>}
            </Inner>
        </Outer>
    )
}

export default function StreamPage({ children, loading = false, includeContainerBox = true , showSaveButton = true, fullWidth = false}) {
    const { streamId, transientStreamId } = useCurrentDraft()

    const l = Object.keys(useStreamEditorStore().cache).length

    useEffect(() => {
        console.log('Drafts:', l)
    }, [l])

    const busy = useIsCurrentDraftBusy()

    const linkTabs = useMemo(() => streamId ? getStreamDetailsLinkTabs(streamId) : [], [streamId])

    const clean = useIsCurrentDraftClean()

    usePreventNavigatingAway('You have unsaved changes. Are you sure you want to leave?', () => !clean)

    return (
        <>
            <form
                onSubmit={(e) => {
                    // save()
                    e.preventDefault()
                }}
            >
                <Layout>
                    <MarketplaceHelmet title={streamId ? `Stream ${streamId}` : 'New stream'} />
                    <DetailsPageHeader
                        backButtonLink={routes.streams.index()}
                        pageTitle={
                            <TitleContainer>
                                <span title={streamId}>
                                    {streamId ? truncateStreamName(streamId, 50) : (transientStreamId || 'New stream')}
                                </span>
                                {streamId ? <CopyButton valueToCopy={streamId} /> : ''}
                            </TitleContainer>
                        }
                        linkTabs={linkTabs}
                        rightComponent={
                            <div>
                                {streamId == null && (
                                    <Button disabled={busy || clean} kind="primary" type="submit">
                                        Save
                                    </Button>
                                )}
                            </div>
                        }
                    />
                    {includeContainerBox ? (
                        <ContainerBox disabled={busy || clean} showSaveButton={showSaveButton} fullWidth={fullWidth}>
                            {!loading && children}
                        </ContainerBox>
                    ) : (
                        <>{!loading && children}</>
                    )}
                </Layout>
            </form>
        </>
    )
}
