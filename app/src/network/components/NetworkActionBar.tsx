import React, { FunctionComponent, ReactNode } from 'react'
import styled from 'styled-components'
import SearchBar from '$shared/components/SearchBar'
import { COLORS, TABLET } from '$shared/utils/styled'

const NetworkActionBarWrap = styled.div`
    background-color: ${COLORS.primaryContrast};
    display: flex;
    align-items: center;
    justify-content: center;

    .search-bar-wrap {
        padding: 30px 24px;
        max-width: 770px;
        margin: 0 auto;
        width: 100%;
        @media (${TABLET}) {
            padding: 40px 72px 80px;
        }
        &.search-disabled {
            > * {
                visibility: hidden;
            }
        }
    }
`

type Props = {
    searchEnabled: boolean
    placeholder?: string
    onSearch?: (term: string) => void
    leftSideContent?: ReactNode[]
    rightSideContent?: ReactNode[]
}
// TODO - finish the implementation of lefSideContent and rightSideContent
export const NetworkActionBar: FunctionComponent<Props> = ({
    searchEnabled,
    onSearch,
    placeholder,
}) => {
    return (
        <NetworkActionBarWrap>
            <div
                className={'search-bar-wrap ' + (!searchEnabled ? 'search-disabled' : '')}
            >
                <SearchBar onChange={onSearch} placeholder={placeholder} />
            </div>
        </NetworkActionBarWrap>
    )
}
