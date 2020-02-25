// @flow

import React from 'react'
import styled from 'styled-components'
import DropdownActions from '$shared/components/DropdownActions'
import Meatball from '$shared/components/Meatball'

export const MenuItem = DropdownActions.Item

type Props = {
    children: Array<typeof MenuItem>,
    onToggle?: (boolean) => any,
}

const UnstyledMenu = ({ children, onToggle, ...props }: Props) => (
    <DropdownActions
        {...props}
        title={(
            <Meatball alt="Select" white />
        )}
        direction="down"
        noCaret
        onMenuToggle={onToggle}
        menuProps={{
            modifiers: {
                offset: {
                    // Make menu aligned to the right.
                    // See https://popper.js.org/popper-documentation.html#modifiers..offset
                    offset: '-100%p + 100%',
                },
            },
        }}
    >
        {children}
    </DropdownActions>
)

const Menu = styled(UnstyledMenu)`
    position: absolute;
    right: 16px;
    top: 16px;
    z-index: 1;
`

export default Menu
