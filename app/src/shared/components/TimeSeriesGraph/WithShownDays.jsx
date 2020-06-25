// @flow

import React, { useState, useCallback } from 'react'
import cx from 'classnames'

import { Header } from '$shared/components/DataUnionStats'
import DropdownActions from '$shared/components/DropdownActions'

import styles from './withShownDays.pcss'

type Props = {
    label?: string,
    children: Function,
    className?: string,
    onDaysChange?: Function,
    disabled?: boolean,
}

export const WithShownDays = ({
    label,
    children,
    className,
    onDaysChange: onDaysChangeProp,
    disabled,
}: Props) => {
    const [shownDays, setShownDays] = useState(7)

    const onDaysChange = useCallback((item: string) => {
        const newValue = Number(item)
        setShownDays((previousValue) => {
            if (onDaysChangeProp && previousValue !== newValue) {
                onDaysChangeProp(newValue)
            }

            return newValue
        })
    }, [onDaysChangeProp])

    return (
        <div className={cx(styles.memberContainer, className)}>
            <div className={styles.memberHeadingContainer}>
                {!!label && (
                    <Header>{label}</Header>
                )}
                <DropdownActions
                    title=""
                    activeTitle
                    selectedItem={shownDays.toString()}
                    onChange={onDaysChange}
                    className={styles.memberGraphDropdown}
                    disabled={disabled}
                    toggleProps={{
                        className: styles.toggleSmall,
                    }}
                >
                    <DropdownActions.ActiveTickItem value="7">Last 7 days</DropdownActions.ActiveTickItem>
                    <DropdownActions.ActiveTickItem value="28">Last 28 days</DropdownActions.ActiveTickItem>
                    <DropdownActions.ActiveTickItem value="90">Last 90 days</DropdownActions.ActiveTickItem>
                </DropdownActions>
            </div>
            {typeof children === 'function' ? children({
                shownDays,
            }) : null}
        </div>
    )
}

export default WithShownDays
