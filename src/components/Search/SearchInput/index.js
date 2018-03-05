// @flow

import React from 'react'

import styles from './searchinput.pcss'

export type Props = {
    value: string,
    onChange: (text: string) => void,
}

const SearchInput = ({ value, onChange }: Props) => (
    <div className={styles.searchInput}>
        <input
            type="text"
            placeholder="Search the marketplace for..."
            value={value}
            onChange={(e: SyntheticInputEvent<EventTarget>) => onChange(e.target.value)}
        />
    </div>
)

SearchInput.defaultProps = {
    value: '',
    onChange: () => {},
}

export default SearchInput
