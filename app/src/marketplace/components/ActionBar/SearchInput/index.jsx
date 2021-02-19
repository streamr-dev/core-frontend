// @flow

import React from 'react'
import cx from 'classnames'

import SvgIcon from '$shared/components/SvgIcon'
import EditableText from '$shared/components/EditableText'
import UseState from '$shared/components/UseState'
import type { SearchFilter } from '../../../flowtype/product-types'

import styles from './searchInput.pcss'

type Props = {
    value: ?SearchFilter,
    onChange: (text: SearchFilter) => void,
    onClear?: () => void,
    placeholder?: string,
    className?: string,
    hideClearButton?: boolean,
    autoFocus?: boolean,
    hidePlaceholderOnFocus?: boolean,
}

const SearchInput = ({
    value,
    onChange,
    onClear,
    placeholder = 'Search the Marketplace for',
    className,
    hideClearButton,
    hidePlaceholderOnFocus,
    autoFocus,
}: Props) => (
    <div className={cx(className, styles.searchInput)}>
        <UseState initialValue={false}>
            {(editing, setEditing) => (
                <EditableText
                    className={cx(styles.input, {
                        [styles.editing]: editing,
                    })}
                    placeholder={placeholder}
                    value={value}
                    onChange={onChange}
                    editOnFocus
                    selectAllOnFocus={false}
                    commitEmpty
                    editing={editing}
                    setEditing={setEditing}
                    autoFocus={autoFocus}
                    hidePlaceholderOnFocus={hidePlaceholderOnFocus}
                >
                    {value || ''}
                </EditableText>
            )}
        </UseState>
        <button
            type="button"
            className={styles.clearButton}
            onClick={onClear}
            hidden={hideClearButton || (value === '' && !hideClearButton)}
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
