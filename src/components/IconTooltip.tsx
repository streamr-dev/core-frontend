import React, { ReactNode } from 'react'
import styled from 'styled-components'
import SvgIcon, { IconName } from '~/shared/components/SvgIcon'
import { WhiteTooltip } from '~/shared/components/Tooltip/Tooltip'
import { COLORS, REGULAR } from '~/shared/utils/styled'

const Root = styled.div`
    display: inline-flex;
    margin-left: 8px;
`

const Content = styled.div`
    white-space: normal;
    font-size: 12px;
    font-weight: ${REGULAR};
    line-height: 1.5em;
    letter-spacing: normal;
    color: ${COLORS.primaryLight};
`

const Icon = styled(SvgIcon)`
    width: 16px;
    height: 16px;
`

type Props = {
    id: string
    iconName: IconName
    content: ReactNode
}

export const IconTooltip = ({ id, iconName, content }: Props) => (
    <Root>
        <Icon data-tooltip-id={id} name={iconName} />
        <WhiteTooltip
            id={id}
            openOnClick={false}
            style={{
                padding: '8px 12px',
            }}
        >
            <Content>{content}</Content>
        </WhiteTooltip>
    </Root>
)
