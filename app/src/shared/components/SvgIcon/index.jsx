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
                stroke="currentColor"
                strokeWidth="1.5"
                d="M7 13L1 7l6-6"
                fill="none"
                fillRule="evenodd"
                strokeLinecap="round"
                strokeLinejoin="round"
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
                stroke="currentColor"
                strokeWidth="1.5"
                fill="none"
                fillRule="evenodd"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    ),
    exclamation: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 2 8">
            <g
                stroke="currentColor"
                strokeWidth="1.5"
                fill="none"
                fillRule="evenodd"
                strokeLinecap="round"
            >
                <path d="M1 1v3.918M.986 6.904L1 6.918" />
            </g>
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
    minusSmall: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 10 2">
            <path fill="none" stroke="currentColor" strokeLinecap="round" strokeWidth="2" d="M1 1h8" />
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
    plusSmall: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 10 10">
            <path fill="none" fillRule="evenodd" stroke="currentColor" strokeLinecap="round" strokeWidth="2" d="M1 5h8M5 1v8" />
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
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
            <g fill="none" fillRule="evenodd">
                <circle cx="10" cy="10" r="10" fill="#FF5C00" fillRule="nonzero" />
                <path stroke="#FFF" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M10 11.562V5M10 14.562v-.052" />
            </g>
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
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                    <path d="M517,2611.5 L517,2603.25" strokeLinecap="round" />
                    <circle cx="517" cy="2610" r="11.25" />
                </g>
            </g>
        </svg>
    ),
    refresh: (
        <svg viewBox="0 0 12 12" xmlns="http://www.w3.org/2000/svg">
            <g fill="none" fillRule="evenodd">
                <path d="M-6-6h24v24H-6z" />
                <g stroke="currentColor" strokeLinecap="round" strokeWidth="1.5">
                    <path d="M10.016 3.02a5.001 5.001 0 0 0-8.607.996m.599 4.995a5.001 5.001 0 0 0 8.57-.999" />
                    <path d="M1 11V8h3M11 1v3H8" strokeLinejoin="round" />
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
    emptyAvatarUpload: (
        <svg width="42" height="42" xmlns="http://www.w3.org/2000/svg">
            <g transform="translate(1 1)" stroke="#D8D8D8" strokeWidth="1.5" fill="none" fillRule="evenodd" strokeLinecap="round" strokeLinejoin="round">
                <path d="M13.817 10.489A11.927 11.927 0 0 0 27.11 13.16" /><circle cx="20" cy="14.13" r="7.174" />
                <path d="M.435 10.871V3.043A2.609 2.609 0 0 1 3.043.435h7.827M39.565 10.871V3.043A2.609 2.609 0 0 0 36.957.435H29.13M.435 29.13v7.827a2.609 2.609 0 0 0 2.608 2.608h7.827M39.565 29.13v7.827a2.609 2.609 0 0 1-2.608 2.608H29.13M31.02 31.74a11.673 11.673 0 0 0-22.04 0" />
            </g>
        </svg>
    ),
    profileMan: (
        <svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg">
            <g fill="none" fillRule="evenodd">
                <circle fill="#EFEFEF" fillRule="nonzero" cx="40" cy="40" r="40" />
                <g opacity="0.5">
                    <ellipse stroke="#525252" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" cx="40.5" cy="28" rx="10.762" ry="10.5" />
                    <path d="M32.813 44.498V46c0 4.142 3.441 7.5 7.687 7.5s7.688-3.358 7.688-7.5v-1.502" stroke="#525252" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M31.226 22.668c3.367 3.408 8.01 5.333 12.861 5.332 2.433 0 4.84-.483 7.073-1.422M20.512 62.5c0-10.77 8.95-19.5 19.988-19.5 11.039 0 19.987 8.73 19.987 19.5" stroke="#525252" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </g>
            </g>
        </svg>
    ),
    hamburger: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 12 10">
            <g stroke="currentColor" strokeWidth="1.5" fill="none" fillRule="evenodd" strokeLinecap="round">
                <path d="M1 9h10M1 5h10M1 1h10" />
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
    lockOutline: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 18 24">
            <g fill="none" fillRule="evenodd" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5">
                <rect width="16.5" height="13.5" x="0.75" y="9.75" rx="1.5" />
                <path d="M3.75 9.75V6a5.25 5.25 0 1110.5 0v3.75M9 15v3" />
            </g>
        </svg>
    ),
    lock: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 19 25">
            <g fill="none" fillRule="evenodd" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" transform="translate(1 1)">
                <path stroke="currentColor" d="M3 9V5.25a5.25 5.25 0 1110.5 0" />
                <rect width="16.5" height="13.5" y="9" fill="currentColor" stroke="currentColor" rx="1.5" />
                <path stroke="#FFF" d="M8.5 14v3" />
            </g>
        </svg>
    ),
    checkBadgeOutline: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <g fill="none" fillRule="evenodd" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5">
                <path d="M15.75 9.749l-3.981 5.308a.75.75 0 01-1.13.08L8.25 12.749" />
                {/* eslint-disable-next-line max-len */}
                <path d="M10.73 1.357a1.63 1.63 0 012.54 0l1.512 1.881c.348.434.893.66 1.446.6l2.4-.261a1.63 1.63 0 011.8 1.8l-.261 2.4c-.06.553.166 1.098.6 1.446l1.881 1.512a1.63 1.63 0 010 2.54l-1.887 1.505a1.63 1.63 0 00-.6 1.447l.261 2.4a1.629 1.629 0 01-1.8 1.8l-2.4-.261a1.628 1.628 0 00-1.446.6L13.27 22.64a1.629 1.629 0 01-2.54 0l-1.511-1.88a1.631 1.631 0 00-1.447-.6l-2.4.261a1.628 1.628 0 01-1.8-1.8l.261-2.4a1.631 1.631 0 00-.6-1.447l-1.88-1.511a1.629 1.629 0 010-2.54l1.88-1.512c.434-.348.66-.893.6-1.446l-.261-2.4a1.629 1.629 0 011.8-1.8l2.4.261a1.632 1.632 0 001.447-.6l1.511-1.869z" />
            </g>
        </svg>
    ),
    checkBadge: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <g fill="none" fillRule="evenodd" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5">
                {/* eslint-disable-next-line max-len */}
                <path fill="currentColor" stroke="currentColor" d="M10.73 1.357a1.63 1.63 0 012.54 0l1.512 1.881c.348.434.893.66 1.446.6l2.4-.261a1.63 1.63 0 011.8 1.8l-.261 2.4c-.06.553.166 1.098.6 1.446l1.881 1.512a1.63 1.63 0 010 2.54l-1.887 1.505a1.63 1.63 0 00-.6 1.447l.261 2.4a1.629 1.629 0 01-1.8 1.8l-2.4-.261a1.628 1.628 0 00-1.446.6L13.27 22.64a1.629 1.629 0 01-2.54 0l-1.511-1.88a1.631 1.631 0 00-1.447-.6l-2.4.261a1.628 1.628 0 01-1.8-1.8l.261-2.4a1.631 1.631 0 00-.6-1.447l-1.88-1.511a1.629 1.629 0 010-2.54l1.88-1.512c.434-.348.66-.893.6-1.446l-.261-2.4a1.629 1.629 0 011.8-1.8l2.4.261a1.632 1.632 0 001.447-.6l1.511-1.869z" />
                <path stroke="#FFF" d="M15.75 9.749l-3.981 5.308a.75.75 0 01-1.13.08L8.25 12.749" />
            </g>
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
    infoBadge: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16">
            <g fill="none" fillRule="evenodd" transform="matrix(1 0 0 -1 0 16)">
                <circle cx="8" cy="8" r="8" fill="#0324FF" />
                <path
                    stroke="#FFF"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M8 11.5v.1m0-2.8V4"
                />
            </g>
        </svg>
    ),
    warnBadge: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16">
            <g fill="none" fillRule="evenodd">
                <circle cx="8" cy="8" r="8" fill="#FF5C00" />
                <path
                    stroke="#FFF"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M8 11.5v.1m0-2.8V4"
                />
            </g>
        </svg>
    ),
    errorBadge: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16">
            <g fill="none" fillRule="evenodd">
                <circle cx="8" cy="8" r="8" fill="#FF0F2D" />
                <path
                    stroke="#FFF"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4.606 4.606l6.788 6.788m0-6.788l-6.788 6.788"
                />
            </g>
        </svg>
    ),
    clear: (
        <svg viewBox="0 0 14 14" xmlns="http://www.w3.org/2000/svg">
            <g transform="translate(.25 .25)" fill="none">
                <circle stroke="#CDCDCD" fill="#CDCDCD" cx="6.75" cy="6.75" r="6.188" />
                <path d="M4.84 4.84l3.82 3.82m0-3.82L4.84 8.66" stroke="#FFF" />
            </g>
        </svg>
    ),
    brevetDown: (
        <svg viewBox="0 0 10 6" xmlns="http://www.w3.org/2000/svg">
            <path d="M.756 1l4.245 4.245 4.243-4.242" stroke="#CDCDCD" strokeWidth="1.5" fill="none" fillRule="evenodd" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    ),
    x: (
        <svg viewBox="0 0 10 10" xmlns="http://www.w3.org/2000/svg">
            <g stroke="#A3A3A3" strokeWidth="1.5" fill="none" fillRule="evenodd" strokeLinecap="round">
                <path d="M.757.757l8.486 8.486M9.243.757L.757 9.243" />
            </g>
        </svg>
    ),
    transfer: (
        <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <g fill="none" fillRule="evenodd">
                <rect fill="currentColor" width="24" height="24" rx="3" />
                <path d="M8.8 8h8.8M14.4 4.8L17.6 8l-3.2 3.2M15.2 16H6.4M9.6 19.2L6.4 16l3.2-3.2" stroke="#FDFDFD" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </g>
        </svg>
    ),
    dataUnion: (
        <svg viewBox="0 0 16 13" xmlns="http://www.w3.org/2000/svg">
            <g
                transform="translate(1)"
                stroke="currentColor"
                strokeWidth="1.125"
                fill="none"
                fillRule="evenodd"
                strokeLinecap="round"
                strokeLinejoin="round"
            >
                <path d="M2.489 8.93C1.71 7.05 2.33 4.9 4.003 3.676a4.805 4.805 0 0 1 5.655.011c1.668 1.23 2.278 3.382 1.492 5.26" />
                <path d="M1.314 10.81C-.656 8.111-.216 4.416 2.34 2.22c2.555-2.197 6.413-2.197 8.968 0 2.556 2.197 2.997 5.892 1.026 8.591" />
                <ellipse cx="6.824" cy="6.978" rx="2.042" ry="1.969" />
                <path d="M10.111 11.76c-.487-1.348-1.805-2.251-3.286-2.251-1.48 0-2.798.903-3.285 2.25h6.571z" />
            </g>
        </svg>
    ),
    DATA: (
        <svg width="24" height="24" xmlns="http://www.w3.org/2000/svg">
            <g fill="none" fillRule="evenodd">
                <path d="M12 24C5.372 24 0 18.628 0 12S5.372 0 12 0s12 5.372 12 12-5.372 12-12 12z" fill="#CDCDCD" fillRule="nonzero" />
                <path d="M13.878 5.193v-.432a.26.26 0 00-.271-.26 5.63 5.63 0 00-5.355 5.393c.006.182.154.23.241.23h.44a.26.26 0 00.26-.248 4.693 4.693 0 014.444-4.438c.183-.023.241-.123.241-.245m-3.953 4.931h.42a.26.26 0 00.258-.242 3.285 3.285 0 013.055-3.035.235.235 0 00.22-.248V6.17a.261.261 0 00-.279-.26 4.224 4.224 0 00-3.935 3.934c-.01.15.11.279.26.279m3.954-2.541v.43c0 .176-.152.239-.227.248a1.878 1.878 0 00-1.635 1.63.262.262 0 01-.26.233h-.42a.26.26 0 01-.259-.284 2.816 2.816 0 012.518-2.517.26.26 0 01.283.26zm4.929 6.282c-.122 0-.222-.058-.245-.241a4.693 4.693 0 00-4.439-4.444.26.26 0 01-.248-.26v-.44c0-.086.048-.234.23-.24a5.631 5.631 0 015.395 5.353.26.26 0 01-.26.272h-.433zm-4.932-3.953c0-.151.128-.27.28-.26a4.224 4.224 0 013.934 3.934c.01.15-.109.28-.26.28h-.428a.235.235 0 01-.248-.221 3.285 3.285 0 00-3.035-3.055.26.26 0 01-.243-.258v-.42zm2.542 3.953h-.43c-.176 0-.24-.153-.248-.227a1.878 1.878 0 00-1.632-1.635.262.262 0 01-.232-.26v-.42a.26.26 0 01.284-.259 2.816 2.816 0 012.518 2.517.26.26 0 01-.26.284zM5.193 10.123c.122 0 .222.059.245.241a4.693 4.693 0 004.439 4.444.26.26 0 01.248.26v.44c0 .086-.048.234-.23.24A5.631 5.631 0 014.5 10.395a.26.26 0 01.26-.272h.433zm4.932 3.953c0 .151-.128.27-.28.26a4.224 4.224 0 01-3.934-3.934.261.261 0 01.26-.28h.428c.189 0 .244.149.248.222a3.285 3.285 0 003.035 3.054.26.26 0 01.243.258v.42zm-2.542-3.953h.43c.176 0 .24.153.248.227.103.853.779 1.53 1.632 1.635a.262.262 0 01.232.26v.42a.26.26 0 01-.284.259 2.816 2.816 0 01-2.518-2.517.26.26 0 01.26-.284zm2.543 8.684c0-.122.059-.222.241-.245a4.693 4.693 0 004.445-4.438.26.26 0 01.26-.248h.44c.086 0 .234.048.24.23a5.631 5.631 0 01-5.354 5.394.26.26 0 01-.272-.26v-.433zm3.954-4.931c.151 0 .27.128.26.28a4.224 4.224 0 01-3.935 3.934.261.261 0 01-.28-.26V17.4c0-.189.149-.243.222-.248a3.285 3.285 0 003.055-3.035.26.26 0 01.257-.242h.42zm-3.954 2.541v-.43c0-.176.153-.239.227-.248a1.878 1.878 0 001.636-1.63.262.262 0 01.259-.233h.42a.26.26 0 01.26.284 2.816 2.816 0 01-2.518 2.517.26.26 0 01-.284-.26z" fill="#FFF" />
            </g>
        </svg>
    ),
    ETH: (
        <svg width="24" height="24" xmlns="http://www.w3.org/2000/svg">
            <g fillRule="nonzero" fill="none">
                <path d="M12 24C5.372 24 0 18.628 0 12S5.372 0 12 0s12 5.372 12 12-5.372 12-12 12zm5.995-11.836L12.373 3 6.75 12.165l5.623 3.265 5.623-3.266zM18 13.212l-5.627 3.263-5.623-3.262 5.623 7.783L18 13.212z" fill="#CDCDCD" />
                <g opacity=".497">
                    <path d="M12.373 3v6.652l5.623 2.513L12.374 3zm0 13.476v4.52L18 13.212l-5.627 3.264z" fillOpacity=".298" fill="#000" />
                    <path fill="#525252" d="M12.373 15.43l5.623-3.265-5.622-2.511z" />
                    <path fill="#ADADAD" d="M6.75 12.165l5.623 3.265V9.654z" />
                </g>
            </g>
        </svg>
    ),
    DAI: (
        <svg width="24" height="24" xmlns="http://www.w3.org/2000/svg">
            <g fillRule="nonzero" fill="none">
                <path d="M12 0C5.371 0 0 5.371 0 12s5.371 12 12 12 12-5.371 12-12S18.629 0 12 0z" fill="#CDCDCD" />
                <path d="M18 10.245h-1.29C16.002 8.323 14.094 7 11.577 7H7.438v3.245H6v1.164h1.438v1.22H6v1.165h1.438V17h4.138c2.488 0 4.382-1.31 5.11-3.206H18V12.63h-1.025c.026-.205.036-.418.036-.63v-.028c0-.191-.01-.379-.029-.563H18v-1.164zM8.596 8.04h2.98c1.847 0 3.22.889 3.853 2.205H8.596V8.04zm2.98 7.916h-2.98v-2.162h6.826c-.641 1.295-2.006 2.162-3.846 2.162zm4.24-3.928c0 .206-.014.407-.043.602H8.596v-1.22h7.18c.026.19.04.388.04.59v.028z" fill="#FFF" />
            </g>
        </svg>
    ),
    console: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 23 20">
            <g
                fill="none"
                fillRule="evenodd"
                stroke="#A3A3A3"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.5"
            >
                <path d="M2.525 18.775a1.35 1.35 0 01-1.35-1.35V2.678a1.458 1.458 0 011.453-1.453h17.35a1.45 1.45 0 011.447 1.446v14.65a1.458 1.458 0 01-1.454 1.454H2.525zm18.9-13.5H1.175m10.8 6.75h4.05" />
                <path d="M6.575 9.325l2.7 2.7-2.7 2.7" />
            </g>
        </svg>
    ),
}

export type IconName = $Keys<typeof sources>

type Props = {
    name: IconName,
}

const SvgIcon = ({ name, ...props }: Props) => React.cloneElement(sources[name], {
    ...props,
})

SvgIcon.names = Object.keys(sources).sort()

export default SvgIcon
