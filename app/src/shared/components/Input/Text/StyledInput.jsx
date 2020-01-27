// @flow

import styled, { css } from 'styled-components'

export const SpaciousTheme = {
    height: 'auto',
    lineHeight: '4rem',
}

export default styled.input`
    background-color: ${({ dark }) => (dark ? '#fdfdfd' : '#ffffff')};
    border: 1px solid #EFEFEF;
    border-radius: 4px;
    box-shadow: none;
    box-sizing: border-box;
    color: #323232;
    display: block;
    font-size: 1rem;
    height: 40px;
    line-height: 1.5rem;
    outline: none;
    padding: 0 1rem;
    width: 100%;

    ${({ theme }) => !!(theme && theme.height) && css`
        height: ${theme.height};
    `}

    ${({ theme }) => !!(theme && theme.lineHeight) && css`
        line-height: ${theme.lineHeight};
    `}

    :focus {
        border: 1px solid #0324FF;
        box-shadow: none;
        outline: none;
    }

    ::placeholder {
        color: #CDCDCD;
    }

    &[type=number] {
        appearance: textfield; /* Hide spin buttons for Mozilla based browsers */
        display: inline-block;
        margin: 0;
        width: calc(100% - 24px);
    }

    /* Hide spin buttons for Webkit based browsers */
    &[type=number]::-webkit-inner-spin-button,
    &[type=number]::-webkit-outer-spin-button {
        appearance: none;
        margin: 0;
    }

    ${({ invalid }) => !!invalid && css`
        border-color: #FF5C00;
    `}
`
