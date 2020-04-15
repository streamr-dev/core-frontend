// @flow

import React, { type Node, useState } from 'react'
import styled, { css } from 'styled-components'
import Meatball from '$shared/components/Meatball'
import DropdownActions from '$shared/components/DropdownActions'
import { type UseStateTuple } from '$shared/flowtype/common-types'

const ActionContainer = styled.div`
    display: inline-block;
    position: absolute;
    right: 0.5rem;
    top: 50%;
    transform: translate(0, -50%);

    ${({ open }) => !!open && css`
        z-index: 2;
    `}
`

type Props = {
    actions?: Array<typeof DropdownActions.Item>,
    disabled?: boolean,
    children?: Node,
}

const UnstyledActionsDropdown = ({ actions, disabled, children = null, ...props }: Props) => {
    const [open, setOpen]: UseStateTuple<boolean> = useState(false)

    return !actions || !actions.length ? (
        children
    ) : (
        <div {...props}>
            {children}
            <ActionContainer open={open}>
                <DropdownActions
                    disabled={disabled}
                    title={(
                        <Meatball
                            alt="Actions"
                            gray
                            disabled={disabled}
                        />
                    )}
                    menuProps={{
                        right: true,
                    }}
                    onMenuToggle={setOpen}
                    noCaret
                >
                    {actions}
                </DropdownActions>
            </ActionContainer>
        </div>
    )
}

const ActionsDropdown = styled(UnstyledActionsDropdown)`
    position: relative;
`

export default ActionsDropdown
