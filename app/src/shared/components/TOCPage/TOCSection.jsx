// @flow

import React, { type Node, type Element } from 'react'
import styled, { css } from 'styled-components'
import { REGULAR, MD, LG } from '$shared/utils/styled'
import TOCBusStop from './TOCBusStop'

type Props = {
    id: string,
    title: string | Element<any>,
    children?: Node,
    onlyDesktop?: boolean,
}

const Section = styled.div`
    ${({ onlyDesktop }) => !!onlyDesktop && css`
        @media (max-width: ${LG - 1}px) {
            display: none;
        }
    `}
`

const Title = styled.h3`
    border-bottom: 1px solid #e7e7e7;
    color: #323232;
    font-size: 24px;
    font-weight: ${REGULAR};
    letter-spacing: 0;
    line-height: 1em;
    margin-bottom: 32px;
    padding-bottom: 20px;

    @media (min-width: ${MD}px) {
        margin-bottom: 32px;
    }
`

export const TOCSection = ({ id, title, children, onlyDesktop }: Props) => (
    <Section onlyDesktop={onlyDesktop}>
        <Title>
            <TOCBusStop name={id} />
            {title}
        </Title>
        {children}
    </Section>
)

export default TOCSection
