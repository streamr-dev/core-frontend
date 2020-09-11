// @flow

import React, { useCallback } from 'react'
import styled, { css } from 'styled-components'
import { Translate } from 'react-redux-i18n'

import useCopy from '$shared/hooks/useCopy'
import useEmbed from '$userpages/hooks/useEmbed'
import SvgIcon from '$shared/components/SvgIcon'
import type { ResourceType, ResourceId } from '$userpages/flowtype/permission-types'

type Props = {
    resourceType: ResourceType,
    resourceId: ResourceId,
}

const Button = styled.button`
    align-items: center;
    appearance: none;
    background: transparent;
    border: 0;
    color: rgb(3, 36, 255);
    display: flex;
    font-size: 0.875rem;
    letter-spacing: 0;
    line-height: 2.5rem;
    margin: 0;
    outline: none;
    padding: 0;

    :focus {
        outline: none;
    }

    svg {
        height: 10px;
        margin-left: 0.5rem;
        width: 10px;
    }

    ${({ copied }) => !!copied && css`
        color: rgb(19, 1, 61);
    `}
`

const UnstyledCopyLink = ({ resourceType, resourceId, ...props }: Props) => {
    const { isCopied, copy } = useCopy()

    const { link } = useEmbed(resourceType, resourceId)

    const onClick = useCallback(() => {
        copy(link)
    }, [copy, link])

    return (
        <Button
            {...props}
            copied={isCopied}
            onClick={onClick}
        >
            {!isCopied && (
                <Translate value="modal.shareResource.copyLink" />
            )}
            {!!isCopied && (
                <React.Fragment>
                    <Translate value="modal.shareResource.linkCopied" />
                    <SvgIcon name="tick" />
                </React.Fragment>
            )}
        </Button>
    )
}

const CopyLink = styled(UnstyledCopyLink)``

export default CopyLink
