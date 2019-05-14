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

function MaybeDraggable({ disabled, children, ...props }) {
    if (disabled) { return children || null }
    return (
        <Draggable {...props}>
            {children}
        </Draggable>
    )
}

const DEFAULT_HEIGHT = 352

export class SearchPanel extends React.PureComponent {
    static defaultProps = {
        bounds: 'parent',
        minWidth: 250,
        defaultWidth: 250,
        maxWidth: 600,
        defaultHeight: DEFAULT_HEIGHT,
        maxHeight: DEFAULT_HEIGHT * 2,
        minHeightMinimized: 91,
        itemHeight: 52,
        scrollPadding: 0,
        defaultPosX: 32,
        defaultPosY: (window.innerHeight / 2) - (DEFAULT_HEIGHT / 2) - 80, // center vertically (take header into account)
    }

    state = {
        search: '',
        isExpanded: true,
        width: this.props.defaultWidth,
        height: this.props.defaultHeight,
        /* eslint-disable-next-line react/no-unused-state */
        heightBeforeMinimize: 0,
        posX: this.props.defaultPosX,
        posY: this.props.defaultPosY,
    }

    unmounted = false
    input = null
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
        if (this.props.isOpen && event.key === 'Escape' && this.state.hasFocus) {
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
        this.setState({ hasFocus: true })
    }

    onInputBlur = () => {
        this.setState({ hasFocus: false })
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
            dragDisabled,
            headerHidden,
        } = this.props
        const {
            search,
            isExpanded,
            width,
            posX,
            posY,
        } = this.state
        const height = this.calculateHeight()
        const isSearching = !!search.trim()

        return (
            <React.Fragment>
                <MaybeDraggable
                    disabled={dragDisabled}
                    handle={`.${styles.dragHandle}`}
                    bounds={bounds}
                    position={{
                        x: posX,
                        y: posY,
                    }}
                    onStop={(e, data) => this.setState({
                        posX: data.x,
                        posY: data.y,
                    })}
                >
                    <div
                        className={cx(styles.SearchPanel, className, {
                            [styles.isSearching]: isSearching,
                        })}
                        hidden={!isOpen}
                        ref={this.props.panelRef}
                    >
                        <ResizableBox
                            className={styles.ResizableBox}
                            width={width}
                            height={height}
                            axis={isSearching ? 'x' : 'both' /* lock y when searching */}
                            minConstraints={[minWidth, minHeightMinimized]}
                            maxConstraints={[maxWidth, maxHeight]}
                            onResize={(e, data) => {
                                this.setState((state) => ({
                                    height: isExpanded ? data.size.height : state.height,
                                    width: data.size.width,
                                }))
                            }}
                        >
                            <div className={styles.Container}>
                                {!headerHidden && (
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
                                )}
                                <div className={styles.Input}>
                                    <input
                                        ref={this.onInputRef}
                                        placeholder={placeholder}
                                        value={search}
                                        onChange={this.onChange}
                                        onFocus={this.onInputFocus}
                                        onBlur={this.onInputBlur}
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
                </MaybeDraggable>
            </React.Fragment>
        )
    }
}

export default SearchPanel

