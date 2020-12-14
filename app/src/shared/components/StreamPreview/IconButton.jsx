import styled from 'styled-components'

const IconButton = styled.button`
    appearance: none;
    background: none;
    border-radius: 2px;
    border: 0;
    height: 32px;
    outline: 0 !important;
    position: relative;
    text-align: center;
    width: 32px;

    :hover,
    :focus {
        background-color: #efefef;
    }

    :active {
        background: #d8d8d8;
        color: #525252;
    }

    :disabled {
        background: none;
        color: inherit;
    }

    svg {
        display: block;
        height: 20px;
        left: 50%;
        position: absolute;
        top: 50%;
        transform: translate(-50%, -50%);
        width: 20px;
    }
`

export default IconButton
