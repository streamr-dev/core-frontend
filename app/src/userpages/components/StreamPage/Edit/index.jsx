// @flow

import React, { useCallback, useState, useMemo, useRef } from 'react'
import { useHistory } from 'react-router-dom'
import styled from 'styled-components'
import cloneDeep from 'lodash/cloneDeep'
import { useTransition, animated } from 'react-spring'
import { StatusIcon } from '@streamr/streamr-layout'
import set from 'lodash/set'
import { StreamOperation } from 'streamr-client'

import useIsMounted from '$shared/hooks/useIsMounted'
import StatusLabel from '$shared/components/StatusLabel'
import TOCPage from '$shared/components/TOCPage'
import Toolbar from '$shared/components/Toolbar'
import CoreLayout from '$shared/components/Layout/Core'
import CodeSnippets from '$shared/components/CodeSnippets'
import { subscribeSnippets, publishSnippets } from '$utils/streamSnippets'
import Sidebar from '$shared/components/Sidebar'
import SidebarProvider, { useSidebar } from '$shared/components/Sidebar/SidebarProvider'
import ShareSidebar from '$userpages/components/ShareSidebar'
import BackButton from '$shared/components/BackButton'
import useLastMessageTimestamp from '$shared/hooks/useLastMessageTimestamp'
import getStreamActivityStatus from '$shared/utils/getStreamActivityStatus'
import Notification from '$shared/utils/Notification'
import { NotificationIcon } from '$shared/utils/constants'
import { MEDIUM } from '$shared/utils/styled'
import useModal from '$shared/hooks/useModal'
import { CoreHelmet } from '$shared/components/Helmet'
import usePreventNavigatingAway from '$shared/hooks/usePreventNavigatingAway'
import useEditableState from '$shared/contexts/Undo/useEditableState'
import { truncate } from '$shared/utils/text'
import routes from '$routes'

import { useController } from '../../StreamController'
import InfoView from './InfoView'
import ConfigureView from './ConfigureView'
import PreviewView from './PreviewView'
import HistoryView from './HistoryView'
import PartitionsView from './PartitionsView'
import SecurityView from './SecurityView'
import StatusView from './StatusView'
import ConfirmSaveModal from './ConfirmSaveModal'
import useNewStreamMode from './useNewStreamMode'

import styles from './edit.pcss'

function StreamPageSidebar({ stream }) {
    const sidebar = useSidebar()

    const onClose = useCallback(() => {
        sidebar.close()
    }, [sidebar])

    return (
        <Sidebar.WithErrorBoundary
            isOpen={sidebar.isOpen()}
            onClose={onClose}
        >
            {sidebar.isOpen('share') && (
                <ShareSidebar
                    sidebarName="share"
                    resourceTitle={stream && truncate(stream.id)}
                    resourceType="STREAM"
                    resourceId={stream && stream.id}
                    onClose={onClose}
                />
            )}
        </Sidebar.WithErrorBoundary>
    )
}

const didChange = (original, changed) => {
    const { streamStatus: originalStatus, lastData: originalData, ...originalStripped } = original.toObject() || {}
    const { streamStatus: changedStatus, lastData: changedData, ...changedStripped } = changed || {}

    return JSON.stringify(originalStripped) !== JSON.stringify(changedStripped)
}

const UnstyledEdit = ({ disabled, isNewStream, ...props }: any) => {
    const { stream: originalStream, permissions } = useController()
    const { state: stream, updateState } = useEditableState()
    const sidebar = useSidebar()
    const streamRef = useRef()
    streamRef.current = stream
    const { api: confirmSaveDialog } = useModal('confirmSave')

    const history = useHistory()

    const canShare = useMemo(() => !!permissions[StreamOperation.STREAM_SHARE], [permissions])

    const updateStream = useCallback((change, additionalData) => {
        try {
            if (typeof change === 'string') {
                updateState(`update "${change}"`, (s) => {
                    const nextStream = {
                        ...s,
                    }

                    set(nextStream, change, additionalData)

                    return nextStream
                })
            } else if (typeof change === 'object') {
                updateState('update multiple fields', (s) => ({
                    ...s,
                    ...change,
                }))
            } else {
                throw new Error(`Unknown update, change = ${JSON.stringify(change)}, additionalData = ${JSON.stringify(additionalData)}`)
            }
        } catch (e) {
            console.warn(e)
        }
    }, [updateState])

    usePreventNavigatingAway(
        'You have unsaved changes. Are you sure you want to leave?',
        () => didChange(originalStream, streamRef.current),
    )

    const isMounted = useIsMounted()

    const [spinner, setSpinner] = useState(false)

    const save = useCallback(async (options = {
        redirect: true,
    }) => {
        setSpinner(true)

        try {
            const newStream = cloneDeep(originalStream)
            Object.assign(newStream, streamRef.current)

            await newStream.update()

            if (isMounted()) {
                Notification.push({
                    title: 'Stream saved successfully',
                    icon: NotificationIcon.CHECKMARK,
                })

                if (options.redirect) {
                    history.push(routes.streams.index())
                }
            }
        } catch (e) {
            console.warn(e)

            Notification.push({
                title: 'Save failed',
                icon: NotificationIcon.ERROR,
            })
        } finally {
            if (isMounted()) {
                setSpinner(false)
            }
        }
    }, [originalStream, isMounted, history])

    const confirmIsSaved = useCallback(async () => {
        if (!didChange(originalStream, streamRef.current)) {
            return true
        }

        const { save: saveRequested, proceed: canProceed } = await confirmSaveDialog.open()

        if (!isMounted()) { return false }

        if (saveRequested) {
            await save({
                redirect: false,
            })
        }

        return !!canProceed
    }, [originalStream, confirmSaveDialog, save, isMounted])

    const cancel = useCallback(async () => {
        const canProceed = await confirmIsSaved()

        if (isMounted() && canProceed) {
            history.push(routes.streams.index())
        }
    }, [confirmIsSaved, history, isMounted])

    const subSnippets = useMemo(() => (
        subscribeSnippets({
            id: stream.id,
        })
    ), [stream.id])

    const pubSnippets = useMemo(() => (
        publishSnippets({
            id: stream.id,
        })
    ), [stream.id])

    const openShareDialog = useCallback(async () => {
        const canProceed = await confirmIsSaved()

        if (isMounted() && canProceed) {
            sidebar.open('share')
        }
    }, [confirmIsSaved, sidebar, isMounted])

    const isDisabled = !!(disabled || sidebar.isOpen())

    const [timestamp, error] = useLastMessageTimestamp(stream.id)

    const status = error ? StatusIcon.ERROR : getStreamActivityStatus(timestamp, stream.inactivityThresholdHours)

    const transitions = useTransition(true, null, {
        config: {
            tension: 500,
            friction: 50,
            clamp: true,
            duration: 300,
        },
        from: {
            opacity: 0,
        },
        enter: {
            opacity: 1,
        },
        leave: {
            opacity: 1,
        },
    })

    return (
        <CoreLayout
            {...props}
            nav={false}
            navComponent={(
                <Toolbar
                    altMobileLayout
                    loading={spinner}
                    left={<BackButton onBack={cancel} />}
                    actions={{
                        share: {
                            title: 'Share',
                            kind: 'primary',
                            outline: true,
                            onClick: () => openShareDialog(),
                            disabled: isDisabled || !canShare,
                            className: styles.showOnDesktop,
                        },
                        saveChanges: {
                            title: 'Save & Exit',
                            kind: 'primary',
                            spinner,
                            onClick: () => save(),
                            disabled: isDisabled,
                            className: styles.showOnDesktop,
                        },
                        done: {
                            title: 'Done',
                            kind: 'primary',
                            spinner,
                            onClick: () => save(),
                            disabled: isDisabled,
                            className: styles.showOnTablet,
                        },
                    }}
                />
            )}
        >
            <CoreHelmet title={stream.id} />
            {transitions.map(({ item, key, props: style }) => (
                item && (
                    <animated.div
                        key={key}
                        {...(isNewStream ? { style } : {})}
                    >
                        <TOCPage title="Set up your Stream">
                            <TOCPage.Section
                                id="details"
                                title="Details"
                            >
                                <InfoView
                                    stream={stream}
                                    disabled={isDisabled}
                                    updateStream={updateStream}
                                />
                            </TOCPage.Section>
                            <TOCPage.Section
                                id="snippets"
                                title="Code Snippets"
                            >
                                <p>
                                    You can grab the code (JS &amp; Java) you’ll need to use this stream in your applications below.
                                    {' '}
                                    Only users with appropriate permissions can publish or subscribe to the stream.
                                </p>
                                <CodeSnippets
                                    items={[
                                        ['javascript', 'Js', subSnippets.javascript],
                                        ['java', 'Java', subSnippets.java],
                                    ]}
                                    title="Subscribe"
                                />
                                <CodeSnippets
                                    items={[
                                        ['javascript', 'Js', pubSnippets.javascript],
                                        ['java', 'Java', pubSnippets.java],
                                    ]}
                                    title="Publish"
                                />
                            </TOCPage.Section>
                            <TOCPage.Section
                                id="security"
                                title="Security"
                                onlyDesktop
                            >
                                <SecurityView
                                    stream={stream}
                                    disabled={isDisabled}
                                    updateStream={updateStream}
                                />
                            </TOCPage.Section>
                            <TOCPage.Section
                                id="configure"
                                title="Fields"
                                onlyDesktop
                            >
                                <ConfigureView
                                    stream={stream}
                                    disabled={isDisabled}
                                    updateStream={updateStream}
                                />
                            </TOCPage.Section>
                            <TOCPage.Section
                                id="status"
                                title="Status"
                                status={<StatusIcon
                                    tooltip
                                    status={status}
                                />}
                                onlyDesktop
                            >
                                <StatusView
                                    stream={stream}
                                    disabled={isDisabled}
                                    updateStream={updateStream}
                                />
                            </TOCPage.Section>
                            <TOCPage.Section
                                id="preview"
                                title="Preview"
                            >
                                <PreviewView stream={stream} />
                            </TOCPage.Section>
                            <TOCPage.Section
                                id="historical-data"
                                title="Data storage"
                                onlyDesktop
                            >
                                <HistoryView
                                    stream={stream}
                                    originalStream={originalStream}
                                    disabled={isDisabled}
                                    updateStream={updateStream}
                                />
                            </TOCPage.Section>
                            <TOCPage.Section
                                id="stream-partitions"
                                title="Stream partitions"
                                linkTitle="Partitions"
                                status={(<StatusLabel.Advanced />)}
                            >
                                <PartitionsView
                                    stream={stream}
                                    disabled={isDisabled}
                                    updateStream={updateStream}
                                />
                            </TOCPage.Section>
                        </TOCPage>
                    </animated.div>
                )
            ))}
            <StreamPageSidebar stream={stream} />
            <ConfirmSaveModal />
        </CoreLayout>
    )
}

const Edit = styled(UnstyledEdit)`
    strong {
        font-weight: ${MEDIUM};
    }
`

export default (props: any) => {
    const isNewStream = useNewStreamMode()

    return (
        <SidebarProvider>
            <Edit {...props} isNewStream={isNewStream} />
        </SidebarProvider>
    )
}
