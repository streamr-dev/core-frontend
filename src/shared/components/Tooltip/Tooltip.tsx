import styled from 'styled-components'
import { Tooltip } from 'react-tooltip'
import { COLORS } from '~/shared/utils/styled'

export const BlackTooltip = styled(Tooltip)`
    max-width: 300px;
    background-color: ${COLORS.primary};
    color: ${COLORS.primaryContrast};
    font-size: 14px;
    border-radius: 8px;
`
export const WhiteTooltip = styled(Tooltip)`
    max-width: 300px;
    background-color: #fff;
    color: ${COLORS.primaryLight};
    font-size: 14px;
    border-radius: 8px;
    box-shadow: 0px 6px 12px 0px #52525226;
`
