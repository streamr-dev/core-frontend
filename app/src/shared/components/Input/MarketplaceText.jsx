// @flow

import React from 'react'
import styled, { css } from 'styled-components'
import CoreText from './CoreText'

type Props = {
    invalid?: boolean,
}

const UnstyledMarketplaceText = ({ invalid, ...props }: Props) => (
    <CoreText {...props} />
)

export default styled(UnstyledMarketplaceText)`
    height: auto;
    letter-spacing: 0;
    line-height: 40px;

    ${({ invalid }) => !!invalid && css`
        border-color: #FF5C00;
    `}
`
