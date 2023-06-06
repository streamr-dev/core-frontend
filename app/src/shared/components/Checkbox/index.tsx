import React, {
    ChangeEvent,
    FunctionComponent,
    HTMLProps,
    MouseEventHandler,
} from 'react'
import styled, { css } from 'styled-components'
import ImageChecked from './checkbox-checked.svg'
import ImageUnchecked from './checkbox.svg'
const Tick = styled.div<{ checked: boolean }>`
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

    :disabled {
        filter: grayscale(1);
        cursor: not-allowed;
    }

    ${({ checked }) =>
        !!checked &&
        css`
            ::after {
                opacity: 1;
            }
        `}
`

const noop = () => {}
type CheckboxProps = {
    value: boolean
    onChange?: (e: ChangeEvent<HTMLInputElement>) => void
    disabled?: boolean
    id?: string
    name?: string
    onClick?: MouseEventHandler
}
const UnstyledCheckbox: FunctionComponent<CheckboxProps> = ({
    value,
    onChange = noop,
    onClick = noop,
    ...props
}) => (
    <Tick
        {...props}
        as="input"
        type="checkbox"
        checked={!!value}
        onChange={onChange}
        onClick={onClick}
    />
)

const Checkbox = styled(UnstyledCheckbox)<CheckboxProps>`
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
    Tick,
})
export default Checkbox
