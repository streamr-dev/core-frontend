import React, { useCallback, useState, useMemo, useRef, useEffect, useReducer } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import styled, { css } from 'styled-components'
import { Translate, I18n } from 'react-redux-i18n'
import { push } from 'connected-react-router'
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
import {
    FormGroup,
    Field,
    Text,
} from './View'
import Preview from './Edit/PreviewView'
import SecurityView from './Edit/SecurityView'
import { StatusView } from './Edit/StatusView'
import KeyView from './Edit/KeyView'
import ConfigureView from './Edit/ConfigureView'
import HistoryView from './Edit/HistoryView'
import PartitionsView from './Edit/PartitionsView'
import Select from '$ui/Select'

const Description = styled(Translate)`
    margin-bottom: 3rem;
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
    const streamDataRef = useRef()
    const contentChangedRef = useRef(false)
    const dispatch = useDispatch()

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

    const onBack = useCallback(() => {
        scrollTop()

        dispatch(push(routes.streams.index()))
    }, [dispatch])

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

    const onSave = useCallback(async () => {
        if (!streamDataRef.current) { return }

        setLoading(true)

        try {
            const streamId = await dispatch(createStream(streamDataRef.current))

            if (!isMounted()) { return }

            Notification.push({
                title: 'Stream created successfully!',
                icon: NotificationIcon.CHECKMARK,
            })
            Activity.push({
                action: actionTypes.CREATE,
                resourceId: streamId,
                resourceType: resourceTypes.STREAM,
            })

            dispatch(push(routes.streams.show({
                id: streamId,
            })))
        } catch (e) {
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
            id: `${domain}/${pathname}`,
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

    const saveEnabled = !!(pathname && pathname) && !loading
    const isDisabled = !!loading
    const isDomainDisabled = isDisabled || domainOptions.length <= 1

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
            <TOCPage title={I18n.t('userpages.streams.edit.details.pageTitle')}>
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
                            label={I18n.t('userpages.streams.edit.details.domain')}
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
                        <Field label={I18n.t('userpages.streams.edit.details.pathname')}>
                            <Text
                                value={pathname || ''}
                                onChange={onPathnameChange}
                                disabled={isDisabled}
                                placeholder="Enter a unique stream path name"
                                name="pathname"
                            />
                        </Field>
                        <Field narrow desktopOnly />
                    </FormGroup>
                    <FormGroup>
                        <Field label={I18n.t('userpages.streams.edit.details.description')}>
                            <Text
                                value={description}
                                onChange={onDescriptionChange}
                                disabled={isDisabled}
                                name="description"
                                placeholder="Add a brief description"
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
                <TOCPage.Section
                    id="api-access"
                    title={I18n.t('userpages.streams.edit.details.nav.apiAccess')}
                    status={(<StatusLabel.Deprecated />)}
                    onlyDesktop
                >
                    <KeyView disabled />
                </TOCPage.Section>
                <TOCSection
                    id="historicalData"
                    title={I18n.t('userpages.streams.edit.details.nav.historicalData')}
                >
                    <HistoryView
                        stream={defaultStreamData}
                        disabled
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
        </Layout>
    )
}

const New = styled(UnstyledNew)`
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
