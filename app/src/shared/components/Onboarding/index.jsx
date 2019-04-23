// @flow

import React, { type Element, type ChildrenArray } from 'react'
import Link from '$shared/components/Link'
import styles from './onboarding.pcss'

type Props = {
    children: ChildrenArray<Element<typeof Link> | null>, // – can be a Link (`null` for a separator)
    title?: ?string,
}

const Onboarding = ({ children, title }: Props) => (
    <div className={styles.root}>
        <div className={styles.children}>
            {!!title && (
                <div className={styles.label}>
                    {title}
                </div>
            )}
            {React.Children.map(children, (child) => child || <div className={styles.separator} />)}
        </div>
        <button type="button">
            <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className={styles.icon}>
                <path
                    // eslint-disable-next-line max-len
                    d="M9.1 9.286a.75.75 0 0 1-1.5-.001 4.287 4.287 0 1 1 5.716 4.044 1.018 1.018 0 0 0-.68.96v.744a.75.75 0 0 1-1.5 0v-.744a2.52 2.52 0 0 1 1.68-2.374A2.787 2.787 0 1 0 9.1 9.285zm2.782 10.074a1.19 1.19 0 1 1 0-2.38 1.19 1.19 0 0 1 0 2.38z"
                    fill="#525252"
                />
            </svg>
        </button>
    </div>
)

export default Onboarding
