import styled from 'styled-components'
import { COLORS, DESKTOP, MEDIUM, TABLET, MAX_BODY_WIDTH } from '~/shared/utils/styled'
import { Button } from '~/components/Button'

export const FiltersBar = styled.div`
    display: flex;
    justify-content: space-between;
    margin: 0 auto;
    max-width: ${MAX_BODY_WIDTH}px;
    padding: 0 30px 30px;

    @media ${DESKTOP} {
        padding: 0 0 30px;
    }
`

export const FiltersWrap = styled.div`
    align-items: center;
    display: flex;
    width: 100%;

    @media ${TABLET} {
        align-items: unset;
        width: auto;
    }
`

export const DropdownFilters = styled.div`
    display: none;
    align-items: center;
    margin-left: 40px;
    span {
        color: ${COLORS.primary};
        font-weight: ${MEDIUM};
        margin-right: 15px;
        font-size: 14px;
    }

    @media (${DESKTOP}) {
        display: flex;
    }
`

export const SelectFieldWrap = styled.div`
    margin-right: 10px;
`

export const MobileFilterWrap = styled.div`
    display: block;
    color: ${COLORS.primary};
    margin-left: 20px;

    @media (${DESKTOP}) {
        display: none;
    }
`

export const MobileFilterText = styled.span`
    margin-right: 15px;
    display: none;
    @media (${TABLET}) {
        display: inline;
    }
`

export const CreateProjectButton = styled(Button)`
    display: none !important;

    @media ${TABLET} {
        display: inherit !important;
    }
`

export const ActionBarContainer = styled.div`
    background-color: ${COLORS.primaryContrast};
`
