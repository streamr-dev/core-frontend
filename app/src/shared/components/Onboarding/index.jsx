// @flow

import React, { type Element, type ChildrenArray } from 'react'
import Link from '$shared/components/Link'
import SvgIcon from '$shared/components/SvgIcon'
import styles from './onboarding.pcss'

type Props = {
    children: ChildrenArray<Element<typeof Link> | null>, // – can be a Link (`null` for a separator)
    title?: ?string,
}

const Onboarding = ({ children, title }: Props) => (
    <div className={styles.root}>
        <div className={styles.inner}>
            <div className={styles.children}>
                {!!title && (
                    <div className={styles.label}>
                        {title}
                    </div>
                )}
                {React.Children.map(children, (child) => child || <div className={styles.separator} />)}
            </div>
            <button type="button">
                <SvgIcon name="questionMark" className={styles.icon} />
            </button>
        </div>
        {/* The following element is visible only when `.inner` is/has `:focus-within`. CSS makes
            it cover the actual popup toggle. Clicking it "steals" focus from whoever has it within
            `.inner`. This allows us to trick ppl into believing that "?" button is a js-driven
            toggle which it is not. Magic. */}
        <button type="button" className={styles.focusCatcher} tabIndex="-1" />
    </div>
)

export default Onboarding
