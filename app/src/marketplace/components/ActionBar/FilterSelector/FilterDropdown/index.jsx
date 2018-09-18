// @flow

import React, { type Node } from 'react'
import { Translate } from 'streamr-layout/dist/bundle'
import { DropdownMenu } from 'reactstrap'

import FilterDropdownItem from '../../FilterDropdownItem/index'

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
            <Translate value="actionBar.clear" />
        </FilterDropdownItem>
    </DropdownMenu>
)

export default FilterDropdown
