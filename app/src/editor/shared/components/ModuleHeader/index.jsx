// @flow

/* eslint-disable */

import React from 'react'
import cx from 'classnames'
import Prop from '$shared/components/Prop'
import EditableText from '$shared/components/EditableText'
import HamburgerButton from './HamburgerButton'
import styles from './moduleHeader.pcss'

type Props = {
    className?: string,
    disabledLabel?: boolean,
    label: string,
    onHamburgerClick?: ?(SyntheticMouseEvent<EventTarget>) => void,
    onLabelChange: (string) => void,
}

const ModuleHeader = ({
    className,
    disabledLabel,
    label,
    onHamburgerClick,
    onLabelChange,
    ...props
}: Props) => (
    <div
        className={cx(styles.root, className)}
        {...props}
    >
        <div className={styles.expandToggle} />
        <Prop initialValue={false}>
            {(editing, setEditing) => (
                <div className={styles.name}>
                    <div
                        className={cx({
                            [styles.idle]: !editing,
                        })}
                    >
                        <EditableText
                            disabled={!!disabledLabel}
                            editing={editing}
                            onChange={onLabelChange}
                            setEditing={setEditing}
                        >
                            {label}
                        </EditableText>
                    </div>
                </div>
            )}
        </Prop>
        {onHamburgerClick ? (
            <HamburgerButton
                className={styles.menuToggle}
                onClick={onHamburgerClick}
            />
        ) : <div />}
    </div>
)

ModuleHeader.defaultProps = {
    disabledLabel: false,
    onHamburgerClick: null,
}

export default ModuleHeader
