import React from 'react'
import styled, { css } from 'styled-components'

export function CopyIcon() {
    return (
        <IconWrap aria-label="Copy" $width={16} $height={16}>
            <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
            >
                <path
                    // eslint-disable-next-line max-len
                    d="M5.33398 2.66665V10.6666C5.33398 11.0203 5.47446 11.3594 5.72451 11.6095C5.97456 11.8595 6.3137 12 6.66732 12H12.0007C12.3543 12 12.6934 11.8595 12.9435 11.6095C13.1935 11.3594 13.334 11.0203 13.334 10.6666V4.82798C13.334 4.65035 13.2984 4.47452 13.2295 4.31081C13.1606 4.1471 13.0597 3.99881 12.9327 3.87465L10.7227 1.71331C10.4736 1.46975 10.139 1.33336 9.79065 1.33331H6.66732C6.3137 1.33331 5.97456 1.47379 5.72451 1.72384C5.47446 1.97389 5.33398 2.31302 5.33398 2.66665Z"
                    stroke="#A3A3A3"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
                <path
                    // eslint-disable-next-line max-len
                    d="M10.667 12V13.3333C10.667 13.6869 10.5265 14.0261 10.2765 14.2761C10.0264 14.5262 9.68728 14.6666 9.33366 14.6666H4.00033C3.6467 14.6666 3.30756 14.5262 3.05752 14.2761C2.80747 14.0261 2.66699 13.6869 2.66699 13.3333V5.99996C2.66699 5.64634 2.80747 5.3072 3.05752 5.05715C3.30756 4.8071 3.6467 4.66663 4.00033 4.66663H5.33366"
                    stroke="#A3A3A3"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
            </svg>
        </IconWrap>
    )
}

export function ExternalLinkIcon() {
    return (
        <IconWrap aria-label="External link" $width={14} $height={14}>
            <svg
                xmlns="http://www.w3.org/2000/svg"
                width="14"
                height="14"
                viewBox="0 0 14 14"
                fill="none"
            >
                <path
                    d="M12.9999 4.42857V1H9.57129"
                    stroke="#A3A3A3"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
                <path
                    d="M13.0004 1L5.28613 8.71429"
                    stroke="#A3A3A3"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
                <path
                    // eslint-disable-next-line max-len
                    d="M6.5 3.57141H1.78571C1.35178 3.57141 1 3.92319 1 4.35713V12.2143C1 12.6482 1.35178 13 1.78571 13H9.64286C10.0768 13 10.4286 12.6482 10.4286 12.2143V7.49998"
                    stroke="#A3A3A3"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
            </svg>
        </IconWrap>
    )
}

export function PencilIcon() {
    return (
        <IconWrap aria-label="Edit" $width={14} $height={14}>
            <svg
                xmlns="http://www.w3.org/2000/svg"
                width="14"
                height="14"
                viewBox="0 0 14 14"
                fill="none"
            >
                <path
                    // eslint-disable-next-line max-len
                    d="M12.1169 1.71649C11.9402 1.54061 11.7305 1.40148 11.4998 1.30712C11.2691 1.21276 11.022 1.16504 10.7727 1.16673C10.5235 1.16842 10.277 1.21947 10.0476 1.31695C9.81822 1.41442 9.6104 1.55639 9.43617 1.73464L1.91776 9.25304L1 12.8334L4.58031 11.9151L12.0987 4.39667C12.277 4.22252 12.419 4.01475 12.5165 3.78539C12.614 3.55602 12.6651 3.30959 12.6668 3.06036C12.6685 2.81114 12.6208 2.56404 12.5264 2.33338C12.432 2.10271 12.2928 1.89304 12.1169 1.71649V1.71649Z"
                    stroke="#ADADAD"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
                <path
                    d="M9.2207 1.94983L11.8827 4.61186"
                    stroke="#ADADAD"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
                <path
                    d="M1.91797 9.2525L4.58259 11.9125"
                    stroke="#ADADAD"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
            </svg>
        </IconWrap>
    )
}

const IconWrap = styled.span<{
    $width?: number
    $height?: number
}>`
    align-items: center;
    display: flex;
    justify-content: center;

    &,
    svg {
        display: block;

        ${({ $width = 24, $height = 24 }) => css`
            width: ${$width}px;
            height: ${$height}px;
        `}
    }
`

IconWrap.defaultProps = { rel: 'img ' }
