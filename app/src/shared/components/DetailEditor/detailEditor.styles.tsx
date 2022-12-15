import styled, { css } from 'styled-components'
import { components, CSSObjectWithLabel } from 'react-select'
import { UncontrolledDropdown } from 'reactstrap'
import { COLORS, REGULAR, SANS, TABLET } from '$shared/utils/styled'
import BlackCheckmarkIcon from '$shared/assets/icons/checkmark-black.svg'

const SelectedOption = css`
  :after {
    content: ' ';
    background: url("${BlackCheckmarkIcon}") center center no-repeat;
    width: 10px;
    height: 10px;
    position: absolute;
    right: 12px;
    top: 18px;
  }
`

export const StyledDetailEditorDropdownOption = styled(components.Option)`
  position: relative;
  &:active {
    //background-color: ${COLORS.primary} !important;
  }
  &:focus {
    background-color: ${COLORS.focus};
  }
  
  ${(props) => {
        if (props.isSelected ) {
            return SelectedOption
        }
    }}
`

export const DetailEditorDropdown = styled(UncontrolledDropdown)`
  &.dropdown {
    display: grid;

    > button {
      font-family: ${SANS};
      font-weight: ${REGULAR};
      font-size: 14px;
      line-height: 18px;
      border: none;
      box-shadow: 0 0 1px rgba(0, 0, 0, 0.25), 0 1px 2px rgba(0, 0, 0, 0.15);
      border-radius: 4px;
      padding: 6px 8px;
      background-color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      height: auto;
      min-width: 33px;
      min-height: 33px;
      text-transform: none;
      letter-spacing: inherit;

      &:hover {
        background-color: ${COLORS.secondaryLight};
        box-shadow: 0 0 1px rgba(0, 0, 0, 0.25), 0 1px 2px rgba(0, 0, 0, 0.15);
      }

      &:active, &:focus {
        box-shadow: 0 0 1px rgba(0, 0, 0, 0.25), 0 1px 2px rgba(0, 0, 0, 0.15) !important;

        span {
          .value, .value-unset {
            color: ${COLORS.primary}
          }
        }
      }

    }

    .dropdown-menu {
      margin-top: 4px;
      border: none;
      border-radius: 8px;
      box-shadow: 0 0 1px rgba(0, 0, 0, 0.25), 0 4px 10px rgba(0, 0, 0, 0.03);
      padding: 24px 16px;
      min-width: 320px;

      .header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 13px;
        line-height: 16px;
      }

      .instruction {
        color: black;
        font-size: 14px;
      }

      .optional {
        color: ${COLORS.primaryDisabled};
        font-size: 12px;
      }

      .detail-input-cta {
        border: none;
        display: flex;
        align-items: center;
        width: 100%;
        padding: 4px 10px;
        margin-top: 8px;
        background-color: ${COLORS.secondaryLight};
        color: ${COLORS.primary};

        &:disabled {
          color: ${COLORS.disabled};
          cursor: not-allowed;
        }

        .cta-icon {
          width: 10px;
          height: 10px;
        }

        span {
          margin-left: 5px;
          font-size: 12px;
        }
      }

      .text-input-container {
        position: relative;
      }

      .text-input {
        border-radius: 4px;
        font-size: 14px;
        line-height: 30px;
        border: 1px solid ${COLORS.secondaryHover};
        padding: 8px 12px;
        width: 100%;
        outline: none;
        color: ${COLORS.primary};
        
        ::placeholder {
          color: ${COLORS.disabled};
        }

        &:focus {
          outline: 1px solid ${COLORS.focus};
        }

        &:focus:not(:placeholder-shown) {
          padding-right: 35px;
        }
      }

      .enter-icon {
        position: absolute;
        right: 10px;
        top: 15px;
        opacity: 0;
        transition: opacity 150ms ease-in;

        &.visible {
          opacity: 1;
          cursor: pointer;
        }
      }

      .invalid-input {
        outline-color: ${COLORS.error} !important;
      }

      .validation-error {
        font-size: 12px;
        margin-top: 13px;
        display: block;
        color: ${COLORS.error};
      }
    }

    .value {
      color: ${COLORS.primary};
      padding-top: 3px;
      white-space: nowrap;
      max-width: calc(100% - 16px);
      display: none;
      @media(${TABLET}) {
        display: block;
      }
    }

    .value-unset {
      color: ${COLORS.primaryDisabled}
    }

    .has-icon {
      margin-left: 4px;
    }
  }
`

export const getDetailEditorDropdownPlaceholderStyles = (styles: CSSObjectWithLabel): CSSObjectWithLabel => {
    return {
        ...styles,
        color: COLORS.disabled
    }
}

export const getDetailEditorDropdownControlStyles = (styles: CSSObjectWithLabel, isFocused: boolean): CSSObjectWithLabel => {
    const styleObject: CSSObjectWithLabel = {
        ...styles,
        fontSize: '14px',
        padding: '5px 0',
        borderColor: COLORS.secondaryHover
    }
    if (isFocused) {
        styleObject.borderColor = COLORS.focus
        styleObject.boxShadow = `0 0 0 1px ${COLORS.focus}`
    }
    return styleObject
}

export const getDetailEditorDropdownMenuStyles = (styles: CSSObjectWithLabel): CSSObjectWithLabel => {
    return {
        ...styles,
        background: '#FFF',
        border: 'none',
        borderRadius: '8px',
        color: COLORS.primary,
        width: '288px',
        padding: 0,
        boxShadow: '0px 0px 4px rgba(0, 0, 0, 0.1)',
        marginTop: '4px'
    }
}

export const getDetailEditorDropdownMenuListStyles = (styles: CSSObjectWithLabel): CSSObjectWithLabel => {
    return {
        ...styles,
        padding: 0,
        borderRadius: '8px',
    }
}

export const getDetailEditorDropdownOptionStyles = (styles: CSSObjectWithLabel, isSelected: boolean): CSSObjectWithLabel => {
    const styleObject: CSSObjectWithLabel = {
        ...styles,
        cursor: 'pointer',
        color: COLORS.primaryLight,
        fontSize: '14px',
        fontWeight: 400,
        lineHeight: '18px'
    }
    if (isSelected) {
        styleObject.color = COLORS.primaryLight
        styleObject.backgroundColor = 'white'
    }
    return styleObject
}
