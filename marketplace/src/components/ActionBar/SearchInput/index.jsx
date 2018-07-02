// @flow

import React from 'react'
import { Container } from '@streamr/streamr-layout'

import type { SearchFilter } from '../../../flowtype/product-types'

import { searchCharMax } from '../../../utils/constants'

import styles from './searchInput.pcss'

type Props = {
    value: ?SearchFilter,
    onChange: (text: SearchFilter) => void,
}

const SearchInput = ({ value, onChange }: Props) => (
    <div className={styles.searchInput}>
        <Container>
            <input
                type="text"
                placeholder="Search the marketplace for..."
                maxLength={searchCharMax}
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
