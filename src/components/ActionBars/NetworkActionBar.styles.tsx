import styled from 'styled-components'
import { Link } from 'react-router-dom'
import { COLORS, LAPTOP, MAX_BODY_WIDTH, MEDIUM, TABLET } from '~/shared/utils/styled'
import SvgIcon from '~/shared/components/SvgIcon'

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

    @media (${LAPTOP}) {
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

export const NetworkActionBarTitle = styled.div`
    line-height: 30px;
    font-size: 24px;
    font-weight: ${MEDIUM};
    margin: 0;
    display: flex;
    gap: 10px;
    justify-content: center;
    align-items: center;
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

export const NetworkActionBarCTAs = styled.div`
    display: none;

    @media (${TABLET}) {
        margin-top: 48px;
        display: flex;
        gap: 10px;
    }

    @media (${LAPTOP}) {
        margin-top: 55px;
    }
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

export const NetworkActionBarCaret = styled(SvgIcon)`
    color: ${COLORS.primaryDisabled};
    width: 12px;
    margin-left: 5px;
`
