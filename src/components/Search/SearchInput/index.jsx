// @flow

import React from 'react'

import { Container } from '@streamr/streamr-layout'

import styles from './searchinput.pcss'

export type Props = {
    value: ?string,
    onChange: (text: string) => void,
}

const SearchInput = ({ value, onChange }: Props) => (
    <div className={styles.searchInput}>
        <Container>
            <input
                type="text"
                placeholder="Search the marketplace for..."
                value={value}
                onChange={(e: SyntheticInputEvent<EventTarget>) => onChange(e.target.value)}
            />
        </Container>
    </div>
)

SearchInput.defaultProps = {
    value: '',
    onChange: () => {},
}

export default SearchInput
