// @flow

import * as React from 'react'
import classNames from 'classnames'
import Dropdown from '$shared/components/Nav/DropdownItem'
import styles from './languageSelector.pcss'

type Props = {
    children: React.Node,
    selected: string,
}

const preventDefault = (e: SyntheticInputEvent<EventTarget>) => {
    e.preventDefault()
}

const icon = (className: string) => (
    <svg xmlns="http://www.w3.org/2000/svg" version="1" viewBox="0 0 12 8" className={className}>
        <path fill="#525252" d="M10.7 0L6 4.7 1.3 0 0 1.3l6 6 6-6z" />
    </svg>
)

const LanguageSelector = ({ children, selected }: Props) => (
    <div
        className={classNames(Dropdown.styles.dropdown, styles.selector, {
            [styles.enabled]: React.Children.count(children) > 1,
        })}
    >
        <a className={styles.toggle} href="#" onClick={preventDefault}>
            <span className={styles.inner}>{selected}</span>
            <div className={styles.arrows}>
                {icon(styles.arrowUp)}
                {icon(styles.arrowDown)}
            </div>
        </a>
        <div className={classNames(Dropdown.styles.dropdownMenuWrapper, styles.dropdownMenuWrapper, Dropdown.styles.centered)}>
            <ul className={classNames(Dropdown.styles.dropdownMenu, styles.dropdownMenu)}>
                {React.Children.map(children, (child) => (
                    <li>{child}</li>
                ))}
            </ul>
        </div>
    </div>
)

export default LanguageSelector
