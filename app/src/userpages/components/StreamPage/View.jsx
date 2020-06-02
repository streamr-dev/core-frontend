import React, { Children, useCallback, useState, useRef } from 'react'
import styled, { css } from 'styled-components'
import { Translate, I18n } from 'react-redux-i18n'
import { push } from 'connected-react-router'
import { useDispatch } from 'react-redux'
import { CodeSnippet, Tabs } from '@streamr/streamr-layout'
import Layout from '$shared/components/Layout/Core'
import Label from '$ui/Label'
import UnstyledText from '$ui/Text'
import { SM, MD, LG, XL, MEDIUM } from '$shared/utils/styled'
import TOCPage, { Title } from '$shared/components/TOCPage'
import TOCSection from '$shared/components/TOCPage/TOCSection'
import BackButton from '$shared/components/BackButton'
import Toolbar from '$shared/components/Toolbar'
import { getRange } from '$userpages/modules/userPageStreams/actions'
import useIsMounted from '$shared/hooks/useIsMounted'
import useOnMount from '$shared/hooks/useOnMount'
import Preview from './Edit/PreviewView'
import { getSecurityLevelConfig } from './Edit/SecurityView'
import { convertFromStorageDays } from './Edit/HistoryView'
import routes from '$routes'
import { scrollTop } from '$shared/hooks/useScrollToTop'
import Button from '$shared/components/Button'
import useCopy from '$shared/hooks/useCopy'

const Details = styled.div`
    border: solid #e7e7e7;
    border-width: 1px 0;
    padding: 24px 0;

    & + & {
        border-top: 0;
    }

    @media (min-width: ${MD}px) {
        display: flex;
        justify-content: space-between;
    }
`

const CustomLabel = styled(Label)`
    margin-bottom: 1.25em;
`

const UnstyledDetail = ({ title, children, ...props }) => (
    <div {...props}>
        <CustomLabel>{title}</CustomLabel>
        <p>{children}</p>
    </div>
)

const Detail = styled(UnstyledDetail)`
    padding-top: 2px;

    & + & {
        border-top: 1px solid #e7e7e7;
        margin-top: 24px;
        padding-top: 26px;
    }

    @media (min-width: ${MD}px) {
        & + & {
            border: 0;
            margin: 0;
            padding-top: 2px;
            width: 144px;
        }
    }
`

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

const FieldControls = styled.div`
    ${({ multiple }) => !!multiple && css`
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
        <FieldControls multiple={Children.count(children) > 1}>
            {children}
        </FieldControls>
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

const UnstyledView = ({ stream, currentUser, ...props }) => {
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

    const { copy } = useCopy()

    const [lang, setLang] = useState('javascript')

    const codeRef = useRef({})

    const onCopyClick = useCallback(() => {
        copy(codeRef.current[lang])
    }, [copy, lang])

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
            <TOCPage title={stream.name}>
                <TOCSection
                    id="details"
                    linkTitle={I18n.t('userpages.streams.edit.details.nav.details')}
                >
                    {!!stream.description && (
                        <Details>
                            <Detail title={I18n.t('userpages.streams.edit.details.description')}>
                                {stream.description}
                            </Detail>
                        </Details>
                    )}
                    <Details>
                        <Detail title={I18n.t('userpages.streams.edit.details.streamId')}>
                            {stream.id}
                        </Detail>
                        <Detail title={I18n.t('userpages.streams.partitionsLabel')}>
                            {stream.partitions}
                        </Detail>
                    </Details>
                </TOCSection>
                <TOCSection
                    id="cs"
                    title="Snippets"
                >
                    <h4>
                        Subscribe
                    </h4>
                    <Tabs
                        footer={
                            <Button kind="secondary" onClick={onCopyClick}>
                                Copy
                            </Button>
                        }
                        onSelect={setLang}
                        selected={lang}
                    >
                        <Tabs.Item label="Js" value="javascript">
                            <CodeSnippet language="javascript" codeRef={codeRef}>
                                {`
                                    const StreamrClient = require('streamr-client')

                                    const streamr = new StreamrClient({
                                        auth: {
                                            apiKey: 'YOUR-API-KEY',
                                        },
                                    })

                                    // Subscribe to a stream
                                    streamr.subscribe({
                                        stream: '${stream.id}'
                                    },
                                    (message, metadata) => {
                                        // Do something with the message here!
                                        console.log(message)
                                    }
                                `}
                            </CodeSnippet>
                        </Tabs.Item>
                        <Tabs.Item value="java">
                            <CodeSnippet language="java" codeRef={codeRef}>
                                {`
                                    StreamrClient client = new StreamrClient();
                                    Stream stream = client.getStream("${stream.id}");

                                    Subscription sub = client.subscribe(stream, new MessageHandler() {
                                        @Override
                                        void onMessage(Subscription s, StreamMessage message) {
                                            // Here you can react to the latest message
                                            System.out.println(message.getPayload().toString());
                                        }
                                    });
                                `}
                            </CodeSnippet>
                        </Tabs.Item>
                    </Tabs>
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
                        </Field>
                    </FormGroup>
                </TOCSection>
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

    h4 {
        font-size: 18px;
        font-weight: ${MEDIUM};
        line-height: 1;
        margin: 0 0 1em;
        padding: 0;
    }

    ${Text} + * {
        margin-left: 16px;
    }

    ${Title} {
        display: block;
    }

    ${TOCSection}:first-child {
        padding-top: 24px;

        @media (min-width: ${LG}px) {
            padding-top: 72px;
        }
    }
`

export default View
