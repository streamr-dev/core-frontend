// @flow

import React, { type Node } from 'react'
import ScrollableAnchor from 'react-scrollable-anchor'
import styled, { css } from 'styled-components'
import { REGULAR, MD, LG } from '$shared/utils/styled'

type Props = {
    id: string,
    title: string,
    children?: Node,
    customStyled?: boolean,
}

const Section = styled.section`
    /* Use padding instead of margin so that scrolling to sections with anchor links looks nicer */
    padding-top: 1rem;
    padding-bottom: 5.5rem;

    ${({ hideOnTablet }) => !!hideOnTablet && css`
        @media (max-width: ${LG - 1}px) {
            display: none;
        }
    `}
`

const Title = styled.h3`
    color: #323232;
    font-size: 1.5rem;
    font-weight: ${REGULAR};
    text-align: left;
    letter-spacing: 0;
    line-height: 1.5rem;
    margin-bottom: 2rem;
    padding-bottom: 1.2rem;
    border-bottom: 1px solid #e7e7e7;

    @media (min-width: ${MD}px) {
        margin-bottom: 2.6rem;
    }
`

export const TOCSection = ({ id, title, children, customStyled }: Props) => (
    <ScrollableAnchor id={id}>
        <Section hideOnTablet={customStyled}>
            <Title>
                {title}
            </Title>
            {children}
        </Section>
    </ScrollableAnchor>
)

export default TOCSection
