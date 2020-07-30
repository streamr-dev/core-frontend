// @flow

import React from 'react'
import styled from 'styled-components'
import cx from 'classnames'
import FallbackImage from '$shared/components/FallbackImage'
import Initials from './Initials'
import styles from './avatar.pcss'

type Props = {
    alt: string,
    className?: ?string,
    src: string,
}

const Avatar = ({ className, alt, src }: Props) => {
    const initials = (alt || '').split(/\s+/).filter(Boolean).map((s) => s[0]).slice(0, 2)
        .join('')
        .toUpperCase()

    return (
        <div className={cx(styles.root, className)}>
            <FallbackImage
                alt={alt || ''}
                className={styles.inner}
                src={src || ''}
                placeholder={initials ? (
                    <Initials>
                        {initials}
                    </Initials>
                ) : (
                    <svg
                        className={styles.inner}
                        viewBox="0 0 80 80"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        {/* eslint-disable-next-line max-len */}
                        <g
                            fill="none"
                            fillRule="evenodd"
                            stroke="#A1A1A1"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="1"
                        >
                            <ellipse vectorEffect="non-scaling-stroke" cx="40.5" cy="28" rx="10.762" ry="10.5" />
                            {/* eslint-disable-next-line max-len */}
                            <path vectorEffect="non-scaling-stroke" d="M31.226 22.668c3.367 3.408 8.01 5.333 12.861 5.332 2.433 0 4.84-.483 7.073-1.422M20.512 62.5c0-10.77 8.95-19.5 19.988-19.5 11.039 0 19.987 8.73 19.987 19.5" />
                            <path vectorEffect="non-scaling-stroke" d="M32.813 44.498V46c0 4.142 3.441 7.5 7.687 7.5s7.688-3.358 7.688-7.5v-1.502" />
                        </g>
                    </svg>
                )}
            />
        </div>
    )
}

export default styled(Avatar)``
