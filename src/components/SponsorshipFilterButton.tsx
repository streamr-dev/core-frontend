import React, { useCallback, useState } from 'react'
import styled, { css } from 'styled-components'
import { SimpleDropdown, SimpleListDropdownMenu } from '~/components/SimpleDropdown'
import SvgIcon from '~/shared/components/SvgIcon'
import { Toggle } from '~/shared/components/Toggle'
import { COLORS } from '~/shared/utils/styled'

const initialState = {
    inactive: false,
    noFunding: false,
    expired: false,
    my: false,
}

interface Props {
    onFilterChange: (filters: typeof initialState) => void
}

export const SponsorshipFilterButton = ({ onFilterChange }: Props) => {
    return (
        <SimpleDropdown menu={<Menu onFilterChange={onFilterChange} />} align="right">
            {(toggle, isOpen) => (
                <Button
                    type="button"
                    onClick={() => void toggle((c) => !c)}
                    $active={isOpen}
                >
                    <SvgIcon name="faders" />
                    Display
                </Button>
            )}
        </SimpleDropdown>
    )
}

const ToggleOption = ({ id, label, value, onChange }) => {
    return (
        <Option>
            <ToggleLabel htmlFor={id}>{label}</ToggleLabel>
            <Toggle id={id} value={value} onChange={onChange} />
        </Option>
    )
}

const Menu = ({ onFilterChange }) => {
    const [state, setState] = useState(initialState)

    const onChange = useCallback(
        (id: string, value: boolean) => {
            setState((prev) => {
                const next = {
                    ...prev,
                    [id]: value,
                }

                onFilterChange(next)
                return next
            })
        },
        [onFilterChange],
    )

    return (
        <DropdownMenu>
            <Title>Showing</Title>
            <ToggleContainer>
                <ToggleOption
                    id={'inactive'}
                    label="Inactive sponsorships"
                    value={state.inactive}
                    onChange={(val) => onChange('inactive', val)}
                />
                <ToggleOption
                    id={'noFunding'}
                    label="Without funding sponsorships"
                    value={state.noFunding}
                    onChange={(val) => onChange('noFunding', val)}
                />
                <ToggleOption
                    id={'expired'}
                    label="Expired funding sponsorships"
                    value={state.expired}
                    onChange={(val) => onChange('expired', val)}
                />
                <ToggleOption
                    id={'my'}
                    label="Sponsorships with my Operator"
                    value={state.my}
                    onChange={(val) => onChange('my', val)}
                />
            </ToggleContainer>
        </DropdownMenu>
    )
}

const DropdownMenu = styled(SimpleListDropdownMenu)`
    padding: 16px;
    color: ${COLORS.primary};
`

const Button = styled.button<{ $active?: boolean }>`
    display: flex;
    flex-direction: row;
    align-items: center;
    padding: 4px 8px;
    gap: 6px;
    color: ${COLORS.primaryLight};
    background-color: ${COLORS.secondaryLight};
    border-radius: 8px;
    border: none;
    cursor: pointer;

    font-size: 14px;
    font-weight: 500;
    line-height: 18.2px;

    ${({ $active = false }) =>
        $active &&
        css`
            color: ${COLORS.primaryContrast};
            background-color: ${COLORS.primary};
        `}
`

const Title = styled.div`
    font-size: 16px;
    font-weight: 500;
    line-height: 20px;
    margin-bottom: 16px;
`

const ToggleContainer = styled.div`
    display: grid;
    grid-template-columns: 1fr auto;
    min-width: 377px;
    gap: 16px;
`

const Option = styled.div`
    display: grid;
    grid-template-columns: subgrid;
    grid-column: span 2;
`

const ToggleLabel = styled.label`
    font-size: 14px;
    font-weight: 500;
    line-height: 20px;
`
