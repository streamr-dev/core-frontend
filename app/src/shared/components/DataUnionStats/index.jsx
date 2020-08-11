import React from 'react'
import Skeleton from 'react-loading-skeleton'
import { I18n } from 'react-redux-i18n'
import styled from 'styled-components'

import { MD, XL } from '$shared/utils/styled'

export const Header = styled.div`
    font-family: var(--sans);
    font-size: 12px;
    letter-spacing: 0;
    line-height: 24px;
    white-space: nowrap;
    margin-bottom: 0.5rem;
`

const ValueRoot = styled.div`
    & .react-loading-skeleton {
      height: 32px;
    }
`

const ValueHolder = styled.div`
    font-family: var(--sans);
    font-weight: 200;
    font-size: 32px;
    line-height: 42px;
    letter-spacing: -0.67px;
    color: #323232;
    white-space: nowrap;
`

const ValueUnit = styled.span`
    font-family: var(--sans);
    font-size: 12px;
    font-weight: var(--regular);
    line-height: 42px;
    letter-spacing: 0;
`

export const Value = ({
    id,
    value,
    unit,
    loading,
    className,
}) => (
    <ValueRoot className={className}>
        <Header>{id ? I18n.t(`productPage.stats.${id}`) : ''}</Header>
        {!loading ? (
            <ValueHolder>
                {value}
                {unit && (
                    <ValueUnit> {unit}</ValueUnit>
                )}
            </ValueHolder>
        ) : <Skeleton />}
    </ValueRoot>
)

const ValuesRoot = styled.div`
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-column-gap: 3em;
    grid-row-gap: 2em;

    @media (min-width: ${MD}px) {
        grid-template-columns: 1fr 1fr 1fr;
        grid-column-gap: 1em;
    }

    @media (min-width: ${XL}px) {
        grid-template-columns: repeat(6, 1fr);
        grid-column-gap: 1em;
    }
`

const Values = ({ stats, className }) => (
    <ValuesRoot className={className}>
        {stats.map((stat) => (
            <Value {...stat} key={stat.id} />
        ))}
    </ValuesRoot>
)

Values.Header = Header
Values.Value = Value

export default Values
