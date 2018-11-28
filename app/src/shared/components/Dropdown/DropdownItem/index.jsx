// @flow

import React, { type Node } from 'react'
import { DropdownItem as RsDropdownItem } from 'reactstrap'
import classNames from 'classnames'

import SvgIcon from '$shared/components/SvgIcon'

import styles from './dropdownItem.pcss'

/* eslint-disable react/no-unused-prop-types */

type Props = {
    children: Node,
    value: string,
    active?: boolean,
    onClick?: (SyntheticInputEvent<EventTarget>) => void,
}

const DropdownItem = ({ children, active, onClick }: Props) => (
    <RsDropdownItem
        onClick={onClick}
        className={classNames(styles.dropdownItem)}
    >
        {children}
        {active &&
            <SvgIcon name="tick" className={styles.tickIcon} />
        }
    </RsDropdownItem>
)

export default DropdownItem
