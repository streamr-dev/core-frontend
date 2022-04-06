import React, { useRef, useState, useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import StreamContext from '$shared/contexts/StreamContext'
import BackButton from '$shared/components/BackButton'
import Display from '$shared/components/Display'
import Layout from '$shared/components/Layout/Core'
import StreamModifier from '$shared/components/StreamModifier'
import TOCPage from '$shared/components/TOCPage'
import Toolbar from '$shared/components/Toolbar'
import useNativeTokenName from '$shared/hooks/useNativeTokenName'
import SwitchNetworkModal from '$shared/components/SwitchNetworkModal'
import GetCryptoDialog from '$mp/components/Modal/GetCryptoDialog'
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
import routes from '$routes'
import InfoSection from './AbstractStreamEditPage/InfoSection'
import CodeSnippetsSection from './AbstractStreamEditPage/CodeSnippetsSection'
import StatusSection from './AbstractStreamEditPage/StatusSection'
import PreviewSection from './AbstractStreamEditPage/PreviewSection'
import HistorySection from './AbstractStreamEditPage/HistorySection'
import PartitionsSection from './AbstractStreamEditPage/PartitionsSection'
import ConfigSection from './AbstractStreamEditPage/ConfigSection'

function StreamCreatePage() {
    const nativeTokenName = useNativeTokenName()

    const history = useHistory()

    const { commit, goBack } = useStreamModifier()

    const { busy, clean } = useStreamModifierStatusContext()

    const [showGetCryptoDialog, setShowGetCryptoDialog] = useState(false)

    const itp = useInterrupt()

    const setValidationError = useValidationErrorSetter()

    useEffect(() => () => {
        itp().interruptAll()
    }, [itp])

    async function save() {
        const { requireUninterrupted } = itp('save')

        try {
            try {
                const { id } = await commit()

                requireUninterrupted()

                Notification.push({
                    title: 'Stream created successfully',
                    icon: NotificationIcon.CHECKMARK,
                })

                Activity.push({
                    action: actionTypes.CREATE,
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
                    newStream: 1,
                }))
            } catch (e) {
                requireUninterrupted()

                throw e
            }
        } catch (e) {
            console.warn(e)

            if (e instanceof InterruptionError) {
                return
            }

            if (e instanceof InsufficientFundsError) {
                setShowGetCryptoDialog(true)
                return
            }

            if (e instanceof DuplicateError) {
                setValidationError({
                    id: 'already exists, please try a different one',
                })
            }

            if (e instanceof ValidationError) {
                setValidationError({
                    id: e.message,
                })
            }

            Notification.push({
                title: 'Save failed',
                icon: NotificationIcon.ERROR,
            })
        }
    }

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
                                title: 'Create stream',
                                type: 'submit',
                            },
                        }}
                    />
                )}
            >
                <TOCPage title="Name your Stream">
                    <InfoSection disabled={busy} />
                    <CodeSnippetsSection disabled />
                    <Display $mobile="none" $desktop>
                        <ConfigSection disabled={busy} />
                    </Display>
                    <Display $mobile="none" $desktop>
                        <StatusSection disabled={busy} status="inactive" />
                    </Display>
                    <PreviewSection disabled subscribe={false} />
                    <Display $mobile="none" $desktop>
                        <HistorySection desc={null} disabled={busy} />
                    </Display>
                    <PartitionsSection disabled={busy} />
                </TOCPage>
                <SwitchNetworkModal />
                {showGetCryptoDialog && (
                    <GetCryptoDialog
                        onCancel={() => setShowGetCryptoDialog(false)}
                        nativeTokenName={nativeTokenName}
                    />
                )}
            </Layout>
        </form>
    )
}

export default function StreamCreatePageWrapper() {
    const { current: stream } = useRef({
        id: undefined,
        description: '',
        config: {
            fields: [],
        },
        storageDays: undefined,
        inactivityThresholdHours: undefined,
        partitions: 1,
    })

    const { current: onValidate } = useRef(({ id }) => {
        if (!id) {
            throw new ValidationError('cannot be blank')
        }
    })

    return (
        <StreamContext.Provider value={stream}>
            <StreamModifier onValidate={onValidate}>
                <StreamCreatePage />
            </StreamModifier>
        </StreamContext.Provider>
    )
}
