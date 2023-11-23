import React, { ReactNode } from 'react'
import styled from 'styled-components'
import { REGULAR, COLORS } from '~/shared/utils/styled'

const Root = styled.div`
    margin-bottom: 60px;
`

const Title = styled.h3`
    color: ${COLORS.primary};
    font-size: 24px;
    font-weight: ${REGULAR};
    letter-spacing: 0;
    line-height: 150%;
    margin-bottom: 16px;
`

const TitleWrapper = styled.div`
    display: inline-flex;
    align-items: center;
    width: 100%;
`

const TitleText = styled.span`
    margin-right: 16px;
`

interface Props {
    title: string
    status?: ReactNode
    children: ReactNode
}

export default function Section({ title, status, children, ...props }: Props) {
    return (
        <Root {...props}>
            <Title>
                <TitleWrapper>
                    <TitleText>{title}</TitleText>
                    {!!status && <span>{status}</span>}
                </TitleWrapper>
            </Title>
            {children}
        </Root>
    )
}
