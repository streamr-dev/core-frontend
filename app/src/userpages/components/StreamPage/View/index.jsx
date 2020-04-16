// @flow

import React from 'react'
import styled, { css } from 'styled-components'
import { Translate, I18n } from 'react-redux-i18n'
import Layout from '$shared/components/Layout/Core'
import Label from '$ui/Label'
import UnstyledText from '$ui/Text'
import { REGULAR, MEDIUM } from '$shared/utils/styled'
import Preview, { Controls } from '../Edit/PreviewView'
import { getSecurityLevelConfig } from '../Edit/SecurityView'
import { convertFromStorageDays } from '../Edit/HistoryView'

const BusStop = () => null

const Body = styled.div`
    margin: 0 auto;
    padding-bottom: 104px;
    width: 680px;

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
`

const Title = styled.h1`
    font-size: 36px;
    font-weight: ${REGULAR};
    margin: 0 0 64px;
`

const Details = styled.div`
    border: solid #e7e7e7;
    border-width: 1px 0;
    display: flex;
    justify-content: space-between;
    padding: 24px 0;

    & + & {
        border-top: 0;
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
    & + & {
        width: 144px;
    }
`

const UnstyledSection = ({ title, children, ...props }: any) => (
    <div {...props}>
        <h2>{title}</h2>
        {children}
    </div>
)

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

const Section = styled(UnstyledSection)`
    margin-top: 104px;

    h2 {
        border-bottom: 1px solid #e7e7e7;
        font-size: 24px;
        font-weight: ${REGULAR};
        margin: 0 0 32px;
        padding-bottom: 20px;
    }

    ${Text} + * {
        margin-left: 16px;
    } 
`

const Field = styled.div`
    display: flex;

    > * {
        width: 80px;
    }

    > ${Label} + ${Label},
    > ${Text} + * {
        flex-shrink: 0;
        width: 176px;
    }

    ${({ narrow }) => !narrow && css`
        justify-content: space-between;

        > ${Text} {
            width: 100%;
        }

        > ${Label} + ${Label},
        > ${Text} + * {
            width: 128px;
        }
    `}

    & + ${Label} {
        margin-top: 32px;
    }

    ${({ head }) => !head && css`
        & + & {
            margin-top: 16px;
        }
    `}
`

const View = ({ stream, currentUser }: any) => {
    const { amount: storagePeriod, unit } = convertFromStorageDays(stream.storageDays)

    const { shortDescription, longDescription } = getSecurityLevelConfig(stream)

    return (
        <Layout>
            <Body>
                <Title>
                    {stream.name}
                </Title>
                <BusStop id="details" />
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
                <Section title="Preview">
                    <Preview currentUser={currentUser} stream={stream} />
                </Section>
                <Section title="Security">
                    <p>
                        <Translate value={shortDescription} tag="strong" />
                        {' '}
                        <Translate value={longDescription} />
                    </p>
                </Section>
                <Section title="Fields">
                    <Field head>
                        <Label>Field name</Label>
                        <Label>Data type</Label>
                    </Field>
                    {stream.config.fields.map(({ name, type }) => (
                        <Field key={name}>
                            <Text disabled value={name} readOnly />
                            <Text
                                disabled
                                value={I18n.t(`userpages.streams.fieldTypes.${type}`)}
                                readOnly
                            />
                        </Field>
                    ))}
                </Section>
                <Section title="Historical Data">
                    <Label>Stored data</Label>
                    <Field>
                        <Text
                            value="No stored data. Drop a CSV file here to load some"
                            readOnly
                            disabled
                        />
                        <div />
                    </Field>
                    <Label>Delete data up to and including</Label>
                    <Field>
                        <Text value="Select date" readOnly disabled />
                        <div />
                    </Field>
                    <Label>Period to retain historical data until auto-removal</Label>
                    <Field narrow>
                        <Text value={storagePeriod} readOnly disabled centered />
                        <Text
                            value={I18n.t(`shared.date.${unit.replace(/s$/, '')}`, {
                                count: stream.storageDays,
                            })}
                            readOnly
                            disabled
                        />
                    </Field>
                </Section>
            </Body>
        </Layout>
    )
}

export default View
