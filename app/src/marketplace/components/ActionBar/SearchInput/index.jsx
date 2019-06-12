// @flow

import React from 'react'
import { Container } from 'reactstrap'
import { I18n } from 'react-redux-i18n'
import AutosizeInput from 'react-input-autosize'

import SvgIcon from '$shared/components/SvgIcon'
import type { SearchFilter } from '../../../flowtype/product-types'

import { searchCharMax } from '../../../utils/constants'

import styles from './searchInput.pcss'

type Props = {
    value: ?SearchFilter,
    onChange: (text: SearchFilter) => void,
    onClear: () => void,
}

const SearchInput = ({ value, onChange, onClear }: Props) => (
    <div className={styles.searchInput}>
        <Container>
            <AutosizeInput
                type="text"
                placeholder={I18n.t('actionBar.searchInput.placeholder')}
                maxLength={searchCharMax}
                value={value}
                onChange={(e: SyntheticInputEvent<EventTarget>) => onChange(e.target.value)}
                style={{
                    height: '100%',
                }}
            />
            <button
                type="button"
                className={styles.clearButton}
                onClick={onClear}
                hidden={value === ''}
            >
                <SvgIcon name="cross" />
            </button>
        </Container>
    </div>
)

SearchInput.defaultProps = {
    value: '',
    onChange: () => {},
}

export default SearchInput
