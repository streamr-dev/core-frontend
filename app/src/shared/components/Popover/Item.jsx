import React from 'react'
import { DropdownItem as RsDropdownItem } from 'reactstrap'
import styled from 'styled-components'

import SvgIcon from '$shared/components/SvgIcon'

const TickIcon = styled(SvgIcon)`
    width: 10px;
    position: absolute;
    transform: translateY(-50%);
    top: 50%;
    right: 10px;
`

const StyledDropdownItem = styled(RsDropdownItem)`
    display: flex;
    align-items: center;
    font-size: 14px;
    cursor: pointer;
    margin-right: 10px;
    position: relative;

    &&[data-tick-position="left"] {
        padding-left: 32px;

        ${TickIcon} {
            left: 10px;
            right: auto;
        }
    }
`

const Item = ({
    children,
    active,
    onClick,
    leftTick,
    ...rest
}) => (
    <StyledDropdownItem
        {...rest}
        onClick={onClick}
        data-tick-position={leftTick ? 'left' : 'right'}
    >
        {children}
        {active &&
            <TickIcon name="tick" />
        }
    </StyledDropdownItem>
)

export default Item
