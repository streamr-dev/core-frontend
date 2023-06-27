import React, { FunctionComponent, ReactNode } from 'react'
import styled from 'styled-components'
import { DropdownItem, DropdownItem as RsDropdownItem } from 'reactstrap'
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
    font-size: 16px;
    cursor: pointer;
    margin-right: 10px;
    position: relative;
    padding: 10px 16px !important;

    &&[data-tick-position='left'] {
        padding-left: 32px;

        ${TickIcon} {
            left: 10px;
            right: auto;
        }
    }
`

type PopoverItemProps = {
    children?: ReactNode | string
    onClick?: () => any
    active?: boolean
    leftTick?: boolean
    value?: any
}

const PopoverItem: FunctionComponent<PopoverItemProps & DropdownItem['props']> = ({
    children,
    active,
    onClick,
    leftTick,
    disabled,
    ...rest
}) => (
    <StyledDropdownItem
        {...rest}
        onClick={onClick}
        data-tick-position={leftTick ? 'left' : 'right'}
        disabled={disabled}
    >
        {children}
        {active && <TickIcon name="tick" />}
    </StyledDropdownItem>
)

export default PopoverItem
