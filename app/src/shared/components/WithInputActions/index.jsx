// @flow

import React, { type Node, useState } from 'react'
import styled, { css } from 'styled-components'
import Popover from '$shared/components/Popover'
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
    actions?: Array<typeof Popover.Item>,
    disabled?: boolean,
    children?: Node,
}

const UnstyledWithInputActions = ({ actions, disabled, children = null, ...props }: Props) => {
    const [open, setOpen]: UseStateTuple<boolean> = useState(false)

    return !actions || !actions.length ? (
        children
    ) : (
        <div {...props}>
            {children}
            <ActionContainer open={open}>
                <Popover
                    disabled={disabled}
                    title="Actions"
                    type="grayMeatball"
                    menuProps={{
                        right: true,
                    }}
                    onMenuToggle={setOpen}
                    caret={false}
                >
                    {actions}
                </Popover>
            </ActionContainer>
        </div>
    )
}

const WithInputActions = styled(UnstyledWithInputActions)`
    position: relative;
`

export default WithInputActions
