import React, { ReactNode } from 'react'
import styled from 'styled-components'
import Popover from '$shared/components/Popover'
import PopoverItem from '$shared/components/Popover/PopoverItem'
export const MenuItem = PopoverItem
type Props = {
    children: ReactNode
    onToggle?: (arg0: boolean) => any
}

const UnstyledMenu = ({ children, onToggle, ...props }: Props) => (
    <Popover
        {...props}
        title="Select"
        type="whiteMeatball"
        direction="down"
        caret={false}
        onMenuToggle={onToggle}
        menuProps={{
            right: true,
        }}
    >
        {children}
    </Popover>
)

const Menu = styled(UnstyledMenu)`
    right: 16px;
    top: 16px;
    z-index: 1;

    && {
        position: absolute;
    }
`
export default Menu
