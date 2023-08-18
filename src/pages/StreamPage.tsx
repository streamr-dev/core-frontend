import React, { FormEvent, useCallback } from 'react'
import { StreamPermission } from 'streamr-client'
import styled, { css } from 'styled-components'
import { toaster } from 'toasterhea'
import {
    Link,
    Route,
    Routes,
    useNavigate,
    useLocation,
    useParams,
    Navigate,
} from 'react-router-dom'
import { StreamPreview } from '~/shared/components/StreamPreview'
import { StreamConnect } from '~/shared/components/StreamConnect'
import {
    useCurrentStreamAbility,
    useInvalidateStreamAbilities,
} from '~/shared/stores/streamAbilities'
import {
    DraftValidationError,
    StreamDraftContext,
    useCurrentDraft,
    useInitStreamDraft,
    useIsCurrentDraftBusy,
    useIsCurrentDraftClean,
    usePersistCurrentDraft,
    useSetCurrentDraftError,
} from '~/shared/stores/streamEditor'
import useDecodedStreamId from '~/shared/hooks/useDecodedStreamId'
import StreamNotFoundError from '~/shared/errors/StreamNotFoundError'
import Layout from '~/components/Layout'
import Helmet from '~/components/Helmet'
import { DetailsPageHeader } from '~/shared/components/DetailsPageHeader'
import { truncateStreamName } from '~/shared/utils/text'
import { CopyButton } from '~/shared/components/CopyButton/CopyButton'
import Tabs, { Tab } from '~/shared/components/Tabs'
import { RouteMemoryKey, useKeep } from '~/shared/stores/routeMemory'
import Button from '~/shared/components/Button'
import usePreventNavigatingAway from '~/shared/hooks/usePreventNavigatingAway'
import { DESKTOP, TABLET } from '~/shared/utils/styled'
import LoadingIndicator from '~/shared/components/LoadingIndicator'
import useIsMounted from '~/shared/hooks/useIsMounted'
import { useWalletAccount } from '~/shared/stores/wallet'
import InsufficientFundsError from '~/shared/errors/InsufficientFundsError'
import getNativeTokenName from '~/shared/utils/nativeToken'
import getChainId from '~/utils/web3/getChainId'
import { Layer } from '~/utils/Layer'
import GetCryptoModal from '~/modals/GetCryptoModal'
import NotFoundPage, { NotFoundPageContent } from '~/shared/components/NotFoundPage'
import { GenericErrorPageContent } from '~/shared/components/GenericErrorPage'
import routes from '~/routes'
import InfoSection from './AbstractStreamEditPage/InfoSection'
import AccessControlSection from './AbstractStreamEditPage/AccessControlSection'
import HistorySection from './AbstractStreamEditPage/HistorySection'
import PartitionsSection from './AbstractStreamEditPage/PartitionsSection'
import DeleteSection from './AbstractStreamEditPage/DeleteSection'
import PersistanceAlert from './AbstractStreamEditPage/PersistanceAlert'
import RelatedProjects from './AbstractStreamEditPage/RelatedProjects'
import CreateProjectHint from './AbstractStreamEditPage/CreateProjectHint'

const getCryptoModal = toaster(GetCryptoModal, Layer.Modal)

function EditPage({ isNew = false }: { isNew?: boolean }) {
    const { streamId } = useCurrentDraft()

    const canEdit = useCurrentStreamAbility(StreamPermission.EDIT)

    const canDelete = useCurrentStreamAbility(StreamPermission.DELETE)

    const canGrant = useCurrentStreamAbility(StreamPermission.GRANT)

    const busy = useIsCurrentDraftBusy()

    const clean = useIsCurrentDraftClean()

    const disabled = typeof canEdit === 'undefined' || busy

    return (
        <>
            <LoadingIndicator loading={disabled} />
            <ContainerBox
                disabled={disabled || clean}
                showRelatedProjects={!!streamId}
                showSaveButton={!isNew}
                streamId={streamId}
                showProjectCreateHint={canGrant}
            >
                <PersistanceAlert />
                <InfoSection disabled={disabled} />
                <AccessControlSection disabled={disabled} />
                <HistorySection disabled={disabled} />
                <PartitionsSection disabled={disabled} />
                {canDelete && <DeleteSection />}
            </ContainerBox>
        </>
    )
}

function LiveDataPage() {
    const canSubscribe = useCurrentStreamAbility(StreamPermission.SUBSCRIBE)

    const loading = typeof canSubscribe === 'undefined'

    const streamId = useDecodedStreamId()

    return (
        <>
            <LoadingIndicator loading={loading} />
            <StreamPreview streamsList={[streamId]} previewDisabled={!canSubscribe} />
        </>
    )
}

function ConnectPage() {
    const streamId = useDecodedStreamId()

    const loading = useCurrentStreamAbility(StreamPermission.EDIT) == null

    return (
        <>
            <LoadingIndicator loading={loading} />
            <ContainerBox fullWidth showRelatedProjects streamId={streamId}>
                <StreamConnect streams={[streamId]} />
            </ContainerBox>
        </>
    )
}

function StreamRedirect() {
    const { id } = useParams<{ id: string }>()

    return <Navigate to={routes.streams.overview({ id })} replace />
}

function defaultFormEventHandler(e: FormEvent) {
    e.preventDefault()
}

interface Props {
    tab?: 'overview' | 'connect' | 'live-data'
}

function StreamPageSwitch({ tab }: Props) {
    const { id } = useParams<{
        id: string
    }>()

    const isNew = id === 'new'

    const { streamId, loadError } = useCurrentDraft()

    const busy = useIsCurrentDraftBusy()

    const clean = useIsCurrentDraftClean()

    const persist = usePersistCurrentDraft()

    const setValidationError = useSetCurrentDraftError()

    const navigate = useNavigate()

    const isMounted = useIsMounted()

    const address = useWalletAccount()

    const invalidateAbilities = useInvalidateStreamAbilities()

    usePreventNavigatingAway({
        isDirty: useCallback(
            (dest?: string) => {
                if (streamId) {
                    switch (dest) {
                        case routes.streams.overview({ id: streamId }):
                        case routes.streams.connect({ id: streamId }):
                        case routes.streams.liveData({ id: streamId }):
                            return false
                    }
                }

                /**
                 * Undefined `dest` means it's a full URL change that's happening outside of the
                 * router, or it's a refresh. We block such things here only if the state is dirty.
                 *
                 * Internal route changes are allowed w/o questions as long as modifications to the
                 * current draft are being persisted (see `busy`).
                 */
                return !clean && (typeof dest === 'undefined' || !busy)
            },
            [clean, busy, streamId],
        ),
    })

    async function onSubmit(e: FormEvent) {
        defaultFormEventHandler(e)

        try {
            await persist({
                onCreate(streamId) {
                    if (!isMounted()) {
                        /**
                         * Avoid redirecting to the new stream's edit page after the stream
                         * page has been unmounted.
                         */
                        return
                    }

                    navigate(
                        routes.streams.overview({
                            id: streamId,
                        }),
                    )
                },
                onPermissionsChange(streamId, assignments) {
                    if (!address) {
                        return
                    }

                    if (
                        !assignments.some((assignment) => {
                            return (
                                'user' in assignment &&
                                assignment.user.toLowerCase() === address.toLowerCase()
                            )
                        })
                    ) {
                        return
                    }

                    invalidateAbilities(streamId, address)
                },
            })
        } catch (e) {
            if (e instanceof DraftValidationError) {
                return void setValidationError(e.key, e.message)
            }

            if (e instanceof InsufficientFundsError) {
                return void setTimeout(async () => {
                    try {
                        const chainId = await getChainId()

                        await getCryptoModal.pop({
                            tokenName: getNativeTokenName(chainId),
                        })
                    } catch (_) {
                        // Do nothing.
                    }
                })
            }

            throw e
        }
    }

    if (typeof loadError === 'undefined') {
        /**
         * We don't know if the stream loaded or not. `loadError` means
         * - still determining if `undefined`,
         * - all good if `null`,
         * - something broke down if anything other than the above 2.
         */
        return (
            <form onSubmit={defaultFormEventHandler}>
                <Layout footer={null}>
                    <Header />
                    <LoadingIndicator loading />
                </Layout>
            </form>
        )
    }

    if (loadError instanceof StreamNotFoundError) {
        return (
            <form onSubmit={defaultFormEventHandler}>
                <Layout footer={null}>
                    <Header />
                    <LoadingIndicator />
                    <NotFoundPageContent />
                </Layout>
            </form>
        )
    }

    if (loadError) {
        return (
            <form onSubmit={defaultFormEventHandler}>
                <Layout footer={null}>
                    <Header />
                    <LoadingIndicator />
                    <GenericErrorPageContent />
                </Layout>
            </form>
        )
    }

    const editView = tab === 'overview' || isNew

    return (
        <form onSubmit={editView ? onSubmit : defaultFormEventHandler}>
            <Layout footer={null}>
                <Header isNew={isNew} />
                {editView && <EditPage isNew={isNew} />}
                {tab === 'connect' && <ConnectPage />}
                {tab === 'live-data' && <LiveDataPage />}
            </Layout>
        </form>
    )
}

export default function StreamPage() {
    const streamId = useDecodedStreamId()

    const draftId = useInitStreamDraft(streamId === 'new' ? undefined : streamId)

    return (
        <StreamDraftContext.Provider value={draftId}>
            <Routes>
                <Route
                    index
                    element={
                        streamId === 'new' ? <StreamPageSwitch /> : <StreamRedirect />
                    }
                />
                <Route path="overview" element={<StreamPageSwitch tab="overview" />} />
                <Route path="connect" element={<StreamPageSwitch tab="connect" />} />
                <Route path="live-data" element={<StreamPageSwitch tab="live-data" />} />
                <Route path="*" element={<NotFoundPage />} />
            </Routes>
        </StreamDraftContext.Provider>
    )
}

function Header({ isNew = false }: { isNew?: boolean }) {
    const { streamId, transientStreamId } = useCurrentDraft()

    const { pathname } = useLocation()

    const keep = useKeep()

    const busy = useIsCurrentDraftBusy()

    const clean = useIsCurrentDraftClean()

    return (
        <>
            <Helmet title={streamId ? `Stream ${streamId}` : 'New stream'} />
            <DetailsPageHeader
                backButtonLink={routes.streams.index()}
                pageTitle={
                    <TitleContainer>
                        <span title={streamId}>
                            {streamId
                                ? truncateStreamName(streamId, 50)
                                : transientStreamId || 'New stream'}
                        </span>
                        {streamId ? <CopyButton valueToCopy={streamId} /> : ''}
                    </TitleContainer>
                }
                rightComponent={
                    streamId ? (
                        <Tabs selection={pathname}>
                            <Tab
                                id="overview"
                                tag={Link}
                                to={routes.streams.overview({
                                    id: streamId,
                                })}
                                selected="to"
                                onClick={() =>
                                    void keep(RouteMemoryKey.lastStreamListingSelection())
                                }
                            >
                                Stream overview
                                {!clean && <Asterisk />}
                            </Tab>
                            <Tab
                                id="connect"
                                tag={Link}
                                to={routes.streams.connect({
                                    id: streamId,
                                })}
                                selected="to"
                                onClick={() =>
                                    void keep(RouteMemoryKey.lastStreamListingSelection())
                                }
                            >
                                Connect
                            </Tab>
                            <Tab
                                id="liveData"
                                tag={Link}
                                to={routes.streams.liveData({
                                    id: streamId,
                                })}
                                selected="to"
                                onClick={() =>
                                    void keep(RouteMemoryKey.lastStreamListingSelection())
                                }
                            >
                                Live data
                            </Tab>
                        </Tabs>
                    ) : isNew ? (
                        <div>
                            <Button disabled={busy || clean} kind="primary" type="submit">
                                Save
                            </Button>
                        </div>
                    ) : null
                }
            />
        </>
    )
}

const TitleContainer = styled.div`
    display: flex;
    align-items: center;
`

const Asterisk = styled.span`
    :after {
        content: '*';
        position: absolute;
    }
`

const Inner = styled.div<{ $fullWidth?: boolean }>`
    display: grid;
    grid-template-columns: fit-content(680px) auto;
    border-radius: 16px;
    background-color: white;
    padding: 24px;

    ${({ $fullWidth = false }) =>
        $fullWidth &&
        css`
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
    children?: React.ReactNode
    disabled?: boolean
    streamId?: string
    showSaveButton?: boolean
    fullWidth?: boolean
    showRelatedProjects?: boolean
    showProjectCreateHint?: boolean
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

function ContainerBox({
    children,
    disabled,
    streamId,
    showSaveButton = false,
    fullWidth = false,
    showRelatedProjects = false,
    showProjectCreateHint = false,
}: ContainerBoxProps) {
    return (
        <Outer>
            <Inner $fullWidth={fullWidth}>
                <div>{children}</div>
                {showSaveButton && (
                    <SaveButton kind="primary" type="submit" disabled={disabled}>
                        Save
                    </SaveButton>
                )}
            </Inner>
            {showRelatedProjects && streamId && <RelatedProjects streamId={streamId} />}
            {showProjectCreateHint && <CreateProjectHint streamId={streamId} />}
        </Outer>
    )
}
