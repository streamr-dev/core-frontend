// @flow

import React, { useState, type Node, Fragment, useContext, useCallback, useEffect } from 'react'
import cx from 'classnames'
import EditableText from '$shared/components/EditableText'
import LoadingIndicator from '$shared/components/LoadingIndicator'
import Probe from '$editor/canvas/components/Resizable/SizeConstraintProvider/Probe'
import { Context as SizeConstraintContext } from '$editor/canvas/components/Resizable/SizeConstraintProvider'
import { Context as ResizableContext } from '$editor/canvas/components/Resizable'
import styles from './moduleHeader.pcss'

type Props = {
    children?: Node,
    className?: string,
    editable?: boolean,
    label: string,
    limitWidth?: boolean,
    onLabelChange: (string) => void,
    isLoading?: boolean,
}

const ModuleHeader = ({
    children,
    className,
    editable,
    label,
    limitWidth,
    onLabelChange,
    isLoading,
    ...props
}: Props) => {
    const [editing, setEditing] = useState(false)

    const { refreshProbes } = useContext(SizeConstraintContext)

    const onChange = useCallback(() => {
        refreshProbes()
    }, [refreshProbes])

    const { setShowHandle } = useContext(ResizableContext)

    useEffect(() => {
        refreshProbes()
        // Hide resize handle during editing.
        setShowHandle(!editing)
    }, [editing, setShowHandle, refreshProbes])

    return (
        <Fragment>
            <div
                {...props}
                className={cx(styles.root, className)}
            >
                {/* TODO: Replace the following line with the actual toggle. This here is just a placeholder. */}
                <div className={styles.expandToggle}>
                    <Probe uid="toggle" group="ModuleHeader" width="auto" />
                </div>
                <div
                    className={cx(styles.name, {
                        [styles.limitedWidth]: !!(limitWidth && editing),
                    })}
                >
                    <div className={styles.inner}>
                        <EditableText
                            className={cx({
                                [styles.limitedWidth]: !!limitWidth,
                            })}
                            disabled={!editable}
                            editing={editing}
                            onCommit={onLabelChange}
                            onChange={onChange}
                            probe={(
                                <Probe uid="name" group="ModuleHeader" width="auto" />
                            )}
                            setEditing={setEditing}
                        >
                            {label}
                        </EditableText>
                    </div>
                </div>
                {!!children && (
                    <div className={styles.buttons}>
                        <Probe uid="buttons" group="ModuleHeader" width="auto" />
                        {children}
                    </div>
                )}
                <LoadingIndicator className={styles.loadingIndicator} loading={!!isLoading} />
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
