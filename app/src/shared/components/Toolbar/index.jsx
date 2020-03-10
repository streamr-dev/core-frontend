// @flow

import React, { useEffect, useState } from 'react'
import styled, { css } from 'styled-components'
import Buttons, { type ButtonActions } from '$shared/components/Buttons'
import { TOOLBAR_SHADOW, MD } from '$shared/utils/styled'

const Cell = styled.div`
    align-items: center;
    display: flex;
`

const Left = styled(Cell)``

const Middle = styled(Cell)``

const Right = styled.div`
    text-align: right;
`

const Root = styled.div`
    ${({ elevated }) => !elevated && css`
        @media (min-width: ${MD}px) {
            /* Toolbar styling comes AFTER Root's thus higher specificity is given here. */
            && {
                box-shadow: none;
            }
        }
    `}
`

type Props = {
    actions?: ButtonActions,
    altMobileLayout?: boolean,
    left?: Node,
    middle?: Node,
}

const UnstyledToolbar = ({
    actions,
    altMobileLayout,
    left,
    middle,
    ...props
}: Props) => {
    const [scrolled, setScrolled] = useState(false)

    useEffect(() => {
        const onScroll = () => {
            setScrolled(window.scrollY !== 0)
        }

        window.addEventListener('scroll', onScroll)

        return () => {
            window.removeEventListener('scroll', onScroll)
        }
    }, [])

    return (
        <Root {...props} elevated={scrolled}>
            {!!(left || middle) && (
                <Left>
                    {left}
                </Left>
            )}
            {!!middle && (
                <Middle>
                    {middle}
                </Middle>
            )}
            {!!actions && (
                <Right>
                    <Buttons actions={actions} />
                </Right>
            )}
        </Root>
    )
}

const Toolbar = styled(UnstyledToolbar)`
    background-color: white;
    box-shadow: ${TOOLBAR_SHADOW};
    display: flex;
    min-height: 4rem;
    padding: 1.25rem 2rem;
    position: sticky;
    top: 0;
    transition: 200ms box-shadow;
    width: 100%;
    z-index: 5;

    ${({ altMobileLayout }) => !!altMobileLayout && css`
        @media (max-width: ${MD - 1}px) {
            bottom: 0;
            padding: 15px;
            position: fixed;
            top: auto;
        }
    `}

    ${Left},
    ${Right} {
        flex: 1;
    }
`

export default Toolbar
