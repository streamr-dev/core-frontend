// @flow

import React, { useState } from 'react'
import cx from 'classnames'
import EditableText from '$shared/components/EditableText'
import HamburgerButton from './HamburgerButton'
import styles from './moduleHeader.pcss'

type Props = {
    className?: string,
    disabledLabel?: boolean,
    label: string,
    limitWidth?: boolean,
    onHamburgerClick?: ?(SyntheticMouseEvent<EventTarget>) => void,
    onLabelChange: (string) => void,
}

const ModuleHeader = ({
    className,
    disabledLabel,
    label,
    limitWidth,
    onHamburgerClick,
    onLabelChange,
    ...props
}: Props) => {
    const [editing, setEditing] = useState(false)

    return (
        <div
            className={cx(styles.root, styles.dragHandle, className)}
            {...props}
        >
            <div className={styles.expandToggle} />
            <div
                className={cx(styles.name, {
                    [styles.limitedWidth]: !!(limitWidth && editing),
                })}
            >
                <div
                    className={cx({
                        [styles.idle]: !editing,
                    })}
                >
                    <EditableText
                        className={cx({
                            [styles.limitedWidth]: !!limitWidth,
                        })}
                        disabled={!!disabledLabel}
                        editing={editing}
                        onChange={onLabelChange}
                        setEditing={setEditing}
                    >
                        {label}
                    </EditableText>
                </div>
            </div>
            {onHamburgerClick && (
                <HamburgerButton
                    className={cx(styles.menuToggle, styles.dragCancel)}
                    onClick={onHamburgerClick}
                />
            )}
        </div>
    )
}

ModuleHeader.defaultProps = {
    disabledLabel: false,
    onHamburgerClick: null,
}

ModuleHeader.styles = styles

export default ModuleHeader
