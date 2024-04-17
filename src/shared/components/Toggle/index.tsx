import React from 'react'
import styled from 'styled-components'
import { COLORS } from '~/shared/utils/styled'

interface Props {
    id: string
    value: boolean
    onChange: (value: boolean) => void
}

export function Toggle({ id, value, onChange, ...rest }: Props) {
    return (
        <Root {...rest}>
            <Input
                type="checkbox"
                id={id}
                checked={value}
                onChange={(e) => {
                    onChange(e.target.checked)
                }}
            />
            <Label htmlFor={id} />
        </Root>
    )
}

const Root = styled.div`
    display: flex;
`

const Label = styled.label`
    display: inline-block;
    width: 32px;
    height: 20px;
    background-color: #78788029;
    border-radius: 10px;
    position: relative;
    cursor: pointer;

    &::before {
        content: '';
        position: absolute;
        top: 2px;
        left: 2px;
        width: 16px;
        height: 16px;
        background-color: white;
        border-radius: 50%;
        transition: transform 0.3s;
    }
`

const Input = styled.input`
    display: none;

    &:checked + ${Label} {
        background-color: ${COLORS.link};
    }

    &:checked + ${Label}::before {
        transform: translateX(12px);
    }
`
