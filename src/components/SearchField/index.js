// @flow

import React from 'react'

export type SearchFieldProps = {
    value: string,
    onChange: (text: string) => void,
    onSearch: () => void,
}

const SearchField = ({ value, onChange, onSearch }: SearchFieldProps) => (
    <div>
        <input
            type="text"
            value={value}
            onChange={(e: SyntheticInputEvent<EventTarget>) => onChange(e.target.value)}
        />
        <button type="button"
            onClick={() =>  onSearch()}
        >Searchasdasdads</button>
    </div>
)

SearchField.defaultProps = {
    value: '',
    onChange: () => {},
    onSearch: () => {},
}

export default SearchField
