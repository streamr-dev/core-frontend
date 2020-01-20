// @flow

import styled from 'styled-components'
import Text from './Text'

export default styled(Text)`
    color: #323232;
    background-color: ${({ dark }) => (dark ? '#fdfdfd' : '#ffffff')};
    border-radius: 4px;
    border: 1px solid #EFEFEF;
    display: block;
    font-size: 1rem;
    height: 40px;
    line-height: 1.5rem;
    width: 100%;
    padding: 0 1rem;
    box-sizing: border-box;
    box-shadow: none;
    outline: none;

    :focus {
        outline: none;
        box-shadow: none;
        border: 1px solid #0324FF;
    }

    ::placeholder {
        color: #CDCDCD;
    }

    &[type=number] {
        appearance: textfield; /* Hide spin buttons for Mozilla based browsers */
        margin: 0;
        display: inline-block;
        width: calc(100% - 24px);
    }

    /* Hide spin buttons for Webkit based browsers */
    &[type=number]::-webkit-inner-spin-button,
    &[type=number]::-webkit-outer-spin-button {
        appearance: none;
        margin: 0;
    }
`
