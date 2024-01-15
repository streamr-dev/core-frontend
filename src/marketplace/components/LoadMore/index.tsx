import React from 'react'
import styled from 'styled-components'
import { LoadMoreButton } from '~/components/LoadMore'

export type Props = {
    onClick: () => void | Promise<void>
    hasMoreSearchResults: boolean
    preserveSpace?: boolean
    className?: string
}

const StyledContainer = styled.div`
    display: flex;
    justify-content: center;
`

const LoadMore = ({ onClick, hasMoreSearchResults, preserveSpace, className }: Props) => {
    if (!hasMoreSearchResults) {
        return preserveSpace ? <StyledContainer className={className} /> : null
    }

    return (
        <StyledContainer className={className}>
            <LoadMoreButton onClick={onClick} kind="primary2">
                Load more
            </LoadMoreButton>
        </StyledContainer>
    )
}

export default LoadMore
