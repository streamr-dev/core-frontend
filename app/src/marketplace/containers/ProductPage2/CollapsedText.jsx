// @flow

import React, { useRef, useState, useCallback } from 'react'
import cx from 'classnames'
import { Translate } from 'react-redux-i18n'

import Link from '$shared/components/Link'

import styles from './collapsedText.pcss'

type Props = {
    text: string,
    className?: string,
}

const CollapsedText = ({ text, className }: Props) => {
    const maxLength = 4000
    const rootRef = useRef(null)
    const truncationRequired = text.length > maxLength
    const [truncated, setTruncatedState] = useState(truncationRequired)

    const toggleTruncate = useCallback(() => {
        setTruncatedState((prev) => !prev)

        if (rootRef.current) {
            rootRef.current.scrollIntoView({
                behavior: 'smooth',
                block: 'start',
                inline: 'nearest',
            })
        }
    }, [setTruncatedState])

    return (
        <div className={cx(styles.root, className)} ref={rootRef}>
            <div
                className={cx(styles.inner, {
                    [styles.truncated]: truncated,
                })}
            >
                {text}
            </div>
            {!!truncationRequired && (
                <Link
                    decorated
                    href="#"
                    className={styles.toggleMore}
                    onClick={toggleTruncate}
                >
                    {truncated ? (
                        <Translate value="productPage.description.more" />
                    ) : (
                        <Translate value="productPage.description.less" />
                    )}
                </Link>
            )}
        </div>
    )
}

export default CollapsedText
