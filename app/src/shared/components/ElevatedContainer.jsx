// @flow

import React, { useState, useEffect } from 'react'
import styled, { css } from 'styled-components'
import { TOOLBAR_SHADOW, MD } from '$shared/utils/styled'
import useInt from '$shared/hooks/useInt'

export const Root = styled.div`
    ${({ elevated, offset }) => (offset === 0 || !!elevated) && css`
        box-shadow: ${TOOLBAR_SHADOW};
        transition: 200ms box-shadow;
    `}

    ${({ elevated }) => !elevated && css`
        @media (min-width: ${MD}px) {
            box-shadow: none;
        }
    `}
`

type Props = {
    offset?: number | string,
}

const UnstyledElevatedContainer = ({ offset: offsetProp = 0, ...props }: Props) => {
    const [scrolled, setScrolled] = useState(false)

    const offset = useInt(offsetProp)

    useEffect(() => {
        const onScroll = () => {
            setScrolled(window.scrollY > offset)
        }

        window.addEventListener('scroll', onScroll)
        onScroll()

        return () => {
            window.removeEventListener('scroll', onScroll)
        }
    }, [offset])

    return (
        <Root {...props} elevated={scrolled} offset={offset} />
    )
}

const ElevatedContainer = styled(UnstyledElevatedContainer)`
`

export default ElevatedContainer
