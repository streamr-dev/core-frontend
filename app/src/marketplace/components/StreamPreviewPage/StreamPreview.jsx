import React from 'react'
import styled, { css } from 'styled-components'

import Button from '$shared/components/Button'
import SvgIcon from '$shared/components/SvgIcon'
import { MD, LG } from '$shared/utils/styled'

const Container = styled.div`
    position: relative;
    height: 100%;
`

const HeaderContainer = styled.div`
    display: fixed;
    left: 0;
    top: 0;
    right: 0;
    height: 200px;
    border: 1px solid #EFEFEF;
    background-color: #FDFDFD;
`

const Header = styled.div`
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: 65px 24px 16px 24px;

    @media (min-width: ${MD}px) {
        padding-left: 40px;
    }

    @media (min-width: ${LG}px) {
        padding-left: 104px;
    }
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

    @media (min-width: ${MD}px) {
        min-width: 224px;
    }

    & + & {
        margin-left: 32px;
    }
`

const SelectorTitle = styled.div`
    font-weight: var(--medium);
    line-height: 24px;
    min-width: 70px;

    @media (min-width: ${LG})px {
        flex: 1;
        min-width: 85px;
    }
`

const SelectorIcon = styled.button`
    width: 32px;
    height: 32px;
    text-align: center;
    position: relative;
    border: none;
    background: none;
    appearance: none;
    border-radius: 2px;

    &:hover,
    &:active,
    &:focus {
        background-color: #EFEFEF;
    }

    svg {
        width: 8px;
        height: 14px;
        position: absolute;
        top: 9px;
        ${({ back }) => !!back && css`
            left: 11px;
        `}
        ${({ forward }) => !!forward && css`
            left: 13px;
        `}
    }
`

const SelectorPages = styled.div`
    min-width: 64px;
    text-align: center;
    padding: 0 0.5rem;

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
    position: fixed;
    left: 0;
    top: 257px;
    bottom: 0;
    width: calc(100% - 130px);
    overflow-y: scroll;

    @media (min-width: ${MD}px) {
        width: calc(100% - 504px);
    }
`

const Inspector = styled.div`
    position: fixed;
    right: 0;
    top: 257px;
    bottom: 0;
    background-color: #FAFAFA;
    border-left: 1px solid #EFEFEF;
    width: 504px;

    @media (max-width: ${MD}px) {
        left: 100%;
        right: auto;
        transform: translateX(-130px);
    }
`

const HeaderItem = styled.div`
    line-height: 56px;
    padding: 0 24px;
    font-size: 14px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    font-weight: var(--medium);
`

const Columns = styled.div`
    position: fixed;
    top: 200px;
    width: 100%;
    border-bottom: 1px solid #EFEFEF;
    height: 57px;
`

const TimestampHeader = styled(HeaderItem)`
    position: fixed;
    top: 200px;
    left: 0;

    @media (min-width: ${LG}px) {
        left: 80px;
    }
`
const DataHeader = styled(HeaderItem)`
    position: fixed;
    top: 200px;
    left: 256px;

    @media (max-width: ${LG}px) {
        display: none;
    }

    @media (min-width: ${LG}px) {
        left: 336px;
    }
`

const InspectorHeader = styled(HeaderItem)`
    position: fixed;
    top: 200px;
    right: 0;
    width: 504px;
    background-color: #FAFAFA;
    border-left: 1px solid #EFEFEF;

    @media (max-width: ${MD}px) {
        left: 100%;
        right: auto;
        transform: translateX(-130px);
    }
`

const TableItem = styled.div`
    line-height: 56px;
    padding: 0 24px;
    font-size: 14px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
`

const TableRow = styled.div`
    border-bottom: 1px solid #EFEFEF;
    display: grid;
    grid-template-columns: 1fr;
`

const DataTable = styled.div`
    @media (min-width: ${LG}px) {
        margin: 0 80px;
    }

    ${TableRow} {
        cursor: pointer;

        &:hover {
            background-color: #FAFAFA;
        }

        @media (max-width: ${LG}px) {
            ${TableItem}:last-child {
                display: none;
            }
        }

        @media (min-width: ${LG}px) {
            grid-template-columns: 256px 1fr;
        }
    }
`

const InspectorTable = styled.div`
    @media (min-width: ${MD}px) {
        margin: 0 40px;
    }

    ${TableRow} {
        ${TableItem}:first-child {
            color: #A3A3A3;
            text-transform: uppercase;
        }

        @media (max-width: ${LG}px) {
            ${TableItem}:last-child {
                display: block;
            }
        }

        grid-template-columns: 164px 1fr;
    }
`

const Selector = ({ title, length, current, ...rest }) => (
    <SelectorRoot {...rest}>
        <SelectorTitle>{title}</SelectorTitle>
        <SelectorIcon back>
            <SvgIcon name="back" />
        </SelectorIcon>
        <SelectorPages>
            <strong>{current}</strong> of <strong>{length}</strong>
        </SelectorPages>
        <SelectorIcon forward>
            <SvgIcon name="forward" />
        </SelectorIcon>
    </SelectorRoot>
)

const streamData = Array(20).fill({
    timestamp: '2020-01-21 14:31:34.166',
    data: {
        NO2: 14,
        CO2: 405,
        PM: 2.5,
        temp: 18.5,
        pressure: 1029.1,
    },
})

const StreamPreview = () => (
    <Container>
        <HeaderContainer>
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
        </HeaderContainer>
        <Columns>
            <TimestampHeader>Timestamp</TimestampHeader>
            <DataHeader>Data</DataHeader>
            <InspectorHeader>Inspector</InspectorHeader>
        </Columns>
        <StreamData>
            <DataTable>
                {streamData.map(({ timestamp, data }, index) => (
                    /* eslint-disable-next-line react/no-array-index-key */
                    <TableRow key={index}>
                        <TableItem>{timestamp}</TableItem>
                        <TableItem>
                            {JSON.stringify(data)}
                        </TableItem>
                    </TableRow>
                ))}
            </DataTable>
        </StreamData>
        <Inspector>
            <InspectorTable>
                <TableRow>
                    <TableItem>Security</TableItem>
                    <TableItem>-</TableItem>
                </TableRow>
                <TableRow>
                    <TableItem>Timestamp</TableItem>
                    <TableItem>{streamData[0].timestamp}</TableItem>
                </TableRow>
                {Object.keys(streamData[0].data).map((key) => (
                    <TableRow key={key}>
                        <TableItem>{key}</TableItem>
                        <TableItem>
                            {JSON.stringify(streamData[0].data[key])}
                        </TableItem>
                    </TableRow>
                ))}
            </InspectorTable>
        </Inspector>
    </Container>
)

export default StreamPreview
