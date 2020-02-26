// @flow

import styled, { css } from 'styled-components'
import Menu from './Menu'
import { Image } from './ImageContainer'

const Tile = styled.div`
    position: relative;

    ${Menu} {
        opacity: 0;
        pointer-events: none;
        transition-property: visibility, opacity;
        transition: 200ms;
        visibility: hidden;
    }

    ${Menu}.show,
    :hover ${Menu},
    :focus ${Menu} {
        opacity: 1;
        pointer-events: auto;
        visibility: visible;
    }

    ${({ suppressHover }) => !suppressHover && css`
        ${Image} {
            filter: brightness(100%);
            transition: 240ms ease-out filter;
        }

        ${Menu}.show + a ${Image},
        :hover ${Image} {
            filter: brightness(70%);
            transition-duration: 40ms;
        }
    `}
`

export default Tile
