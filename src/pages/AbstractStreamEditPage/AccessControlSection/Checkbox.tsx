import React from 'react'
import styled from 'styled-components'

import SharedCheckbox from '~/shared/components/Checkbox'
import { COLORS } from '~/shared/utils/styled'

type LabelProps = {
    disabled?: boolean
}

const Label = styled.label<LabelProps>`
    border: 1px solid ${COLORS.separator};
    border-radius: 4px;
    display: grid;
    grid-template-columns: 1fr auto;
    align-items: center;
    justify-items: left;
    padding: 0px 12px 0px 18px;
    height: 40px;
    margin: 0;
    cursor: ${({ disabled }) => (disabled ? 'not-allowed' : 'pointer')};
`

type Props = {
    operationName: string
    value: boolean
    address: string
    onChange: (value: boolean) => void
    disabled?: boolean
}

const Checkbox: React.FC<Props> = ({
    operationName,
    value,
    address,
    onChange,
    disabled,
}) => {
    const uniqueKey = `${operationName}-${address}`
    return (
        <Label htmlFor={uniqueKey} disabled={disabled}>
            {operationName}
            <SharedCheckbox
                id={uniqueKey}
                onChange={(ev) => onChange(ev.target.checked)}
                value={value}
                disabled={disabled}
            />
        </Label>
    )
}

export default Checkbox
