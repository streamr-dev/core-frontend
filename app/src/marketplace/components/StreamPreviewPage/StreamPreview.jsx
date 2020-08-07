import React from 'react'
import styled, { css } from 'styled-components'

import Button from '$shared/components/Button'
import SvgIcon from '$shared/components/SvgIcon'
import { MD, LG } from '$shared/utils/styled'

const Container = styled.div`
    display: grid;
    grid-template-areas: 
        "header header"
        "data inspector";
`

const Header = styled.div`
    grid-area: header;
    min-height: 200px;
    border: 1px solid #EFEFEF;
    padding: 65px 24px 16px 24px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
`

const Title = styled.div`
    font-family: var(--sans);
    font-weight: var(--regular);
    font-size: 18px;
    line-height: 30px;
    color: #323232;
`

const Description = styled.div`
    font-size: 12px;
    color: #A3A3A3;
    line-height: 30px;
`

const CurrentStream = styled.div``

const Controls = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
`

const Switchers = styled.div`
    display: flex;
`

const Buttons = styled.div``

const StyledButton = styled(Button)`
    && {
        font-size: 12px;
        height: 32px;
        min-width: 80px;
    }
`

const SelectorRoot = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    font-size: 14px;
    color: #525252;

    ${({ hideOnMobile }) => !!hideOnMobile && css`
        display: none;

        @media (min-width: ${MD}px) {
            display: flex;
        }
    `}

    @media (min-width: ${LG}) {
        min-width: 200px;
    }
`

const SelectorTitle = styled.div`
    font-weight: var(--medium);
    line-height: 24px;
    min-width: 70px;

    @media (min-width: ${LG}) {
        flex: 1;
        min-width: 85px;
    }
`

const SelectorIcon = styled.div`
    line-height: 14px;
    min-width: 32px;
    text-align: center;

    svg {
        width: 14px;
        height: 14px;
    }
`

const SelectorPages = styled.div`
    min-width: 64px;
    text-align: center;

    strong {
        font-weight: var(--medium);
    }
`

const MobileText = styled.span`
    @media (min-width: ${MD}px) {
        display: none;
    }
`

const TabletText = styled.span`
    display: none;

    @media (min-width: ${MD}px) {
        display: inline-block;
    }
`

const StreamData = styled.div`
    grid-area: data;
`

const Inspector = styled.div`
    grid-area: inspector;
`

const Selector = ({ title, length, current, ...rest }) => (
    <SelectorRoot {...rest}>
        <SelectorTitle>{title}</SelectorTitle>
        <SelectorIcon>
            <SvgIcon name="back" />
        </SelectorIcon>
        <SelectorPages>
            <strong>{current}</strong> of <strong>{length}</strong>
        </SelectorPages>
        <SelectorIcon>
            <SvgIcon name="forward" />
        </SelectorIcon>
    </SelectorRoot>
)

const StreamPreview = () => (
    <Container>
        <Header>
            <CurrentStream>
                <Title>Woodberry Down</Title>
                <Description>Data from the pollution sensor at Woodberry Down</Description>
            </CurrentStream>
            <Controls>
                <Switchers>
                    <Selector title="Streams" length={12} current={1} />
                    <Selector title="Partitions" length={146} current={112} hideOnMobile />
                </Switchers>
                <Buttons>
                    <StyledButton
                        kind="secondary"
                    >
                        <MobileText>Copy Id</MobileText>
                        <TabletText>Copy Stream ID</TabletText>
                    </StyledButton>
                </Buttons>
            </Controls>
        </Header>
        <StreamData>
            stream data
        </StreamData>
        <Inspector>
            inspector
        </Inspector>
    </Container>
)

export default StreamPreview
