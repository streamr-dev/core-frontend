import React, {useState, useMemo, useEffect, FunctionComponent} from 'react'
import { useHistory } from 'react-router-dom'
import styled, { css } from 'styled-components'
import Layout from '$shared/components/Layout/Core'
import Button from '$shared/components/Button'
import { MarketplaceHelmet } from '$shared/components/Helmet'
import SwitchNetworkModal from '$shared/components/SwitchNetworkModal'
import useStreamModifier from '$shared/hooks/useStreamModifier'
import ValidationError from '$shared/errors/ValidationError'
import InsufficientFundsError from '$shared/errors/InsufficientFundsError'
import DuplicateError from '$shared/errors/DuplicateError'
import InterruptionError from '$shared/errors/InterruptionError'
import Notification from '$shared/utils/Notification'
import useInterrupt from '$shared/hooks/useInterrupt'
import { useStreamModifierStatusContext } from '$shared/contexts/StreamModifierStatusContext'
import { useValidationErrorSetter } from '$shared/components/ValidationErrorProvider'
import useStreamId from '$shared/hooks/useStreamId'
import { DetailsPageHeader } from '$shared/components/DetailsPageHeader'
import { truncateStreamName } from '$shared/utils/text'
import useNativeTokenName from '$shared/hooks/useNativeTokenName'
import GetCryptoDialog from '$mp/components/Modal/GetCryptoDialog'
import { CopyButton } from "$shared/components/CopyButton/CopyButton"
import { useTransientStream } from '$shared/contexts/TransientStreamContext'
import { DESKTOP, TABLET } from '$shared/utils/styled'
import { useStreamEditorStore as useStreamEditorStore2 } from '$shared/stores/streamEditor'
import { TransactionList } from '$shared/components/TransactionList'
import usePreventNavigatingAway from '$shared/hooks/usePreventNavigatingAway'
import useStreamPermissionsInvalidator from '$shared/hooks/useStreamPermissionsInvalidator'
import routes from '$routes'
import { useStreamEditorStore } from './AbstractStreamEditPage/state'

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

const StreamTransactionList: FunctionComponent = () => {
    const persistOperations = useStreamEditorStore((state) => state.persistOperations)
    return <TransactionList operations={persistOperations}/>
}

export default function StreamPage({ children, loading = false, includeContainerBox = true , showSaveButton = true, fullWidth = false}) {
    const streamId = useStreamId()

    const history = useHistory()
    const { commit, isUpdateNeeded, validate, setBusy } = useStreamModifier()
    const { busy, clean: isStreamClean } = useStreamModifierStatusContext()
    const itp = useInterrupt()
    const setValidationError = useValidationErrorSetter()
    const isNew = !streamId
    const nativeTokenName = useNativeTokenName()
    const [showGetCryptoDialog, setShowGetCryptoDialog] = useState(false)
    const linkTabs = useMemo(() => streamId ? getStreamDetailsLinkTabs(streamId) : [], [streamId])
    const {id: transientStreamId} = useTransientStream()
    const invalidatePermissions = useStreamPermissionsInvalidator()
    const clearPersistOperations = useStreamEditorStore((state) => state.clearPersistOperations)
    const addPersistOperation = useStreamEditorStore((state) => state.addPersistOperation)
    const updatePersistOperation = useStreamEditorStore((state) => state.updatePersistOperation)
    const hasPersistOperations = useStreamEditorStore((state) => state.hasPersistOperations)
    const calculateStorageNodeOperations = useStreamEditorStore((state) => state.calculateStorageNodeOperations)
    const persistStorageNodes = useStreamEditorStore((state) => state.persistStorageNodes)
    const hasStorageNodeChanges = useStreamEditorStore((state) => state.hasStorageNodeChanges)
    const resetStore = useStreamEditorStore((state) => state.reset)

    const assignments = useStreamEditorStore2(({ cache }) => streamId ? cache[streamId]?.permissionAssignments || [] : [])

    const clean = isStreamClean && !hasStorageNodeChanges && !assignments.length

    usePreventNavigatingAway({
        isDirty: () => !clean,
    })

    useEffect(() => {
        resetStore()
    }, [resetStore])

    async function save() {
        const { requireUninterrupted } = itp('save')
        let transactionsToastNotification: Notification | null = null
        let id = streamId
        let wasStreamCreated = false

        try {
            try {
                const streamNeedsSaving = isUpdateNeeded()
                const hasPermissionChanges = !assignments.length

                if (!streamNeedsSaving && !hasPermissionChanges && !hasStorageNodeChanges) {
                    // Nothing changed
                    return
                }

                setBusy(true)
                clearPersistOperations()

                // First validate user input
                try {
                    await validate()
                } catch (e) {
                    if (e instanceof DuplicateError) {
                        setValidationError({
                            id: 'already exists, please try a different one',
                        })
                    } else if (e instanceof ValidationError) {
                        setValidationError({
                            id: e.message,
                        })
                    }
                    return
                }

                // First gather info about operations we need to save the stream.
                // We need to do this before showing the transaction list toast
                // as otherwise it will not be displayed correctly sized.
                if (streamNeedsSaving) {
                    addPersistOperation({
                        id: 'stream',
                        name: `${isNew ? 'Create' : 'Update'} stream`,
                        state: 'notstarted',
                        type: 'stream',
                    })
                }

                if (hasPermissionChanges) {
                    addPersistOperation({
                        id: 'access',
                        name: 'Update access settings',
                        state: 'notstarted',
                        type: 'permissions',
                    })
                }

                // This will add a persist operation for each storage node change user made
                await calculateStorageNodeOperations()

                if (!hasPersistOperations()) {
                    // No changes so return
                    return
                }

                // Show the toast notification with list of transactions we need
                transactionsToastNotification = Notification.push({
                    autoDismiss: false,
                    dismissible: false,
                    children: <StreamTransactionList/>,
                })

                // Now we can start actually making the transactions.
                // 1. Create / update stream
                updatePersistOperation('stream', {
                    state: 'inprogress',
                })

                try {
                    if (streamNeedsSaving) {
                        ({ id } = await commit())
                        requireUninterrupted()
                        updatePersistOperation('stream', {
                            state: 'complete',
                        })
                        wasStreamCreated = isNew
                    }
                } catch (e) {
                    updatePersistOperation('stream', {
                        state: 'error',
                    })

                    if (e instanceof InsufficientFundsError) {
                        setShowGetCryptoDialog(true)
                    } else {
                        throw e
                    }
                }

                // 2. Update stream permissions
                if (hasPermissionChanges) {
                    updatePersistOperation('access', {
                        state: 'inprogress',
                    })
                    try {
                        await Promise.reject('Not implemented')
                        requireUninterrupted()

                        // Reload permissions to update e.g. showing of stream delete button
                        invalidatePermissions()

                        updatePersistOperation('access', {
                            state: 'complete',
                        })
                    } catch (e) {
                        console.error('permissions failed', e)
                        updatePersistOperation('access', {
                            state: 'error',
                        })
                        throw e
                    }
                }

                // 3. Update storage nodes
                await persistStorageNodes(id)
                requireUninterrupted()
            } catch (e) {
                requireUninterrupted()
                throw e
            }
        } catch (e) {
            if (e instanceof InterruptionError) {
                return
            }

            console.error('Save failed', e)
        } finally {
            setBusy(false)

            // Give the notification some time before navigating away in the next step.
            await new Promise((resolve) => {
                setTimeout(resolve, 3000)
            })

            if (transactionsToastNotification != null) {
                transactionsToastNotification.close()
                resetStore()
            }
            if (wasStreamCreated) {
                history.push(
                    routes.streams.show({
                        id,
                        newStream: isNew ? 1 : undefined,
                    }),
                )
            }
        }
    }

    const streamIdToDisplay = useMemo<string | undefined>(() =>
        streamId || (!clean && !!transientStreamId) ? transientStreamId : undefined,
    [streamId, clean, transientStreamId]
    )

    return (
        <>
            <form
                onSubmit={(e) => {
                    save()
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
                                    {!!streamIdToDisplay ? truncateStreamName(streamIdToDisplay, 50) : streamId ? '' : 'New stream'}
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
            {showGetCryptoDialog && <GetCryptoDialog onCancel={() => void setShowGetCryptoDialog(false)} nativeTokenName={nativeTokenName} />}
            <SwitchNetworkModal />
        </>
    )
}
