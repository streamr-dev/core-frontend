// @flow

import React, { useCallback, useState, useMemo, useContext, useRef, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { I18n, Translate } from 'react-redux-i18n'
import { push } from 'connected-react-router'
import styled from 'styled-components'
import cloneDeep from 'lodash/cloneDeep'
import { useTransition, animated } from 'react-spring'

import useIsMounted from '$shared/hooks/useIsMounted'
import StatusIcon from '$shared/components/StatusIcon'
import StatusLabel from '$shared/components/StatusLabel'
import { updateStream as updateStreamAction, updateEditStream, updateEditStreamField } from '$userpages/modules/userPageStreams/actions'
import TOCPage from '$shared/components/TOCPage'
import Toolbar from '$shared/components/Toolbar'
import routes from '$routes'
import CoreLayout from '$shared/components/Layout/Core'
import CodeSnippets from '$shared/components/CodeSnippets'
import { subscribeSnippets, publishSnippets } from '$utils/streamSnippets'
import Sidebar from '$shared/components/Sidebar'
import SidebarProvider, { SidebarContext } from '$shared/components/Sidebar/SidebarProvider'
import ShareSidebar from '$userpages/components/ShareSidebar'
import BackButton from '$shared/components/BackButton'
import Nav from '$shared/components/Layout/Nav'
import { resetResourcePermission } from '$userpages/modules/permission/actions'
import useLastMessageTimestamp from '$shared/hooks/useLastMessageTimestamp'
import getStreamActivityStatus from '$shared/utils/getStreamActivityStatus'
import Notification from '$shared/utils/Notification'
import { NotificationIcon } from '$shared/utils/constants'
import { MEDIUM } from '$shared/utils/styled'
import useModal from '$shared/hooks/useModal'

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
    const sidebar = useContext(SidebarContext)
    const dispatch = useDispatch()

    const streamId = stream && stream.id

    const onClose = useCallback(() => {
        sidebar.close()

        if (streamId) {
            dispatch(resetResourcePermission('STREAM', streamId))
        }
    }, [sidebar, dispatch, streamId])

    return (
        <Sidebar.WithErrorBoundary
            isOpen={sidebar.isOpen()}
            onClose={onClose}
        >
            {sidebar.isOpen('share') && (
                <ShareSidebar
                    sidebarName="share"
                    resourceTitle={stream && stream.id}
                    resourceType="STREAM"
                    resourceId={stream && stream.id}
                    onClose={onClose}
                />
            )}
        </Sidebar.WithErrorBoundary>
    )
}

const didChange = (original, changed) => {
    const { streamStatus: originalStatus, lastData: originalData, ...originalStripped } = original || {}
    const { streamStatus: changedStatus, lastData: changedData, ...changedStripped } = changed || {}

    return JSON.stringify(originalStripped) !== JSON.stringify(changedStripped)
}

const UnstyledEdit = ({
    stream,
    canShare,
    disabled,
    isNewStream,
    ...props
}: any) => {
    const sidebar = useContext(SidebarContext)
    const { id: streamId } = stream
    const streamRef = useRef()
    streamRef.current = stream
    const originalStreamRef = useRef()
    const { api: confirmSaveDialog } = useModal('confirmSave')

    const dispatch = useDispatch()

    useEffect(() => {
        if (!streamId || !streamRef.current) { return }
        originalStreamRef.current = {
            ...streamRef.current,
            config: cloneDeep(streamRef.current.config),
        }
    }, [streamId])

    const updateStream = useCallback((change, additionalData) => {
        try {
            if (typeof change === 'string') {
                dispatch(updateEditStreamField(change, additionalData))
            } else if (typeof change === 'object') {
                dispatch(updateEditStream({
                    ...change,
                }))
            } else {
                throw new Error(`Unknown update, change = ${JSON.stringify(change)}, additionalData = ${JSON.stringify(additionalData)}`)
            }
        } catch (e) {
            console.warn(e)
        }
    }, [dispatch])

    useEffect(() => {
        const handleBeforeunload = (event) => {
            if (didChange(originalStreamRef.current, streamRef.current)) {
                const message = I18n.t('userpages.streams.edit.unsavedChanges')
                const evt = (event || window.event)
                evt.returnValue = message // Gecko + IE
                return message // Webkit, Safari, Chrome etc.
            }
            return ''
        }

        window.addEventListener('beforeunload', handleBeforeunload)

        return () => {
            window.removeEventListener('beforeunload', handleBeforeunload)
        }
    }, [])

    const isMounted = useIsMounted()

    const [spinner, setSpinner] = useState(false)

    const save = useCallback(async (options = {
        redirect: true,
    }) => {
        setSpinner(true)

        try {
            await dispatch(updateStreamAction(stream))

            if (isMounted()) {
                Notification.push({
                    title: I18n.t('userpages.streams.actions.saveStreamSuccess'),
                    icon: NotificationIcon.CHECKMARK,
                })

                if (options.redirect) {
                    dispatch(push(routes.streams.index()))
                }
            }
        } catch (e) {
            console.warn(e)

            Notification.push({
                title: e.message,
                icon: NotificationIcon.ERROR,
            })
        } finally {
            if (isMounted()) {
                setSpinner(false)
            }
        }
    }, [stream, dispatch, isMounted])

    const confirmIsSaved = useCallback(async () => {
        if (!didChange(originalStreamRef.current, streamRef.current)) {
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
    }, [confirmSaveDialog, save, isMounted])

    const cancel = useCallback(async () => {
        const canProceed = await confirmIsSaved()

        if (isMounted() && canProceed) {
            dispatch(push(routes.streams.index()))
        }
    }, [confirmIsSaved, dispatch, isMounted])

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
            nav={(
                <Nav noWide />
            )}
            navComponent={(
                <Toolbar
                    altMobileLayout
                    left={<BackButton onBack={cancel} />}
                    actions={{
                        share: {
                            title: I18n.t('userpages.profilePage.toolbar.share'),
                            kind: 'primary',
                            outline: true,
                            onClick: () => openShareDialog(),
                            disabled: isDisabled || !canShare,
                            className: styles.showOnDesktop,
                        },
                        saveChanges: {
                            title: I18n.t('userpages.profilePage.toolbar.saveAndExit'),
                            kind: 'primary',
                            spinner,
                            onClick: () => save(),
                            disabled: isDisabled,
                            className: styles.showOnDesktop,
                        },
                        done: {
                            title: I18n.t('userpages.profilePage.toolbar.done'),
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
            {transitions.map(({ item, key, props: style }) => (
                item && (
                    <animated.div
                        key={key}
                        {...(isNewStream ? { style } : {})}
                    >
                        <TOCPage title={I18n.t('userpages.streams.edit.details.pageTitle.editStream')}>
                            <TOCPage.Section
                                id="details"
                                title={I18n.t('userpages.streams.edit.details.nav.details')}
                            >
                                <InfoView
                                    stream={stream}
                                    disabled={isDisabled}
                                    updateStream={updateStream}
                                />
                            </TOCPage.Section>
                            <TOCPage.Section
                                id="snippets"
                                title={I18n.t('general.codeSnippets')}
                            >
                                <Translate
                                    value="userpages.streams.edit.codeSnippets.description"
                                    tag="p"
                                />
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
                                title={I18n.t('userpages.streams.edit.details.nav.security')}
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
                                title={I18n.t('userpages.streams.edit.details.nav.fields')}
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
                                title={I18n.t('userpages.streams.edit.details.nav.status')}
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
                                title={I18n.t('userpages.streams.edit.details.nav.preview')}
                            >
                                <PreviewView stream={stream} />
                            </TOCPage.Section>
                            <TOCPage.Section
                                id="historical-data"
                                title={I18n.t('userpages.streams.edit.details.nav.historicalData')}
                                onlyDesktop
                            >
                                <HistoryView
                                    stream={stream}
                                    disabled={isDisabled}
                                    updateStream={updateStream}
                                />
                            </TOCPage.Section>
                            <TOCPage.Section
                                id="stream-partitions"
                                title={I18n.t('userpages.streams.edit.details.nav.streamPartitions')}
                                linkTitle={I18n.t('userpages.streams.edit.details.nav.partitions')}
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
