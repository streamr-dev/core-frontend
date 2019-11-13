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
    const outerElRef = useRef()
    const innerElRef = useRef()

    useEffect(() => {
        if (!truncationRequired) {
            setExpanded(false)
        }
    }, [truncationRequired])

    const toggleExpanded = useCallback(() => {
        setExpanded((prev) => !prev)

        const outerEl = outerElRef.current
        if (outerEl) {
            const { top } = outerEl.getBoundingClientRect()

            window.scrollTo({
                top: (top + window.pageYOffset) - 100, // offset nav
                behavior: 'smooth',
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
        <div className={cx(styles.root, styles.CollapsedText, className)}>
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
                    onClick={toggleExpanded}
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
