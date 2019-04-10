// @flow

import React, { useState, type Node } from 'react'
import cx from 'classnames'
import EditableText from '$shared/components/EditableText'
import styles from './moduleHeader.pcss'

type Props = {
    children?: Node,
    className?: string,
    editable?: boolean,
    label: string,
    limitWidth?: boolean,
    onLabelChange: (string) => void,
}

const ModuleHeader = ({
    children,
    className,
    editable,
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
            {/* TODO: Replace the following line with the actual toggle. This here is just a placeholder. */}
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
                        disabled={!editable}
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
    editable: true,
    onHamburgerClick: null,
}

ModuleHeader.styles = styles

export default ModuleHeader
