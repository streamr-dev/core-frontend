// @flow

import * as React from 'react'
import styled from 'styled-components'
import { XL } from '$shared/utils/styled'

type Props = {
    leftContent: React.Node,
    rightContent: React.Node,
    className?: string,
}

const UnstyledHero = ({ leftContent, rightContent, ...props }: Props) => (
    <div {...props}>
        <div>
            {leftContent}
        </div>
        <div>
            {rightContent}
        </div>
    </div>
)

const Hero = styled(UnstyledHero)`
    display: grid;
    grid-column-gap: 4rem;
    grid-row-gap: 1.75rem;
    grid-template-columns: 1fr;

    @media (min-width: ${XL}px) {
        grid-template-columns: 480px 1fr;
    }
`

export default Hero
