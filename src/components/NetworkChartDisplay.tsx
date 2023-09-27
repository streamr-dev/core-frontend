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
                <ChartPeriodWrap>{periodTabs}</ChartPeriodWrap>
            </Header>
            <Body>{children}</Body>
            <ChartPeriodWrap>{periodTabs}</ChartPeriodWrap>
        </Root>
    )
}

const ChartPeriodWrap = styled.div``

const Root = styled.div`
    ${TabsRoot} {
        width: 100%;
    }

    ${TabsItem} {
        flex: 1;
        padding: 0;
    }

    > ${ChartPeriodWrap} {
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

        ${ChartPeriodWrap} ${TabsItem} {
            padding: 0 12px;
        }

        > ${ChartPeriodWrap} {
            display: none;
        }
    }
`

const Header = styled.div`
    ${ChartPeriodWrap} {
        display: none;
    }

    @media ${TABLET} {
        align-items: center;
        display: flex;

        ${ChartPeriodWrap} {
            display: block;
        }
    }
`

const Body = styled.div``

const SetSelector = styled.div`
    flex-grow: 1;
`
