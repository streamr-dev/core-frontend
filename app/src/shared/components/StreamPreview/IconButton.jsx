import styled from 'styled-components'

const IconButton = styled.button`
    width: 32px;
    height: 32px;
    text-align: center;
    position: relative;
    border: none;
    background: none;
    appearance: none;
    border-radius: 2px;

    &:not(:disabled):hover,
    &:focus {
        background-color: #EFEFEF;
        outline: none;
    }

    &:not(:disabled):active {
        background-color: #D8D8D8;
        color: #525252;
    }

    svg {
        width: 20px;
        height: 20px;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
    }

    & + & {
        margin-left: 32px;
    }
`

export default IconButton
