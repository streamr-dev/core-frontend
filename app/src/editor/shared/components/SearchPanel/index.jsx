import React from 'react'
import cx from 'classnames'
import Draggable from 'react-draggable'
import { toFlatArray } from 'react-children-addons'
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
        bounds: 'parent',
        minWidth: 250,
        defaultWidth: 250,
        maxWidth: 600,
        defaultHeight: 352,
        maxHeight: 352 * 2,
        minHeightMinimized: 91,
        itemHeight: 52,
        scrollPadding: 16,
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
    contentRef = React.createRef()

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
    }

    clear = () => {
        this.setState({
            search: '',
        })
        if (this.input) {
            this.input.focus()
        }
    }

    componentDidUpdate(prevProps, prevState) {
        if (this.props.onChange && this.state.search !== prevState.search) {
            this.props.onChange(this.state.search)
        }

        // focus input on open
        if (this.props.isOpen && !prevProps.isOpen) {
            if (this.input) {
                this.input.focus()
            }
        }

        const { current: currentContent } = this.contentRef
        if (currentContent && this.lastHeight !== currentContent.offsetHeight) {
            this.lastHeight = currentContent.offsetHeight
            this.forceUpdate()
        }
    }

    calculateHeight = () => {
        const {
            children,
            minHeightMinimized,
            itemHeight,
            maxHeight,
            scrollPadding,
        } = this.props
        const { isExpanded, search, height } = this.state
        const { current: currentContent } = this.contentRef

        if (!isExpanded) {
            return minHeightMinimized
        }

        // use actual height child count may not be accurate if children render fragments
        const itemsHeight = currentContent
            ? currentContent.offsetHeight
            : toFlatArray(children).length * itemHeight

        let requiredHeight = minHeightMinimized + (itemsHeight ? scrollPadding + itemsHeight : 0)

        if (search.trim() === '') {
            requiredHeight = height /* use user-set height if 'browsing' */
        }

        return Math.min(height, Math.min(Math.max(requiredHeight, minHeightMinimized), maxHeight))
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
        setTimeout(() => { // temporary workaround for modal timing
            if (this.props.isOpen && this.input) {
                this.input.focus()
            }
        }, 100)
    }

    onInputFocus = () => {
        if (this.input) {
            this.input.select()
        }
    }

    render() {
        const {
            open,
            isOpen,
            bounds,
            placeholder,
            minWidth,
            minHeightMinimized,
            maxWidth,
            maxHeight,
            children,
            className,
            scrollPadding,
        } = this.props
        const { search, isExpanded, width } = this.state
        const height = this.calculateHeight()
        const isSearching = !!search.trim()
        return (
            <React.Fragment>
                <Draggable
                    handle={`.${styles.dragHandle}`}
                    bounds={bounds}
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
                                            <SvgIcon name="brevetDown" className={styles.flip} /> :
                                            <SvgIcon name="brevetDown" className={styles.normal} />
                                        }
                                    </button>
                                    <button type="button" className={styles.close} onClick={() => open(false)}>
                                        <SvgIcon name="x" />
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
                                {/* eslint-disable-next-line max-len */}
                                {/* eslint-disable-next-line jsx-a11y/no-static-element-interactions, jsx-a11y/click-events-have-key-events, jsx-a11y/no-noninteractive-element-interactions */}
                                <div
                                    className={styles.ContentContainer}
                                    style={{
                                        paddingBottom: `${scrollPadding}px`,
                                    }}
                                    onClick={() => {
                                        // quick hack to force recalculation of height on child expansion/collapse
                                        this.forceUpdate()
                                    }}
                                >
                                    <div ref={this.contentRef} role="listbox" className={styles.Content}>
                                        {children}
                                    </div>
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

