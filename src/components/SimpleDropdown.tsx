import React, { FunctionComponent, ReactNode, useState } from 'react'
import { Dropdown, DropdownMenu, DropdownToggle } from 'reactstrap'
import styled from 'styled-components'

const StyledDropdownMenu = styled(DropdownMenu)`
    border-radius: 8px;
    border: none;
    padding: 15px;
    box-shadow: 0px 0px 1px 0px rgba(9, 30, 66, 0.31),
        0px 3px 5px 0px rgba(9, 30, 66, 0.2);
`
export const SimpleDropdown: FunctionComponent<{
    toggleElement: ReactNode
    dropdownContent: ReactNode
}> = ({ toggleElement, dropdownContent }) => {
    const [dropdownOpen, setDropdownOpen] = useState(false)
    const toggle = () => setDropdownOpen((prevState) => !prevState)

    return (
        <Dropdown toggle={toggle} isOpen={dropdownOpen}>
            <DropdownToggle data-toggle="dropdown" tag={'div'}>
                {toggleElement}
            </DropdownToggle>
            <StyledDropdownMenu>{dropdownContent}</StyledDropdownMenu>
        </Dropdown>
    )
}
