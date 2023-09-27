import React, { ReactNode } from 'react'
import styled, { css } from 'styled-components'
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
                    <Pad>
                        <h2>{title}</h2>
                    </Pad>
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

    hr {
        background: #efefef;
        border: 0;
        height: 1px;
        margin: 0;
        width: 100%;
    }
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
    gap: 24px;
    margin-top: 64px;

    * + &,
    & & {
        margin-top: 0;
    }
`
