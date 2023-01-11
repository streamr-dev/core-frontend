import React, { ChangeEvent, FunctionComponent, ReactNode, useCallback } from 'react'
import styled from 'styled-components'
import { COLORS } from '$shared/utils/styled'

type RadioProps = {
    id: string
    name: string,
    label: ReactNode,
    value: any
    checked?: boolean
    disabled?: boolean,
    disabledReason?: string,
    onChange: (value: any) => void
    className?: string
    size?: 'normal' | 'large'
}

export const Radio: FunctionComponent<RadioProps> = ({
    id,
    name,
    label,
    value,
    checked,
    disabled,
    disabledReason,
    onChange,
    className,
    size
}) => {
    const handleChange = useCallback(
        (event: ChangeEvent<HTMLInputElement>) => onChange(event.target.value),
        [onChange]
    )

    return <RadioLabel htmlFor={id} title={disabled && disabledReason ? disabledReason : ''} className={className + (disabled ? ' disabled' : '')}>
        <input
            id={id}
            name={name}
            value={value}
            checked={checked}
            type={'radio'}
            disabled={disabled}
            onChange={handleChange}
            className={(!label ? 'no-label ' : '') + (size === 'large' ? 'large ' : '')}/>
        {!!label && <div>{label}</div>}
    </RadioLabel>
}

const RadioLabel = styled.label`
  display: flex;
  align-items: center;
  cursor: pointer;
  margin: 0;
  
  &.disabled {
    cursor: not-allowed;
  }

  input[type="radio"] {
    appearance: none;
    background-color: transparent;
    margin: 0;
    flex-shrink: 0;
    font: inherit;
    color: purple;
    width: 15px;
    height: 15px;
    border: 2px solid ${COLORS.radioBorder};
    border-radius: 50%;
    transform: translateY(-2px);
    display: grid;
    place-content: center;
    
    &.no-label {
      transform: none;
    }
    
    &:checked {
      border-color: ${COLORS.link};
    }
    
    &:disabled {
      border-color: ${COLORS.secondaryHover};
      &:not(:checked) {
        background-color: ${COLORS.secondaryHover};
      }
    }

    &.large {
      width: 20px;
      height: 20px;
      ::before {
        width: 10px;
        height: 10px;
        box-shadow: inset 1.5em 1.5em ${COLORS.link};
      }
    }
  }

  input[type="radio"]::before {
    content: "";
    width: 7px;
    height: 7px;
    border-radius: 50%;
    transform: scale(0);
    transition: 120ms transform ease-in-out;
    box-shadow: inset 1em 1em ${COLORS.link};
    background-color: transparent;
  }

  input[type="radio"]:checked::before {
    transform: scale(1);
  }
  
  input[type="radio"]:disabled:checked::before {
    box-shadow: inset 1em 1em ${COLORS.disabled}
  }

  input[type="radio"]:focus {
    //outline: max(2px, 0.15em) solid cadetblue;
    //outline-offset: max(2px, 0.15em);
  }
  
  > * {
    margin-left: 9px;
    font-size: 14px;
    width: 100%;
  }
`
