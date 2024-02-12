import React, {
    FormEvent,
    MutableRefObject,
    ReactNode,
    RefCallback,
    useMemo,
} from 'react'
import { Link, Navigate, Outlet, useLocation, useParams } from 'react-router-dom'
import { StreamPermission } from 'streamr-client'
import styled, { css } from 'styled-components'
import { toaster } from 'toasterhea'
import { Button } from '~/components/Button'
import { CopyButton } from '~/components/CopyButton'
import { FloatingToolbar } from '~/components/FloatingToolbar'
import Helmet from '~/components/Helmet'
import Layout from '~/components/Layout'
import { useInViewport } from '~/hooks/useInViewport'
import GetCryptoModal from '~/modals/GetCryptoModal'
import { GenericErrorPageContent } from '~/pages/GenericErrorPage'
import { NotFoundPageContent } from '~/pages/NotFoundPage'
import routes from '~/routes'
import { DetailsPageHeader } from '~/shared/components/DetailsPageHeader'
import LoadingIndicator from '~/shared/components/LoadingIndicator'
import { StreamConnect } from '~/shared/components/StreamConnect'
import { StreamPreview } from '~/shared/components/StreamPreview'
import Tabs, { Tab } from '~/shared/components/Tabs'
import StreamNotFoundError from '~/shared/errors/StreamNotFoundError'
import { useCurrentStreamAbility } from '~/shared/stores/streamAbilities'
import { DESKTOP, TABLET } from '~/shared/utils/styled'
import { truncateStreamName } from '~/shared/utils/text'
import {
    StreamDraft,
    getEmptyStreamEntity,
    useStreamEntityQuery,
} from '~/stores/streamDraft'
import { Layer } from '~/utils/Layer'
import { AccessControlSection } from '../AbstractStreamEditPage/AccessControlSection'
import CreateProjectHint from '../AbstractStreamEditPage/CreateProjectHint'
import DeleteSection from '../AbstractStreamEditPage/DeleteSection'
import { HistorySection } from '../AbstractStreamEditPage/HistorySection'
import { InfoSection } from '../AbstractStreamEditPage/InfoSection'
import { PartitionsSection } from '../AbstractStreamEditPage/PartitionsSection'
import RelatedProjects from '../AbstractStreamEditPage/RelatedProjects'
import SponsorshipsTable from '../AbstractStreamEditPage/SponsorshipsTable'

const getCryptoModal = toaster(GetCryptoModal, Layer.Modal)

export function StreamEditPage({
    saveButtonRef,
}: {
    saveButtonRef?: MutableRefObject<Element | null> | RefCallback<Element | null>
}) {
    const { fetching = false } = StreamDraft.useDraft() || {}

    const { id: streamId } = StreamDraft.useEntity() || {}

    const isNew = !streamId

    const canEdit = useCurrentStreamAbility(streamId, StreamPermission.EDIT)

    const canDelete = useCurrentStreamAbility(streamId, StreamPermission.DELETE)

    const canGrant = useCurrentStreamAbility(streamId, StreamPermission.GRANT)

    const busy = StreamDraft.useIsDraftBusy()

    const canSubmit = useCanSubmit()

    const disabled = typeof canEdit === 'undefined' || busy

    const isLoading = typeof canEdit === 'undefined' || busy || fetching

    return (
        <>
            <LoadingIndicator loading={isLoading} />
            <ContainerBox
                disabled={disabled || !canSubmit}
                showRelatedProjects={!!streamId}
                showSaveButton={!isNew}
                saveButtonRef={saveButtonRef}
                streamId={streamId}
                showProjectCreateHint={canGrant}
            >
                <InfoSection disabled={disabled} />
                <AccessControlSection disabled={disabled} />
                <HistorySection disabled={disabled} />
                <PartitionsSection disabled={disabled} />
                {canDelete && <DeleteSection />}
            </ContainerBox>
        </>
    )
}

export function StreamLiveDataPage() {
    const { fetching = false } = StreamDraft.useDraft() || {}

    const { id: streamId = undefined } = StreamDraft.useEntity() || {}

    const canSubscribe = useCurrentStreamAbility(streamId, StreamPermission.SUBSCRIBE)

    const isLoading = fetching || canSubscribe == null

    return (
        <>
            <LoadingIndicator loading={isLoading} />
            {streamId != null && (
                <StreamPreview streamsList={[streamId]} previewDisabled={!canSubscribe} />
            )}
        </>
    )
}

export function StreamConnectPage() {
    const { fetching = false } = StreamDraft.useDraft() || {}

    const { id: streamId = undefined } = StreamDraft.useEntity() || {}

    const canEdit = useCurrentStreamAbility(streamId, StreamPermission.EDIT)

    const isLoading = fetching || canEdit == null

    return (
        <>
            <LoadingIndicator loading={isLoading} />
            {streamId != null && (
                <ContainerBox fullWidth showRelatedProjects streamId={streamId}>
                    <StreamConnect streams={[streamId]} />
                </ContainerBox>
            )}
        </>
    )
}

export function StreamIndexRedirect() {
    const { id } = useParams<{ id: string }>()

    return <Navigate to={routes.streams.overview({ id })} replace />
}

function defaultFormEventHandler(e: FormEvent) {
    e.preventDefault()
}

// function StreamPageSwitch({ tab }: Props) {
//     usePreventNavigatingAway({
//         isDirty: useCallback(
//             (dest?: string) => {
//                 if (streamId) {
//                     switch (dest) {
//                         case routes.streams.overview({ id: streamId }):
//                         case routes.streams.connect({ id: streamId }):
//                         case routes.streams.liveData({ id: streamId }):
//                             return false
//                     }
//                 }

//                 /**
//                  * Undefined `dest` means it's a full URL change that's happening outside of the
//                  * router, or it's a refresh. We block such things here only if the state is dirty.
//                  *
//                  * Internal route changes are allowed w/o questions as long as modifications to the
//                  * current draft are being persisted (see `busy`).
//                  */
//                 return !clean && (typeof dest === 'undefined' || !busy)
//             },
//             [clean, busy, streamId],
//         ),
//     })

//     async function onSubmit(e: FormEvent) {
//         defaultFormEventHandler(e)

//         try {
//             await persist(chainId, {
//                 onCreate(streamId) {
//                     if (!isMounted()) {
//                         /**
//                          * Avoid redirecting to the new stream's edit page after the stream
//                          * page has been unmounted.
//                          */
//                         return
//                     }

//                     navigate(
//                         routes.streams.overview({
//                             id: streamId,
//                         }),
//                     )
//                 },
//                 onPermissionsChange(streamId, assignments) {
//                     if (!address) {
//                         return
//                     }

//                     if (
//                         !assignments.some((assignment) => {
//                             return (
//                                 'user' in assignment &&
//                                 assignment.user.toLowerCase() === address.toLowerCase()
//                             )
//                         })
//                     ) {
//                         return
//                     }

//                     invalidateAbilities(streamId, address)
//                 },
//             })
//         } catch (e) {
//             if (e instanceof DraftValidationError) {
//                 return void setValidationError(e.key, e.message)
//             }

//             if (e instanceof InsufficientFundsError) {
//                 return void setTimeout(async () => {
//                     try {
//                         const chainId = await getChainId()

//                         await getCryptoModal.pop({
//                             tokenName: getNativeTokenName(chainId),
//                         })
//                     } catch (_) {
//                         // Do nothing.
//                     }
//                 })
//             }

//             if (isRejectionReason(e)) {
//                 return
//             }

//             if (isTransactionRejection(e)) {
//                 return
//             }

//             throw e
//         }
//     }

//     return null
// }

export function NewStreamPage() {
    const stream = useMemo(() => getEmptyStreamEntity(), [])

    const draftId = StreamDraft.useInitDraft(stream)

    return (
        <StreamDraft.DraftContext.Provider value={draftId}>
            <StreamEntityForm stickySubmit>
                {(attach) => <StreamEditPage saveButtonRef={attach} />}
            </StreamEntityForm>
        </StreamDraft.DraftContext.Provider>
    )
}

interface StreamTabbedPageProps {
    children?: ReactNode | ((attach: RefCallback<Element>) => ReactNode)
    stickySubmit?: boolean
}

export function StreamTabbedPage(props: StreamTabbedPageProps) {
    const { stickySubmit = false, children = <Outlet /> } = props

    const query = useStreamEntityQuery()

    const { data: stream = null } = query

    const isLoading = !stream && (query.isLoading || query.isFetching)

    const draftId = StreamDraft.useInitDraft(isLoading ? undefined : stream)

    return (
        <StreamDraft.DraftContext.Provider value={draftId}>
            <StreamEntityForm stickySubmit={stickySubmit}>
                {isLoading ? (
                    <LoadingIndicator loading />
                ) : query.error instanceof StreamNotFoundError ? (
                    <>
                        <LoadingIndicator />
                        <NotFoundPageContent />
                    </>
                ) : query.error ? (
                    <>
                        <LoadingIndicator />
                        <GenericErrorPageContent />
                    </>
                ) : (
                    children
                )}
            </StreamEntityForm>
        </StreamDraft.DraftContext.Provider>
    )
}

export function StreamOverviewPage() {}

interface StreamEntityFormProps {
    onSubmit?: () => void
    children?: ReactNode | ((attach: RefCallback<Element>) => ReactNode)
    stickySubmit?: boolean
}

function StreamEntityForm(props: StreamEntityFormProps) {
    const { onSubmit = defaultFormEventHandler, children, stickySubmit = false } = props

    const [attach, isSaveButtonVisible] = useInViewport()

    const canSubmit = useCanSubmit()

    return (
        <form onSubmit={onSubmit}>
            <Layout footer={null}>
                <Header saveButtonRef={attach} />
                {typeof children === 'function' ? children(attach) : children}
            </Layout>
            <FloatingToolbar $active={!isSaveButtonVisible && stickySubmit}>
                <Button type="submit" disabled={!canSubmit || isSaveButtonVisible}>
                    Save
                </Button>
            </FloatingToolbar>
        </form>
    )
}

function useCanSubmit() {
    const busy = StreamDraft.useIsDraftBusy()

    const clean = StreamDraft.useIsDraftClean()

    return !busy && !clean
}

function Header({
    saveButtonRef,
}: {
    saveButtonRef?: MutableRefObject<Element | null> | RefCallback<Element | null>
}) {
    const {
        id: streamId,
        domain = '',
        pathname = '',
    } = StreamDraft.useEntity({ hot: true }) || {}

    const isNew = !streamId

    const transientStreamId = domain && pathname ? `${domain}/${pathname}` : undefined

    const location = useLocation()

    const canSubmit = useCanSubmit()

    const clean = StreamDraft.useIsDraftClean()

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
                        {streamId ? <CopyButton value={streamId} /> : ''}
                    </TitleContainer>
                }
                rightComponent={
                    streamId ? (
                        <Tabs selection={location.pathname}>
                            <Tab
                                id="overview"
                                tag={Link}
                                to={routes.streams.overview({
                                    id: streamId,
                                })}
                                selected="to"
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
                            >
                                Live data
                            </Tab>
                        </Tabs>
                    ) : isNew ? (
                        <div>
                            <Button
                                disabled={!canSubmit}
                                kind="primary"
                                type="submit"
                                ref={saveButtonRef}
                            >
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
    align-items: center;
    display: flex;
    gap: 8px;
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
    fullWidth?: boolean
    saveButtonRef?: MutableRefObject<Element | null> | RefCallback<Element | null>
    showProjectCreateHint?: boolean
    showRelatedProjects?: boolean
    showSaveButton?: boolean
    streamId?: string
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
    saveButtonRef,
}: ContainerBoxProps) {
    return (
        <Outer>
            <Inner $fullWidth={fullWidth}>
                <div>{children}</div>
                {showSaveButton && (
                    <SaveButton
                        kind="primary"
                        type="submit"
                        disabled={disabled}
                        ref={saveButtonRef}
                    >
                        Save
                    </SaveButton>
                )}
            </Inner>
            {streamId && <SponsorshipsTable streamId={streamId} />}
            {showRelatedProjects && streamId && <RelatedProjects streamId={streamId} />}
            {showProjectCreateHint && <CreateProjectHint streamId={streamId} />}
        </Outer>
    )
}
