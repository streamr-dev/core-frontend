import React, { ReactNode } from 'react'
import styled from 'styled-components'
import ColoredBox from '~/components/ColoredBox'
import { COLORS, MEDIUM, TABLET } from '~/shared/utils/styled'

export default function NetworkPageSegment({
    bodyComponent: BodyComponent = Body,
    children,
    foot = false,
    headerComponent: HeaderComponent = Header,
    rootComponent: RootComponent = Root,
    title = 'Title',
}: {
    bodyComponent?: typeof Body
    children?: ReactNode
    foot?: boolean
    headerComponent?: typeof Header
    rootComponent?: typeof Root
    title?: ReactNode
}) {
    return (
        <RootComponent>
            <ColoredBox>
                <HeaderComponent>
                    <Pad>{typeof title === 'string' ? <h2>{title}</h2> : title}</Pad>
                </HeaderComponent>
                <BodyComponent>{children}</BodyComponent>
                {foot ? <Foot /> : <></>}
            </ColoredBox>
        </RootComponent>
    )
}

const Root = styled.div``

const Body = styled.div`
    border-top: 1px solid #efefef;
`

const Foot = styled.div`
    border-top: 1px solid #efefef;
    height: 32px;
    margin-top: -1px;
`

const Header = styled.div`
    h2 {
        color: ${COLORS.primary};
        font-size: 20px;
        font-weight: ${MEDIUM};
        line-height: 30px;
        margin: 0;
    }
`

export const Pad = styled.div`
    padding: 20px 24px;

    @media ${TABLET} {
        padding: 32px 40px;
    }
`

export const SegmentGrid = styled.div`
    display: grid;
    grid-template-columns: minmax(0, 1fr);
    gap: 24px;
    margin-top: 64px;

    * + &,
    & & {
        margin-top: 0;
    }
`

interface TitleBarProps {
    children: ReactNode
    label?: ReactNode
    aux?: ReactNode
}

export function TitleBar({ children, label, aux = <></> }: TitleBarProps) {
    return (
        <TitleBarRoot>
            <Lhs>
                <h2>{children}</h2>
                {label != null && <TitleBarLabel>{label}</TitleBarLabel>}
            </Lhs>
            {<Rhs>{aux}</Rhs>}
        </TitleBarRoot>
    )
}

const TitleBarRoot = styled.div`
    align-items: center;
    display: flex;
    gap: 8px;
    height: 30px;
`

const Lhs = styled.div`
    align-items: center;
    display: flex;
    flex-grow: 1;
    gap: 8px;
`

const TitleBarLabel = styled.div`
    color: #a3a3a3;
    display: flex;
    font-size: 20px;
    font-style: normal;
    font-weight: 500;
    letter-spacing: 0.2px;
    line-height: 30px;
`

const Rhs = styled.div`
    align-items: center;
    display: flex;
    gap: 8px;

    :empty {
        display: none;
    }
`
