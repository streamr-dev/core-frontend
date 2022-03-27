// @flow

import React, { useCallback, useState, useMemo, useRef } from 'react'
import { useHistory } from 'react-router-dom'
import styled from 'styled-components'
import cloneDeep from 'lodash/cloneDeep'
import { useTransition, animated } from 'react-spring'
import { StatusIcon } from '@streamr/streamr-layout'
import set from 'lodash/set'
import { StreamPermission } from 'streamr-client'

import useIsMounted from '$shared/hooks/useIsMounted'
import TOCPage from '$shared/components/TOCPage'
import Toolbar from '$shared/components/Toolbar'
import CoreLayout from '$shared/components/Layout/Core'
import CodeSnippets from '$shared/components/CodeSnippets'
import { lightNodeSnippets, websocketSnippets, httpSnippets, mqttSnippets } from '$utils/streamSnippets'
import Sidebar from '$shared/components/Sidebar'
import SidebarProvider, { useSidebar } from '$shared/components/Sidebar/SidebarProvider'
import ShareSidebar from '$userpages/components/ShareSidebar'
import BackButton from '$shared/components/BackButton'
import Display from '$shared/components/Display'
import useLastMessageTimestamp from '$shared/hooks/useLastMessageTimestamp'
import getStreamActivityStatus from '$shared/utils/getStreamActivityStatus'
import Notification from '$shared/utils/Notification'
import { NotificationIcon, networks } from '$shared/utils/constants'
import { MEDIUM } from '$shared/utils/styled'
import useModal from '$shared/hooks/useModal'
import { CoreHelmet } from '$shared/components/Helmet'
import usePreventNavigatingAway from '$shared/hooks/usePreventNavigatingAway'
import useRequireNetwork from '$shared/hooks/useRequireNetwork'
import useEditableState from '$shared/contexts/Undo/useEditableState'
import { truncate } from '$shared/utils/text'
import PartitionsSection from '$app/src/pages/AbstractStreamEditPage/PartitionsSection'
import HistorySection from '$app/src/pages/AbstractStreamEditPage/HistorySection'
import PreviewSection from '$app/src/pages/AbstractStreamEditPage/PreviewSection'
import StreamIdContext from '$shared/contexts/StreamIdContext'
import StatusSection from '$app/src/pages/AbstractStreamEditPage/StatusSection'
import routes from '$routes'

import { useController } from '../../StreamController'
import InfoView from './InfoView'
import ConfigureView from './ConfigureView'
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
    const { streamStatus: originalStatus, lastData: originalData, ...originalStripped } = (() => {
        const streamObject = original.toObject() || {}

        if (!streamObject.inactivityThresholdHours) {
            streamObject.inactivityThresholdHours = 0
        }

        return streamObject
    })()
    const { streamStatus: changedStatus, lastData: changedData, ...changedStripped } = changed || {}

    return JSON.stringify(originalStripped) !== JSON.stringify(changedStripped)
}

const UnstyledEdit = ({ disabled, isNewStream, ...props }: any) => {
    const { stream: originalStream, permissions } = useController()
    const { state: stream, updateState } = useEditableState()
    const sidebar = useSidebar()
    const { validateNetwork } = useRequireNetwork(networks.STREAMS, false, false)
    const streamRef = useRef()
    streamRef.current = stream
    const { api: confirmSaveDialog } = useModal('confirmSave')

    const history = useHistory()

    const canShare = useMemo(() => !!permissions[StreamPermission.GRANT], [permissions])

    const updateStream = useCallback((change, additionalData = {}) => {
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
            await validateNetwork()

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
    }, [originalStream, isMounted, history, validateNetwork])

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

    const lightNodeSnippet = useMemo(() => (
        lightNodeSnippets({
            id: stream.id,
        })
    ), [stream.id])

    const websocketSnippet = useMemo(() => (
        websocketSnippets({
            id: stream.id,
        })
    ), [stream.id])

    const httpSnippet = useMemo(() => (
        httpSnippets({
            id: stream.id,
        })
    ), [stream.id])

    const mqttSnippet = useMemo(() => (
        mqttSnippets({
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
                                    Bring your data to Streamr in the way that works best for you &mdash;
                                    as a JS library within your app, or via MQTT, HTTP or Websocket.
                                </p>
                                <CodeSnippets
                                    items={[
                                        ['javascript', 'Light node (JS)', lightNodeSnippet.javascript],
                                        ['javascript', 'Websocket', websocketSnippet.javascript],
                                        ['javascript', 'HTTP', httpSnippet.javascript],
                                        ['javascript', 'MQTT', mqttSnippet.javascript],
                                    ]}
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
                            <Display $mobile="none" $desktop>
                                <StatusSection
                                    disabled={isDisabled}
                                    duration={stream.inactivityThresholdHours}
                                    onChange={(inactivityThresholdHours) => void updateStream({
                                        inactivityThresholdHours,
                                    })}
                                    status={status}
                                />
                            </Display>
                            <StreamIdContext.Provider value={stream.id}>
                                <PreviewSection />
                                <Display $mobile="none" $desktop>
                                    <HistorySection
                                        disabled={isDisabled}
                                        duration={stream.storageDays}
                                        onChange={(storageDays) => void updateStream({
                                            storageDays,
                                        })}
                                    />
                                </Display>
                            </StreamIdContext.Provider>
                            <PartitionsSection
                                partitions={stream.partitions}
                                disabled={isDisabled}
                                onChange={(partitions) => void updateStream({
                                    partitions,
                                })}
                            />
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
