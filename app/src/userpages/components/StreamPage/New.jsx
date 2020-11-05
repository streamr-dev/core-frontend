import React, { useCallback, useState, useMemo, useRef, useEffect, useReducer } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import styled, { css } from 'styled-components'
import { Translate, I18n } from 'react-redux-i18n'
import { push } from 'connected-react-router'
import { useTransition, animated } from 'react-spring'

import { MEDIUM } from '$shared/utils/styled'
import TOCPage, { Title } from '$shared/components/TOCPage'
import TOCSection from '$shared/components/TOCPage/TOCSection'
import BackButton from '$shared/components/BackButton'
import Toolbar from '$shared/components/Toolbar'
import routes from '$routes'
import { scrollTop } from '$shared/hooks/useScrollToTop'
import Notification from '$shared/utils/Notification'
import { NotificationIcon } from '$shared/utils/constants'
import StatusLabel from '$shared/components/StatusLabel'
import Nav from '$shared/components/Layout/Nav'
import useIsMounted from '$shared/hooks/useIsMounted'
import { createStream } from '$userpages/modules/userPageStreams/actions'
import { selectUserData } from '$shared/modules/user/selectors'
import Layout from '$shared/components/Layout/Core'
import StatusIcon from '$shared/components/StatusIcon'
import Activity, { actionTypes, resourceTypes } from '$shared/utils/Activity'
import docsLinks from '$shared/../docsLinks'
import {
    FormGroup,
    Field,
    Text,
} from './View'
import Preview from './Edit/PreviewView'
import SecurityView from './Edit/SecurityView'
import { StatusView } from './Edit/StatusView'
import ConfigureView from './Edit/ConfigureView'
import HistoryView from './Edit/HistoryView'
import PartitionsView from './Edit/PartitionsView'
import Select from '$ui/Select'
import Errors, { MarketplaceTheme } from '$ui/Errors'
import useModal from '$shared/hooks/useModal'
import ConfirmDialog from '$shared/components/ConfirmDialog'
import SvgIcon from '$shared/components/SvgIcon'

const Description = styled(Translate)`
    margin-bottom: 3rem;
`

const PathnameWrapper = styled.div`
    position: relative;
`

const Tooltip = styled.div`
    position: absolute;
    visibility: hidden;
    background: #323232;
    width: 250px;
    padding: 0.5rem 0.75rem;
    border-radius: 4px;
    font-size: 0.75rem;
    color: white;
    line-height: 1rem;
    top: 28px;
    right: 6px;
    z-index: 1;

    strong {
        font-family: var(--mono);
        font-weight: var(--medium);
        font-size: 0.9em;
    }

    a {
        color: var(--white);
        text-decoration: none;
    }
`

const QuestionIcon = styled.div`
    position: absolute;
    color: #CDCDCD;
    line-height: 0;
    top: -30px;
    right: -6px;
    width: 32px;
    height: 32px;

    svg {
        position: absolute;
        width: 16px;
        height: 16px;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
    }

    &:hover {
        color: #323232;

        ${Tooltip} {
            visibility: visible;
        }
    }
`

// this default data is only used for display purposes
const defaultStreamData = {
    id: 'newStream',
    config: {
        fields: [],
    },
    storageDays: 365,
    inactivityThresholdHours: 48,
    partitions: 1,
}

const DEFAULT_DOMAIN = 'sandbox'

const getValidId = ({ domain, pathname }) => {
    const id = `${domain}/${pathname}`

    if (pathname.indexOf('/') === 0) {
        throw new Error(I18n.t('userpages.streams.validation.noSlashAtBeginning'))
    }

    if (/\/\/+/.test(pathname)) {
        throw new Error(I18n.t('userpages.streams.validation.useSingleSlashPathSeparator'))
    }

    if (!/\w$/.test(id)) {
        throw new Error(I18n.t('userpages.streams.validation.invalidPathEndCharacter'))
    }

    // this matches the backend validation for the full id
    if (!/^((?:[\w-]+\.?)*\w)\/(?:[\w.-]+\/?)*\w$/.test(id)) {
        throw new Error(I18n.t('userpages.streams.validation.invalidPathCharacters'))
    }

    return id
}

const ConfirmExitModal = () => {
    const { api, isOpen } = useModal('confirmExit')

    if (!isOpen) {
        return null
    }

    return (
        <ConfirmDialog
            title={I18n.t('modal.confirmSave.title')}
            message={I18n.t('modal.confirmSave.newStream.message')}
            onAccept={() => api.close({ canProceed: true })}
            onReject={() => api.close({ canProceed: false })}
        />
    )
}

const UnstyledNew = (props) => {
    const [{ domain, pathname, description }, updateStream] = useReducer((state, changeSet) => ({
        ...state,
        ...changeSet,
    }), {
        pathname: '',
        description: '',
        domain: DEFAULT_DOMAIN,
    })

    const [loading, setLoading] = useState(false)
    const [createAttempted, setCreateAttempted] = useState(false)
    const [finished, setFinished] = useState(false)
    const streamDataRef = useRef()
    const contentChangedRef = useRef(false)
    const dispatch = useDispatch()
    const { api: confirmExitDialog } = useModal('confirmExit')

    const isMounted = useIsMounted()

    const domainOptions = useMemo(() => ([{
        value: DEFAULT_DOMAIN,
        label: DEFAULT_DOMAIN,
    },
        // ... todo: get domains
    /* {
        value: undefined,
        label: 'Add new domain',
    } */]), [])

    const confirmIsSaved = useCallback(async () => {
        const { pathname, description } = streamDataRef.current || {}

        if (!pathname && !description) {
            return true
        }

        const { canProceed } = await confirmExitDialog.open()

        if (!isMounted()) { return false }

        return !!canProceed
    }, [confirmExitDialog, isMounted])

    const onBack = useCallback(async () => {
        const canProceed = await confirmIsSaved()

        if (isMounted() && canProceed) {
            scrollTop()

            dispatch(push(routes.streams.index()))
        }
    }, [confirmIsSaved, dispatch, isMounted])

    const onDomainChange = useCallback(({ value: domain }) => {
        if (!domain) {
            console.warn('Adding new domains is not implemented!')
        } else {
            updateStream({ domain })
        }
    }, [updateStream])

    const onPathnameChange = useCallback((e) => {
        const pathname = e.target.value

        updateStream({ pathname })
    }, [updateStream])

    const onDescriptionChange = useCallback((e) => {
        const description = e.target.value

        updateStream({ description })
    }, [updateStream])

    const validationError = useMemo(() => {
        try {
            if (pathname) {
                getValidId({
                    domain,
                    pathname,
                })
            }

            return undefined
        } catch (e) {
            return e.message
        }
    }, [domain, pathname])

    const onSave = useCallback(async () => {
        if (!streamDataRef.current) { return }

        setLoading(true)
        setCreateAttempted(true)

        try {
            const { domain, pathname, description } = streamDataRef.current

            const streamId = await dispatch(createStream({
                id: getValidId({
                    domain,
                    pathname,
                }),
                description,
            }))

            if (!isMounted()) { return }

            setFinished(true)

            Notification.push({
                title: I18n.t('userpages.streams.created.notification'),
                icon: NotificationIcon.CHECKMARK,
            })
            Activity.push({
                action: actionTypes.CREATE,
                resourceId: streamId,
                resourceType: resourceTypes.STREAM,
            })

            // give time for fadeout animation to happen
            setTimeout(() => {
                if (isMounted()) {
                    dispatch(push(routes.streams.show({
                        id: streamId,
                        newStream: 1,
                    })))
                }
            }, 300)
        } catch (e) {
            console.warn(e)

            if (!isMounted()) { return }

            Notification.push({
                title: e.message,
                icon: NotificationIcon.ERROR,
            })
        } finally {
            if (isMounted()) {
                setLoading(false)
            }
        }
    }, [dispatch, isMounted])

    useEffect(() => {
        streamDataRef.current = {
            domain,
            pathname,
            description,
        }
        contentChangedRef.current = !!(pathname || description)
    }, [domain, pathname, description])

    useEffect(() => {
        const handleBeforeunload = (event) => {
            if (contentChangedRef.current) {
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

    const saveEnabled = !!pathname && !loading
    const isDisabled = !!loading
    const isDomainDisabled = isDisabled || domainOptions.length <= 1

    const transitions = useTransition(!finished, null, {
        config: {
            tension: 500,
            friction: 50,
            clamp: true,
            duration: 300,
        },
        from: {
            opacity: 1,
        },
        enter: {
            opacity: 1,
        },
        leave: {
            opacity: 0,
        },
    })

    return (
        <Layout
            {...props}
            nav={(
                <Nav noWide />
            )}
            loading={loading}
            navComponent={(
                <Toolbar
                    altMobileLayout
                    left={(
                        <BackButton onBack={onBack} />
                    )}
                    actions={{
                        cancel: {
                            kind: 'link',
                            title: I18n.t('userpages.profilePage.toolbar.cancel'),
                            outline: true,
                            onClick: () => onBack(),
                        },
                        saveChanges: {
                            title: I18n.t('userpages.profilePage.toolbar.saveAndExit'),
                            kind: 'primary',
                            onClick: () => onSave(),
                            disabled: !saveEnabled,
                        },
                    }}
                />
            )}
        >
            {transitions.map(({ item, key, props: style }) => (
                item && (
                    <animated.div
                        key={key}
                        style={style}
                    >
                        <TOCPage title={I18n.t('userpages.streams.edit.details.pageTitle.newStream')}>
                            <TOCSection
                                id="details"
                                title={I18n.t('userpages.streams.edit.details.nav.details')}
                            >
                                <Description
                                    value="userpages.streams.edit.details.info.description"
                                    tag="p"
                                    defaultDomain={DEFAULT_DOMAIN}
                                    dangerousHTML
                                />
                                <FormGroup>
                                    <Field
                                        label={I18n.t('userpages.streams.edit.details.domain.label')}
                                        css={css`
                                            && {
                                                max-width: 176px;
                                            }
                                        `}
                                    >
                                        {!!isDomainDisabled && (
                                            <Text
                                                value={domain || ''}
                                                readOnly
                                                disabled
                                                name="domain"
                                            />
                                        )}
                                        {!isDomainDisabled && (
                                            <Select
                                                options={domainOptions}
                                                value={domainOptions.find((t) => t.value === domain)}
                                                onChange={onDomainChange}
                                                disabled={isDisabled}
                                                name="domain"
                                            />
                                        )}
                                    </Field>
                                    <Field
                                        narrow
                                        css={css`
                                            && {
                                                margin: 0 16px 0 16px;
                                                width: auto;
                                            }
                                        `}
                                    >
                                        /
                                    </Field>
                                    <Field label={I18n.t('userpages.streams.edit.details.pathname.label')}>
                                        <PathnameWrapper>
                                            <QuestionIcon>
                                                <SvgIcon name="outlineQuestionMark" />
                                                <Tooltip>
                                                    <Translate
                                                        value="userpages.streams.edit.details.tooltip"
                                                        docsLink={docsLinks.streams}
                                                        dangerousHTML
                                                    />
                                                </Tooltip>
                                            </QuestionIcon>
                                            <Text
                                                value={pathname || ''}
                                                onChange={onPathnameChange}
                                                disabled={isDisabled}
                                                placeholder={I18n.t('userpages.streams.edit.details.pathname.placeholder')}
                                                name="pathname"
                                                invalid={!!createAttempted && !!validationError}
                                            />
                                        </PathnameWrapper>
                                        {!!createAttempted && !!validationError && (
                                            <Errors overlap theme={MarketplaceTheme}>
                                                {validationError}
                                            </Errors>
                                        )}
                                    </Field>
                                    <Field narrow desktopOnly />
                                </FormGroup>
                                <FormGroup>
                                    <Field label={I18n.t('userpages.streams.edit.details.description.label')}>
                                        <Text
                                            value={description}
                                            onChange={onDescriptionChange}
                                            disabled={isDisabled}
                                            name="description"
                                            placeholder={I18n.t('userpages.streams.edit.details.description.placeholder')}
                                            autoComplete="off"
                                        />
                                    </Field>
                                    <Field narrow desktopOnly />
                                </FormGroup>
                            </TOCSection>
                            <TOCSection
                                id="security"
                                title={I18n.t('userpages.streams.edit.details.nav.security')}
                            >
                                <SecurityView
                                    stream={defaultStreamData}
                                    disabled
                                />
                            </TOCSection>
                            <TOCPage.Section
                                id="configure"
                                title={I18n.t('userpages.streams.edit.details.nav.fields')}
                                onlyDesktop
                            >
                                <ConfigureView
                                    stream={defaultStreamData}
                                    disabled
                                />
                            </TOCPage.Section>
                            <TOCPage.Section
                                id="status"
                                title={I18n.t('userpages.streams.edit.details.nav.status')}
                                status={<StatusIcon
                                    tooltip
                                    status="inactive"
                                />}
                                onlyDesktop
                            >
                                <StatusView disabled stream={defaultStreamData} />
                            </TOCPage.Section>
                            <TOCSection
                                id="preview"
                                title={I18n.t('userpages.streams.edit.details.nav.preview')}
                            >
                                <Preview
                                    stream={defaultStreamData}
                                    subscribe={false}
                                />
                            </TOCSection>
                            <TOCSection
                                id="historicalData"
                                title={I18n.t('userpages.streams.edit.details.nav.historicalData')}
                            >
                                <HistoryView
                                    stream={defaultStreamData}
                                    disabled
                                    showStorageOptions={false}
                                />
                            </TOCSection>
                            <TOCPage.Section
                                id="stream-partitions"
                                title={I18n.t('userpages.streams.edit.details.nav.streamPartitions')}
                                linkTitle={I18n.t('userpages.streams.edit.details.nav.partitions')}
                                status={(<StatusLabel.Advanced />)}
                            >
                                <PartitionsView
                                    stream={defaultStreamData}
                                    disabled
                                />
                            </TOCPage.Section>
                        </TOCPage>
                    </animated.div>
                )
            ))}
            <ConfirmExitModal />
        </Layout>
    )
}

const New = styled(UnstyledNew)`
    p {
        line-height: 1.5em;
    }

    strong {
        font-weight: ${MEDIUM};
    }

    ${Text} + * {
        margin-left: 16px;
    }

    ${Title} {
        display: block;
    }
`

const NewStreamViewMaybe = (props) => {
    const currentUser = useSelector(selectUserData)

    if (!currentUser) {
        return (
            <Layout loading />
        )
    }

    return <New {...props} />
}

export default NewStreamViewMaybe
