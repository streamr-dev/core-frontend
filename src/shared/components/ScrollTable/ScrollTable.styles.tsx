import styled from 'styled-components'
import { COLORS, MEDIUM, TABLET } from '~/shared/utils/styled'
import LoadingIndicator from '~/shared/components/LoadingIndicator'

const horizontalPaddingMobile = '24px'
const verticalPaddingMobile = '20px'
const horizontalPaddingDesktop = '40px'
const verticalPaddingDesktop = '32px'

export const ScrollTableContainer = styled.div`
    background-color: ${COLORS.primaryContrast};
    border-radius: 16px;
`

export const ScrollTableCellsWrap = styled.div<{
    stickyColumnCount: number
    nonStickyColumnCount: number
}>`
    display: grid;
    grid-template-columns: ${({ stickyColumnCount, nonStickyColumnCount }) =>
        stickyColumnCount + nonStickyColumnCount === 1 ? '1fr' : 'min-content 1fr'};
    position: relative;
`

export const ScrollTableTitle = styled.div`
    font-size: 20px;
    font-weight: ${MEDIUM};
    margin: 0;
    padding: ${verticalPaddingMobile} ${horizontalPaddingMobile}
        ${horizontalPaddingMobile};
    @media (${TABLET}) {
        padding: ${verticalPaddingDesktop} ${horizontalPaddingDesktop};
    }
`

export const ScrollTableColumn = styled.div`
    display: flex;
    flex-direction: column;
    flex: 1;
    &.action-column {
        flex: 0.1;
    }
`

export const ScrollTableNonStickyColumnsWrap = styled.div`
    display: flex;
    flex: 1;
    overflow-x: auto;
    overflow-y: hidden;
`

export const ScrollTableHeaderCell = styled.div`
    border-bottom: 1.5px solid ${COLORS.separator};
    padding: 5px ${horizontalPaddingMobile};
    height: 80px;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    font-size: 14px;
    font-weight: ${MEDIUM};
    white-space: nowrap;
    @media (${TABLET}) {
        padding: 5px ${horizontalPaddingDesktop};
    }

    &.align-start {
        justify-content: flex-start;
    }
    &.align-end {
        justify-content: flex-end;
    }
`

export const ScrollTableCell = styled.div`
    padding: 5px ${horizontalPaddingMobile};
    font-size: 16px;
    color: ${COLORS.primaryLight} !important; //to override the link styled when we use this StyledComponent as Link
    height: 90px;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    border-bottom: 1px solid ${COLORS.secondary};
    white-space: nowrap;
    @media (${TABLET}) {
        padding: 5px ${horizontalPaddingDesktop};
    }
    &.align-start {
        justify-content: flex-start;
    }
    &.align-end {
        justify-content: flex-end;
    }
    &.action-cell {
        border-left: 1px solid ${COLORS.secondary};
    }
`

export const FloatingLoadingIndicator = styled(LoadingIndicator)`
    position: absolute;
    top: 78px;
    left: 0;
    width: 100%;
`

export const NoDataWrap = styled.div`
    grid-column-start: 1;
    grid-column-end: 3;
`
