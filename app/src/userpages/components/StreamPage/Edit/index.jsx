// @flow

import React, { useCallback, useState, useMemo, useContext } from 'react'
import { useDispatch } from 'react-redux'
import { useLocation } from 'react-router-dom'
import { I18n, Translate } from 'react-redux-i18n'
import { push } from 'connected-react-router'
import qs from 'query-string'
import styled from 'styled-components'

import useIsMounted from '$shared/hooks/useIsMounted'
import StatusIcon from '$shared/components/StatusIcon'
import StatusLabel from '$shared/components/StatusLabel'
import { updateStream } from '$userpages/modules/userPageStreams/actions'
import TOCPage from '$shared/components/TOCPage'
import Toolbar from '$shared/components/Toolbar'
import routes from '$routes'
import docsLinks from '$shared/../docsLinks'
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

import InfoView from './InfoView'
import ConfigureView from './ConfigureView'
import PreviewView from './PreviewView'
import HistoryView from './HistoryView'
import PartitionsView from './PartitionsView'
import SecurityView from './SecurityView'
import StatusView from './StatusView'

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
                    resourceTitle={stream && stream.name}
                    resourceType="STREAM"
                    resourceId={stream && stream.id}
                    onClose={onClose}
                />
            )}
        </Sidebar.WithErrorBoundary>
    )
}

const PreviewDescription = styled(Translate)`
    margin-bottom: 3.125rem;
    max-width: 660px;
`

const Edit = ({ stream: streamProp, canShare, disabled }: any) => {
    const sidebar = useContext(SidebarContext)
    const stream = useMemo(() => ({
        ...streamProp,
        ...(streamProp.config ? {
            ...streamProp.config,
            fields: streamProp.config.fields.map(({ id, ...field }) => field),
        } : {}),
    }), [streamProp])

    const isNewStream = !!qs.parse(useLocation().search).newStream

    const dispatch = useDispatch()

    const isMounted = useIsMounted()

    const cancel = useCallback(() => {
        dispatch(push(routes.streams.index()))
    }, [dispatch])

    const [spinner, setSpinner] = useState(false)

    const save = useCallback(async () => {
        setSpinner(true)

        try {
            await dispatch(updateStream(stream))

            if (isMounted()) {
                Notification.push({
                    title: I18n.t('userpages.streams.actions.saveStreamSuccess'),
                    icon: NotificationIcon.CHECKMARK,
                })
                dispatch(push(routes.streams.index()))
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

    const openShareDialog = useCallback(() => {
        sidebar.open('share')
    }, [sidebar])

    const [timestamp, error] = useLastMessageTimestamp(stream.id)

    const status = error ? StatusIcon.ERROR : getStreamActivityStatus(timestamp, stream.inactivityThresholdHours)

    return (
        <CoreLayout
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
                            onClick: openShareDialog,
                            disabled: disabled || !canShare,
                            className: styles.showOnDesktop,
                        },
                        saveChanges: {
                            title: I18n.t('userpages.profilePage.toolbar.saveAndExit'),
                            kind: 'primary',
                            spinner,
                            onClick: save,
                            disabled,
                            className: styles.showOnDesktop,
                        },
                        done: {
                            title: I18n.t('userpages.profilePage.toolbar.done'),
                            kind: 'primary',
                            spinner,
                            onClick: save,
                            disabled,
                            className: styles.showOnTablet,
                        },
                    }}
                />
            )}
        >
            <TOCPage title={I18n.t(`userpages.streams.edit.details.pageTitle.${isNewStream ? 'newStream' : 'existingStream'}`)}>
                <TOCPage.Section
                    id="details"
                    title={I18n.t('userpages.streams.edit.details.nav.details')}
                >
                    <InfoView stream={stream} disabled={disabled} />
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
                    <SecurityView stream={stream} disabled={disabled} />
                </TOCPage.Section>
                <TOCPage.Section
                    id="configure"
                    title={I18n.t('userpages.streams.edit.details.nav.fields')}
                    onlyDesktop
                >
                    <ConfigureView stream={stream} disabled={disabled} />
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
                    <StatusView stream={stream} disabled={disabled} />
                </TOCPage.Section>
                <TOCPage.Section
                    id="preview"
                    title={I18n.t('userpages.streams.edit.details.nav.preview')}
                >
                    <PreviewDescription
                        value="userpages.streams.edit.preview.description"
                        tag="p"
                        dangerousHTML
                        docsLink={docsLinks.gettingStarted}
                    />
                    <PreviewView stream={stream} />
                </TOCPage.Section>
                <TOCPage.Section
                    id="historical-data"
                    title={I18n.t('userpages.streams.edit.details.nav.historicalData')}
                    onlyDesktop
                >
                    <HistoryView stream={stream} disabled={disabled} />
                </TOCPage.Section>
                <TOCPage.Section
                    id="stream-partitions"
                    title={I18n.t('userpages.streams.edit.details.nav.streamPartitions')}
                    linkTitle={I18n.t('userpages.streams.edit.details.nav.partitions')}
                    status={(<StatusLabel.Advanced />)}
                >
                    <PartitionsView stream={stream} disabled={disabled} />
                </TOCPage.Section>
            </TOCPage>
            <StreamPageSidebar stream={stream} />
        </CoreLayout>
    )
}

export default (props: any) => (
    <SidebarProvider>
        <Edit {...props} />
    </SidebarProvider>
)
