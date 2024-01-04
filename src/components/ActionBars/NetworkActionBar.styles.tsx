import styled from 'styled-components'
import { Link } from 'react-router-dom'
import { COLORS, MEDIUM } from '~/shared/utils/styled'
import SvgIcon from '~/shared/components/SvgIcon'

export const NetworkActionBarBackLink = styled(Link)`
    align-items: center;
    display: flex;
    justify-content: center;
    margin: 0 7px 0 -9px;
    width: 42px;
`

export const NetworkActionBarBackButtonIcon = styled(SvgIcon)`
    color: ${COLORS.primaryLight};
    display: block;
`

export const NetworkActionBarTitle = styled.div`
    line-height: 30px;
    font-size: 24px;
    font-weight: ${MEDIUM};
    margin: 0;
    display: flex;
    gap: 10px;
    justify-content: center;
    align-items: center;
    word-break: break-word;
`

export const NetworkActionBarStatsTitle = styled.p`
    font-weight: ${MEDIUM};
    letter-spacing: 0.6px;
    line-height: 30px;
    font-size: 12px;
    color: ${COLORS.primaryLight};
    text-transform: uppercase;
    margin-top: 44px;
`
