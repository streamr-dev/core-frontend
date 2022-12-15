import React, { Fragment, useState, useCallback, useMemo } from 'react'
import { StreamPermission } from 'streamr-client'
import { useHistory } from 'react-router-dom'
import styled from 'styled-components'

import Layout from '$shared/components/Layout/Core'
import { MarketplaceHelmet } from '$shared/components/Helmet'
import SwitchNetworkModal from '$shared/components/SwitchNetworkModal'
import useStreamModifier from '$shared/hooks/useStreamModifier'
import ValidationError from '$shared/errors/ValidationError'
import InsufficientFundsError from '$shared/errors/InsufficientFundsError'
import DuplicateError from '$shared/errors/DuplicateError'
import InterruptionError from '$shared/errors/InterruptionError'
import Notification from '$shared/utils/Notification'
import useInterrupt from '$shared/hooks/useInterrupt'
import { NotificationIcon } from '$shared/utils/constants'
import Activity, { actionTypes, resourceTypes } from '$shared/utils/Activity'
import { useStreamModifierStatusContext } from '$shared/contexts/StreamModifierStatusContext'
import { useValidationErrorSetter } from '$shared/components/ValidationErrorProvider'
import useStreamId from '$shared/hooks/useStreamId'
import useStreamPermissions from '$shared/hooks/useStreamPermissions'
import SidebarProvider, { useSidebar } from '$shared/components/Sidebar/SidebarProvider'
import { DetailsPageHeader } from '$shared/components/DetailsPageHeader'
import ShareSidebar from '$userpages/components/ShareSidebar'
import { truncate } from '$shared/utils/text'
import Sidebar from '$shared/components/Sidebar'
import useNativeTokenName from '$shared/hooks/useNativeTokenName'
import GetCryptoDialog from '$mp/components/Modal/GetCryptoDialog'
import { DESKTOP, TABLET } from '$shared/utils/styled'
import routes from '$routes'

export const getStreamDetailsLinkTabs = (streamId: string) => {
    return [
        {
            label: 'Stream overview',
            href:  routes.streams.show({id: streamId})
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
    padding: 24px 24px 80px 24px;

    @media ${TABLET} {
        max-width: 1296px;
        margin: 0 auto;
        padding: 45px 40px 90px 40px;
    }

    @media ${DESKTOP} {
        padding: 60px 78px 130px 78px;
    }
`

const Inner = styled.div`
    border-radius: 16px;
    background-color: white;

    padding: 24px;

    @media ${TABLET} {
        padding: 40px;
    }

    @media ${DESKTOP} {
        padding: 52px;
    }
`

const Content = styled.div`
    max-width: 680px;
`

function StreamPageSidebar() {
    const streamId = useStreamId()
    const sidebar = useSidebar()
    const onClose = useCallback(() => {
        sidebar.close()
    }, [sidebar])
    return (
        !!streamId && (
            <Sidebar.WithErrorBoundary isOpen={sidebar.isOpen()} onClose={onClose}>
                {sidebar.isOpen('share') && (
                    <ShareSidebar
                        sidebarName="share"
                        resourceTitle={truncate(streamId)}
                        resourceType="STREAM"
                        resourceId={streamId}
                        onClose={onClose}
                    />
                )}
            </Sidebar.WithErrorBoundary>
        )
    )
}

function UnwrappedStreamPage({ children, loading = false }) {
    const history = useHistory()
    const { commit, goBack } = useStreamModifier()
    const { busy, clean } = useStreamModifierStatusContext()
    const itp = useInterrupt()
    const setValidationError = useValidationErrorSetter()
    const { [StreamPermission.GRANT]: canGrant = false } = useStreamPermissions()
    const streamId = useStreamId()
    const isNew = !streamId
    const nativeTokenName = useNativeTokenName()
    const [showGetCryptoDialog, setShowGetCryptoDialog] = useState(false)
    const linkTabs = useMemo(() => getStreamDetailsLinkTabs(streamId), [streamId])

    async function save() {
        const { requireUninterrupted } = itp('save')

        try {
            try {
                const { id } = await commit()
                requireUninterrupted()
                const [notification, action] = isNew
                    ? ['Stream created successfully', actionTypes.UPDATE]
                    : ['Stream updated successfully', actionTypes.UPDATE]
                Notification.push({
                    title: notification,
                    icon: NotificationIcon.CHECKMARK,
                })
                Activity.push({
                    action,
                    resourceId: id,
                    resourceType: resourceTypes.STREAM,
                })
                // Give the notification some time before navigating away in the next step.
                await new Promise((resolve) => {
                    setTimeout(resolve, 300)
                })
                requireUninterrupted()
                history.push(
                    routes.streams.show({
                        id,
                        newStream: isNew ? 1 : undefined,
                    }),
                )
            } catch (e) {
                requireUninterrupted()
                throw e
            }
        } catch (e) {
            let handled = false

            if (e instanceof InterruptionError) {
                return
            }

            if (e instanceof DuplicateError) {
                setValidationError({
                    id: 'already exists, please try a different one',
                })
                handled = true
            }

            if (e instanceof ValidationError) {
                setValidationError({
                    id: e.message,
                })
                handled = true
            }

            if (e instanceof InsufficientFundsError) {
                setShowGetCryptoDialog(true)
                handled = true
            }

            if (handled) {
                return
            }

            console.warn(e)
            Notification.push({
                title: 'Save failed',
                icon: NotificationIcon.ERROR,
            })
        }
    }

    const submitButtonLabel = isNew ? 'Create stream' : 'Save & exit'
    const sidebar = useSidebar()

    const buttons = (() => {
        if (isNew) {
            return {
                cancel: {
                    kind: 'link',
                    onClick: () => void goBack(),
                    outline: true,
                    title: 'Cancel',
                    type: 'button',
                },
                saveChanges: {
                    disabled: clean || busy,
                    kind: 'primary',
                    title: submitButtonLabel,
                    type: 'submit',
                },
            }
        }

        return {
            share: {
                disabled: busy || !canGrant,
                kind: 'primary',
                onClick: () => void sidebar.open('share'),
                outline: true,
                title: 'Share',
                type: 'button',
            },
            saveChanges: {
                disabled: clean || busy,
                kind: 'primary',
                title: submitButtonLabel,
                type: 'submit',
            },
        }
    })()

    return (
        <Fragment>
            <Layout>
                <MarketplaceHelmet title={`Stream ${streamId}`} />
                <DetailsPageHeader
                    backButtonLink={routes.streams.index()}
                    pageTitle={streamId}
                    linkTabs={linkTabs}
                />
                <Outer>
                    <Inner>
                        <Content>
                            {!loading && children}
                        </Content>
                    </Inner>
                </Outer>
            </Layout>
            {showGetCryptoDialog && (
                <GetCryptoDialog
                    onCancel={() => void setShowGetCryptoDialog(false)}
                    nativeTokenName={nativeTokenName}
                />
            )}
        </Fragment>
    )
}

export default function StreamPage(props) {
    return (
        <SidebarProvider>
            <UnwrappedStreamPage {...props} />
            <StreamPageSidebar />
            <SwitchNetworkModal />
        </SidebarProvider>
    )
}
