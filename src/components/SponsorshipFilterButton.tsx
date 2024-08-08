import React from 'react'
import styled, { css } from 'styled-components'
import { SimpleDropdown, SimpleListDropdownMenu } from '~/components/SimpleDropdown'
import SvgIcon from '~/shared/components/SvgIcon'
import { Toggle } from '~/shared/components/Toggle'
import { COLORS } from '~/shared/utils/styled'

export type SponsorshipFilters = typeof defaultFilters

export const defaultFilters = {
    inactive: true,
    noFunding: true,
    expired: true,
    my: false,
}

interface Props {
    filter?: SponsorshipFilters
    onFilterChange: (filters: SponsorshipFilters) => void
}

export const SponsorshipFilterButton = ({
    filter = defaultFilters,
    onFilterChange,
}: Props) => {
    return (
        <SimpleDropdown
            menu={<Menu value={filter} onChange={onFilterChange} />}
            align="right"
        >
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

interface ToggleOptionProps {
    id: string
    label: string
    value: boolean
    onChange(value: boolean): void
}

const ToggleOption = ({ id, label, value, onChange }: ToggleOptionProps) => {
    return (
        <Option>
            <ToggleLabel htmlFor={id}>{label}</ToggleLabel>
            <Toggle id={id} value={value} onChange={onChange} />
        </Option>
    )
}

interface MenuProps {
    value: SponsorshipFilters
    onChange?(value: SponsorshipFilters): void
}

const Menu = ({ value, onChange }: MenuProps) => {
    return (
        <DropdownMenu>
            <Title>Showing</Title>
            <ToggleContainer>
                <ToggleOption
                    id={'inactive'}
                    label="Inactive sponsorships"
                    value={value.inactive}
                    onChange={(val) => {
                        onChange?.({ ...value, inactive: val })
                    }}
                />
                <ToggleOption
                    id={'noFunding'}
                    label="Without funding sponsorships"
                    value={value.noFunding}
                    onChange={(val) => {
                        onChange?.({ ...value, noFunding: val })
                    }}
                />
                <ToggleOption
                    id={'expired'}
                    label="Expired funding sponsorships"
                    value={value.expired}
                    onChange={(val) => {
                        onChange?.({ ...value, expired: val })
                    }}
                />
                <ToggleOption
                    id={'my'}
                    label="Sponsorships with my Operator"
                    value={value.my}
                    onChange={(val) => {
                        onChange?.({ ...value, my: val })
                    }}
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
