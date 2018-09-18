// @flow

import React from 'react'

export type DropdownOptions = {
    [string]: string,
}

export type DropdownProps = {
    options: DropdownOptions,
    onSelect: (option: ?string) => void,
}

const Dropdown = ({ options, onSelect }: DropdownProps) => (
    <select onChange={(e: SyntheticInputEvent<EventTarget>) => onSelect(e.target.value)}>
        {options && Object.keys(options).map((key) => (
            <option key={key} value={key}>{options[key]}</option>
        ))}
    </select>
)

Dropdown.defaultProps = {
    onSelect: () => {},
}

export default Dropdown
