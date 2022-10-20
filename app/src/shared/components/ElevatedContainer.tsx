import React, { useState, useEffect, FunctionComponent, ReactNode } from 'react'
import styled, { css } from 'styled-components'
import { TOOLBAR_SHADOW, MD } from '$shared/utils/styled'
import useInt from '$shared/hooks/useInt'
export const Root = styled.div<{elevated: boolean, offset: number}>`
    ${({ elevated, offset }) =>
        (offset === 0 || !!elevated) &&
        css`
            box-shadow: ${TOOLBAR_SHADOW};
            transition: 200ms box-shadow;
        `}

    ${({ elevated }) =>
        !elevated &&
        css`
            @media (min-width: ${MD}px) {
                box-shadow: none;
            }
        `}
`
type Props = {
    offset?: number | string
    children?: ReactNode | ReactNode[]
}

const UnstyledElevatedContainer: FunctionComponent<Props> = ({ offset: offsetProp = 0, children, ...props }: Props) => {
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
    return <Root {...props} elevated={scrolled} offset={offset}>{children}</Root>
}

const ElevatedContainer = styled(UnstyledElevatedContainer)<Props>``
export default ElevatedContainer
