// @flow

import React, { type Node } from 'react'
import { DropdownMenu } from 'reactstrap'

import FilterDropdownItem from '../../FilterDropdownItem'

type Props = {
    children: Node,
    onClear: () => void,
}

const FilterDropdown = ({ children, onClear }: Props) => (
    <DropdownMenu>
        {children}
        <FilterDropdownItem
            selected={false}
            onSelect={onClear}
            secondaryDropdown
        >
            Clear
        </FilterDropdownItem>
    </DropdownMenu>
)

export default FilterDropdown
