// @flow

import styled, { css } from 'styled-components'
import CoreText from './CoreText'

export default styled(CoreText)`
    height: auto;
    letter-spacing: 0;
    line-height: 40px;

    ${({ invalid }) => !!invalid && css`
        border-color: #FF5C00;
    `}
`
