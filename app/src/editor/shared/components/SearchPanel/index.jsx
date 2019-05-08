import React from 'react'
import cx from 'classnames'
import Draggable from 'react-draggable'
import { ResizableBox } from 'react-resizable'
import SvgIcon from '$shared/components/SvgIcon'

import styles from './SearchPanel.pcss'

export function SearchRow({ className, ...props }) {
    return (
        /* eslint-disable-next-line jsx-a11y/click-events-have-key-events */
        <div
            className={cx(styles.SearchRow, className)}
            role="option"
            aria-selected="false"
            tabIndex="0"
            {...props}
        />
    )
}

export class SearchPanel extends React.PureComponent {
    static defaultProps = {
        minWidth: 250,
        defaultWidth: 250,
        maxWidth: 600,
        defaultHeight: 352,
        maxHeight: 352 * 2,
        minHeightMinimized: 90,
        itemHeight: 52,
    }

    state = {
        search: '',
        isExpanded: true,
        width: this.props.defaultWidth,
        height: this.props.defaultHeight,
        /* eslint-disable-next-line react/no-unused-state */
        heightBeforeMinimize: 0,
    }

    unmounted = false
    input = null
    currentSearch = ''
    selfRef = React.createRef()

    componentDidMount() {
        window.addEventListener('keydown', this.onKeyDown)
    }

    componentWillUnmount() {
        this.unmounted = true
        window.removeEventListener('keydown', this.onKeyDown)
    }

    onChange = async (event) => {
        const { value } = event.currentTarget

        this.setState({
            search: value,
            isExpanded: true,
        })
        if (this.props.onChange) {
            this.props.onChange(event)
        }
    }

    clear = () => {
        this.setState({
            search: '',
        })
        if (this.input) {
            this.input.focus()
        }
    }

    calculateHeight = () => {
        const { children, minHeightMinimized, itemHeight, maxHeight } = this.props

        const { isExpanded, search, height } = this.state
        const numItems = React.Children.count(children)

        if (!isExpanded) {
            return minHeightMinimized
        }

        let requiredHeight = minHeightMinimized + (numItems * itemHeight)

        if (search.trim() === '') {
            requiredHeight = height /* use user-set height if 'browsing' */
        }

        return Math.min(Math.max(requiredHeight, minHeightMinimized), maxHeight)
    }

    toggleMinimize = () => {
        this.setState(({ isExpanded, height, heightBeforeMinimize }) => ({
            isExpanded: !isExpanded,
            heightBeforeMinimize: isExpanded ? height : heightBeforeMinimize,
        }))
    }

    onKeyDown = (event) => {
        if (this.props.isOpen && event.key === 'Escape') {
            this.props.open(false)
        }
    }

    onInputRef = (el) => {
        this.input = el
        if (this.props.isOpen && this.input) {
            this.input.focus()
        }
    }

    onInputFocus = () => {
        if (this.input) {
            this.input.select()
        }
    }

    componentDidUpdate(prevProps) {
        // focus input on open
        if (this.props.isOpen && !prevProps.isOpen) {
            if (this.input) {
                this.input.focus()
            }
        }
    }

    render() {
        const {
            open,
            isOpen,
            placeholder,
            minWidth,
            minHeightMinimized,
            maxWidth,
            maxHeight,
            children,
            className,
        } = this.props
        const { search, isExpanded, width } = this.state
        const height = this.calculateHeight()
        const isSearching = !!search.trim()
        return (
            <React.Fragment>
                <Draggable
                    handle={`.${styles.dragHandle}`}
                    bounds="parent"
                >
                    <div
                        className={cx(styles.SearchPanel, className, {
                            [styles.isSearching]: isSearching,
                        })}
                        hidden={!isOpen}
                        ref={this.selfRef}
                    >
                        <ResizableBox
                            className={styles.ResizableBox}
                            width={width}
                            height={height}
                            axis={isSearching ? 'x' : 'both' /* lock y when searching */}
                            minConstraints={[minWidth, minHeightMinimized]}
                            maxConstraints={[maxWidth, maxHeight]}
                            onResize={(e, data) => {
                                this.setState({
                                    height: data.size.height,
                                    width: data.size.width,
                                    isExpanded: data.size.height > minHeightMinimized,
                                })
                            }}
                        >
                            <div className={styles.Container}>
                                <div className={cx(styles.Header, styles.dragHandle)}>
                                    <button type="button" className={styles.minimize} onClick={() => this.toggleMinimize()}>
                                        {isExpanded ?
                                            <SvgIcon name="caretUp" /> :
                                            <SvgIcon name="caretDown" />
                                        }
                                    </button>
                                    <button type="button" className={styles.close} onClick={() => open(false)}>
                                        <SvgIcon name="crossHeavy" />
                                    </button>
                                </div>
                                <div className={styles.Input}>
                                    <input
                                        ref={this.onInputRef}
                                        placeholder={placeholder}
                                        value={search}
                                        onChange={this.onChange}
                                        onFocus={this.onInputFocus}
                                    />
                                    <button
                                        type="button"
                                        className={styles.ClearButton}
                                        onClick={this.clear}
                                        hidden={search === ''}
                                    >
                                        <SvgIcon name="clear" />
                                    </button>
                                </div>
                                <div role="listbox" className={styles.Content}>
                                    {children}
                                </div>
                            </div>
                        </ResizableBox>
                    </div>
                </Draggable>
            </React.Fragment>
        )
    }
}

export default SearchPanel

