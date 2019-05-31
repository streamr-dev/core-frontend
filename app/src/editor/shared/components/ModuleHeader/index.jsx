// @flow

import React, { useState, type Node, Fragment } from 'react'
import cx from 'classnames'
import EditableText from '$shared/components/EditableText'
import Probe from '$editor/canvas/components/Resizable/SizeConstraintProvider/Probe'
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
        <Fragment>
            {/*
                ModuleHeader's minWidth is always 92px. The way we calculate the number:
                - 24px for expand/collapse placeholder
                - 40px for the hamburger menu button
                - 1.75um for EditableText (1um = 16px) - makes `Title` display as `T…`
            */}
            <Probe group="ModuleHeader" width={92} />
            <div
                className={cx(styles.root, className)}
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
                            onCommit={onLabelChange}
                            setEditing={setEditing}
                        >
                            {label}
                        </EditableText>
                    </div>
                </div>
                {!!children && (
                    <div className={styles.buttons}>
                        {children}
                    </div>
                )}
            </div>
        </Fragment>
    )
}

ModuleHeader.defaultProps = {
    children: null,
    editable: true,
}

ModuleHeader.styles = styles

export default ModuleHeader
