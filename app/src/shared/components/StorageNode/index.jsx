import React, { useCallback } from 'react'
import styled, { css } from 'styled-components'
import Checkbox from '$shared/components/Checkbox'
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
    changing: changingProp,
    checked: checkedProp,
    children,
    disabled,
    onClick: onClickProp,
    streamId,
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
            clickable={!changing}
            disabled={disabled}
            onClick={onClick}
            title={children}
            type="button"
        >
            <div>{children}</div>
            {(!disabled || !!checked) && !changing && (
                <Checkbox.Tick
                    checked={checked}
                    data-test-hook={checked ? 'Checkbox on' : 'Checkbox off'}
                />
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

    ${Checkbox.Tick} {
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
