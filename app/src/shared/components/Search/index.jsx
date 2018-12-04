// @flow

import React from 'react'
import cx from 'classnames'
import debounce from 'lodash/debounce'

import SearchIcon from '$shared/components/SearchIcon'
import ClearIcon from '$shared/components/ClearIcon'

import styles from './search.pcss'

type Props = {
    value: string,
    placeholder: string,
    onChange: (value: string) => void,
    debounceTime?: number,
}

type State = {
    isOpen: boolean,
    text: string,
}

class Search extends React.Component<Props, State> {
    static defaultProps = {
        debounceTime: 500,
    }

    constructor(props: Props) {
        super(props)

        this.state = {
            isOpen: this.props.value !== '',
            text: this.props.value || '',
        }
    }

    componentDidMount() {
        this.mounted = true
    }

    componentWillUnmount() {
        this.mounted = false
    }

    onTextChange = (e: SyntheticInputEvent<EventTarget>) => {
        const { value } = e.target

        this.setState({
            text: value,
        })

        this.debouncedOnChange(value)
    }

    debouncedOnChange = debounce((text: string) => {
        if (!this.mounted) {
            return
        }
        this.props.onChange(text)
    }, this.props.debounceTime)

    mounted = false
    inputRef = React.createRef()

    handleClick = () => {
        const { current } = this.inputRef

        if (!this.state.isOpen) {
            this.setState({
                isOpen: true,
            })
        }

        if (current) {
            current.focus()
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
                    <SearchIcon className={styles.searchIcon} />
                </span>
                <input
                    type="search"
                    ref={this.inputRef}
                    className={styles.searchInput}
                    value={text}
                    placeholder={placeholder}
                    onChange={this.onTextChange}
                />
                <span onClick={this.clear} role="button">
                    <ClearIcon className={styles.clearIcon} />
                </span>
            </div>
        )
    }
    /* eslint-enable jsx-a11y/interactive-supports-focus */
    /* eslint-enable jsx-a11y/click-events-have-key-events */
}

export default Search
