import React, { useState, ReactNode, HTMLAttributes } from 'react'
import styled, { css } from 'styled-components'
import Popover from '~/shared/components/Popover'

const Container = styled.div``

const Root = styled.div<{ $open?: boolean }>`
    position: relative;

    ${Container} {
        position: absolute;
        right: 0.5rem;
        top: 50%;
        transform: translateY(-50%);
    }

    ${({ $open = false }) =>
        $open &&
        css`
            ${Container} {
                z-index: 2;
            }
        `}
`

interface Props extends HTMLAttributes<HTMLDivElement> {
    actions?: ReactNode
    disabled?: boolean
}

function UnstyledWithInputActions({ actions, disabled, children, ...props }: Props) {
    const [open, setOpen] = useState(false)

    if (!actions) {
        return children
    }

    return (
        <Root {...props} $open={open}>
            {children}
            <Container>
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
            </Container>
        </Root>
    )
}

const WithInputActions = styled(UnstyledWithInputActions)``

export default WithInputActions
