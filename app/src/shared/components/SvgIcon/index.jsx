// @flow

import React, { type ComponentType } from 'react'

import UploadIcon from './ImageUploadIcon'
import CheckmarkIcon from './CheckmarkIcon'
import * as MapIcons from './MapIcons'
import * as SocialIcons from './SocialIcons'
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
    forward: (
        <svg viewBox="0 0 8 14" xmlns="http://www.w3.org/2000/svg">
            <g fill="none" fillRule="evenodd">
                <path
                    d="M1 1.342l5.66 5.66-5.656 5.656"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.5"
                />
            </g>
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
    outlineQuestionMark: (
        <svg viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg">
            <g transform="translate(1 1)" stroke="currentColor" fill="none" fillRule="evenodd">
                <circle cx="8" cy="8" r="8" />
                <g strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.071">
                    <path d="M7.925 12.005a.316.316 0 100 .632.316.316 0 000-.632h0M5.398 5.975a2.526 2.526 0 113.369 2.383 1.263 1.263 0 00-.842 1.19v.532" />
                </g>
            </g>
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
    checkBadgeHD: (
        <svg viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
            <g fill="none" fillRule="evenodd">
                <path fill="#0324FF" d="M8 14.88l-1.56.966-1.073-1.49-1.812.296-.42-1.787-1.787-.42.296-1.812L.154 9.56 1.12 8 .154 6.44l1.49-1.073-.296-1.812 1.787-.42.42-1.787 1.812.296L6.44.154 8 1.12 9.56.154l1.073 1.49 1.812-.296.42 1.787 1.787.42-.296 1.812 1.49 1.072L14.88 8l.966 1.56-1.49 1.073.296 1.812-1.787.42-.42 1.787-1.812-.296-1.072 1.49z" />
                <path stroke="#FFF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" d="M4.865 8.172l1.65 1.792 4.243-4.243" />
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
    trash: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 15 14">
            <path
                fill="none"
                fillRule="evenodd"
                stroke="#A3A3A3"
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M11.167 13h-7a1 1 0 01-1-1V3h9v9a1 1 0 01-1 1zm-5-3V6m3 4V6m-8-3h13m-5-2h-3a1 1 0 00-1 1v1h5V2a1 1 0 00-1-1z"
            />
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
    alarmBell: (
        <svg viewBox="0 0 16 20" xmlns="http://www.w3.org/2000/svg">
            <g strokeWidth="1.5" stroke="currentColor" fill="none" fillRule="evenodd" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6.444 17.917a1.623 1.623 0 003.115 0M8 3.333v-1.75M8 3.333a5.833 5.833 0 015.833 5.834c0 5.48 1.167 6.416 1.167 6.416H1s1.167-1.49 1.167-6.416A5.833 5.833 0 018 3.333z" />
            </g>
        </svg>
    ),
    canvas: (
        <svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
            <defs>
                <rect id="a" x="0" y="0" width="32" height="32" rx="4" />
                <rect id="b" x="0" y="0" width="32" height="32" rx="4" />
            </defs>
            <g fill="none" fillRule="evenodd">
                <rect stroke="#D8D8D8" x=".5" y=".5" width="31" height="31" rx="4" />
                <mask id="c" fill="#fff">
                    <use xlinkHref="#b" />
                </mask>
                <use fill="#97BAC0" xlinkHref="#b" />
                <g mask="url(#c)">
                    <g transform="translate(6 6)">
                        <circle stroke="#FFF" strokeWidth="1.5" cx="4" cy="4" r="3.25" />
                        <circle fill="#FFF" cx="4" cy="4" r="1" />
                    </g>
                </g>
                <g mask="url(#c)">
                    <g transform="translate(18 6)">
                        <circle stroke="#FFF" strokeWidth="1.5" cx="4" cy="4" r="3.25" />
                        <circle fill="#FFF" cx="4" cy="4" r="1" />
                    </g>
                </g>
                <g mask="url(#c)">
                    <g transform="translate(6 18)">
                        <path stroke="#FFF" strokeWidth="1.5" d="M.75.75h6.5v6.5H.75z" />
                        <circle fill="#FFF" cx="4" cy="4" r="1" />
                    </g>
                </g>
                <g mask="url(#c)">
                    <circle stroke="#FFF" strokeWidth="1.5" cx="4" cy="4" r="3.25" transform="translate(18 18)" />
                </g>
            </g>
        </svg>
    ),
    product: (
        <svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
            <defs>
                <rect id="a" x="0" y="0" width="32" height="32" rx="4" />
            </defs>
            <g fill="none" fillRule="evenodd">
                <mask id="b" fill="#fff">
                    <use xlinkHref="#a" />
                </mask>
                <use fill="#97BAC0" xlinkHref="#a" />
                <g mask="url(#b)" stroke="#FFF" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5">
                    <g transform="translate(6 7)">
                        <rect x=".455" y=".227" width="19.091" height="17.727" rx="1.5" />
                        <path d="M.455 4.318h19.09" />
                        <rect x="3.182" y="8.045" width="5.455" height="4.545" rx=".75" />
                        <path d="M11.818 13.5h5M11.818 8.045h5M11.818 10.773h5" />
                    </g>
                </g>
            </g>
        </svg>
    ),
    stream: (
        <svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
            <defs>
                <rect id="a" x="0" y="0" width="32" height="32" rx="4" />
            </defs>
            <g fill="none" fillRule="evenodd">
                <use fill="#97BAC0" xlinkHref="#a" />
                <g transform="translate(9 9)" stroke="#FFF" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5">
                    <circle cx="2.5" cy="11.497" r="2.25" />
                    <path d="M.205 5.126a6.807 6.807 0 018.4 9.36M.359.445a11.279 11.279 0 0113 14.08" />
                </g>
            </g>
        </svg>
    ),
    clipboardPlus: (
        <svg viewBox="0 0 11 13" xmlns="http://www.w3.org/2000/svg">
            <g stroke="currentColor" fill="none" fillRule="evenodd" strokeLinecap="round">
                <path d="M7.375 2.875H9.25a.75.75 0 01.75.75V11.5a.75.75 0 01-.75.75h-7.5A.75.75 0 011 11.5V3.625a.75.75 0 01.75-.75h1.875a1.875 1.875 0 113.75 0z" strokeLinejoin="round" />
                <path d="M5.529 2.883a.187.187 0 11-.058.37.187.187 0 01.058-.37" strokeLinejoin="round" />
                <path d="M3.5 7.5h4M5.5 5.5v4" />
            </g>
        </svg>
    ),
    clipboardCheck: (
        <svg viewBox="0 0 11 13" xmlns="http://www.w3.org/2000/svg">
            <g stroke="currentColor" fill="none" fillRule="evenodd" strokeLinecap="round" strokeLinejoin="round">
                <path d="M7.375 2.875H9.25a.75.75 0 01.75.75V11.5a.75.75 0 01-.75.75h-7.5A.75.75 0 011 11.5V3.625a.75.75 0 01.75-.75h1.875a1.875 1.875 0 113.75 0z" />
                <path d="M5.529 2.883a.187.187 0 11-.058.37.187.187 0 01.058-.37M7.612 6L4.816 8.796a.409.409 0 01-.579 0L3.3 7.858" />
            </g>
        </svg>
    ),
    expand: (
        <svg width="25" height="24" xmlns="http://www.w3.org/2000/svg">
            <g transform="translate(1)" stroke="#ADADAD" strokeWidth="1.5" fill="none" fillRule="evenodd" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5.25 17.998L0 23.248M22.5 6.748v-6h-6M0 17.248v6h6M22.5.748l-5.25 5.25M17.25 17.998l5.25 5.25M0 6.748v-6h6M22.5 17.248v6h-6M0 .748l5.25 5.25" />
                <rect x="7.5" y="8.248" width="7.5" height="7.5" rx=".75" />
            </g>
        </svg>
    ),
    list: (
        <svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
            <rect fill="none" x=".75" y=".75" width="18.5" height="18.5" rx="1.25" stroke="currentColor" strokeWidth="1.5" />
            <path
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                d="M5.75 4.979h8.5M5.75 7.479h5.167M5.75 9.979h8.5M5.75 12.479h5.167M5.75 14.979h8.5"
            />
        </svg>
    ),
    listInspect: (
        <svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
            <path
                d="M10.02 5.06h-4.5M7.77 8.04H5.52M5.52 11.02h2.632M5.52 13.998h2.563"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <path
                fill="none"
                d="M14.59 6.923V3.474a2 2 0 00-2-2H3.38a2 2 0 00-2 2v12a2 2 0 002 2h4.866"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
            />
            <path
                fill="none"
                d="M14.072 16.9a3.451 3.451 0 100-6.903 3.451 3.451 0 000 6.902zM16.502 15.899L18.621 18"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    ),
    listSettings: (
        <svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
            <path
                fill="none"
                d="M10.02 5.06h-4.5M7.77 8.04H5.52M5.52 11.02h2.632M5.52 13.998h2.563"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <path
                fill="none"
                d="M14.59 6.923V3.474a2 2 0 00-2-2H3.38a2 2 0 00-2 2v12a2 2 0 002 2h4.866"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
            />
            <path
                fill="none"
                d="M14.59 15.505a1 1 0 100-2.001 1 1 0 000 2.001z"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <path
                fill="none"
                d="M15.44 10.635l.294.969a.663.663 0 00.784.454l.982-.227a.894.894 0 01.85 1.48l-.688.74a.667.667 0 000 .91l.688.74a.893.893 0 01-.85 1.48l-.982-.227a.663.663 0 00-.784.454l-.294.966a.887.887 0 01-1.7 0l-.295-.97a.663.663 0 00-.784-.454l-.982.228a.893.893 0 01-.85-1.48l.687-.741a.667.667 0 000-.91l-.687-.74a.894.894 0 01.85-1.48l.982.227a.663.663 0 00.784-.454l.294-.97a.887.887 0 011.7.005z"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    ),
    github: (
        <SocialIcons.GitHub />
    ),
    medium: (
        <SocialIcons.Medium />
    ),
    peepeth: (
        <SocialIcons.Peepeth />
    ),
    reddit: (
        <SocialIcons.Reddit />
    ),
    telegram: (
        <SocialIcons.Telegram />
    ),
    trello: (
        <SocialIcons.Trello />
    ),
    twitter: (
        <SocialIcons.Twitter />
    ),
    youtube: (
        <SocialIcons.Youtube />
    ),
    linkedin: (
        <SocialIcons.LinkedIn />
    ),
    instagram: (
        <SocialIcons.Instagram />
    ),
    facebook: (
        <SocialIcons.Facebook />
    ),
    web: (
        <SocialIcons.Web />
    ),
}

export type IconName = $Keys<typeof sources>

type Props = {
    name: IconName,
}

const SvgIcon = (React.forwardRef(({ name, ...props }: Props, ref) => React.cloneElement(sources[name], {
    ...props,
    ref,
})): ComponentType<Props>)

// $FlowFixMe suppress flow complaining about property `names` is missing in  `React.AbstractComponentStatics`
SvgIcon.names = Object.keys(sources).sort()

export default SvgIcon
