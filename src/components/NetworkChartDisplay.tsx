import React, { ReactNode, useState } from 'react'
import styled from 'styled-components'
import Tabs, { Tab, Root as TabsRoot, Item as TabsItem } from '~/shared/components/Tabs'
import { TABLET } from '~/shared/utils/styled'
import TimePeriodTabs, { TimePeriod } from './TimePeriodTabs'

export default function NetworkChartDisplay<
    T extends { id: string; label: string; data: { x: number; y: number }[] },
>({ dataSets = [], children }: { dataSets?: T[]; children?: (value: T) => ReactNode }) {
    const [currentId, setCurrentId] = useState(dataSets[0]?.id)

    const currentDataSet = dataSets.find(({ id }) => id === currentId) || undefined

    const [chartPeriod, setChartPeriod] = useState<TimePeriod>(TimePeriod.SevenDays)

    return (
        <Root>
            <Header>
                <SetSelector>
                    <Tabs
                        selection={currentId}
                        onSelectionChange={(id) => {
                            setCurrentId(id)
                        }}
                    >
                        {dataSets.map(({ id, label }) => (
                            <Tab key={id} id={id}>
                                {label}
                            </Tab>
                        ))}
                    </Tabs>
                </SetSelector>
                <TimePeriodWrap>
                    <TimePeriodTabs value={chartPeriod} onChange={setChartPeriod} />
                </TimePeriodWrap>
            </Header>
            <Body>{currentDataSet ? children?.(currentDataSet) : null}</Body>
            <TimePeriodWrap>
                <TimePeriodTabs value={chartPeriod} onChange={setChartPeriod} />
            </TimePeriodWrap>
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
