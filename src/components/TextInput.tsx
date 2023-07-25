import styled, { css } from 'styled-components'
import { COLORS } from '~/shared/utils/styled'
import Label from '~/shared/components/Ui/Label'

export const TextInput = styled.input`
    background: none;
    border: 0;
    backface-visibility: hidden;
    font-size: inherit;
    height: 100%;
    color: ${COLORS.primary};
    padding: 0 18px;
    flex-grow: 1;
    outline: 0;

    ::-webkit-outer-spin-button,
    ::-webkit-inner-spin-button {
        -webkit-appearance: none;
        margin: 0;
    }

    &[type='number'] {
        -moz-appearance: textfield;
    }

    &::placeholder {
        color: #a3a3a3;
    }
`
export const Appendix = styled.div`
    align-items: center;
    display: flex;
    flex-shrink: 0;
    height: 100%;
`
export const TextAppendix = styled(Appendix)`
    padding: 0 18px;
`
export const FieldWrap = styled.div<{ $invalid?: boolean; $grayedOut?: boolean }>`
    display: flex;
    border: 1px solid transparent;
    align-items: center;
    background: #ffffff;
    font-size: 14px;
    border-radius: 8px;
    height: 40px;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.02);

    :focus-within {
        box-shadow: 0 0 3px rgba(0, 0, 0, 0.1);
    }

    & + ${Label} {
        margin-top: 24px;
    }

    ${TextAppendix} {
        border-left: 1px solid #efefef;
    }

    ${({ $invalid = false }) =>
        $invalid &&
        css`
            border: 1px solid #d90c25;

            ${TextAppendix} {
                border-color: #d90c25;
            }
        `}

    ${({ $grayedOut = false }) =>
        $grayedOut &&
        css`
            border-color: #f8f8f8;
            background: #f8f8f8;
        `}
`
export const CopyButtonWrapAppendix = styled(Appendix)`
    padding: 0 16px 0 0;

    button {
        align-items: center;
        appearance: none;
        background: #ffffff;
        border: 0;
        color: #525252;
        display: flex;
        height: 24px;
        justify-content: center;
        width: 24px;
    }
`
export const IconWrapAppendix = styled(Appendix)`
    color: #a3a3a3;
    padding-right: 10px;
`
