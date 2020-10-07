import React from 'react'
import styled, { css } from 'styled-components'
import Checkbox from '$shared/components/Checkbox2'

const UnstyledStorageNode = ({ children, checked, disabled, ...props }) => (
    <button {...props} type="button" disabled={disabled} title={children}>
        <div>{children}</div>
        {(!disabled || !!checked) && (
            <Checkbox checked={checked} />
        )}
    </button>
)

const StorageNode = styled(UnstyledStorageNode)`
    align-items: center;
    appearance: none;
    background: #ffffff;
    border: 1px solid #efefef;
    border-radius: 4px;
    box-sizing: border-box;
    color: #cdcdcd;
    cursor: pointer;
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
        cursor: default;
    }

    :focus {
        outline: 0;
    }

    ${({ checked }) => !!checked && css`
        color: #323232;
    `}

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
