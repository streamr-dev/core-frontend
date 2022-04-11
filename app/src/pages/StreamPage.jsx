import React, { useEffect } from 'react'
import { StreamPermission } from 'streamr-client'
import { useHistory } from 'react-router-dom'
import BackButton from '$shared/components/BackButton'
import Layout from '$shared/components/Layout/Core'
import TOCPage from '$shared/components/TOCPage'
import Toolbar from '$shared/components/Toolbar'
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
import ShareSidebar from '$userpages/components/ShareSidebar'
import { truncate } from '$shared/utils/text'
import Sidebar from '$shared/components/Sidebar'
import routes from '$routes'

function StreamPageSidebar() {
    const streamId = useStreamId()

    const sidebar = useSidebar()

    function onClose() {
        sidebar.close()
    }

    return !!streamId && (
        <Sidebar.WithErrorBoundary
            isOpen={sidebar.isOpen()}
            onClose={onClose}
        >
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
}

function UnwrappedStreamPage({ title, children, loading = false }) {
    const history = useHistory()

    const { commit, goBack } = useStreamModifier()

    const { busy, clean } = useStreamModifierStatusContext()

    const itp = useInterrupt()

    const setValidationError = useValidationErrorSetter()

    const { [StreamPermission.GRANT]: canGrant = false } = useStreamPermissions()

    useEffect(() => () => {
        itp().interruptAll()
    }, [itp])

    const isNew = !useStreamId()

    async function save() {
        const { requireUninterrupted } = itp('save')

        try {
            try {
                const { id } = await commit()

                requireUninterrupted()

                const [notification, action] = isNew ? [
                    'Stream created successfully',
                    actionTypes.UPDATE,
                ] : [
                    'Stream updated successfully',
                    actionTypes.UPDATE,
                ]

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

                history.push(routes.streams.show({
                    id,
                    newStream: isNew ? 1 : undefined,
                }))
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
                return
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

    const submitButtonLabel = isNew
        ? 'Create stream'
        : 'Save & exit'

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
        <form
            onSubmit={(e) => {
                save()
                e.preventDefault()
            }}
        >
            <Layout
                nav={false}
                navComponent={(
                    <Toolbar
                        altMobileLayout
                        loading={loading || busy}
                        left={(
                            <BackButton onBack={goBack} />
                        )}
                        actions={buttons}
                    />
                )}
            >
                {!loading && (
                    <TOCPage title={title}>
                        {children}
                    </TOCPage>
                )}
            </Layout>
        </form>
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
