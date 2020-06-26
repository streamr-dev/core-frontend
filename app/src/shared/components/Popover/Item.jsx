import React from 'react'
import { DropdownItem as RsDropdownItem } from 'reactstrap'
import styled from 'styled-components'

import SvgIcon from '$shared/components/SvgIcon'

const StyledDropdownItem = styled(RsDropdownItem)`
    display: flex;
    align-items: center;
    font-size: 14px;
    cursor: pointer;
    margin-right: 10px;
    position: relative;
`

const TickIcon = styled(SvgIcon)`
    width: 10px;
    position: absolute;
    right: 10px;
    top: 50%;
    transform: translateY(-50%);
`

const Item = ({ children, active, onClick, ...rest }) => (
    <StyledDropdownItem
        onClick={onClick}
        {...rest}
    >
        {children}
        {active &&
            <TickIcon name="tick" />
        }
    </StyledDropdownItem>
)

export default Item
