// @flow

import React from 'react'
import cx from 'classnames'

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

const SearchIcon = (props: any) => (
    <svg width="16" height="16" xmlns="http://www.w3.org/2000/svg" {...props}>
        <g
            transform="translate(-1 -1)"
            strokeWidth="1.5"
            fill="none"
            fillRule="evenodd"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <circle transform="rotate(-23.025 7.593 7.592)" cx="7.593" cy="7.592" r="5.371" />
            <path d="M11.39 11.39l4.166 4.166" />
        </g>
    </svg>
)

const ClearIcon = (props: any) => (
    <svg width="10" height="10" xmlns="http://www.w3.org/2000/svg" {...props}>
        <g strokeWidth="1.5" stroke="#A3A3A3" fill="none" fillRule="evenodd" strokeLinecap="round">
            <path d="M.757.757l8.486 8.486M9.243.757L.757 9.243" />
        </g>
    </svg>
)

class Search extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props)

        this.state = {
            isOpen: false,
            text: props.value || '',
        }

        this.inputRef = React.createRef()
    }

    onTextChange = (e: SyntheticInputEvent<EventTarget>) => {
        const { value } = e.target
        this.props.onChange(value)
        this.setState({
            text: value,
        })
    }

    inputRef: any

    handleClick = () => {
        if (!this.state.isOpen) {
            this.setState({
                isOpen: true,
            })
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
