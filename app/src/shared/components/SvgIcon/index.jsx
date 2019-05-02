// @flow

import React from 'react'

import UploadIcon from './ImageUploadIcon'
import CheckmarkIcon from './CheckmarkIcon'
import * as MapIcons from './MapIcons'
import styles from './svgIcon.pcss'

/* eslint-disable max-len */

const sources = {
    back: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 8 14">
            <path
                strokeWidth="1.5"
                d="M7 13L1 7l6-6"
                fill="none"
                fillRule="evenodd"
                strokeLinecap="round"
                strokeLinejoin="round"
                className={styles.default}
            />
        </svg>
    ),
    caretUp: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 11 6">
            <path
                d="M1 5.245L5.245 1l4.243 4.243"
                stroke="currentColor"
                strokeWidth="1.5"
                fill="none"
                fillRule="evenodd"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    ),
    caretDown: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 11 6">
            <path
                d="M9.488 1.243L5.243 5.488 1 1.245"
                stroke="currentColor"
                strokeWidth="1.5"
                fill="none"
                fillRule="evenodd"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    ),
    tick: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 10 8">
            <path
                d="M1.271 4.55l2.2 2.39 5.657-5.658"
                strokeWidth="1.5"
                fill="none"
                fillRule="evenodd"
                strokeLinecap="round"
                strokeLinejoin="round"
                className={styles.default}
            />
        </svg>
    ),
    cross: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 15 15">
            <path
                d="M1 1l13.2 13.2m0-13.2L1 14.2"
                fill="none"
                className={styles.default}
            />
        </svg>
    ),
    crossMedium: (
        <svg viewBox="0 0 10 10" xmlns="http://www.w3.org/2000/svg">
            <path
                d="M.757.757l8.486 8.486m0-8.486L.757 9.243"
                strokeWidth="1.5"
                stroke="currentColor"
                fill="none"
                fillRule="evenodd"
                strokeLinecap="round"
            />
        </svg>
    ),
    crossHeavy: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 8 8">
            <g stroke="currentColor" strokeWidth="1.5" fill="none" fillRule="evenodd" strokeLinecap="round">
                <path d="M7.182 6.975L1.525 1.318M1.525 6.975l5.657-5.657" />
            </g>
        </svg>
    ),
    play: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
            <path
                d="M12 22l10-6-10-6z"
                strokeLinejoin="round"
                fill="none"
                fillRule="evenodd"
                className={styles.default}
            />
        </svg>
    ),
    pause: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
            <path
                d="M11 10h3v12h-3zm7 0h3v12h-3z"
                strokeLinejoin="round"
                fill="none"
                fillRule="evenodd"
                className={styles.default}
            />
        </svg>
    ),
    minus: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 8 2">
            <g fill="none" fillRule="evenodd">
                <path stroke="currentColor" strokeLinecap="round" d="M7.2 1H.8" />
            </g>
        </svg>
    ),
    plus: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 8 8">
            <g fill="none" fillRule="evenodd">
                <g stroke="currentColor" strokeLinecap="round">
                    <path d="M4 .8v6.4M7.2 4H.8" />
                </g>
            </g>
        </svg>
    ),
    user: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 30 30">
            <g
                transform="translate(1 1)"
                stroke="currentColor"
                strokeWidth="1.5"
                fill="none"
                fillRule="evenodd"
                strokeLinecap="round"
                strokeLinejoin="round"
            >
                <path d="M8.188 7.711a10.622 10.622 0 0 0 11.838 2.381" />
                <circle cx="13.696" cy="10.957" r="6.391" />
                <path d="M22.111 24.501a11.865 11.865 0 0 0-16.831 0" />
                <circle cx="13.696" cy="13.696" r="13.696" />
            </g>
        </svg>
    ),
    imageUpload: (
        <UploadIcon />
    ),
    checkmark: (
        <CheckmarkIcon />
    ),
    error: (
        <svg viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
            <path
                d="M8 13.795a1.001 1.001 0 0 1 0-2.004 1.001 1.001 0 0 1 0 2.004zm-.8-7.416h1.6v4.81H7.2V6.38zm8.716 8.46L8.716.409c-.271-.544-1.16-.544-1.432 0L.084 14.84A.802.802 0 0 0 .8 16h14.4a.802.802 0 0 0 .716-1.16z" // eslint-disable-line max-len
                fill="#6240AF"
                fillRule="evenodd"
            />
        </svg>
    ),
    csvUpload: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52">
            <g fill="none" fillRule="evenodd">
                <circle fill="#EFEFEF" cx="26" cy="26" r="26" />
                <g
                    transform="translate(15 15)"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.5"
                    className={styles.default}
                >
                    <circle cx="17.25" cy="17.25" r="6" />
                    <path d="M17.25 20.25v-6M17.25 14.25L15 16.5M17.25 14.25l2.25 2.25M3.75 6.75v9h4.5" />
                    <path d="M3.75 12.75l2.689-2.689a1.5 1.5 0 0 1 2.122 0l.581.581a1.5 1.5 0 0 0 2.346-.289l.358-.6" />
                    <path d="M9 20.25H2.25a1.5 1.5 0 0 1-1.5-1.5V2.25a1.5 1.5 0 0 1 1.5-1.5h10.629a1.5 1.5 0 0 1 1.06.439l2.872 2.872a1.5 1.5 0 0 1 .439 1.06V7.5" />
                </g>
            </g>
        </svg>
    ),
    warning: (
        <svg width="24px" height="24px" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
                <g transform="translate(-505.000000, -2598.000000)" stroke="#0324FF" strokeWidth="1.5">
                    <path
                        d="M517,2614.5 C516.792893,2614.5 516.625,2614.66789 516.625,2614.875 C516.625,2615.08211 516.792893,2615.25 517,2615.25 C517.207107,2615.25 517.375,2615.08211 517.375,2614.875 C517.375,2614.66789 517.207107,2614.5 517,2614.5"
                        id="Path"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                    <path d="M517,2611.5 L517,2603.25" id="Path" strokeLinecap="round" />
                    <circle id="Oval" cx="517" cy="2610" r="11.25" />
                </g>
            </g>
        </svg>
    ),
    circle: (
        <MapIcons.CircleIcon />
    ),
    pin: (
        <MapIcons.PinIcon />
    ),
    arrow: (
        <MapIcons.ArrowIcon />
    ),
    longArrow: (
        <MapIcons.LongArrowIcon />
    ),
    arrowhead: (
        <MapIcons.ArrowHeadIcon />
    ),
    keyboard: (
        <svg viewBox="0 0 24 14" xmlns="http://www.w3.org/2000/svg">
            <g
                stroke="currentColor"
                strokeWidth="1.5"
                fill="none"
                fillRule="evenodd"
                strokeLinecap="round"
                strokeLinejoin="round"
            >
                <rect x=".75" y=".25" width="22.5" height="12" rx="3" />
                <path d="M6.75 3.25h1.5M15.75 3.25h1.5M11.25 3.25h1.5M4.5 6.25H6M9 6.25h1.5M13.5 6.25H15M18 6.25h1.5M6.75 9.25h10.5" />
            </g>
        </svg>
    ),
    share: (
        <svg viewBox="0 0 19 24" xmlns="http://www.w3.org/2000/svg">
            <g transform="translate(0 -2)" stroke="currentColor" strokeWidth="1.5" fill="none" fillRule="evenodd" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17.788 5.375h-7.013c-1.408 0-2.55 1.12-2.55 2.5V11" />
                <path d="M13.963 9.125l3.825-3.75-3.825-3.75M15.238 12.875v6.25c0 .69-.571 1.25-1.275 1.25H2.488c-.705 0-1.276-.56-1.276-1.25v-10c0-.69.571-1.25 1.276-1.25H4.4" />
            </g>
        </svg>
    ),
    profileMan: (
        <svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg">
            <defs>
                <circle id="a" cx="40" cy="40" r="40" />
            </defs>
            <g fill="none" fillRule="evenodd">
                <mask id="b" fill="#fff">
                    <use href="#a" />
                </mask>
                <use fill="#EFEFEF" href="#a" />
                <g opacity=".503" mask="url(#b)" stroke="#525252" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5">
                    <g transform="translate(20 17)">
                        <ellipse cx="20.5" cy="11" rx="10.762" ry="10.5" />
                        <path d="M11.226 5.668c3.367 3.408 8.01 5.333 12.861 5.332 2.433 0 4.84-.483 7.073-1.422M.512 45.5C.512 34.73 9.462 26 20.5 26c11.039 0 19.987 8.73 19.987 19.5" />
                        <path d="M12.813 27.498V29c0 4.142 3.441 7.5 7.687 7.5s7.688-3.358 7.688-7.5v-1.502" />
                    </g>
                </g>
            </g>
        </svg>
    ),
    search: (
        <svg viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
            <g
                stroke="currentColor"
                transform="translate(-1 -1)"
                strokeWidth="1.5"
                fill="none"
                fillRule="evenodd"
                strokeLinecap="round"
                strokeLinejoin="round"
            >
                <circle transform="rotate(-23.025 7.593 7.592)" cx="7.593" cy="7.592" r="5.371" />
                <path d="M11.39 11.39l4.166 4.166" />
            </g>
        </svg>
    ),
    questionMark: (
        <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path
                d="M9.1 9.286a.75.75 0 0 1-1.5-.001 4.287 4.287 0 1 1 5.716 4.044 1.018 1.018 0 0 0-.68.96v.744a.75.75 0 0 1-1.5 0v-.744a2.52 2.52 0 0 1 1.68-2.374A2.787 2.787 0 1 0 9.1 9.285zm2.782 10.074a1.19 1.19 0 1 1 0-2.38 1.19 1.19 0 0 1 0 2.38z"
                fill="#525252"
            />
        </svg>
    ),
    dropPlus: (
        <svg viewBox="0 0 25 25" xmlns="http://www.w3.org/2000/svg">
            <g transform="translate(1 1)" fill="none" fillRule="evenodd">
                <circle fill="#FCFBF9" cx="11.5" cy="11.5" r="11.5" />
                <path d="M11.5 23C17.851 23 23 17.851 23 11.5S17.851 0 11.5 0 0 5.149 0 11.5C.007 17.848 5.152 22.993 11.5 23zm-6-12.5h4.75a.25.25 0 0 0 .25-.25V5.5a1 1 0 0 1 2 0v4.75c0 .138.112.25.25.25h4.75a1 1 0 0 1 0 2h-4.75a.25.25 0 0 0-.25.25v4.75a1 1 0 0 1-2 0v-4.75a.25.25 0 0 0-.25-.25H5.5a1 1 0 0 1 0-2z" fill="#FF5C00" fillRule="nonzero" />
            </g>
        </svg>
    ),
    clear: (
        <svg viewBox="0 0 14 14" xmlns="http://www.w3.org/2000/svg">
            <g transform="translate(.25 .25)" strokeWidth="1.125" fill="none" fillRule="evenodd">
                <circle stroke="#CDCDCD" fill="#CDCDCD" cx="6.75" cy="6.75" r="6.188" />
                <g stroke="#FFF" strokeLinecap="round">
                    <path d="M4.84 4.84l3.82 3.82M8.66 4.84L4.84 8.66" />
                </g>
            </g>
        </svg>
    ),
}

type Props = {
    name: $Keys<typeof sources>,
}

const SvgIcon = ({ name, ...props }: Props) => React.cloneElement(sources[name], {
    ...props,
})

SvgIcon.names = Object.keys(sources).sort()

export default SvgIcon
