import React, { useEffect } from 'react'
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
import routes from '$routes'

export default function StreamPage({ children }) {
    const history = useHistory()

    const { commit, goBack } = useStreamModifier()

    const { busy, clean } = useStreamModifierStatusContext()

    const itp = useInterrupt()

    const setValidationError = useValidationErrorSetter()

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

    const title = isNew
        ? 'Name your Stream'
        : 'Set up your stream'

    const submitButtonLabel = isNew
        ? 'Create stream'
        : 'Save & exit'

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
                        loading={busy}
                        left={(
                            <BackButton onBack={goBack} />
                        )}
                        actions={{
                            cancel: {
                                kind: 'link',
                                title: 'Cancel',
                                outline: true,
                                onClick: () => void goBack(),
                                type: 'button',
                            },
                            saveChanges: {
                                disabled: clean || busy,
                                kind: 'primary',
                                title: submitButtonLabel,
                                type: 'submit',
                            },
                        }}
                    />
                )}
            >
                <TOCPage title={title}>
                    {children}
                </TOCPage>
                <SwitchNetworkModal />
            </Layout>
        </form>
    )
}
