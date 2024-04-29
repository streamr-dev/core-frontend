import { StreamPermission } from '@streamr/sdk'
import React, {
    MutableRefObject,
    ReactNode,
    RefCallback,
    useCallback,
    useEffect,
} from 'react'
import {
    Link,
    Navigate,
    Outlet,
    useLocation,
    useNavigate,
    useParams,
} from 'react-router-dom'
import styled from 'styled-components'
import { Button } from '~/components/Button'
import ColoredBox from '~/components/ColoredBox'
import { CopyButton } from '~/components/CopyButton'
import { FloatingToolbar } from '~/components/FloatingToolbar'
import Helmet from '~/components/Helmet'
import Layout, { LayoutColumn } from '~/components/Layout'
import { Pad, SegmentGrid } from '~/components/NetworkPageSegment'
import { useInViewport } from '~/hooks/useInViewport'
import { GenericErrorPageContent } from '~/pages/GenericErrorPage'
import { NotFoundPageContent } from '~/pages/NotFoundPage'
import routes from '~/routes'
import { DetailsPageHeader } from '~/shared/components/DetailsPageHeader'
import LoadingIndicator from '~/shared/components/LoadingIndicator'
import { StreamConnect } from '~/shared/components/StreamConnect'
import { StreamPreview } from '~/shared/components/StreamPreview'
import Tabs, { Tab } from '~/shared/components/Tabs'
import StreamNotFoundError from '~/shared/errors/StreamNotFoundError'
import usePreventNavigatingAway from '~/shared/hooks/usePreventNavigatingAway'
import {
    useCurrentStreamAbility,
    useInvalidateStreamAbilities,
} from '~/shared/stores/streamAbilities'
import { useWalletAccount } from '~/shared/stores/wallet'
import { DESKTOP, TABLET } from '~/shared/utils/styled'
import { truncateStreamName } from '~/shared/utils/text'
import {
    StreamDraft,
    usePersistStreamDraft,
    useStreamEntityQuery,
} from '~/stores/streamDraft'
import { AccessControlSection } from '../AbstractStreamEditPage/AccessControlSection'
import CreateProjectHint from '../AbstractStreamEditPage/CreateProjectHint'
import DeleteSection from '../AbstractStreamEditPage/DeleteSection'
import { HistorySection } from '../AbstractStreamEditPage/HistorySection'
import { InfoSection } from '../AbstractStreamEditPage/InfoSection'
import { PartitionsSection } from '../AbstractStreamEditPage/PartitionsSection'
import RelatedProjects from '../AbstractStreamEditPage/RelatedProjects'
import SponsorshipsTable from '../AbstractStreamEditPage/SponsorshipsTable'

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
            <LayoutColumn>
                <Footerless>
                    <SegmentGrid>
                        <ColoredBox>
                            <Pad>
                                <Wings>
                                    <div>
                                        <InfoSection disabled={disabled} />
                                        <AccessControlSection disabled={disabled} />
                                        <HistorySection disabled={disabled} />
                                        <PartitionsSection disabled={disabled} />
                                        {canDelete && <DeleteSection />}
                                    </div>
                                    {!isNew && (
                                        <SaveButton
                                            kind="primary"
                                            type="submit"
                                            disabled={disabled || !canSubmit}
                                            ref={saveButtonRef}
                                        >
                                            Save
                                        </SaveButton>
                                    )}
                                </Wings>
                            </Pad>
                        </ColoredBox>
                        {streamId != null && <SponsorshipsTable streamId={streamId} />}
                    </SegmentGrid>
                    {streamId != null && (
                        <>
                            <RelatedProjects streamId={streamId} />
                            {canGrant && <CreateProjectHint streamId={streamId} />}
                        </>
                    )}
                </Footerless>
            </LayoutColumn>
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
                <StreamPreview
                    streamsList={[streamId]}
                    previewDisabled={canSubscribe === false}
                />
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
            <LayoutColumn>
                {streamId != null && (
                    <Footerless>
                        <SegmentGrid>
                            <ColoredBox>
                                <Pad>
                                    <StreamConnect streams={[streamId]} />
                                </Pad>
                            </ColoredBox>
                            <SponsorshipsTable streamId={streamId} />
                        </SegmentGrid>
                        <RelatedProjects streamId={streamId} />
                    </Footerless>
                )}
            </LayoutColumn>
        </>
    )
}

export function StreamIndexRedirect() {
    const { id } = useParams<{ id: string }>()

    return <Navigate to={routes.streams.overview({ id })} replace />
}

interface StreamTabbedPageProps {
    children?: ReactNode | ((attach: RefCallback<Element>, ready: boolean) => ReactNode)
    stickySubmit?: boolean
}

export function StreamDraftPage() {
    const { id: streamId } = useParams<{ id: string }>()

    const draftId = StreamDraft.useInitDraft2(streamId)

    return (
        <StreamDraft.DraftContext.Provider value={draftId}>
            <Outlet />
        </StreamDraft.DraftContext.Provider>
    )
}

export function StreamTabbedPage(props: StreamTabbedPageProps) {
    const { stickySubmit = false, children = <Outlet /> } = props

    const query = useStreamEntityQuery()

    const { data: stream = null } = query

    const isLoading = !stream && (query.isLoading || query.isFetching)

    const { assign } = StreamDraft.useDraftStore()

    const draftId = StreamDraft.useDraftId()

    useEffect(
        function assignEntity() {
            assign(draftId, stream)
        },
        [assign, draftId, stream],
    )

    return (
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
    )
}

interface StreamEntityFormProps {
    children?: ReactNode | ((attach: RefCallback<Element>, ready: boolean) => ReactNode)
    stickySubmit?: boolean
}

function StreamEntityForm(props: StreamEntityFormProps) {
    const { children, stickySubmit = false } = props

    const [attach, isSaveButtonVisible] = useInViewport()

    const canSubmit = useCanSubmit()

    usePreventDataLossEffect()

    const navigate = useNavigate()

    const account = useWalletAccount()?.toLowerCase()

    const invalidateAbilities = useInvalidateStreamAbilities()

    const persist = usePersistStreamDraft({
        onCreate(streamId, { abortSignal }) {
            if (abortSignal?.aborted) {
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
            if (!account) {
                return
            }

            for (const assignment of assignments) {
                /**
                 * Detect if the new set of assignments affect the current user
                 * and, if so, invalidate associated stream abilities.
                 */

                if ('user' in assignment && assignment.user.toLowerCase() === account) {
                    invalidateAbilities(streamId, account)

                    break
                }
            }
        },
    })

    const ready = !!StreamDraft.useEntity({ hot: true })

    return (
        <form
            onSubmit={(e) => {
                e.preventDefault()

                if (stickySubmit) {
                    persist()
                }
            }}
        >
            <Layout footer={null}>
                <Header saveButtonRef={attach} />
                {typeof children === 'function' ? children(attach, ready) : children}
            </Layout>
            <FloatingToolbar $active={!isSaveButtonVisible && stickySubmit && ready}>
                <Button type="submit" disabled={!canSubmit || isSaveButtonVisible}>
                    Save
                </Button>
            </FloatingToolbar>
        </form>
    )
}

function usePreventDataLossEffect() {
    const clean = StreamDraft.useIsDraftClean()

    const busy = StreamDraft.useIsDraftBusy()

    const { id } = StreamDraft.useEntity() || {}

    usePreventNavigatingAway({
        isDirty: useCallback(
            (dest?: string) => {
                if (id) {
                    switch (dest) {
                        case routes.streams.overview({ id }):
                        case routes.streams.connect({ id }):
                        case routes.streams.liveData({ id }):
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
            [clean, busy, id],
        ),
    })
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
    const entity = StreamDraft.useEntity({ hot: true })

    const { id: streamId, domain = '', pathname = '' } = entity || {}

    const isNew = !streamId

    const transientStreamId = domain && pathname ? `${domain}/${pathname}` : undefined

    const location = useLocation()

    const canSubmit = useCanSubmit()

    const clean = StreamDraft.useIsDraftClean()

    const ready = !!entity

    return (
        <>
            <Helmet
                title={
                    ready ? (streamId ? `Stream ${streamId}` : 'New stream') : undefined
                }
            />
            <DetailsPageHeader
                backButtonLink={routes.streams.index()}
                pageTitle={
                    <TitleContainer>
                        <span title={streamId}>
                            {ready ? (
                                streamId ? (
                                    truncateStreamName(streamId, 50)
                                ) : (
                                    transientStreamId || 'New stream'
                                )
                            ) : (
                                <>&zwnj;</>
                            )}
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
                    ) : isNew && ready ? (
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

const SaveButton = styled(Button)`
    width: fit-content;
    justify-self: right;
`

const Footerless = styled.div`
    padding-bottom: 80px;

    @media ${TABLET} {
        padding-bottom: 92px;
    }

    @media ${DESKTOP} {
        padding-bottom: 128px;
    }
`

const Wings = styled.div`
    display: grid;
    grid-template-columns: fit-content(680px) auto;

    div:first-child {
        min-width: 0;
    }
`
