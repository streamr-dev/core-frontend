import React, { useCallback, useMemo } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import styled, { css } from 'styled-components'
import { Translate, I18n } from 'react-redux-i18n'
import { push } from 'connected-react-router'
import Label from '$ui/Label'
import { SM, XL, MEDIUM } from '$shared/utils/styled'
import TOCPage, { Title } from '$shared/components/TOCPage'
import TOCSection from '$shared/components/TOCPage/TOCSection'
import BackButton from '$shared/components/BackButton'
import Toolbar from '$shared/components/Toolbar'
import useCopy from '$shared/hooks/useCopy'
import Preview from './Edit/PreviewView'
import { getSecurityLevelConfig } from './Edit/SecurityView'
import { convertFromStorageDays } from './Edit/HistoryView'
import routes from '$routes'
import { scrollTop } from '$shared/hooks/useScrollToTop'
import CodeSnippets from '$shared/components/CodeSnippets'
import { subscribeSnippets } from '$utils/streamSnippets'
import Button from '$shared/components/Button'
import Notification from '$shared/utils/Notification'
import { NotificationIcon } from '$shared/utils/constants'
import StatusLabel from '$shared/components/StatusLabel'
import Nav from '$shared/components/Layout/Nav'
import useIsMounted from '$shared/hooks/useIsMounted'
import useOnMount from '$shared/hooks/useOnMount'
import useFailure from '$shared/hooks/useFailure'
import { createStream } from '$userpages/modules/userPageStreams/actions'
import { selectUserData } from '$shared/modules/user/selectors'
import Layout from '$shared/components/Layout/Core'
import StatusIcon from '$shared/components/StatusIcon'
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

const UnstyledNew = (props) => {
    const dispatch = useDispatch()

    const isMounted = useIsMounted()

    const currentUser = useSelector(selectUserData)
    const stream = {
        config: {
            fields: [],
        },
        storageDays: 365,
        inactivityThresholdHours: 48,
    }

    const { shortDescription, longDescription } = getSecurityLevelConfig(stream)
    const { amount: storagePeriod, unit } = convertFromStorageDays(stream.storageDays)

    const onBack = useCallback(() => {
        scrollTop()

        if (currentUser) {
            dispatch(push(routes.streams.index()))
        } else {
            dispatch(push(routes.root()))
        }
    }, [dispatch, currentUser])

    if (!currentUser) {
        return (
            <Layout loading />
        )
    }

    return (
        <Layout
            {...props}
            nav={(
                <Nav noWide />
            )}
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
                            onClick: () => {},
                            disabled: true,
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
                    <FormGroup>
                        <Field
                            label={I18n.t('userpages.streams.edit.details.domain')}
                            css={css`
                                && {
                                    max-width: 176px;
                                }
                            `}
                        >
                            <Select
                                options={[]}
                                value={undefined}
                                onChange={() => {}}
                                disabled={false}
                            />
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
                                value={stream.name || ''}
                                readOnly
                                disabled={false}
                                placeholder="Enter a unique stream path name"
                                name="name"
                            />
                        </Field>
                        <Field narrow desktopOnly />
                    </FormGroup>
                    <FormGroup>
                        <Field label={I18n.t('userpages.streams.edit.details.description')}>
                            <Text
                                value=""
                                disabled={false}
                                name="description"
                                placeholder="Add a brief description"
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
                    <StatusView disabled stream={stream} updateEditStream={() => {}} />
                </TOCPage.Section>
                <TOCSection
                    id="preview"
                    title={I18n.t('userpages.streams.edit.details.nav.preview')}
                >
                    <Preview currentUser={currentUser} stream={stream} />
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
                                        count: stream.storageDays,
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
                                    value={stream.partitions || '1'}
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
