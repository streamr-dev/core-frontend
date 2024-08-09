import React, { ReactNode } from 'react'
import styled from 'styled-components'
import {
    NetworkActionBarBackButtonIcon,
    NetworkActionBarBackLink,
    NetworkActionBarStatsTitle,
    NetworkActionBarTitle,
} from '~/components/ActionBars/NetworkActionBar.styles'
import { Separator } from '~/components/Separator'
import { TooltipIconWrap } from '~/components/Tooltip'
import { COLORS, LAPTOP, MAX_BODY_WIDTH, TABLET } from '~/shared/utils/styled'
import { goBack } from '~/utils'

interface AbstractActionBarProps {
    fallbackBackButtonUrl: string
    title: ReactNode
    buttons?: ReactNode
    ctas?: ReactNode
    summaryTitle?: ReactNode
    summary?: ReactNode
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
        <Root>
            <OuterWrap>
                <InnerWrap>
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
                </InnerWrap>
                <ActionsOuterWrap>
                    <Buttons>{buttons}</Buttons>
                    <Ctas>{ctas}</Ctas>
                </ActionsOuterWrap>
                {summary && (
                    <>
                        {summaryTitle && (
                            <NetworkActionBarStatsTitle>
                                {summaryTitle}
                            </NetworkActionBarStatsTitle>
                        )}
                        <Separator />
                        {summary}
                    </>
                )}
            </OuterWrap>
        </Root>
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

const Root = styled.div`
    background: #fff;
    color: ${COLORS.primary};
    padding-top: 34px;

    @media ${TABLET} {
        padding-top: 60px;
    }

    @media ${LAPTOP} {
        padding-top: 108px;
    }
`

const OuterWrap = styled.div`
    margin: 0 auto;
    max-width: ${MAX_BODY_WIDTH}px;
    padding: 0 24px 28px;
    width: 100%;

    @media (min-width: ${MAX_BODY_WIDTH + 48}px) {
        padding: 0;
    }
`

const InnerWrap = styled.div`
    align-items: center;
    display: flex;
`

const ActionsOuterWrap = styled(InnerWrap)`
    gap: 40px;
    flex-wrap: wrap;
    margin-top: 10px;

    @media ${LAPTOP} {
        padding-left: 40px;
    }
`

const Buttons = styled(InnerWrap)`
    flex-grow: 1;
    flex-wrap: wrap;
    gap: 8px;
`

const Ctas = styled.div`
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 8px;
    width: 100%;
    max-width: 480px;

    button {
        width: 100%;
    }

    @media ${TABLET} {
        max-width: none;
        width: auto;
    }
`
