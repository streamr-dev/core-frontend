import React from 'react'
import styled, { css } from 'styled-components'
import ImageChecked from './checkbox-checked.svg'
import ImageUnchecked from './checkbox.svg'

const Dummy = styled.div`
    background: url(${ImageUnchecked}) no-repeat;
    height: 16px;
    position: relative;
    width: 16px;

    ::after {
        background: url(${ImageChecked}) no-repeat;
        bottom: 0;
        content: ' ';
        display: block;
        left: 0;
        opacity: 0;
        position: absolute;
        right: 0;
        top: 0;
        transition: opacity 0.1s;
    }

    ${({ checked }) => !!checked && css`
        ::after {
            opacity: 1;
        }
    `}
`

const noop = () => {}

const UnstyledCheckbox = ({ value, onChange = noop, ...props }) => (
    <Dummy
        {...props}
        as="input"
        type="checkbox"
        checked={!!value}
        onChange={onChange}
    />
)

const Checkbox = styled(UnstyledCheckbox)`
    appearance: none;
    border: 0;
    cursor: pointer;
    flex-shrink: 0;
    margin-right: 0.5em;
    top: 0;

    :focus {
        outline: none;
    }
`

Object.assign(Checkbox, {
    Dummy,
})

export default Checkbox
