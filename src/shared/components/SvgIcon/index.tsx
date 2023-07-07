import { ComponentType } from 'react'
import React from 'react'
import { $Keys } from 'utility-types'
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
    backArrow: (
        <svg
            width="23"
            height="18"
            viewBox="0 0 23 18"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M8.1895 17.4096C8.57392 17.794 9.1972 17.794 9.58162 17.4096C9.96604 17.0251 9.96604 16.4019 9.58162 16.0174L3.8364 10.2722L21.8796 10.2722C22.4232 10.2722 22.8639 9.83151 22.8639 9.28785C22.8639 8.74419 22.4232 8.30348 21.8796 8.30348L3.83846 8.30348L9.58162 2.56032C9.96604 2.17589 9.96604 1.55262 9.58162 1.1682C9.19719 0.783777 8.57392 0.783778 8.1895 1.1682L0.774414 8.58329C0.760749 8.59662 0.74747 8.61035 0.734597 8.62446C0.380737 9.01071 0.390831 9.61089 0.764879 9.98494L8.1895 17.4096Z"
                fill="currentColor"
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
    close: (
        <svg
            width="9"
            height="9"
            viewBox="0 0 9 9"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <path
                d="M7.46875 1.57343L1.53125 7.51092"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
            />
            <path
                d="M1.53125 1.57343L7.46875 7.51092"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
            />
        </svg>
    ),
    disconnect: (
        <svg
            width="12"
            height="12"
            viewBox="0 0 12 12"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <path
                d="M11.1242 6.31172L8.82734 8.60859C8.74336 8.68887 8.6318 8.73388 8.51562 8.73438C8.42887 8.73423 8.34412 8.7083 8.27214 8.65987C8.20016 8.61145 8.14421 8.54271 8.11138 8.46241C8.07856 8.38211 8.07035 8.29386 8.0878 8.20888C8.10525 8.1239 8.14756 8.04603 8.20937 7.98516L9.75703 6.4375H4.6875C4.57147 6.4375 4.46019 6.39141 4.37814 6.30936C4.29609 6.22731 4.25 6.11603 4.25 6C4.25 5.88397 4.29609 5.77269 4.37814 5.69064C4.46019 5.60859 4.57147 5.5625 4.6875 5.5625H9.75703L8.20937 4.01484C8.1267 3.9329 8.07997 3.82146 8.07946 3.70506C8.07894 3.58865 8.12469 3.47681 8.20664 3.39414C8.28859 3.31147 8.40002 3.26473 8.51643 3.26422C8.63283 3.26371 8.74467 3.30946 8.82734 3.39141L11.1242 5.68828C11.2064 5.77123 11.2525 5.88325 11.2525 6C11.2525 6.11675 11.2064 6.22877 11.1242 6.31172ZM4.6875 10.375H1.625V1.625H4.6875C4.80353 1.625 4.91481 1.57891 4.99686 1.49686C5.07891 1.41481 5.125 1.30353 5.125 1.1875C5.125 1.07147 5.07891 0.960188 4.99686 0.878141C4.91481 0.796094 4.80353 0.75 4.6875 0.75H1.625C1.39294 0.75 1.17038 0.842187 1.00628 1.00628C0.842187 1.17038 0.75 1.39294 0.75 1.625V10.375C0.75 10.6071 0.842187 10.8296 1.00628 10.9937C1.17038 11.1578 1.39294 11.25 1.625 11.25H4.6875C4.80353 11.25 4.91481 11.2039 4.99686 11.1219C5.07891 11.0398 5.125 10.9285 5.125 10.8125C5.125 10.6965 5.07891 10.5852 4.99686 10.5031C4.91481 10.4211 4.80353 10.375 4.6875 10.375Z"
                fill="currentColor"
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
            <g
                stroke="currentColor"
                strokeWidth="1.5"
                fill="none"
                fillRule="evenodd"
                strokeLinecap="round"
            >
                <path d="M7.182 6.975L1.525 1.318M1.525 6.975l5.657-5.657" />
            </g>
        </svg>
    ),
    linkOut: (
        <svg
            width="42"
            height="42"
            viewBox="0 0 42 42"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <path
                d="M27.8906 24.5684V14.0684H17.3906"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <path
                d="M27.8906 14.0684L13.4531 28.5059"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
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
            <path
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeWidth="2"
                d="M1 1h8"
            />
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
            <path
                fill="none"
                fillRule="evenodd"
                stroke="currentColor"
                strokeLinecap="round"
                strokeWidth="2"
                d="M1 5h8M5 1v8"
            />
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
    userFull: (
        <svg
            width="46"
            height="46"
            viewBox="0 0 46 46"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <path
                d="M23 46C35.7025 46 46 35.7025 46 23C46 10.2975 35.7025 0 23 0C10.2975 0 0 10.2975 0 23C0 35.7025 10.2975 46 23 46Z"
                fill="currentColor"
            />
            <path
                d="M18.971 28.8528V29.705C18.971 32.0553 20.882 33.9606 23.2394 33.9606C25.5968 33.9606 27.5078 32.0553 27.5078 29.705V28.8528"
                stroke="white"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <path
                d="M19.3626 14.958C17.4573 16.5774 16.7666 19.2092 17.6321 21.5514C18.4976 23.8936 20.7358 25.4496 23.2394 25.4496C25.743 25.4496 27.9812 23.8936 28.8467 21.5514C29.7122 19.2092 29.0214 16.5774 27.1162 14.958"
                stroke="white"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M25.8004 12.6826C24.2645 12.6835 22.9171 11.6619 22.5075 10.186C20.6608 10.277 19.1578 11.6997 18.971 13.5338C18.971 15.4141 20.8821 16.9382 23.2394 16.9382C25.5967 16.9382 27.5078 15.4141 27.5078 13.5338C27.5078 13.0637 27.1256 12.6826 26.6541 12.6826H25.8004Z"
                stroke="white"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <path
                d="M33.8011 35.6629C32.3186 31.0967 28.0533 28.0034 23.2394 28.0034C18.4255 28.0034 14.1602 31.0967 12.6777 35.6629"
                stroke="white"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    ),
    imageUpload: <UploadIcon />,
    checkmark: <CheckmarkIcon />,
    checkmarkOutline: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 112 113" fill="none">
            <circle opacity=".1" cx="56" cy="56.5" r="56" fill="#0EAC1B" />
            <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M101.833 56.5c0 25.313-20.52 45.833-45.834 45.833-25.313 0-45.833-20.52-45.833-45.833s20.52-45.833 45.833-45.833 45.834 20.52 45.834 45.833Zm-57.831-4.267c.56.24 1.065.589 1.488 1.027l5.926 5.926 15.093-15.093a4.583 4.583 0 1 1 6.48 6.48L54.657 68.908a4.583 4.583 0 0 1-6.48 0l-9.167-9.166a4.585 4.585 0 0 1 3.224-7.88c.608.005 1.21.131 1.769.372Z"
                fill="#0EAC1B"
            />
        </svg>
    ),
    checkMarkMono: (
        <svg
            width="14"
            height="11"
            viewBox="0 0 14 11"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <path
                d="M0.76361 5.82623L4.25997 9.59981L12.5685 1.29131"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    ),
    error: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
            <g fill="none" fillRule="evenodd">
                <circle cx="10" cy="10" r="10" fill="#FF5C00" fillRule="nonzero" />
                <path
                    stroke="#FFF"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.5"
                    d="M10 11.562V5M10 14.562v-.052"
                />
            </g>
        </svg>
    ),
    warning: (
        <svg
            width="24px"
            height="24px"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
        >
            <g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
                <g
                    transform="translate(-505.000000, -2598.000000)"
                    stroke="#0324FF"
                    strokeWidth="1.5"
                >
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
    circle: <MapIcons.CircleIcon />,
    pin: <MapIcons.PinIcon />,
    arrow: <MapIcons.ArrowIcon />,
    longArrow: <MapIcons.LongArrowIcon />,
    arrowhead: <MapIcons.ArrowHeadIcon />,
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
            <g
                transform="translate(0 -2)"
                stroke="currentColor"
                strokeWidth="1.5"
                fill="none"
                fillRule="evenodd"
                strokeLinecap="round"
                strokeLinejoin="round"
            >
                <path d="M17.788 5.375h-7.013c-1.408 0-2.55 1.12-2.55 2.5V11" />
                <path d="M13.963 9.125l3.825-3.75-3.825-3.75M15.238 12.875v6.25c0 .69-.571 1.25-1.275 1.25H2.488c-.705 0-1.276-.56-1.276-1.25v-10c0-.69.571-1.25 1.276-1.25H4.4" />
            </g>
        </svg>
    ),
    emptyAvatarUpload: (
        <svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg">
            <g
                transform="translate(20 20)"
                stroke="#D8D8D8"
                strokeWidth="1.5"
                fill="none"
                fillRule="evenodd"
                strokeLinecap="round"
                strokeLinejoin="round"
            >
                <path d="M13.817 10.489A11.927 11.927 0 0 0 27.11 13.16" />
                <circle cx="20" cy="14.13" r="7.174" />
                <path d="M.435 10.871V3.043A2.609 2.609 0 0 1 3.043.435h7.827M39.565 10.871V3.043A2.609 2.609 0 0 0 36.957.435H29.13M.435 29.13v7.827a2.609 2.609 0 0 0 2.608 2.608h7.827M39.565 29.13v7.827a2.609 2.609 0 0 1-2.608 2.608H29.13M31.02 31.74a11.673 11.673 0 0 0-22.04 0" />
            </g>
        </svg>
    ),
    profileMan: (
        <svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg">
            <g fill="none" fillRule="evenodd">
                <g opacity="0.5">
                    <ellipse
                        stroke="#525252"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        cx="40.5"
                        cy="28"
                        rx="10.762"
                        ry="10.5"
                    />
                    <path
                        d="M32.813 44.498V46c0 4.142 3.441 7.5 7.687 7.5s7.688-3.358 7.688-7.5v-1.502"
                        stroke="#525252"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                    <path
                        d="M31.226 22.668c3.367 3.408 8.01 5.333 12.861 5.332 2.433 0 4.84-.483 7.073-1.422M20.512 62.5c0-10.77 8.95-19.5 19.988-19.5 11.039 0 19.987 8.73 19.987 19.5"
                        stroke="#525252"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                </g>
            </g>
        </svg>
    ),
    hamburger: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 12 10">
            <g
                stroke="currentColor"
                strokeWidth="1.5"
                fill="none"
                fillRule="evenodd"
                strokeLinecap="round"
            >
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
                <circle
                    transform="rotate(-23.025 7.593 7.592)"
                    cx="7.593"
                    cy="7.592"
                    r="5.371"
                />
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
            <g
                transform="translate(1 1)"
                stroke="currentColor"
                fill="none"
                fillRule="evenodd"
            >
                <circle cx="8" cy="8" r="8" />
                <g strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.071">
                    <path d="M7.925 12.005a.316.316 0 100 .632.316.316 0 000-.632h0M5.398 5.975a2.526 2.526 0 113.369 2.383 1.263 1.263 0 00-.842 1.19v.532" />
                </g>
            </g>
        </svg>
    ),
    outlineQuestionMark2: (
        <svg viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
                d="M8.25 16.5a8.25 8.25 0 1 0 0-16.5 8.25 8.25 0 0 0 0 16.5Z"
                fill="#A3A3A3"
            />
            <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M8.435 11.41a1.05 1.05 0 1 0 0 2.1 1.05 1.05 0 0 0 0-2.1Z"
                fill="#fff"
            />
            <path
                d="M6.225 5.853a2.21 2.21 0 1 1 2.947 2.085 1.105 1.105 0 0 0-.737 1.042v.465"
                stroke="#fff"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    ),
    lockOutline: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 18 24">
            <g
                fill="none"
                fillRule="evenodd"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.5"
            >
                <rect width="16.5" height="13.5" x="0.75" y="9.75" rx="1.5" />
                <path d="M3.75 9.75V6a5.25 5.25 0 1110.5 0v3.75M9 15v3" />
            </g>
        </svg>
    ),
    lock: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 19 25">
            <g
                fill="none"
                fillRule="evenodd"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.5"
                transform="translate(1 1)"
            >
                <path stroke="currentColor" d="M3 9V5.25a5.25 5.25 0 1110.5 0" />
                <rect
                    width="16.5"
                    height="13.5"
                    y="9"
                    fill="currentColor"
                    stroke="currentColor"
                    rx="1.5"
                />
                <path stroke="#FFF" d="M8.5 14v3" />
            </g>
        </svg>
    ),
    checkBadgeOutline: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <g
                fill="none"
                fillRule="evenodd"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.5"
            >
                <path d="M15.75 9.749l-3.981 5.308a.75.75 0 01-1.13.08L8.25 12.749" />
                {/* eslint-disable-next-line max-len */}
                <path d="M10.73 1.357a1.63 1.63 0 012.54 0l1.512 1.881c.348.434.893.66 1.446.6l2.4-.261a1.63 1.63 0 011.8 1.8l-.261 2.4c-.06.553.166 1.098.6 1.446l1.881 1.512a1.63 1.63 0 010 2.54l-1.887 1.505a1.63 1.63 0 00-.6 1.447l.261 2.4a1.629 1.629 0 01-1.8 1.8l-2.4-.261a1.628 1.628 0 00-1.446.6L13.27 22.64a1.629 1.629 0 01-2.54 0l-1.511-1.88a1.631 1.631 0 00-1.447-.6l-2.4.261a1.628 1.628 0 01-1.8-1.8l.261-2.4a1.631 1.631 0 00-.6-1.447l-1.88-1.511a1.629 1.629 0 010-2.54l1.88-1.512c.434-.348.66-.893.6-1.446l-.261-2.4a1.629 1.629 0 011.8-1.8l2.4.261a1.632 1.632 0 001.447-.6l1.511-1.869z" />
            </g>
        </svg>
    ),
    checkBadge: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <g
                fill="none"
                fillRule="evenodd"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.5"
            >
                {/* eslint-disable-next-line max-len */}
                <path
                    fill="currentColor"
                    stroke="currentColor"
                    d="M10.73 1.357a1.63 1.63 0 012.54 0l1.512 1.881c.348.434.893.66 1.446.6l2.4-.261a1.63 1.63 0 011.8 1.8l-.261 2.4c-.06.553.166 1.098.6 1.446l1.881 1.512a1.63 1.63 0 010 2.54l-1.887 1.505a1.63 1.63 0 00-.6 1.447l.261 2.4a1.629 1.629 0 01-1.8 1.8l-2.4-.261a1.628 1.628 0 00-1.446.6L13.27 22.64a1.629 1.629 0 01-2.54 0l-1.511-1.88a1.631 1.631 0 00-1.447-.6l-2.4.261a1.628 1.628 0 01-1.8-1.8l.261-2.4a1.631 1.631 0 00-.6-1.447l-1.88-1.511a1.629 1.629 0 010-2.54l1.88-1.512c.434-.348.66-.893.6-1.446l-.261-2.4a1.629 1.629 0 011.8-1.8l2.4.261a1.632 1.632 0 001.447-.6l1.511-1.869z"
                />
                <path
                    stroke="#FFF"
                    d="M15.75 9.749l-3.981 5.308a.75.75 0 01-1.13.08L8.25 12.749"
                />
            </g>
        </svg>
    ),
    checkBadgeHD: (
        <svg viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
            <g fill="none" fillRule="evenodd">
                <path
                    fill="#0324FF"
                    d="M8 14.88l-1.56.966-1.073-1.49-1.812.296-.42-1.787-1.787-.42.296-1.812L.154 9.56 1.12 8 .154 6.44l1.49-1.073-.296-1.812 1.787-.42.42-1.787 1.812.296L6.44.154 8 1.12 9.56.154l1.073 1.49 1.812-.296.42 1.787 1.787.42-.296 1.812 1.49 1.072L14.88 8l.966 1.56-1.49 1.073.296 1.812-1.787.42-.42 1.787-1.812-.296-1.072 1.49z"
                />
                <path
                    stroke="#FFF"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4.865 8.172l1.65 1.792 4.243-4.243"
                />
            </g>
        </svg>
    ),
    dropPlus: (
        <svg viewBox="0 0 25 25" xmlns="http://www.w3.org/2000/svg">
            <g transform="translate(1 1)" fill="none" fillRule="evenodd">
                <circle fill="#FCFBF9" cx="11.5" cy="11.5" r="11.5" />
                <path
                    d="M11.5 23C17.851 23 23 17.851 23 11.5S17.851 0 11.5 0 0 5.149 0 11.5C.007 17.848 5.152 22.993 11.5 23zm-6-12.5h4.75a.25.25 0 0 0 .25-.25V5.5a1 1 0 0 1 2 0v4.75c0 .138.112.25.25.25h4.75a1 1 0 0 1 0 2h-4.75a.25.25 0 0 0-.25.25v4.75a1 1 0 0 1-2 0v-4.75a.25.25 0 0 0-.25-.25H5.5a1 1 0 0 1 0-2z"
                    fill="#FF5C00"
                    fillRule="nonzero"
                />
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
            <path
                d="M.756 1l4.245 4.245 4.243-4.242"
                stroke="#CDCDCD"
                strokeWidth="1.5"
                fill="none"
                fillRule="evenodd"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    ),
    // TODO check if is used and delete if not
    x: (
        <svg viewBox="0 0 10 10" xmlns="http://www.w3.org/2000/svg">
            <g
                stroke="#A3A3A3"
                strokeWidth="1.5"
                fill="none"
                fillRule="evenodd"
                strokeLinecap="round"
            >
                <path d="M.757.757l8.486 8.486M9.243.757L.757 9.243" />
            </g>
        </svg>
    ),
    transfer: (
        <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <g fill="none" fillRule="evenodd">
                <rect fill="currentColor" width="24" height="24" rx="3" />
                <path
                    d="M8.8 8h8.8M14.4 4.8L17.6 8l-3.2 3.2M15.2 16H6.4M9.6 19.2L6.4 16l3.2-3.2"
                    stroke="#FDFDFD"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
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
                <path
                    d="M12 24C5.372 24 0 18.628 0 12S5.372 0 12 0s12 5.372 12 12-5.372 12-12 12z"
                    fill="#CDCDCD"
                    fillRule="nonzero"
                />
                <path
                    d="M13.878 5.193v-.432a.26.26 0 00-.271-.26 5.63 5.63 0 00-5.355 5.393c.006.182.154.23.241.23h.44a.26.26 0 00.26-.248 4.693 4.693 0 014.444-4.438c.183-.023.241-.123.241-.245m-3.953 4.931h.42a.26.26 0 00.258-.242 3.285 3.285 0 013.055-3.035.235.235 0 00.22-.248V6.17a.261.261 0 00-.279-.26 4.224 4.224 0 00-3.935 3.934c-.01.15.11.279.26.279m3.954-2.541v.43c0 .176-.152.239-.227.248a1.878 1.878 0 00-1.635 1.63.262.262 0 01-.26.233h-.42a.26.26 0 01-.259-.284 2.816 2.816 0 012.518-2.517.26.26 0 01.283.26zm4.929 6.282c-.122 0-.222-.058-.245-.241a4.693 4.693 0 00-4.439-4.444.26.26 0 01-.248-.26v-.44c0-.086.048-.234.23-.24a5.631 5.631 0 015.395 5.353.26.26 0 01-.26.272h-.433zm-4.932-3.953c0-.151.128-.27.28-.26a4.224 4.224 0 013.934 3.934c.01.15-.109.28-.26.28h-.428a.235.235 0 01-.248-.221 3.285 3.285 0 00-3.035-3.055.26.26 0 01-.243-.258v-.42zm2.542 3.953h-.43c-.176 0-.24-.153-.248-.227a1.878 1.878 0 00-1.632-1.635.262.262 0 01-.232-.26v-.42a.26.26 0 01.284-.259 2.816 2.816 0 012.518 2.517.26.26 0 01-.26.284zM5.193 10.123c.122 0 .222.059.245.241a4.693 4.693 0 004.439 4.444.26.26 0 01.248.26v.44c0 .086-.048.234-.23.24A5.631 5.631 0 014.5 10.395a.26.26 0 01.26-.272h.433zm4.932 3.953c0 .151-.128.27-.28.26a4.224 4.224 0 01-3.934-3.934.261.261 0 01.26-.28h.428c.189 0 .244.149.248.222a3.285 3.285 0 003.035 3.054.26.26 0 01.243.258v.42zm-2.542-3.953h.43c.176 0 .24.153.248.227.103.853.779 1.53 1.632 1.635a.262.262 0 01.232.26v.42a.26.26 0 01-.284.259 2.816 2.816 0 01-2.518-2.517.26.26 0 01.26-.284zm2.543 8.684c0-.122.059-.222.241-.245a4.693 4.693 0 004.445-4.438.26.26 0 01.26-.248h.44c.086 0 .234.048.24.23a5.631 5.631 0 01-5.354 5.394.26.26 0 01-.272-.26v-.433zm3.954-4.931c.151 0 .27.128.26.28a4.224 4.224 0 01-3.935 3.934.261.261 0 01-.28-.26V17.4c0-.189.149-.243.222-.248a3.285 3.285 0 003.055-3.035.26.26 0 01.257-.242h.42zm-3.954 2.541v-.43c0-.176.153-.239.227-.248a1.878 1.878 0 001.636-1.63.262.262 0 01.259-.233h.42a.26.26 0 01.26.284 2.816 2.816 0 01-2.518 2.517.26.26 0 01-.284-.26z"
                    fill="#FFF"
                />
            </g>
        </svg>
    ),
    DATAColor: (
        <svg
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
        >
            <circle cx="12" cy="12" r="12" fill="#F7600A" />
            <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M14.104 4.377v-.485c0-.166-.138-.3-.304-.292a6.307 6.307 0 0 0-5.998 6.041c.007.204.173.258.27.258h.492a.292.292 0 0 0 .292-.278 5.256 5.256 0 0 1 4.978-4.97c.204-.026.27-.138.27-.274ZM9.676 9.899h.47a.29.29 0 0 0 .289-.272 3.68 3.68 0 0 1 3.422-3.398.263.263 0 0 0 .247-.278v-.48a.293.293 0 0 0-.313-.291 4.73 4.73 0 0 0-4.407 4.406.293.293 0 0 0 .292.313Zm6.257 4.202c.097 0 .263.054.27.258a6.307 6.307 0 0 1-5.998 6.04.292.292 0 0 1-.304-.291v-.484c0-.137.066-.248.27-.275a5.256 5.256 0 0 0 4.978-4.97.292.292 0 0 1 .292-.278h.492Zm-1.604 0c.17 0 .303.144.292.313a4.73 4.73 0 0 1-4.407 4.406.293.293 0 0 1-.313-.291v-.48c0-.211.165-.272.247-.278a3.68 3.68 0 0 0 3.422-3.398.29.29 0 0 1 .289-.272h.47Zm-1.581 0c.171 0 .308.147.29.318a3.154 3.154 0 0 1-2.82 2.82.291.291 0 0 1-.317-.292v-.481c0-.197.171-.268.255-.278a2.103 2.103 0 0 0 1.831-1.827.294.294 0 0 1 .29-.26h.47ZM4.377 9.898c.136 0 .248.065.274.27a5.256 5.256 0 0 0 4.971 4.977.292.292 0 0 1 .278.292v.492c0 .097-.054.262-.258.27A6.307 6.307 0 0 1 3.6 10.201a.292.292 0 0 1 .292-.304h.485Zm1.574 0c.212 0 .273.165.278.247a3.68 3.68 0 0 0 3.4 3.421.29.29 0 0 1 .27.289v.47c0 .17-.143.303-.312.292A4.73 4.73 0 0 1 5.18 10.21a.293.293 0 0 1 .291-.312h.48Zm8.407-2.11a6.307 6.307 0 0 1 6.042 5.997.292.292 0 0 1-.292.304h-.485c-.136 0-.248-.066-.274-.27a5.256 5.256 0 0 0-4.971-4.978.292.292 0 0 1-.278-.29v-.493c0-.097.054-.263.258-.27Zm.055 1.582a4.73 4.73 0 0 1 4.407 4.406.293.293 0 0 1-.291.313h-.48a.263.263 0 0 1-.278-.247 3.68 3.68 0 0 0-3.4-3.421.29.29 0 0 1-.27-.289v-.47c0-.17.143-.303.312-.292Zm.005 1.582a3.154 3.154 0 0 1 2.82 2.82.291.291 0 0 1-.291.317h-.482c-.197 0-.268-.171-.278-.254a2.103 2.103 0 0 0-1.827-1.832.293.293 0 0 1-.26-.29v-.47c0-.172.148-.308.318-.291ZM7.535 9.898c.197 0 .268.17.278.254a2.103 2.103 0 0 0 1.827 1.832c.148.018.26.14.26.29v.47a.291.291 0 0 1-.318.29 3.154 3.154 0 0 1-2.82-2.819.291.291 0 0 1 .291-.317h.482Zm6.569-2.845v.481c0 .197-.171.268-.254.278a2.103 2.103 0 0 0-1.832 1.827.294.294 0 0 1-.29.26h-.47a.29.29 0 0 1-.291-.318 3.154 3.154 0 0 1 2.82-2.82c.17-.016.317.12.317.292Z"
                fill="#fff"
            />
        </svg>
    ),
    ETH: (
        <svg width="24" height="24" xmlns="http://www.w3.org/2000/svg">
            <g fillRule="nonzero" fill="none">
                <path
                    d="M12 24C5.372 24 0 18.628 0 12S5.372 0 12 0s12 5.372 12 12-5.372 12-12 12zm5.995-11.836L12.373 3 6.75 12.165l5.623 3.265 5.623-3.266zM18 13.212l-5.627 3.263-5.623-3.262 5.623 7.783L18 13.212z"
                    fill="#CDCDCD"
                />
                <g opacity=".497">
                    <path
                        d="M12.373 3v6.652l5.623 2.513L12.374 3zm0 13.476v4.52L18 13.212l-5.627 3.264z"
                        fillOpacity=".298"
                        fill="#000"
                    />
                    <path fill="#525252" d="M12.373 15.43l5.623-3.265-5.622-2.511z" />
                    <path fill="#ADADAD" d="M6.75 12.165l5.623 3.265V9.654z" />
                </g>
            </g>
        </svg>
    ),
    DAI: (
        <svg width="24" height="24" xmlns="http://www.w3.org/2000/svg">
            <g fillRule="nonzero" fill="none">
                <path
                    d="M12 0C5.371 0 0 5.371 0 12s5.371 12 12 12 12-5.371 12-12S18.629 0 12 0z"
                    fill="#CDCDCD"
                />
                <path
                    d="M18 10.245h-1.29C16.002 8.323 14.094 7 11.577 7H7.438v3.245H6v1.164h1.438v1.22H6v1.165h1.438V17h4.138c2.488 0 4.382-1.31 5.11-3.206H18V12.63h-1.025c.026-.205.036-.418.036-.63v-.028c0-.191-.01-.379-.029-.563H18v-1.164zM8.596 8.04h2.98c1.847 0 3.22.889 3.853 2.205H8.596V8.04zm2.98 7.916h-2.98v-2.162h6.826c-.641 1.295-2.006 2.162-3.846 2.162zm4.24-3.928c0 .206-.014.407-.043.602H8.596v-1.22h7.18c.026.19.04.388.04.59v.028z"
                    fill="#FFF"
                />
            </g>
        </svg>
    ),
    unknownToken: (
        <svg width="24" height="24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
                d="M11.942 23.885c6.596 0 11.943-5.347 11.943-11.943C23.885 5.347 18.538 0 11.942 0 5.347 0 0 5.347 0 11.942c0 6.596 5.347 11.943 11.942 11.943Z"
                fill="#CDCDCD"
            />
            <path
                d="M15.833 8.167a.572.572 0 0 0-.585-.138 10.257 10.257 0 0 1-6.496 0 .571.571 0 0 0-.723.723 10.256 10.256 0 0 1 0 6.496.571.571 0 0 0 .723.723 10.337 10.337 0 0 1 6.496 0 .571.571 0 0 0 .723-.723 10.257 10.257 0 0 1 0-6.496.572.572 0 0 0-.138-.585ZM12 14.305c-.874 0-1.749.099-2.601.297a11.393 11.393 0 0 0 0-5.203 11.391 11.391 0 0 0 5.202 0 11.394 11.394 0 0 0 0 5.203A11.498 11.498 0 0 0 12 14.305Z"
                fill="#fff"
            />
            <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M12 2.7c-5.042 0-9.3 4.222-9.3 9.3 0 5.042 4.222 9.3 9.3 9.3 5.042 0 9.3-4.222 9.3-9.3 0-5.042-4.222-9.3-9.3-9.3Zm0 17.113c-4.232 0-7.813-3.58-7.813-7.813 0-4.232 3.581-7.813 7.813-7.813 4.232 0 7.814 3.58 7.814 7.813 0 4.232-3.582 7.813-7.814 7.813ZM9.882 3.261A8.717 8.717 0 0 1 12 3c4.912 0 9 4.123 9 9 0 4.17-2.973 7.747-6.855 8.732C18.028 19.748 21 16.171 21 12c0-4.877-4.088-9-9-9-.726 0-1.436.09-2.118.261ZM12 20.113c-4.398 0-8.113-3.715-8.113-8.113 0-3.747 2.697-6.999 6.216-7.88-3.519.881-6.216 4.133-6.216 7.88 0 4.398 3.715 8.113 8.113 8.113Z"
                fill="#fff"
            />
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
    copy: (
        <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M23 5H13C11.6193 5 10.5 6.11929 10.5 7.5V8.5H9.5C8.11929 8.5 7 9.61929 7 11V24C7 25.3807 8.11929 26.5 9.5 26.5H19.5C20.8807 26.5 22 25.3807 22 24V23H23C24.3807 23 25.5 21.8807 25.5 20.5V7.5C25.5 6.11929 24.3807 5 23 5ZM20.5 23H13C11.6193 23 10.5 21.8807 10.5 20.5V10H9.5C8.94772 10 8.5 10.4477 8.5 11V24C8.5 24.5523 8.94772 25 9.5 25H19.5C20.0523 25 20.5 24.5523 20.5 24V23ZM12 7.5C12 6.94772 12.4477 6.5 13 6.5H23C23.5523 6.5 24 6.94772 24 7.5V20.5C24 21.0523 23.5523 21.5 23 21.5H13C12.4477 21.5 12 21.0523 12 20.5V7.5Z"
                fill="currentColor"
            />
        </svg>
    ),
    alarmBell: (
        <svg viewBox="0 0 16 20" xmlns="http://www.w3.org/2000/svg">
            <g
                strokeWidth="1.5"
                stroke="currentColor"
                fill="none"
                fillRule="evenodd"
                strokeLinecap="round"
                strokeLinejoin="round"
            >
                <path d="M6.444 17.917a1.623 1.623 0 003.115 0M8 3.333v-1.75M8 3.333a5.833 5.833 0 015.833 5.834c0 5.48 1.167 6.416 1.167 6.416H1s1.167-1.49 1.167-6.416A5.833 5.833 0 018 3.333z" />
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
                <g
                    mask="url(#b)"
                    stroke="#FFF"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.5"
                >
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
                <g
                    transform="translate(9 9)"
                    stroke="#FFF"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.5"
                >
                    <circle cx="2.5" cy="11.497" r="2.25" />
                    <path d="M.205 5.126a6.807 6.807 0 018.4 9.36M.359.445a11.279 11.279 0 0113 14.08" />
                </g>
            </g>
        </svg>
    ),
    clipboardPlus: (
        <svg viewBox="0 0 11 13" xmlns="http://www.w3.org/2000/svg">
            <g stroke="currentColor" fill="none" fillRule="evenodd" strokeLinecap="round">
                <path
                    d="M7.375 2.875H9.25a.75.75 0 01.75.75V11.5a.75.75 0 01-.75.75h-7.5A.75.75 0 011 11.5V3.625a.75.75 0 01.75-.75h1.875a1.875 1.875 0 113.75 0z"
                    strokeLinejoin="round"
                />
                <path
                    d="M5.529 2.883a.187.187 0 11-.058.37.187.187 0 01.058-.37"
                    strokeLinejoin="round"
                />
                <path d="M3.5 7.5h4M5.5 5.5v4" />
            </g>
        </svg>
    ),
    clipboardCheck: (
        <svg viewBox="0 0 11 13" xmlns="http://www.w3.org/2000/svg">
            <g
                stroke="currentColor"
                fill="none"
                fillRule="evenodd"
                strokeLinecap="round"
                strokeLinejoin="round"
            >
                <path d="M7.375 2.875H9.25a.75.75 0 01.75.75V11.5a.75.75 0 01-.75.75h-7.5A.75.75 0 011 11.5V3.625a.75.75 0 01.75-.75h1.875a1.875 1.875 0 113.75 0z" />
                <path d="M5.529 2.883a.187.187 0 11-.058.37.187.187 0 01.058-.37M7.612 6L4.816 8.796a.409.409 0 01-.579 0L3.3 7.858" />
            </g>
        </svg>
    ),
    expand: (
        <svg width="25" height="24" xmlns="http://www.w3.org/2000/svg">
            <g
                transform="translate(1)"
                stroke="#ADADAD"
                strokeWidth="1.5"
                fill="none"
                fillRule="evenodd"
                strokeLinecap="round"
                strokeLinejoin="round"
            >
                <path d="M5.25 17.998L0 23.248M22.5 6.748v-6h-6M0 17.248v6h6M22.5.748l-5.25 5.25M17.25 17.998l5.25 5.25M0 6.748v-6h6M22.5 17.248v6h-6M0 .748l5.25 5.25" />
                <rect x="7.5" y="8.248" width="7.5" height="7.5" rx=".75" />
            </g>
        </svg>
    ),
    list: (
        <svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
            <rect
                fill="none"
                x=".75"
                y=".75"
                width="18.5"
                height="18.5"
                rx="1.25"
                stroke="currentColor"
                strokeWidth="1.5"
            />
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
    page: (
        <svg
            width="15"
            height="18"
            viewBox="0 0 15 18"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <path
                id="page"
                fillRule="evenodd"
                clipRule="evenodd"
                d="M12.5 0H2.5C1.11929 0 0 1.11929 0 2.5V15.5C0 16.8807 1.11929 18 2.5 18H12.5C13.8807 18 15 16.8807 15 15.5V2.5C15 1.11929 13.8807 0 12.5 0ZM1.5 2.5C1.5 1.94772 1.94772 1.5 2.5 1.5H12.5C13.0523 1.5 13.5 1.94772 13.5 2.5V15.5C13.5 16.0523 13.0523 16.5 12.5 16.5H2.5C1.94772 16.5 1.5 16.0523 1.5 15.5V2.5ZM8.85748 4.56053C8.85748 4.97475 8.5217 5.31053 8.10748 5.31053H5.02067C4.60646 5.31053 4.27067 4.97474 4.27067 4.56053C4.27067 4.14632 4.60646 3.81053 5.02067 3.81053L8.10748 3.81053C8.5217 3.81053 8.85748 4.14632 8.85748 4.56053ZM8.02069 7.53983C8.02069 7.95404 7.6849 8.28983 7.27069 8.28983H5.02069C4.60648 8.28983 4.27069 7.95404 4.27069 7.53983C4.27069 7.12561 4.60648 6.78983 5.02069 6.78983H7.27069C7.6849 6.78983 8.02069 7.12561 8.02069 7.53983ZM5.02069 9.76912C4.60648 9.76912 4.27069 10.1049 4.27069 10.5191C4.27069 10.9333 4.60648 11.2691 5.02069 11.2691H8.78803C9.20225 11.2691 9.53803 10.9333 9.53803 10.5191C9.53803 10.1049 9.20225 9.76912 8.78803 9.76912H5.02069ZM8.33316 13.4984C8.33316 13.9126 7.99737 14.2484 7.58316 14.2484H5.02068C4.60647 14.2484 4.27068 13.9126 4.27068 13.4984C4.27068 13.0842 4.60647 12.7484 5.02068 12.7484H7.58316C7.99737 12.7484 8.33316 13.0842 8.33316 13.4984Z"
                fill="currentColor"
            />
        </svg>
    ),
    fullScreen: (
        <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <g id="mingcute:fullscreen-line" clipPath="url(#clip0_4518_586)">
                <g id="Group">
                    <path
                        id="Vector"
                        d="M4 15C4.26522 15 4.51957 15.1054 4.70711 15.2929C4.89464 15.4804 5 15.7348 5 16V19H8C8.26522 19 8.51957 19.1054 8.70711 19.2929C8.89464 19.4804 9 19.7348 9 20C9 20.2652 8.89464 20.5196 8.70711 20.7071C8.51957 20.8946 8.26522 21 8 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V16C3 15.7348 3.10536 15.4804 3.29289 15.2929C3.48043 15.1054 3.73478 15 4 15ZM20 15C20.2449 15 20.4813 15.09 20.6644 15.2527C20.8474 15.4155 20.9643 15.6397 20.993 15.883L21 16V19C21.0002 19.5046 20.8096 19.9906 20.4665 20.3605C20.1234 20.7305 19.6532 20.9572 19.15 20.995L19 21H16C15.7451 20.9997 15.5 20.9021 15.3146 20.7272C15.1293 20.5522 15.0178 20.313 15.0028 20.0586C14.9879 19.8042 15.0707 19.5536 15.2343 19.3582C15.3979 19.1627 15.6299 19.0371 15.883 19.007L16 19H19V16C19 15.7348 19.1054 15.4804 19.2929 15.2929C19.4804 15.1054 19.7348 15 20 15ZM19 3C19.5046 2.99984 19.9906 3.19041 20.3605 3.5335C20.7305 3.87659 20.9572 4.34684 20.995 4.85L21 5V8C20.9997 8.25488 20.9021 8.50003 20.7272 8.68537C20.5522 8.8707 20.313 8.98224 20.0586 8.99717C19.8042 9.01211 19.5536 8.92933 19.3582 8.76574C19.1627 8.60215 19.0371 8.3701 19.007 8.117L19 8V5H16C15.7451 4.99972 15.5 4.90212 15.3146 4.72715C15.1293 4.55218 15.0178 4.31305 15.0028 4.05861C14.9879 3.80416 15.0707 3.55362 15.2343 3.35817C15.3979 3.16271 15.6299 3.0371 15.883 3.007L16 3H19ZM8 3C8.25488 3.00028 8.50003 3.09788 8.68537 3.27285C8.8707 3.44782 8.98224 3.68695 8.99717 3.94139C9.01211 4.19584 8.92933 4.44638 8.76574 4.64183C8.60215 4.83729 8.3701 4.9629 8.117 4.993L8 5H5V8C4.99972 8.25488 4.90212 8.50003 4.72715 8.68537C4.55218 8.8707 4.31305 8.98224 4.05861 8.99717C3.80416 9.01211 3.55362 8.92933 3.35817 8.76574C3.16271 8.60215 3.0371 8.3701 3.007 8.117L3 8V5C2.99984 4.49542 3.19041 4.00943 3.5335 3.63945C3.87659 3.26947 4.34684 3.04284 4.85 3.005L5 3H8Z"
                        fill="currentColor"
                    />
                </g>
            </g>
            <defs>
                <clipPath id="clip0_4518_586">
                    <rect width="24" height="24" fill="white" />
                </clipPath>
            </defs>
        </svg>
    ),
    externalLink: (
        <svg
            width="32"
            height="32"
            viewBox="0 0 32 32"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <path
                d="M22.0008 13.4286V10H18.5723"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <path
                d="M21.9994 10L14.2852 17.7143"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <path
                d="M15.5 12.5713H10.7857C10.3518 12.5713 10 12.9231 10 13.357V21.2141C10 21.6481 10.3518 21.9999 10.7857 21.9999H18.6429C19.0768 21.9999 19.4286 21.6481 19.4286 21.2141V16.4999"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    ),
    pencil: (
        <svg
            width="32"
            height="32"
            viewBox="0 0 32 32"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <path
                d="M22.3402 9.65976C22.1283 9.44871 21.8766 9.28175 21.5998 9.16852C21.3229 9.05528 21.0264 8.99803 20.7273 9.00005C20.4282 9.00208 20.1324 9.06334 19.8571 9.18031C19.5819 9.29728 19.3325 9.46764 19.1234 9.68154L10.1013 18.7036L9 23L13.2964 21.8981L22.3185 12.876C22.5324 12.667 22.7028 12.4177 22.8198 12.1424C22.9368 11.8672 22.9981 11.5715 23.0002 11.2724C23.0022 10.9733 22.9449 10.6768 22.8316 10.4C22.7184 10.1232 22.5513 9.87162 22.3402 9.65976V9.65976Z"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <path
                d="M18.8652 9.93994L22.0597 13.1344"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <path
                d="M10.1016 18.7031L13.2991 21.8951"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    ),
    pencilFull: (
        <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <path
                d="M14.0833 5.43734L10.5417 1.93734L11.7083 0.770671C12.0278 0.451226 12.4203 0.291504 12.8858 0.291504C13.3508 0.291504 13.7431 0.451226 14.0625 0.770671L15.2292 1.93734C15.5486 2.25678 15.7153 2.64234 15.7292 3.094C15.7431 3.54511 15.5903 3.93039 15.2708 4.24984L14.0833 5.43734ZM1.33333 15.4998C1.09722 15.4998 0.899445 15.4198 0.74 15.2598C0.58 15.1004 0.5 14.9026 0.5 14.6665V12.3123C0.5 12.2012 0.520833 12.0937 0.5625 11.9898C0.604167 11.8854 0.666667 11.7915 0.75 11.7082L9.33333 3.12484L12.875 6.6665L4.29167 15.2498C4.20833 15.3332 4.11472 15.3957 4.01083 15.4373C3.90639 15.479 3.79861 15.4998 3.6875 15.4998H1.33333Z"
                fill="currentColor"
            />
        </svg>
    ),
    eye: (
        <svg
            width="32"
            height="32"
            viewBox="0 0 32 32"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <path
                d="M15.9988 10.501C12.774 10.4466 9.43872 12.7002 7.34189 15.0082C7.1218 15.2526 7 15.5698 7 15.8986C7 16.2275 7.1218 16.5447 7.34189 16.789C9.39312 19.0483 12.7188 21.3539 15.9988 21.2987C19.2788 21.3539 22.6053 19.0483 24.6581 16.789C24.8782 16.5447 25 16.2275 25 15.8986C25 15.5698 24.8782 15.2526 24.6581 15.0082C22.5589 12.7002 19.2236 10.4466 15.9988 10.501Z"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <path
                d="M18.9981 15.9003C18.998 16.4936 18.8219 17.0735 18.4921 17.5668C18.1624 18.06 17.6938 18.4444 17.1456 18.6714C16.5974 18.8983 15.9942 18.9576 15.4123 18.8417C14.8304 18.7259 14.2959 18.4401 13.8765 18.0205C13.457 17.6009 13.1713 17.0664 13.0556 16.4844C12.9399 15.9025 12.9994 15.2993 13.2265 14.7512C13.4536 14.2031 13.8381 13.7346 14.3314 13.405C14.8248 13.0753 15.4048 12.8994 15.9981 12.8994C16.3922 12.8993 16.7824 12.9769 17.1465 13.1276C17.5105 13.2784 17.8413 13.4995 18.1199 13.7782C18.3986 14.0568 18.6195 14.3877 18.7702 14.7518C18.9209 15.1159 18.9983 15.5062 18.9981 15.9003Z"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    ),
    ellipse: (
        <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="2" />
        </svg>
    ),
    email: (
        <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <g clipPath="url(#clip0_1889_4457)">
                <g clipPath="url(#clip1_1889_4457)">
                    <circle cx="8" cy="8" r="8" fill="currentColor" />
                    <path
                        d="M3.33203 5.5013C3.33203 5.28029 3.43036 5.06833 3.6054 4.91205C3.78043 4.75577 4.01783 4.66797 4.26536 4.66797H11.732C11.9796 4.66797 12.217 4.75577 12.392 4.91205C12.567 5.06833 12.6654 5.28029 12.6654 5.5013V10.5013C12.6654 10.7223 12.567 10.9343 12.392 11.0906C12.217 11.2468 11.9796 11.3346 11.732 11.3346H4.26536C4.01783 11.3346 3.78043 11.2468 3.6054 11.0906C3.43036 10.9343 3.33203 10.7223 3.33203 10.5013V5.5013ZM4.97423 5.5013L7.9987 7.86422L11.0232 5.5013H4.9747H4.97423ZM11.732 6.05505L8.30623 8.73172C8.22113 8.79829 8.11184 8.83499 7.9987 8.83499C7.88555 8.83499 7.77626 8.79829 7.69116 8.73172L4.26536 6.05505V10.5013H11.732V6.05505Z"
                        fill="white"
                    />
                </g>
            </g>
            <defs>
                <clipPath id="clip0_1889_4457">
                    <rect width="16" height="16" fill="white" />
                </clipPath>
                <clipPath id="clip1_1889_4457">
                    <rect width="16" height="16" fill="white" />
                </clipPath>
            </defs>
        </svg>
    ),
    github: <SocialIcons.GitHub />,
    medium: <SocialIcons.Medium />,
    peepeth: <SocialIcons.Peepeth />,
    reddit: <SocialIcons.Reddit />,
    telegram: <SocialIcons.Telegram />,
    trello: <SocialIcons.Trello />,
    twitter: <SocialIcons.Twitter />,
    youtube: <SocialIcons.Youtube />,
    linkedin: <SocialIcons.LinkedIn />,
    instagram: <SocialIcons.Instagram />,
    facebook: <SocialIcons.Facebook />,
    web: <SocialIcons.Web />,
}
export type IconName = $Keys<typeof sources>
export type SvgIconProps = {
    name: IconName
    className?: string
    css?: any
    id?: string
    onClick?: () => void
}
const SvgIcon = React.forwardRef(({ name, ...props }: SvgIconProps, ref) =>
    React.cloneElement(sources[name], { ...props, ref }),
) as ComponentType<SvgIconProps>
// @ts-expect-error suppress flow complaining about property `names` is missing in  `React.AbstractComponentStatics`
SvgIcon.names = Object.keys(sources).sort()
SvgIcon.displayName = 'SvgIcon'
export default SvgIcon
