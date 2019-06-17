// @flow

import React from 'react'
import { I18n } from 'react-redux-i18n'
import cx from 'classnames'

import SvgIcon from '$shared/components/SvgIcon'
import EditableText from '$shared/components/EditableText'
import UseState from '$shared/components/UseState'
import type { SearchFilter } from '../../../flowtype/product-types'

import styles from './searchInput.pcss'

type Props = {
    value: ?SearchFilter,
    onChange: (text: SearchFilter) => void,
    onClear: () => void,
}

const SearchInput = ({ value, onChange, onClear }: Props) => (
    <div className={styles.searchInput}>
        <UseState initialValue={false}>
            {(editing, setEditing) => (
                <EditableText
                    className={cx(styles.input, {
                        [styles.editing]: editing,
                    })}
                    placeholder={I18n.t('actionBar.searchInput.placeholder')}
                    value={value}
                    onChange={onChange}
                    editOnFocus
                    selectAllOnFocus={false}
                    commitEmpty
                    editing={editing}
                    setEditing={setEditing}
                >
                    {value || ''}
                </EditableText>
            )}
        </UseState>
        <button
            type="button"
            className={styles.clearButton}
            onClick={onClear}
            hidden={value === ''}
        >
            <SvgIcon name="cross" />
        </button>
    </div>
)

SearchInput.defaultProps = {
    value: '',
    onChange: () => {},
}

export default SearchInput
