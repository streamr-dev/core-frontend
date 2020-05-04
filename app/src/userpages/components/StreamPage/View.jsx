// @flow

import React, { Children, useCallback } from 'react'
import styled, { css } from 'styled-components'
import { Translate, I18n } from 'react-redux-i18n'
import { push } from 'connected-react-router'
import { useDispatch } from 'react-redux'
import Layout from '$shared/components/Layout/Core'
import Label from '$ui/Label'
import UnstyledText from '$ui/Text'
import { SM, MD, LG, XL, MEDIUM } from '$shared/utils/styled'
import TOCPage, { Title } from '$shared/components/TOCPage'
import TOCSection from '$shared/components/TOCPage/TOCSection'
import BackButton from '$shared/components/BackButton'
import Toolbar from '$shared/components/Toolbar'
import Preview, { Controls } from './Edit/PreviewView'
import { getSecurityLevelConfig } from './Edit/SecurityView'
import { convertFromStorageDays } from './Edit/HistoryView'
import routes from '$routes'

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

const UnstyledDetail = ({ title, children, ...props }: any) => (
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
}: any) => (
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

const UnstyledView = ({ stream, currentUser, ...props }: any) => {
    const { amount: storagePeriod, unit } = convertFromStorageDays(stream.storageDays)

    const { shortDescription, longDescription } = getSecurityLevelConfig(stream)

    const dispatch = useDispatch()

    const onBack = useCallback(() => {
        dispatch(push(routes.streams()))
    }, [dispatch])

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
                <TOCSection id="details" linkTitle="Details">
                    <Details>
                        <Detail title="Description">
                            {stream.description}
                        </Detail>
                    </Details>
                    <Details>
                        <Detail title="Stream ID">
                            {stream.id}
                        </Detail>
                        <Detail title="Partitions">
                            {stream.partitions}
                        </Detail>
                    </Details>
                </TOCSection>
                <TOCSection id="preview" title="Preview">
                    <Preview currentUser={currentUser} stream={stream} />
                </TOCSection>
                <TOCSection id="security" title="Security">
                    <p>
                        <Translate value={shortDescription} tag="strong" />
                        {' '}
                        <Translate value={longDescription} />
                    </p>
                </TOCSection>
                <TOCSection id="fields" title="Fields">
                    {stream.config.fields.map(({ name, type }) => (
                        <FieldGroup key={name}>
                            <Field label="Field name">
                                <Text disabled value={name} readOnly />
                            </Field>
                            <Field label="Data type" narrow>
                                <Text
                                    disabled
                                    value={I18n.t(`userpages.streams.fieldTypes.${type}`)}
                                    readOnly
                                />
                            </Field>
                        </FieldGroup>
                    ))}
                </TOCSection>
                <TOCSection id="historicalData" title="Historical Data">
                    <FormGroup>
                        <Field label="Stored data">
                            <Text
                                value="No stored data. Drop a CSV file here to load some"
                                readOnly
                                disabled
                            />
                        </Field>
                        <Field narrow desktopOnly />
                    </FormGroup>
                    <FormGroup>
                        <Field label="Delete data up to and including">
                            <Text value="Select date" readOnly disabled />
                        </Field>
                        <Field narrow desktopOnly />
                    </FormGroup>
                    <FormGroup>
                        <Field label="Period to retain historical data until auto-removal">
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

    ${Controls} {
        border: solid #ebebeb;
        border-width: 0 1px 1px;
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
