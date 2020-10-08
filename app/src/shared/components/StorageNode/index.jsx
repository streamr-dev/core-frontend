import React, { useCallback } from 'react'
import styled, { css } from 'styled-components'
import Checkbox from '$shared/components/Checkbox2'
import useStreamStorageNodeToggle from '$shared/components/StorageNode/useStreamStorageNodeToggle'
import Spinner from '$shared/components/Spinner'

const Button = styled.button`
    color: #cdcdcd;
    cursor: pointer;

    :disabled,
    &[disabled] {
        cursor: default;
    }

    ${({ checked }) => !!checked && css`
        color: #323232;
    `}

    ${({ clickable }) => !clickable && css`
        cursor: default !important;
    `}
`

const UnstyledStorageNode = ({
    address,
    streamId,
    children,
    checked: checkedProp,
    changing: changingProp,
    disabled,
    onClick: onClickProp,
    ...props
}) => {
    const [checked, changing, change] = useStreamStorageNodeToggle(streamId, address, checkedProp, changingProp)

    const onClick = useCallback(() => {
        change()
    }, [change])

    return (
        <Button
            {...props}
            checked={checked}
            disabled={disabled}
            onClick={onClick}
            title={children}
            type="button"
            clickable={!changing}
        >
            <div>{children}</div>
            {(!disabled || !!checked) && !changing && (
                <Checkbox checked={checked} />
            )}
            {changing && (
                <Spinner color="gray" />
            )}
        </Button>
    )
}

const StorageNode = styled(UnstyledStorageNode)`
    align-items: center;
    appearance: none;
    background: #ffffff;
    border: 1px solid #efefef;
    border-radius: 4px;
    box-sizing: border-box;
    display: flex;
    font-size: 16px;
    height: 40px;
    line-height: normal;
    padding: 0 16px;
    text-align: left;
    transition: color 0.1s;
    width: 100%;

    :disabled,
    &[disabled] {
        background: #efefef;
        border-color: #efefef;
    }

    :focus {
        outline: 0;
    }

    & + & {
        margin-top: 16px;
    }

    > div:first-child {
        flex-grow: 1;
        min-width: 0;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }

    ${Checkbox} {
        flex-shrink: 0;
        margin-left: 12px;
    }
`

const List = styled.div`
    max-width: 536px;
`

Object.assign(StorageNode, {
    List,
})

export default StorageNode
