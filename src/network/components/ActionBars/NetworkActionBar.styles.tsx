import styled from 'styled-components'
import { Link } from 'react-router-dom'
import { COLORS, LAPTOP, MAX_BODY_WIDTH, MEDIUM, TABLET } from '~/shared/utils/styled'
import SvgIcon from '~/shared/components/SvgIcon'
import { Tooltip } from 'react-tooltip'

export const SingleElementPageActionBar = styled.div`
    background-color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    color: ${COLORS.primary};
`
export const SingleElementPageActionBarContainer = styled.div`
    padding: 0 24px 28px;
    width: 100%;
    max-width: ${MAX_BODY_WIDTH}px;
    margin-top: 34px;
    @media (min-width: ${MAX_BODY_WIDTH + 48}px) {
        padding: 0;
    }
    @media (${TABLET}) {
        margin-top: 60px;
    }
    @media (${LAPTOP}) {
        margin-top: 108px;
    }
`

export const SingleElementPageActionBarTopPart = styled.div`
    display: flex;
    flex-direction: column;

    @media (${TABLET}) {
        align-items: center;
        flex-direction: row;
        justify-content: space-between;
    }
`

export const NetworkActionBarBackLink = styled(Link)`
    padding: 9px;
    line-height: 30px;
`
export const NetworkActionBarBackButtonIcon = styled(SvgIcon)`
    color: ${COLORS.primaryLight};
`
export const NetworkActionBarBackButtonAndTitle = styled.div`
    display: flex;
    align-items: center;
`

export const NetworkActionBarTitle = styled.p`
    line-height: 30px;
    font-size: 24px;
    font-weight: ${MEDIUM};
    margin: 0;
`

export const NetworkActionBarInfoButtons = styled.div`
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    margin-top: 10px;
    @media (${LAPTOP}) {
        padding-left: 40px;
    }
`

export const NetworkActionBarInfoButton = styled.div`
    background-color: ${COLORS.secondary};
    border-radius: 8px;
    display: flex;
    height: 40px;
    padding: 0px 12px;
    justify-content: center;
    align-items: center;
    gap: 6px;

    &.active {
        color: ${COLORS.active};
        background-color: ${COLORS.activeBackground};
    }

    .icon {
        height: 20px;
        color: ${COLORS.primaryDisabled};
    }
`

export const CopyAddressTooltip = styled(Tooltip)`
    max-width: 300px;
    background-color: ${COLORS.primary};
    color: ${COLORS.primaryContrast};
    font-size: 14px;
    border-radius: 8px;
`
