import styled, { css } from 'styled-components'
import ImageChecked from './checkbox-checked.svg'
import ImageUnchecked from './checkbox.svg'

const Checkbox = styled.div`
    background: url(${ImageUnchecked}) no-repeat;
    height: 16px;
    position: relative;
    width: 16px;

    ::after {
        background: url(${ImageChecked}) no-repeat;
        bottom: 0;
        content: ' ';
        display: block;
        left: 0;
        opacity: 0;
        position: absolute;
        right: 0;
        top: 0;
        transition: opacity 0.1s;
    }

    ${({ checked }) => !!checked && css`
        ::after {
            opacity: 1;
        }
    `}
`

export default Checkbox
