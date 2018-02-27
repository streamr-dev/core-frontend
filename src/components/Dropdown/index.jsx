// @flow
import React from 'react'

export type DropdownOptions = {
    [string]: string,
}

export type DropdownProps = {
    options: DropdownOptions
}

const Dropdown = ({ options }: DropdownProps) => (
    <select>
        {options && Object.keys(options).map((key) => (
            <option key={key} value={key}>{options[key]}</option>
        ))}
    </select>
)

export default Dropdown
