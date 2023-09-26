import React, { ReactNode } from 'react'
import styled from 'styled-components'
import { Root as TabsRoot, Item as TabsItem } from '~/shared/components/Tabs'
import { TABLET } from '~/shared/utils/styled'

export default function NetworkChartDisplay({
    children,
    periodTabs,
    sourceTabs,
}: {
    children?: ReactNode
    periodTabs: ReactNode
    sourceTabs: ReactNode
}) {
    return (
        <Root>
            <Header>
                <SetSelector>{sourceTabs}</SetSelector>
                <TimePeriodWrap>{periodTabs}</TimePeriodWrap>
            </Header>
            <Body>{children}</Body>
            <TimePeriodWrap>{periodTabs}</TimePeriodWrap>
        </Root>
    )
}

const TimePeriodWrap = styled.div``

const Root = styled.div`
    ${TabsRoot} {
        width: 100%;
    }

    ${TabsItem} {
        flex: 1;
        padding: 0;
    }

    > ${TimePeriodWrap} {
        display: block;
        margin-top: 24px;
    }

    @media ${TABLET} {
        ${TabsRoot} {
            width: max-content;
        }

        ${TabsItem} {
            flex: none;
            padding: 0 20px;
        }

        ${TimePeriodWrap} ${TabsItem} {
            padding: 0 12px;
        }

        > ${TimePeriodWrap} {
            display: none;
        }
    }
`

const Header = styled.div`
    ${TimePeriodWrap} {
        display: none;
    }

    @media ${TABLET} {
        align-items: center;
        display: flex;

        ${TimePeriodWrap} {
            display: block;
        }
    }
`

const Body = styled.div``

const SetSelector = styled.div`
    flex-grow: 1;
`
