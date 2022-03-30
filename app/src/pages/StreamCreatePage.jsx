import React, { useCallback, useRef, useState, useEffect, useReducer } from 'react'
import { useHistory } from 'react-router-dom'
import StreamContext from '$shared/contexts/StreamContext'
import BackButton from '$shared/components/BackButton'
import Display from '$shared/components/Display'
import Layout from '$shared/components/Layout/Core'
import StreamModifier from '$shared/components/StreamModifier'
import TOCPage from '$shared/components/TOCPage'
import Toolbar from '$shared/components/Toolbar'
import useModal from '$shared/hooks/useModal'
import useNativeTokenName from '$shared/hooks/useNativeTokenName'
import SwitchNetworkModal from '$shared/components/SwitchNetworkModal'
import GetCryptoDialog from '$mp/components/Modal/GetCryptoDialog'
import useStream from '$shared/hooks/useStream'
import useStreamModifier from '$shared/hooks/useStreamModifier'
import useClientAddress from '$shared/hooks/useClientAddress'
import ValidationError from '$shared/errors/ValidationError'
import InsufficientFundsError from '$shared/errors/InsufficientFundsError'
import DuplicateError from '$shared/errors/DuplicateError'
import InterruptionError from '$shared/errors/InterruptionError'
import Notification from '$shared/utils/Notification'
import useInterrupt from '$shared/hooks/useInterrupt'
import { NotificationIcon } from '$shared/utils/constants'
import Activity, { actionTypes, resourceTypes } from '$shared/utils/Activity'
import { useStreamModifierStatusContext } from '$shared/contexts/StreamModifierStatusContext'
import routes from '$routes'
import InfoSection from './AbstractStreamEditPage/InfoSection'
import CodeSnippetsSection from './AbstractStreamEditPage/CodeSnippetsSection'
import StatusSection from './AbstractStreamEditPage/StatusSection'
import PreviewSection from './AbstractStreamEditPage/PreviewSection'
import HistorySection from './AbstractStreamEditPage/HistorySection'
import PartitionsSection from './AbstractStreamEditPage/PartitionsSection'

function StreamCreatePage() {
    const { description, inactivityThresholdHours, storageDays, partitions } = useStream()

    const nativeTokenName = useNativeTokenName()

    const history = useHistory()

    const { api: confirmExitDialog } = useModal('confirmExit')

    const user = useClientAddress()

    const [domain = '', setDomain] = useState()

    useEffect(() => {
        if (!domain) {
            setDomain(user)
        }
    }, [user, domain])

    const [pathname = '', setPathname] = useState()

    const [validationError, setValidationError] = useReducer((_, msg) => (msg ? `Path name ${msg}` : undefined))

    const { stage, commit } = useStreamModifier()

    const { busy, clean } = useStreamModifierStatusContext()

    const [showGetCryptoDialog, setShowGetCryptoDialog] = useState(false)

    const itp = useInterrupt()

    useEffect(() => () => {
        itp().interruptAll()
    }, [itp])

    const onBack = useCallback(() => {
        const { requireUninterrupted } = itp('go back')

        if (clean) {
            history.push(routes.streams.index())
            return
        }

        async function fn() {
            try {
                const { canProceed } = await confirmExitDialog.open()

                requireUninterrupted()

                if (canProceed) {
                    history.push(routes.streams.index())
                }
            } catch (e) {
                // Noop.
            }
        }

        fn()
    }, [itp, history, clean, confirmExitDialog])

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
                setValidationError('already exists, please try a different one')
            }

            if (e instanceof ValidationError) {
                setValidationError(e.message)
            }

            Notification.push({
                title: 'Save failed',
                icon: NotificationIcon.ERROR,
            })
        }
    }

    useEffect(() => {
        const id = `${domain}/${pathname}`

        stage({
            id: undefined,
        })

        setValidationError(undefined)

        if (!domain || /^\s*$/.test(pathname)) {
            return
        }

        try {
            if (/^\//.test(pathname)) {
                throw new ValidationError('cannot start with a slash')
            }

            if (/\/{2,}/.test(pathname)) {
                throw new ValidationError('cannot contain consecutive "/" characters')
            }

            if (/[^\w]$/.test(pathname)) {
                throw new ValidationError('must end with an alpha-numeric character')
            }

            if (/[^\w.\-/_]/.test(pathname)) {
                throw new ValidationError('may only contain alpha-numeric characters, underscores, and dashes')
            }

            stage({
                id,
            })
        } catch (e) {
            if (e instanceof ValidationError) {
                setValidationError(e.message)
                return
            }

            throw e
        }
    }, [domain, pathname, stage])

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
                            <BackButton onBack={onBack} />
                        )}
                        actions={{
                            cancel: {
                                kind: 'link',
                                title: 'Cancel',
                                outline: true,
                                onClick: () => void onBack(),
                            },
                            saveChanges: {
                                disabled: clean || busy,
                                kind: 'primary',
                                title: 'Save & Exit',
                                type: 'submit',
                            },
                        }}
                    />
                )}
            >
                <TOCPage title="Name your Stream">
                    <InfoSection
                        description={description}
                        domain={domain}
                        onDescriptionChange={(value) => void stage({
                            description: value,
                        })}
                        onDomainChange={setDomain}
                        onPathnameChange={setPathname}
                        pathname={pathname}
                        validationError={validationError}
                        disabled={busy}
                    />
                    <CodeSnippetsSection disabled />
                    <TOCPage.Section
                        id="configure"
                        title="Fields"
                        onlyDesktop
                        disabled
                    >
                        {/* @TODO */}
                        {/* <ConfigureView
                            stream={defaultStreamData}
                            disabled
                        /> */}
                    </TOCPage.Section>
                    <Display $mobile="none" $desktop>
                        <StatusSection
                            disabled={busy}
                            duration={inactivityThresholdHours}
                            onChange={(value) => void stage({
                                inactivityThresholdHours: value,
                            })}
                            status="inactive"
                        />
                    </Display>
                    <PreviewSection
                        disabled
                        subscribe={false}
                    />
                    <Display $mobile="none" $desktop>
                        <HistorySection
                            desc={null}
                            disabled={busy}
                            duration={storageDays}
                            onChange={(value) => void stage({
                                storageDays: value,
                            })}
                        />
                    </Display>
                    <PartitionsSection
                        disabled={busy}
                        onChange={(value) => void stage({
                            partitions: value,
                        })}
                        partitions={partitions}
                    />
                </TOCPage>
                {/* <ConfirmExitModal /> */}
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
