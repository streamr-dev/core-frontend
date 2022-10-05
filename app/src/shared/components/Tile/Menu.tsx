import type { Node } from 'react'
import React from 'react'
import styled from 'styled-components'
import Popover from '$shared/components/Popover'
export const MenuItem = Popover.Item
type Props = {
    children: Node
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
