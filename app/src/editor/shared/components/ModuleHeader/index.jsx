// @flow

import React, { useState, type Node } from 'react'
import cx from 'classnames'
import EditableText from '$shared/components/EditableText'
import styles from './moduleHeader.pcss'

type Props = {
    children?: Node,
    className?: string,
    disabledLabel?: boolean,
    label: string,
    limitWidth?: boolean,
    onLabelChange: (string) => void,
}

const ModuleHeader = ({
    children,
    className,
    disabledLabel,
    label,
    limitWidth,
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
            {children}
        </div>
    )
}

ModuleHeader.defaultProps = {
    children: null,
    disabledLabel: false,
    onHamburgerClick: null,
}

ModuleHeader.styles = styles

export default ModuleHeader
