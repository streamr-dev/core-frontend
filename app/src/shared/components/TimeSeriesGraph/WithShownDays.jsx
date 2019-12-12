// @flow

import React, { useState, useCallback } from 'react'
import cx from 'classnames'

import Header from '$shared/components/CommunityStats/Header'
import Dropdown from '$shared/components/Dropdown'

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
                <Dropdown
                    title=""
                    selectedItem={shownDays.toString()}
                    onChange={onDaysChange}
                    className={styles.memberGraphDropdown}
                    toggleStyle="small"
                    disabled={disabled}
                >
                    <Dropdown.Item value="7">Last 7 days</Dropdown.Item>
                    <Dropdown.Item value="28">Last 28 days</Dropdown.Item>
                    <Dropdown.Item value="90">Last 90 days</Dropdown.Item>
                </Dropdown>
            </div>
            {typeof children === 'function' ? children({
                shownDays,
            }) : null}
        </div>
    )
}

export default WithShownDays
