import React, { FunctionComponent, useCallback } from 'react'
import styled from 'styled-components'
import Button from '$shared/components/Button'
import useCopy from '$shared/hooks/useCopy'
import SvgIcon from '$shared/components/SvgIcon'

const Btn = styled(Button)`
    width: 32px;
    height: 32px;
    border-radius: 100%;
    margin-left: 10px;
    display: grid;
    svg {
        width: 22px;
    }
    &.white {
        background-color: white;
    }
`

type CopyButtonProps = {
    valueToCopy: string
    notificationTitle?: string
    className?: string
}

export const CopyButton: FunctionComponent<CopyButtonProps> = ({
    valueToCopy,
    notificationTitle = 'Stream ID copied',
    className,
}) => {
    const { copy } = useCopy()
    const handleCopy = useCallback(() => {
        copy(valueToCopy, {
            toastMessage: notificationTitle,
        })
    }, [copy, notificationTitle, valueToCopy])
    return (
        <Btn
            onClick={handleCopy}
            type={'button'}
            kind={'secondary'}
            size={'mini'}
            className={className}
        >
            <SvgIcon name={'copy'} />
        </Btn>
    )
}
