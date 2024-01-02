import React, { ComponentProps, ReactNode } from 'react'
import styled from 'styled-components'
import SvgIcon from '~/shared/components/SvgIcon'
import { Tooltip } from '~/components/Tooltip'

/**
 * Question mark icon with a tooltip.
 */
export function Hint({ children }: { children: ReactNode }) {
    return (
        <Tooltip content={children}>
            <IconWrap>
                <QuestionMarkIcon />
            </IconWrap>
        </Tooltip>
    )
}

export const IconWrap = styled.div<{ $color?: string }>`
    align-items: center;
    color: ${({ $color = 'inherit' }) => $color};
    display: flex;
    height: 24px;
    justify-content: center;
    position: relative;
    width: 24px;
`

function getQuestionMarkIconAttrs(): ComponentProps<typeof SvgIcon> {
    return { name: 'outlineQuestionMark' }
}

const QuestionMarkIcon = styled(SvgIcon).attrs(getQuestionMarkIconAttrs)`
    display: block;
    height: 16px;
    width: 16px;
`
