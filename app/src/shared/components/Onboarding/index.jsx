// @flow

import React, { type Element as ReactElement, type ChildrenArray, useState, useCallback, useRef, useMemo } from 'react'
import cx from 'classnames'
import useGlobalEventWithin from '$shared/hooks/useGlobalEventWithin'
import useKeyDown from '$shared/hooks/useKeyDown'
import { type Ref } from '$shared/flowtype/common-types'
import Link from '$shared/components/Link'
import SvgIcon from '$shared/components/SvgIcon'
import styles from './onboarding.pcss'

type Props = {
    children: ChildrenArray<ReactElement<typeof Link> | null>, // – can be a Link (`null` for a separator)
    title?: ?string,
}

const Onboarding = ({ children, title }: Props) => {
    const [open, setOpen] = useState(false)

    const toggle = useCallback(() => {
        setOpen((current) => !current)
    }, [setOpen])

    const childrenRef: Ref<Element> = useRef(null)

    useGlobalEventWithin('click', childrenRef, useCallback((within: boolean) => {
        if (within) {
            setOpen(false)
        }
    }, [setOpen]))

    const rootRef: Ref<Element> = useRef(null)

    useGlobalEventWithin('mousedown focusin touchstart', rootRef, useCallback((within: boolean) => {
        if (!within) {
            setOpen(false)
        }
    }, [setOpen]))

    useKeyDown(useMemo(() => ({
        Escape: () => {
            if (open) {
                setOpen(false)
            }
        },
    }), [open, setOpen]))

    return (
        <div
            className={cx(styles.root, {
                [styles.open]: open,
            })}
            ref={rootRef}
        >
            <div className={styles.inner}>
                <div
                    className={styles.children}
                    ref={childrenRef}
                >
                    {!!title && (
                        <div className={styles.label}>
                            {title}
                        </div>
                    )}
                    {React.Children.map(children, (child) => child || <div className={styles.separator} />)}
                </div>
                <button type="button" className={styles.toggle} onClick={toggle}>
                    <SvgIcon name="questionMark" className={styles.icon} />
                </button>
            </div>
        </div>
    )
}

export default Onboarding
