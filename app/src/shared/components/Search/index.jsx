// @flow

import React from 'react'
import cx from 'classnames'
import debounce from 'lodash/debounce'

import SvgIcon from '$shared/components/SvgIcon'
import { type Ref } from '$shared/flowtype/common-types'

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

    componentWillReceiveProps(newProps: Props) {
        if (this.state.isOpen && this.state.text !== newProps.value) {
            this.setState({
                isOpen: newProps.value !== '',
                text: newProps.value || '',
            })
        }
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
    inputRef: Ref<HTMLInputElement> = React.createRef()

    handleFocus = (e: SyntheticInputEvent<EventTarget>) => {
        if (!this.state.isOpen) {
            this.setState({
                isOpen: true,
            })
            const { current } = this.inputRef
            if (current) {
                current.focus()
            }
            e.preventDefault()
        }
    }

    handleBlur = () => {
        if (this.state.isOpen && this.state.text === '') {
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
                onBlur={this.handleBlur}
                onFocus={this.handleFocus}
                role="searchbox"
            >
                <span role="button" onMouseDown={this.handleFocus}>
                    <SvgIcon name="search" className={styles.searchIcon} />
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
                    <SvgIcon name="crossMedium" className={styles.clearIcon} />
                </span>
            </div>
        )
    }
    /* eslint-enable jsx-a11y/interactive-supports-focus */
    /* eslint-enable jsx-a11y/click-events-have-key-events */
}

export default Search
