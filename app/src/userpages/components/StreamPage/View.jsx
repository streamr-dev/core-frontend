import React, { useCallback, useMemo } from 'react'
import styled from 'styled-components'
import { Translate, I18n } from 'react-redux-i18n'
import { push } from 'connected-react-router'
import { useDispatch } from 'react-redux'
import Layout from '$shared/components/Layout/Core'
import Label from '$ui/Label'
import { SM, MEDIUM } from '$shared/utils/styled'
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
import { CoreHelmet } from '$shared/components/Helmet'

import Storage from './shared/Storage'
import useStreamPath from './shared/useStreamPath'
import {
    StreamIdFormGroup,
    FormGroup,
    Field,
    Text,
} from './shared/FormGroup'

const FieldGroup = styled(FormGroup)`
    @media (min-width: ${SM}px) {
        & + & {
            margin-top: 16px;
        }

        & + & ${Label} {
            display: none;
        }
    }
`

const HistoricalStorage = styled.div`
    display: flex;

    @media (min-width: ${SM}px) {
        width: 320px;
    }

    ${Text}:first-child {
        width: 80px;
    }

    ${Text} + ${Text} {
        flex-grow: 1;
    }
`

const StreamPartitions = styled.div`
    width: 136px;
`

const UnstyledView = ({ stream, currentUser, ...props }) => {
    const { copy, isCopied } = useCopy()
    const { amount: storagePeriod, unit } = convertFromStorageDays(stream.storageDays)
    const { truncatedDomain: domain, pathname } = useStreamPath(stream.id)

    const { shortDescription, longDescription } = getSecurityLevelConfig(stream)

    const dispatch = useDispatch()

    const onBack = useCallback(() => {
        scrollTop()

        if (currentUser) {
            dispatch(push(routes.streams.index()))
        } else {
            dispatch(push(routes.root()))
        }
    }, [dispatch, currentUser])

    const snippets = useMemo(() => (
        subscribeSnippets({
            id: stream.id,
        })
    ), [stream.id])

    const onCopy = useCallback((id) => {
        copy(id)

        Notification.push({
            title: I18n.t('notifications.streamIdCopied'),
            icon: NotificationIcon.CHECKMARK,
        })
    }, [copy])

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
                />
            )}
        >
            <CoreHelmet title={stream.id} />
            <TOCPage title={I18n.t('userpages.streams.edit.details.pageTitle.readOnlyStream')}>
                <TOCSection
                    id="details"
                    title={I18n.t('userpages.streams.edit.details.nav.details')}
                >
                    <StreamIdFormGroup hasDomain={!!domain} data-test-hook="StreamId">
                        {!!domain && (
                            <React.Fragment>
                                <Field
                                    label={I18n.t('userpages.streams.edit.details.domain.label')}
                                >
                                    <Text
                                        value={domain}
                                        readOnly
                                        disabled
                                        name="domain"
                                    />
                                </Field>
                                <Field narrow>
                                    /
                                </Field>
                                <Field
                                    label={I18n.t('userpages.streams.edit.details.pathname.label')}
                                >
                                    <Text
                                        value={pathname}
                                        readOnly
                                        disabled
                                        name="pathname"
                                    />
                                </Field>
                            </React.Fragment>
                        )}
                        {!domain && (
                            <Field
                                label={I18n.t('userpages.streams.edit.details.streamId')}
                            >
                                <Text
                                    value={pathname}
                                    readOnly
                                    disabled
                                    name="streamId"
                                />
                            </Field>
                        )}
                        <Field
                            narrow
                        >
                            <Button kind="secondary" onClick={() => onCopy(stream.id)}>
                                <Translate value={`userpages.streams.edit.details.${isCopied ? 'streamIdCopied' : 'copyStreamId'}`} />
                            </Button>
                        </Field>
                    </StreamIdFormGroup>
                    {!!stream.description && (
                        <FormGroup>
                            <Field label={I18n.t('userpages.streams.edit.details.description.label')}>
                                <Text
                                    value={stream.description || ''}
                                    readOnly
                                    disabled
                                    name="description"
                                />
                            </Field>
                        </FormGroup>
                    )}
                </TOCSection>
                <TOCSection
                    id="snippets"
                    title={I18n.t('general.codeSnippets')}
                >
                    <CodeSnippets
                        items={[
                            ['javascript', 'Js', snippets.javascript],
                            ['java', 'Java', snippets.java],
                        ]}
                        title="Subscribe"
                    />
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
                {!!stream.config.fields.length && (
                    <TOCSection
                        id="fields"
                        title={I18n.t('userpages.streams.edit.details.nav.fields')}
                    >
                        {stream.config.fields.map(({ name, type, id }) => (
                            <FieldGroup key={name}>
                                <Field label={I18n.t('userpages.streams.edit.configure.fieldName')}>
                                    <Text id={`name-${id}`} disabled value={name} readOnly />
                                </Field>
                                <Field label={I18n.t('userpages.streams.edit.configure.dataType')} narrow>
                                    <Text
                                        id={`type-${id}`}
                                        disabled
                                        value={I18n.t(`userpages.streams.fieldTypes.${type}`)}
                                        readOnly
                                    />
                                </Field>
                            </FieldGroup>
                        ))}
                    </TOCSection>
                )}
                <TOCSection
                    id="preview"
                    title={I18n.t('userpages.streams.edit.details.nav.preview')}
                >
                    <Preview stream={stream} showDescription={false} />
                </TOCSection>
                <TOCSection
                    id="historicalData"
                    title={I18n.t('userpages.streams.edit.details.nav.historicalData')}
                >
                    <Storage streamId={stream.id} disabled />
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

const View = styled(UnstyledView)`
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

export default View
