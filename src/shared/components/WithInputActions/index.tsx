import React, { useState, ReactNode, FunctionComponent } from 'react'
import styled, { css } from 'styled-components'
import Popover from '~/shared/components/Popover'

const ActionContainer = styled.div<{ open: boolean }>`
    display: inline-block;
    position: absolute;
    right: 0.5rem;
    top: 50%;
    transform: translate(0, -50%);

    ${({ open }) =>
        !!open &&
        css`
            z-index: 2;
        `}
`

type Props = {
    actions?: ReactNode[]
    disabled?: boolean
    children?: ReactNode | ReactNode[]
    className?: string
}

const UnstyledWithInputActions: FunctionComponent<Props> = ({
    actions,
    disabled,
    children = null,
    ...props
}: Props) => {
    const [open, setOpen] = useState(false)
    return (
        <>
            {!actions || !actions.length ? (
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
            )}
        </>
    )
}

const WithInputActions = styled(UnstyledWithInputActions)`
    position: relative;
`
export default WithInputActions
