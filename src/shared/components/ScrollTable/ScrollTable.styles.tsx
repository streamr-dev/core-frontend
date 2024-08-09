import styled, { css } from 'styled-components'
import LoadingIndicator from '~/shared/components/LoadingIndicator'
import SvgIcon from '~/shared/components/SvgIcon'
import { COLORS, MEDIUM, TABLET } from '~/shared/utils/styled'

const horizontalPaddingMobile = '24px'
const horizontalPaddingDesktop = '40px'
const actionPadding = '16px'

export const ScrollTableCellsWrap = styled.div<{
    stickyColumnCount: number
    nonStickyColumnCount: number
}>`
    display: grid;
    grid-template-columns: ${({ stickyColumnCount, nonStickyColumnCount }) =>
        stickyColumnCount + nonStickyColumnCount === 1 ? '1fr' : 'min-content 1fr'};
    position: relative;
    overflow: auto;
    max-height: inherit;
`

export const ScrollTableColumn = styled.div<{ $actionColumn?: boolean }>`
    display: flex;
    flex-direction: column;
    flex: 1;
    ${({ $actionColumn }) => {
        if ($actionColumn) {
            return css`
                flex: 0.1;
            `
        }
    }}
`

export const ScrollTableNonStickyColumnsWrap = styled.div`
    display: flex;
    flex: 1;
    overflow-x: auto;
    overflow-y: hidden;
`

export const ScrollTableHeaderCell = styled.div<{
    $align?: 'start' | 'end'
    $pointer?: boolean
    $actionCell?: boolean
}>`
    border-bottom: 1.5px solid ${COLORS.Border};
    padding: 5px ${horizontalPaddingMobile};
    height: 80px;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    font-size: 14px;
    font-weight: ${MEDIUM};
    white-space: nowrap;

    ${({ $align }) => {
        switch ($align) {
            case 'start':
                return css`
                    justify-content: flex-start;
                `
            case 'end':
                return css`
                    justify-content: flex-end;
                `
        }
    }}

    ${({ $pointer }) => {
        if ($pointer) {
            return css`
                cursor: pointer;
            `
        }
    }}

    ${({ $actionCell }) => {
        if ($actionCell) {
            return css`
                padding: ${actionPadding};
            `
        }

        return css`
            @media (${TABLET}) {
                padding: 5px ${horizontalPaddingDesktop};
            }
        `
    }}
`

export const ScrollTableCell = styled.div<{
    $align?: 'start' | 'end'
    $actionCell?: boolean
    $hover?: boolean
}>`
    padding: 5px ${horizontalPaddingMobile};
    font-size: 16px;
    color: ${COLORS.primaryLight} !important; //to override the link styled when we use this StyledComponent as Link
    height: 90px;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    border-bottom: 1px solid ${COLORS.secondary};
    white-space: nowrap;

    ${({ $align }) => {
        switch ($align) {
            case 'start':
                return css`
                    justify-content: flex-start;
                `
            case 'end':
                return css`
                    justify-content: flex-end;
                `
        }
    }}
    ${({ $actionCell }) => {
        if ($actionCell) {
            return css`
                border-left: 1px solid ${COLORS.secondary};
                padding: ${actionPadding};
                justify-content: center;
            `
        }

        return css`
            @media (${TABLET}) {
                padding: 5px ${horizontalPaddingDesktop};
            }
        `
    }}
    ${({ $hover }) => {
        if ($hover) {
            return css`
                background-color: ${COLORS.secondaryLight};
            `
        }
    }}
`

export const OrderCaretIcon = styled(SvgIcon)<{ $direction?: 'asc' | 'desc' }>`
    width: 10px;
    margin-left: 10px;
    transition: transform 200ms ease-in-out;

    ${({ $direction }) => {
        switch ($direction) {
            case 'asc':
                return css`
                    transform: rotate(0deg);
                `
            case 'desc':
                return css`
                    transform: rotate(180deg);
                `
        }
    }}
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
