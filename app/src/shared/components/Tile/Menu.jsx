// @flow

import React, { type Node } from 'react'
import styled from 'styled-components'
import Popover from '$shared/components/Popover'

export const MenuItem = Popover.Item

type Props = {
    children: Node,
    onToggle?: (boolean) => any,
}

const UnstyledMenu = ({ children, onToggle, ...props }: Props) => (
    <Popover
        {...props}
        title="Select"
        type="whiteMeatball"
        direction="down"
        noCaret
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
