import React, { useCallback } from 'react'
import styled, { css } from 'styled-components'

import useCopy from '$shared/hooks/useCopy'
import SvgIcon from '$shared/components/SvgIcon'
import { usePermissionsState } from '$shared/components/PermissionsProvider'
import resourceUrl from '$shared/utils/resourceUrl'

const Button = styled.button`
    align-items: center;
    appearance: none;
    background: transparent;
    border: 0;
    color: rgb(3, 36, 255);
    display: flex;
    font-size: 14px;
    letter-spacing: 0;
    line-height: 40px;
    margin: 0;
    outline: none;
    padding: 0;

    :focus {
        outline: none;
    }

    svg {
        height: 10px;
        margin-left: 8px;
        width: 10px;
    }

    ${({ copied }) => !!copied && css`
        color: rgb(19, 1, 61);
    `}
`

const UnstyledCopyLink = (props) => {
    const { isCopied, copy } = useCopy()

    const { resourceType, resourceId } = usePermissionsState()

    const onClick = useCallback(() => {
        copy(resourceUrl(resourceType, resourceId))
    }, [copy, resourceType, resourceId])

    return (
        <Button
            {...props}
            copied={isCopied}
            onClick={onClick}
        >
            {!isCopied && 'Copy link'}
            {!!isCopied && (
                <React.Fragment>
                    <span>Link copied</span>
                    <SvgIcon name="tick" />
                </React.Fragment>
            )}
        </Button>
    )
}

const CopyLink = styled(UnstyledCopyLink)``

export default CopyLink
