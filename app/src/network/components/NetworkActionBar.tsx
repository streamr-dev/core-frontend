import React, { FunctionComponent, ReactNode } from 'react'
import styled from 'styled-components'
import SearchBar from '$shared/components/SearchBar'
import { COLORS, MAX_BODY_WIDTH, TABLET } from '$shared/utils/styled'

const NetworkActionBarWrap = styled.div`
    background-color: ${COLORS.primaryContrast};
    display: flex;
    flex-direction: column;
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

    .action-content-wrap {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0 24px 28px;
        width: 100%;
        max-width: ${MAX_BODY_WIDTH}px;
        @media (min-width: ${MAX_BODY_WIDTH + 48}px) {
            padding: 0 0 28px;
        }
    }

    .left-side-content {
        width: 100%;
        @media (${TABLET}) {
            width: auto;
        }
    }

    .right-side-content {
        display: none;
        @media (${TABLET}) {
            display: block;
        }
    }
`

type Props = {
    searchEnabled: boolean
    placeholder?: string
    onSearch?: (term: string) => void
    leftSideContent?: ReactNode
    rightSideContent?: ReactNode
}

export const NetworkActionBar: FunctionComponent<Props> = ({
    searchEnabled,
    onSearch,
    placeholder,
    leftSideContent,
    rightSideContent,
}) => {
    return (
        <NetworkActionBarWrap>
            <div
                className={'search-bar-wrap ' + (!searchEnabled ? 'search-disabled' : '')}
            >
                <SearchBar onChange={onSearch} placeholder={placeholder} />
            </div>
            {(leftSideContent || rightSideContent) && (
                <div className="action-content-wrap">
                    <div className="left-side-content">{leftSideContent}</div>
                    <div className="right-side-content">{rightSideContent}</div>
                </div>
            )}
        </NetworkActionBarWrap>
    )
}
