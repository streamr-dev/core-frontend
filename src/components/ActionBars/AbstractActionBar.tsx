import React, { ReactNode } from 'react'
import {
    NetworkActionBarBackButtonAndTitle,
    NetworkActionBarBackButtonIcon,
    NetworkActionBarBackLink,
    NetworkActionBarCTAs,
    NetworkActionBarInfoButtons,
    NetworkActionBarStatsTitle,
    NetworkActionBarTitle,
    SingleElementPageActionBar,
    SingleElementPageActionBarContainer,
    SingleElementPageActionBarTopPart,
} from './NetworkActionBar.styles'
import { goBack } from '~/utils'
import { Separator } from '../Separator'
import styled from 'styled-components'
import { TooltipIconWrap } from '../Tooltip'
import { TABLET } from '~/shared/utils/styled'

interface AbstractActionBarProps {
    fallbackBackButtonUrl: string
    title: ReactNode
    buttons?: ReactNode
    ctas?: ReactNode
    summaryTitle: ReactNode
    summary: ReactNode
}

export function AbstractActionBar({
    fallbackBackButtonUrl,
    title,
    buttons = <></>,
    ctas = <></>,
    summaryTitle,
    summary,
}: AbstractActionBarProps) {
    return (
        <SingleElementPageActionBar>
            <SingleElementPageActionBarContainer>
                <SingleElementPageActionBarTopPart>
                    <div>
                        <NetworkActionBarBackButtonAndTitle>
                            <NetworkActionBarBackLink
                                to={fallbackBackButtonUrl}
                                onClick={(e) => {
                                    goBack({
                                        onBeforeNavigate() {
                                            e.preventDefault()
                                        },
                                    })
                                }}
                            >
                                <NetworkActionBarBackButtonIcon name="backArrow" />
                            </NetworkActionBarBackLink>
                            <NetworkActionBarTitle>{title}</NetworkActionBarTitle>
                        </NetworkActionBarBackButtonAndTitle>
                        <NetworkActionBarInfoButtons>
                            {buttons}
                        </NetworkActionBarInfoButtons>
                    </div>
                    <NetworkActionBarCTAs>{ctas}</NetworkActionBarCTAs>
                </SingleElementPageActionBarTopPart>
                <NetworkActionBarStatsTitle>{summaryTitle}</NetworkActionBarStatsTitle>
                <Separator />
                {summary}
            </SingleElementPageActionBarContainer>
        </SingleElementPageActionBar>
    )
}

export const Pad = styled.div`
    padding: 20px 0;

    ${TooltipIconWrap} svg {
        height: 18px;
        width: 18px;
    }

    @media ${TABLET} {
        padding: 32px 40px;
    }
`
