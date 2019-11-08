// @flow

import React, { useRef, useState, useCallback, useEffect } from 'react'
import cx from 'classnames'
import { Translate } from 'react-redux-i18n'
import ReactMarkdown from 'react-markdown'

import { useThrottled } from '$shared/hooks/wrapCallback'

import styles from './collapsedText.pcss'

type Props = {
    text: string,
    className?: string,
}

const CollapsedText = ({ text: textProp, className }: Props) => {
    const text = textProp || ''
    const [truncationRequired, setTruncationRequired] = useState(false)
    const [expanded, setExpanded] = useState(false)
    const rootRef = useRef()
    const outerElRef = useRef()
    const innerElRef = useRef()

    const toggleTruncate = useCallback(() => {
        setExpanded((prev) => !prev)

        if (rootRef.current) {
            rootRef.current.scrollIntoView({
                behavior: 'smooth',
                block: 'start',
                inline: 'nearest',
            })
        }
    }, [setExpanded])

    const updateTruncation = useCallback(() => {
        const outerEl = outerElRef.current
        const innerEl = innerElRef.current

        if (outerEl && innerEl) {
            const { height: outerHeight } = outerEl.getBoundingClientRect()
            const { height: innerHeight } = innerEl.getBoundingClientRect()

            setTruncationRequired(innerHeight > outerHeight)
        }
    }, [outerElRef, innerElRef])

    const onResize = useThrottled(updateTruncation, 250)

    useEffect(() => {
        onResize()
    }, [onResize])

    useEffect(() => {
        window.addEventListener('resize', onResize)
        return () => {
            window.removeEventListener('resize', onResize)
        }
    }, [onResize])

    // Checks when markdown gets applied.
    useEffect(() => {
        const innerEl = innerElRef.current

        if (innerEl) {
            innerEl.addEventListener('DOMSubtreeModified', onResize)

            return () => {
                innerEl.removeEventListener('DOMSubtreeModified', onResize)
            }
        }

        return () => {}
    }, [innerElRef, onResize])

    return (
        <div className={cx(styles.root, styles.CollapsedText, className)} ref={rootRef}>
            <div
                className={cx(styles.outer, {
                    [styles.expanded]: !!expanded,
                    [styles.truncated]: !!truncationRequired,
                })}
                ref={outerElRef}
            >
                <div className={styles.inner} ref={innerElRef}>
                    <ReactMarkdown
                        source={text}
                        escapeHtml
                    />
                </div>
            </div>
            {truncationRequired && (
                <button
                    type="button"
                    onClick={toggleTruncate}
                    className={styles.expandButton}
                >
                    {!expanded ? (
                        <Translate value="productPage.description.more" />
                    ) : (
                        <Translate value="productPage.description.less" />
                    )}
                </button>
            )}
        </div>
    )
}

export default CollapsedText
