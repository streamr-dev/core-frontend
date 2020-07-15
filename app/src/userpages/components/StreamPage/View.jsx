import React, { useCallback, useState, useMemo } from 'react'
import styled, { css } from 'styled-components'
import { Translate, I18n } from 'react-redux-i18n'
import { push } from 'connected-react-router'
import { useDispatch } from 'react-redux'
import Layout from '$shared/components/Layout/Core'
import Label from '$ui/Label'
import UnstyledText from '$ui/Text'
import { SM, XL, MEDIUM } from '$shared/utils/styled'
import TOCPage, { Title } from '$shared/components/TOCPage'
import TOCSection from '$shared/components/TOCPage/TOCSection'
import BackButton from '$shared/components/BackButton'
import Toolbar from '$shared/components/Toolbar'
import { getRange } from '$userpages/modules/userPageStreams/actions'
import useIsMounted from '$shared/hooks/useIsMounted'
import useOnMount from '$shared/hooks/useOnMount'
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

const Text = styled(UnstyledText)`
    &[disabled] {
        background-color: #efefef;
        color: #525252;
        opacity: 1;
    }

    ${({ centered }) => !!centered && css`
        text-align: center;
    `}
`

const UnstyledField = ({
    label,
    children,
    narrow,
    desktopOnly,
    ...props
}) => (
    <div {...props}>
        <Label>{label}&zwnj;</Label>
        {children}
    </div>
)

const Field = styled(UnstyledField)`
    flex-grow: 1;

    & + & {
        margin-top: 24px;
    }

    ${({ narrow }) => !!narrow && css`
        flex-grow: 0;
        width: 128px;
    `}

    @media (min-width: ${SM}px) {
        & + & {
            margin: 0 0 0 16px;
        }
    }

    ${({ desktopOnly }) => !!desktopOnly && css`
        display: none;

        @media (min-width: ${XL}px) {
            display: block;
        }
    `}
`

const FormGroup = styled.div`
    & + & {
        margin-top: 32px;
    }

    @media (min-width: ${SM}px) {
        display: flex;
        justify-content: space-between;
    }

    ${Text} {
        width: 100%;
    }
`

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

const StreamId = styled.div`
    display: flex;

    & > :first-child {
        flex-grow: 1;
    }

    & > :last-child {
        min-width: 72px;
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

const StyledButton = styled(Button)`
    && {
        padding: 0;
    }
`

const StreamPartitions = styled.div`
    width: 136px;
`

const UnstyledView = ({ stream, currentUser, ...props }) => {
    const { copy, isCopied } = useCopy()
    const { amount: storagePeriod, unit } = convertFromStorageDays(stream.storageDays)

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

    const [range, setRange] = useState({})

    const isMounted = useIsMounted()

    useOnMount(async () => {
        try {
            const r = await dispatch(getRange(stream.id))

            if (isMounted() && r) {
                setRange(r)
            }
        } catch (e) { /**/ }
    })

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
            hideNavOnDesktop
            navComponent={(
                <Toolbar
                    altMobileLayout
                    left={(
                        <BackButton onBack={onBack} />
                    )}
                />
            )}
        >
            <TOCPage title={I18n.t('userpages.streams.edit.details.pageTitle.readOnlyStream')}>
                <TOCSection
                    id="details"
                    title={I18n.t('userpages.streams.edit.details.nav.details')}
                >
                    <FormGroup>
                        <Field label={I18n.t('userpages.streams.edit.details.name')}>
                            <Text
                                value={stream.name || ''}
                                readOnly
                                disabled
                                name="name"
                            />
                        </Field>
                        <Field narrow desktopOnly />
                    </FormGroup>
                    {!!stream.description && (
                        <FormGroup>
                            <Field label={I18n.t('userpages.streams.edit.details.description')}>
                                <Text
                                    value={stream.description || ''}
                                    readOnly
                                    disabled
                                    name="description"
                                />
                            </Field>
                            <Field narrow desktopOnly />
                        </FormGroup>
                    )}
                    <FormGroup>
                        <Field label={I18n.t('userpages.streams.edit.details.streamId')}>
                            <StreamId>
                                <Text
                                    value={stream.id || ''}
                                    readOnly
                                    disabled
                                    name="streamId"
                                />
                                <StyledButton kind="secondary" onClick={() => onCopy(stream.id)}>
                                    <Translate value={`userpages.keyField.${isCopied ? 'copied' : 'copy'}`} />
                                </StyledButton>
                            </StreamId>
                        </Field>
                        <Field narrow desktopOnly />
                    </FormGroup>
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
                    <Preview currentUser={currentUser} stream={stream} />
                </TOCSection>
                <TOCSection
                    id="historicalData"
                    title={I18n.t('userpages.streams.edit.details.nav.historicalData')}
                >
                    <FormGroup>
                        <Field label={I18n.t('userpages.streams.edit.history.storedEvents')}>
                            <Text
                                value={range.beginDate && range.endDate ? (
                                    I18n.t('userpages.streams.edit.history.events', {
                                        start: new Date(range.beginDate).toLocaleDateString(),
                                        end: new Date(range.endDate).toLocaleDateString(),
                                    })
                                ) : (
                                    I18n.t('userpages.streams.edit.history.noEvents')
                                )}
                                readOnly
                                disabled
                                name="range"
                            />
                        </Field>
                        <Field narrow desktopOnly />
                    </FormGroup>
                    <FormGroup>
                        <Field label={I18n.t('userpages.streams.edit.history.deleteEvents')}>
                            <Text
                                value="Select date"
                                readOnly
                                disabled
                            />
                        </Field>
                        <Field narrow desktopOnly />
                    </FormGroup>
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
        margin: 0;
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
