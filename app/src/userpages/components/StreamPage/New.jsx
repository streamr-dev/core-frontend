import React, { useCallback, useState, useMemo, useRef, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import styled, { css } from 'styled-components'
import { Translate, I18n } from 'react-redux-i18n'
import { push } from 'connected-react-router'
import { MEDIUM } from '$shared/utils/styled'
import TOCPage, { Title } from '$shared/components/TOCPage'
import TOCSection from '$shared/components/TOCPage/TOCSection'
import BackButton from '$shared/components/BackButton'
import Toolbar from '$shared/components/Toolbar'
import Preview from './Edit/PreviewView'
import { getSecurityLevelConfig } from './Edit/SecurityView'
import { convertFromStorageDays } from './Edit/HistoryView'
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
    HistoricalStorage,
    StreamPartitions,
} from './View'
import { StatusView } from './Edit/StatusView'
import KeyView from './Edit/KeyView'
import Select from '$ui/Select'

const Description = styled(Translate)`
    margin-bottom: 3rem;
`

const defaultStreamData = {
    config: {
        fields: [],
    },
    storageDays: 365,
    inactivityThresholdHours: 48,
}

const DEFAULT_DOMAIN = 'sandbox'

const UnstyledNew = (props) => {
    const [pathname, setPathname] = useState('')
    const [description, setDescription] = useState('')
    const [domain, setDomain] = useState(DEFAULT_DOMAIN)
    const [loading, setLoading] = useState(false)
    const streamDataRef = useRef({
        name: '',
        description: '',
    })
    const dispatch = useDispatch()

    const isMounted = useIsMounted()

    const domainOptions = useMemo(() => ([{
        value: DEFAULT_DOMAIN,
        label: DEFAULT_DOMAIN,
    },
        // ... todo: get domains
    {
        value: undefined,
        label: 'Add new domain',
    }]), [])

    const currentUser = useSelector(selectUserData)

    const { shortDescription, longDescription } = getSecurityLevelConfig(defaultStreamData)
    const { amount: storagePeriod, unit } = convertFromStorageDays(defaultStreamData.storageDays)

    const onBack = useCallback(() => {
        scrollTop()

        if (currentUser) {
            dispatch(push(routes.streams.index()))
        } else {
            dispatch(push(routes.root()))
        }
    }, [dispatch, currentUser])

    const onDomainChange = useCallback(({ value }) => {
        if (!value) {
            alert('add new')
        } else {
            setDomain(value)
        }
    }, [])

    const onPathnameChange = useCallback((e) => {
        const pathname = e.target.value

        setPathname(pathname)
    }, [])

    const onDescriptionChange = useCallback((e) => {
        const description = e.target.value

        setDescription(description)
    }, [])

    const onSave = useCallback(async () => {
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
            name: `${domain}/${pathname}`,
            description,
        }
    }, [domain, pathname, description])

    if (!currentUser) {
        return (
            <Layout loading />
        )
    }

    const saveEnabled = !!(pathname && pathname) && !loading
    const isDisabled = !!loading

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
                            onClick: () => onBack,
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
                            label={I18n.t('userpages.streams.edit.details.domain')}
                            css={css`
                                && {
                                    max-width: 176px;
                                }
                            `}
                        >
                            {!!isDisabled && (
                                <Text
                                    value={domain || ''}
                                    readOnly
                                    disabled
                                    name="domain"
                                />
                            )}
                            {!isDisabled && (
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
                    <p>
                        <Translate value={shortDescription} tag="strong" />
                        {' '}
                        <Translate value={longDescription} />
                    </p>
                </TOCSection>
                <TOCPage.Section
                    id="configure"
                    title={I18n.t('userpages.streams.edit.details.nav.fields')}
                    onlyDesktop
                >
                    <Translate value="userpages.streams.edit.configure.help" tag="p" />
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
                    <StatusView disabled stream={defaultStreamData} updateEditStream={() => {}} />
                </TOCPage.Section>
                <TOCSection
                    id="preview"
                    title={I18n.t('userpages.streams.edit.details.nav.preview')}
                >
                    <Preview currentUser={currentUser} stream={defaultStreamData} />
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
                    <FormGroup>
                        <Field label={I18n.t('userpages.streams.edit.configure.historicalStoragePeriod.label')}>
                            <HistoricalStorage>
                                <Text
                                    value={storagePeriod}
                                    readOnly
                                    disabled
                                    centered
                                />
                                <Text
                                    value={I18n.t(`shared.date.${unit.replace(/s$/, '')}`, {
                                        count: defaultStreamData.storageDays,
                                    })}
                                    readOnly
                                    disabled
                                />
                            </HistoricalStorage>
                        </Field>
                    </FormGroup>
                </TOCSection>
                <TOCPage.Section
                    id="stream-partitions"
                    title={I18n.t('userpages.streams.edit.details.nav.streamPartitions')}
                    linkTitle={I18n.t('userpages.streams.edit.details.nav.partitions')}
                    status={(<StatusLabel.Advanced />)}
                >
                    <FormGroup>
                        <Field label={I18n.t('userpages.streams.partitionsLabel')}>
                            <StreamPartitions>
                                <Text
                                    value={defaultStreamData.partitions || '1'}
                                    readOnly
                                    disabled
                                    centered
                                />
                            </StreamPartitions>
                        </Field>
                    </FormGroup>
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

export default New
