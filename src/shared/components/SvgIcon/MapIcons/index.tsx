import React from 'react'

/* eslint-disable max-len */
type MapIconProps = {
    color: string
}
export const CircleIcon = ({ color }: MapIconProps) => (
    <svg viewBox="0 0 12 12" xmlns="http://www.w3.org/2000/svg">
        <g transform="translate(-6 -6)" fillRule="evenodd">
            <path d="M0 0h24v24H0z" fill="none" />
            <circle fill={color} cx="12" cy="12" r="6" />
        </g>
    </svg>
)
CircleIcon.defaultProps = {
    color: '#FFFFFF',
}
export const PinIcon = ({ color }: MapIconProps) => (
    <svg viewBox="0 0 12 14" xmlns="http://www.w3.org/2000/svg">
        <g transform="translate(-6 -6)" fill="none" fillRule="evenodd">
            <path d="M0 0h24v24H0z" />
            <path
                d="M12 20c.049 0 6-4.686 6-8a6 6 0 1 0-12 0c0 3.314 5.92 8 6 8z"
                fill={color}
            />
            <circle fill="#FFF" cx="12" cy="12" r="2" />
        </g>
    </svg>
)
PinIcon.defaultProps = {
    color: '#FFFFFF',
}
export const ArrowIcon = ({ color }: MapIconProps) => (
    <svg viewBox="0 0 11 10" xmlns="http://www.w3.org/2000/svg">
        <g fill="none" fillRule="evenodd">
            <path d="M-7-7h24v24H-7z" />
            <path
                d="M6.5 3.361V8.84a1 1 0 0 1-2 0V3.338L1.86 5.873A1 1 0 0 1 .473 4.431L4.784.294a.997.997 0 0 1 .704-.279.997.997 0 0 1 .705.279l4.309 4.137a1 1 0 0 1-1.385 1.442L6.5 3.361z"
                fill={color}
                fillRule="nonzero"
            />
        </g>
    </svg>
)
ArrowIcon.defaultProps = {
    color: '#FFFFFF',
}
export const ArrowHeadIcon = ({ color }: MapIconProps) => (
    <svg viewBox="0 0 8 9" xmlns="http://www.w3.org/2000/svg">
        <g fill="none" fillRule="evenodd">
            <path d="M-8-7h24v24H-8z" />
            <path
                d="M.13 7.7L3.477.897A.5.5 0 0 1 4.37.892l3.478 6.842a.5.5 0 0 1-.772.605L3.917 5.613.913 8.293A.5.5 0 0 1 .13 7.7z"
                fill={color}
            />
        </g>
    </svg>
)
ArrowHeadIcon.defaultProps = {
    color: '#FFFFFF',
}
export const LongArrowIcon = ({ color }: MapIconProps) => (
    <svg viewBox="0 0 11 16" xmlns="http://www.w3.org/2000/svg">
        <g fill="none" fillRule="evenodd">
            <path d="M-7-4h24v24H-7z" />
            <path
                d="M6.333 3.346v11.4a1 1 0 1 1-2 0V3.322l-2.64 2.535A1 1 0 1 1 .307 4.416L4.617.279A.997.997 0 0 1 5.32 0a.997.997 0 0 1 .705.279l4.31 4.137A1 1 0 1 1 8.95 5.858L6.333 3.346z"
                fill={color}
                fillRule="nonzero"
            />
        </g>
    </svg>
)
LongArrowIcon.defaultProps = {
    color: '#FFFFFF',
}
