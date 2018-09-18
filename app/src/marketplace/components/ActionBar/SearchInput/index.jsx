// @flow

import React from 'react'
import { Container } from 'reactstrap'

import type { SearchFilter } from '../../../../../../marketplace/src/flowtype/product-types'

import { searchCharMax } from '../../../../../../marketplace/src/utils/constants'
import withI18n from '../../../../../../marketplace/src/containers/WithI18n/index'

import styles from './searchInput.pcss'

type Props = {
    value: ?SearchFilter,
    onChange: (text: SearchFilter) => void,
    translate: (key: string, options: any) => string,
}

const SearchInput = ({ value, onChange, translate }: Props) => (
    <div className={styles.searchInput}>
        <Container>
            <input
                type="text"
                placeholder={translate('actionBar.searchInput.placeholder')}
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

export default withI18n(SearchInput)
