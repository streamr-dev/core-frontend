// @flow

import React, { type ComponentType, useState } from 'react'
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
}

const ActionsDropdownDecorator = (WrappedComponent: ComponentType<any>) => {
    const ActionsDropdownDecoratorWrapper = ({ actions, ...props }: Props) => {
        const [open, setOpen]: UseStateTuple<boolean> = useState(false)

        return (
            <React.Fragment>
                <WrappedComponent {...props} />
                {actions && actions.length > 0 && (
                    <ActionContainer open={open}>
                        <DropdownActions
                            title={(
                                <Meatball alt="Actions" gray />
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
                )}
            </React.Fragment>
        )
    }

    return ActionsDropdownDecoratorWrapper
}

export default ActionsDropdownDecorator
