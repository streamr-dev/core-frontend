// @flow

import React from 'react'

import styles from './meatball.pcss'

type Props = {
    alt: string,
}

const Meatball = ({ alt }: Props) => (
    <div className={styles.root}>
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="4"
            alt={alt}
        >
            <g fill="#FFF">
                <circle cx="2" cy="2" r="2" />
                <circle cx="10" cy="2" r="2" />
                <circle cx="18" cy="2" r="2" />
            </g>
        </svg>
    </div>
)

export default Meatball
