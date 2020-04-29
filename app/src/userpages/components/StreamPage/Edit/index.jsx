// @flow

import React, { useCallback, useState, useMemo } from 'react'
import { useDispatch } from 'react-redux'
import { I18n, Translate } from 'react-redux-i18n'
import { push } from 'connected-react-router'
import MediaQuery from 'react-responsive'
import useIsMounted from '$shared/hooks/useIsMounted'
import StatusIcon from '$shared/components/StatusIcon'
import { updateStream } from '$userpages/modules/userPageStreams/actions'
import TOCPage from '$shared/components/TOCPage'
import Toolbar from '$shared/components/Toolbar'
import routes from '$routes'
import breakpoints from '$app/scripts/breakpoints'
import CoreLayout from '$shared/components/Layout/Core'
import InfoView from './InfoView'
import KeyView from './KeyView'
import ConfigureView from './ConfigureView'
import PreviewView from './PreviewView'
import HistoryView from './HistoryView'
import SecurityView from './SecurityView'
import StatusView from './StatusView'
import styles from './streamShowView.pcss'

const { lg } = breakpoints

const Edit = ({ stream: streamProp, canShare, currentUser, disabled }: any) => {
    const stream = useMemo(() => ({
        ...streamProp,
        ...(streamProp.config ? {
            ...streamProp.config,
            fields: streamProp.config.fields.map(({ id, ...field }) => field),
        } : {}),
    }), [streamProp])

    // It's either that or the GET param. Let's try this first.
    const isNewStream = !stream.lastUpdated

    const dispatch = useDispatch()

    const isMounted = useIsMounted()

    const cancel = useCallback(() => {
        dispatch(push(routes.userPageStreamListing()))
    }, [dispatch])

    const [spinner, setSpinner] = useState(false)

    const save = useCallback(async () => {
        setSpinner(true)

        try {
            await dispatch(updateStream(stream))

            if (isMounted()) {
                dispatch(push(routes.userPageStreamListing()))
            }
        } catch (e) {
            console.warn(e)
        } finally {
            if (isMounted()) {
                setSpinner(false)
            }
        }
    }, [stream, dispatch, isMounted])

    return (
        <CoreLayout
            hideNavOnDesktop
            navComponent={(
                <MediaQuery minWidth={lg.min}>
                    {(isDesktop) => (
                        <Toolbar
                            altMobileLayout
                            actions={{
                                cancel: {
                                    title: I18n.t('userpages.profilePage.toolbar.cancel'),
                                    kind: 'link',
                                    onClick: cancel,
                                },
                                saveChanges: {
                                    title: isDesktop ?
                                        I18n.t('userpages.profilePage.toolbar.saveAndExit') :
                                        I18n.t('userpages.profilePage.toolbar.done'),
                                    kind: 'primary',
                                    spinner,
                                    onClick: save,
                                    disabled,
                                },
                            }}
                        />
                    )}
                </MediaQuery>
            )}
        >
            <TOCPage title={I18n.t(`userpages.streams.edit.details.pageTitle.${isNewStream ? 'newStream' : 'existingStream'}`)}>
                <TOCPage.Section
                    id="details"
                    title={I18n.t('userpages.streams.edit.details.nav.details')}
                >
                    <InfoView disabled={disabled} />
                </TOCPage.Section>
                <TOCPage.Section
                    id="security"
                    title={I18n.t('userpages.streams.edit.details.nav.security')}
                    onlyDesktop
                >
                    <SecurityView disabled={disabled} />
                </TOCPage.Section>
                <TOCPage.Section
                    id="configure"
                    title={I18n.t('userpages.streams.edit.details.nav.fields')}
                    onlyDesktop
                >
                    <ConfigureView disabled={disabled} />
                </TOCPage.Section>
                <TOCPage.Section
                    id="status"
                    linkTitle={I18n.t('userpages.streams.edit.details.nav.status')}
                    title={(
                        <div className={styles.statusTitle}>
                            {I18n.t('userpages.streams.edit.details.nav.status')}
                            &nbsp;
                            <StatusIcon tooltip status={stream.streamStatus} />
                        </div>
                    )}
                    onlyDesktop
                >
                    <StatusView disabled={disabled} />
                </TOCPage.Section>
                <TOCPage.Section
                    id="preview"
                    title={I18n.t('userpages.streams.edit.details.nav.preview')}
                >
                    <Translate
                        value="userpages.streams.edit.preview.description"
                        className={styles.longText}
                        tag="p"
                        dangerousHTML
                        docsLink={routes.docsGettingStarted()}
                    />
                    <PreviewView
                        stream={stream}
                        currentUser={currentUser}
                    />
                </TOCPage.Section>
                <TOCPage.Section
                    id="api-access"
                    title={I18n.t('userpages.streams.edit.details.nav.apiAccess')}
                    onlyDesktop
                >
                    <KeyView disabled={disabled || !canShare} />
                </TOCPage.Section>
                <TOCPage.Section
                    id="historical-data"
                    title={I18n.t('userpages.streams.edit.details.nav.historicalData')}
                    onlyDesktop
                >
                    <HistoryView disabled={disabled} streamId={stream.id} />
                </TOCPage.Section>
            </TOCPage>
        </CoreLayout>
    )
}

export default Edit
