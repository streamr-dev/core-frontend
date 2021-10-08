import React, { useCallback, useMemo } from 'react'
import styled from 'styled-components'
import startCase from 'lodash/startCase'
import { useHistory } from 'react-router-dom'

import Layout from '$shared/components/Layout/Core'
import Label from '$ui/Label'
import { SM, MEDIUM } from '$shared/utils/styled'
import TOCPage, { Title } from '$shared/components/TOCPage'
import TOCSection from '$shared/components/TOCPage/TOCSection'
import BackButton from '$shared/components/BackButton'
import Toolbar from '$shared/components/Toolbar'
import useCopy from '$shared/hooks/useCopy'
import { scrollTop } from '$shared/hooks/useScrollToTop'
import CodeSnippets from '$shared/components/CodeSnippets'
import { subscribeSnippets } from '$utils/streamSnippets'
import Button from '$shared/components/Button'
import Notification from '$shared/utils/Notification'
import { NotificationIcon } from '$shared/utils/constants'
import StatusLabel from '$shared/components/StatusLabel'
import { CoreHelmet } from '$shared/components/Helmet'
import { fieldTypes } from '$userpages/modules/userPageStreams/selectors'
import routes from '$routes'
import { convertFromStorageDays } from './Edit/HistoryView'
import { getSecurityLevelConfig } from './Edit/SecurityView'
import Preview from './Edit/PreviewView'

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

    const history = useHistory()

    const onBack = useCallback(() => {
        scrollTop()

        if (currentUser) {
            history.push(routes.streams.index())
        } else {
            history.push(routes.root())
        }
    }, [history, currentUser])

    const snippets = useMemo(() => (
        subscribeSnippets({
            id: stream.id,
        })
    ), [stream.id])

    const onCopy = useCallback((id) => {
        copy(id)

        Notification.push({
            title: 'Stream ID copied',
            icon: NotificationIcon.CHECKMARK,
        })
    }, [copy])

    return (
        <Layout
            {...props}
            nav={null}
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
            <TOCPage title="Read only stream">
                <TOCSection
                    id="details"
                    title="Details"
                >
                    <StreamIdFormGroup hasDomain={!!domain} data-test-hook="StreamId">
                        {!!domain && (
                            <React.Fragment>
                                <Field
                                    label="Domain"
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
                                    label="Path name"
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
                                label="Stream ID"
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
                                {!isCopied && 'Copy Stream ID'}
                                {!!isCopied && 'Copied!'}
                            </Button>
                        </Field>
                    </StreamIdFormGroup>
                    {!!stream.description && (
                        <FormGroup>
                            <Field label="Description">
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
                    title="Code Snippets"
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
                    title="Security"
                >
                    <p>
                        <strong>{shortDescription}</strong>
                        {' '}
                        {longDescription}
                    </p>
                </TOCSection>
                {!!stream.config.fields.length && (
                    <TOCSection
                        id="fields"
                        title="Fields"
                    >
                        {stream.config.fields.map(({ name, type, id }) => (
                            <FieldGroup key={name}>
                                <Field label="Field name">
                                    <Text id={`name-${id}`} disabled value={name} readOnly />
                                </Field>
                                <Field label="Data type" narrow>
                                    <Text
                                        id={`type-${id}`}
                                        disabled
                                        value={fieldTypes[type]}
                                        readOnly
                                    />
                                </Field>
                            </FieldGroup>
                        ))}
                    </TOCSection>
                )}
                <TOCSection
                    id="preview"
                    title="Preview"
                >
                    <Preview stream={stream} showDescription={false} />
                </TOCSection>
                <TOCSection
                    id="historicalData"
                    title="Data storage"
                >
                    <Storage streamId={stream.id} disabled />
                    <FormGroup>
                        <Field label="Store historical data for">
                            <HistoricalStorage>
                                <Text
                                    value={storagePeriod}
                                    readOnly
                                    disabled
                                    centered
                                />
                                <Text
                                    value={startCase(`${unit.replace(/s$/, '')}${storagePeriod === 1 ? '' : 's'}`)}
                                    readOnly
                                    disabled
                                />
                            </HistoricalStorage>
                        </Field>
                    </FormGroup>
                </TOCSection>
                <TOCPage.Section
                    id="stream-partitions"
                    title="Stream partitions"
                    linkTitle="Partitions"
                    status={(<StatusLabel.Advanced />)}
                >
                    <FormGroup>
                        <Field label="Partitions">
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
