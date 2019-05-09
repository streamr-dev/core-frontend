// @flow

import React, { type Element, type ChildrenArray } from 'react'
import cx from 'classnames'
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
            {/* eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex */}
            <div className={styles.toggle} tabIndex="0">
                <SvgIcon name="questionMark" className={styles.icon} />
            </div>
        </div>
        {/* The following element is visible only when `.inner` is/has `:focus-within`. CSS makes
            it cover the actual popup toggle. Clicking it "steals" focus from whoever has it within
            `.inner`. This allows us to trick ppl into believing that "?" is a js-driven toggle
            which it is not. Magic. */}
        <div className={cx(styles.toggle, styles.focusCatcher)} />
    </div>
)

export default Onboarding
