// @flow

import React from 'react'
import cx from 'classnames'

import SearchIcon from '$shared/components/SearchIcon'
import ClearIcon from '$shared/components/ClearIcon'

import styles from './search.pcss'

type Props = {
    value: string,
    placeholder: string,
    onChange: (value: string) => void,
}

type State = {
    isOpen: boolean,
    text: string,
}

class Search extends React.Component<Props, State> {
    state = {
        isOpen: false,
        text: this.props.value || '',
    }

    onTextChange = (e: SyntheticInputEvent<EventTarget>) => {
        const { value } = e.target
        this.props.onChange(value)
        this.setState({
            text: value,
        })
    }

    inputRef = React.createRef()

    handleClick = () => {
        if (!this.state.isOpen) {
            this.setState({
                isOpen: true,
            })
        }

        if (this.inputRef && this.inputRef.current) {
            this.inputRef.current.focus()
        }
    }

    handleBlur = () => {
        if (this.state.text === '') {
            this.setState({
                isOpen: false,
            })
        }
    }

    clear = () => {
        this.setState({
            isOpen: false,
            text: '',
        })
        this.props.onChange('')
    }

    /* eslint-disable jsx-a11y/interactive-supports-focus */
    /* eslint-disable jsx-a11y/click-events-have-key-events */
    render() {
        const { placeholder } = this.props
        const { isOpen, text } = this.state

        return (
            <div
                className={cx(styles.search, {
                    [styles.open]: isOpen,
                })}
                onClick={this.handleClick}
                onBlur={this.handleBlur}
                role="searchbox"
            >
                <span role="button">
                    <SearchIcon
                        className={cx(styles.searchIcon, {
                            [styles.open]: isOpen,
                        })}
                    />
                </span>

                <input
                    type="search"
                    ref={this.inputRef}
                    className={cx(styles.searchInput, {
                        [styles.open]: isOpen,
                    })}
                    value={text}
                    placeholder={placeholder}
                    onChange={this.onTextChange}
                />

                <span onClick={this.clear} role="button">
                    <ClearIcon
                        className={cx(styles.clearIcon, {
                            [styles.open]: isOpen,
                        })}
                    />
                </span>
            </div>
        )
    }
    /* eslint-enable jsx-a11y/interactive-supports-focus */
    /* eslint-enable jsx-a11y/click-events-have-key-events */
}

export default Search
