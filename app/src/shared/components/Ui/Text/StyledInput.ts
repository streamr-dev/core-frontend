import styled, { css } from 'styled-components'

export const SpaciousTheme = {
    height: '64px',
}

const StyledInput = styled.input<{dark?: boolean, invalid?: boolean, theme?: any}>`
    background-color: ${({ dark }) => (dark ? '#fdfdfd' : '#ffffff')};
    border: 1px solid #efefef;
    border-radius: 4px;
    box-shadow: none;
    box-sizing: border-box;
    color: #323232;
    display: block;
    font-size: 1rem;
    height: 40px;
    line-height: 1;
    outline: none;
    padding: 0 1rem;
    width: 100%;

    ${({ theme }) =>
        !!(theme && theme.height) &&
        css`
            height: ${theme.height};
        `}

    ${({ theme }) =>
        !!(theme && theme.lineHeight) &&
        css`
            line-height: ${theme.lineHeight};
        `}

    /* Avoids weird browser bug where translucent elements with
     * same background colour and same opacity render with
     * different colours
     */
    backface-visibility: hidden;

    :disabled {
        opacity: 0.5;
        cursor: not-allowed;
        background-color: #efefef;
        border-color: #efefef;
        color: #32323280;
    }

    :not(:disabled):focus {
        border: 1px solid #0324ff;
        box-shadow: none;
        outline: none;
    }

    ::placeholder {
        color: #cdcdcd;
    }

    &[type='number'] {
        appearance: textfield; /* Hide spin buttons for Mozilla based browsers */
        display: inline-block;
        margin: 0;
        width: 100%;
    }

    /* Hide spin buttons for Webkit based browsers */
    &[type='number']::-webkit-inner-spin-button,
    &[type='number']::-webkit-outer-spin-button {
        appearance: none;
        margin: 0;
    }

    ${({ invalid }) =>
        !!invalid &&
        css`
            :not(:disabled),
            :not(:disabled):focus {
                border-color: #ff5c00;
            }
        `}
`

export default StyledInput
