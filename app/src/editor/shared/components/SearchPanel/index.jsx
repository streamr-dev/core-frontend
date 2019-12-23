import React, { useState, useRef, useCallback, useMemo, useEffect, useLayoutEffect } from 'react'
import cx from 'classnames'
import Draggable from 'react-draggable'
import { ResizableBox } from 'react-resizable'
import SvgIcon from '$shared/components/SvgIcon'
import { useDebounced } from '$shared/hooks/wrapCallback'

import styles from './SearchPanel.pcss'

import { ListBox, ListOption, useListBoxInteraction, useOptionalRef } from './ListBox'

export function SearchRow({ className, ...props }) {
    return (
        <ListOption
            className={cx(styles.SearchRow, className)}
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

export function SearchPanel(props) {
    const {
        open,
        isOpen,
        closeOnBlur,
        bounds,
        placeholder,
        minWidth,
        minHeight,
        maxWidth,
        maxHeight,
        children,
        className,
        scrollPadding,
        dragDisabled,
        headerHidden,
        resetOnDefault, /* if true will reset listbox when switching between default render */
        renderDefault,
    } = props

    const listContextRef = useRef()
    const contentRef = useRef()
    const inputRef = useRef()
    const panelRef = useOptionalRef(props.panelRef)

    const [isExpanded, setExpanded] = useState(true)
    const [hasFocus, setHasFocus] = useState(false)

    /* Search Text Handling */

    const [search, setSearch] = useState('')
    const isSearching = !!search.trim()

    const clear = useCallback(() => {
        setSearch('')
        if (inputRef.current) {
            inputRef.current.focus()
        }
    }, [setSearch, inputRef])

    const onChange = useCallback((event) => {
        const { value } = event.currentTarget
        setSearch(value)
    }, [setSearch])

    // fire onChange prop when search changes
    const prevSearch = useRef(search)
    const onChangeProp = props.onChange
    useEffect(() => {
        if (onChangeProp && search !== prevSearch.current) {
            onChangeProp(search)
        }
        prevSearch.current = search
    }, [onChangeProp, search])

    /* Layout Handling */

    const [layout, setLayoutState] = useState({
        preferredHeight: props.defaultHeight,
        width: props.defaultWidth,
        height: props.defaultHeight,
        posX: props.defaultPosX,
        posY: props.defaultPosY,
    })

    const setLayout = useCallback((next = {}) => {
        setLayoutState((prev) => Object.assign({}, prev, next))
    }, [setLayoutState])

    // Update size when things change
    useLayoutEffect(() => {
        if (layout.resizing) { return } // do nothing while resizing

        const { current: currentContent } = contentRef
        const itemsHeight = currentContent ? currentContent.offsetHeight : minHeight
        const requiredHeight = minHeight + (itemsHeight ? scrollPadding + itemsHeight : 0)

        setLayoutState((layout) => {
            const { preferredHeight } = layout
            let { height } = layout
            if (!isSearching) {
                // when no search show at either min or preferredHeight height
                height = isExpanded ? layout.preferredHeight : minHeight
            } else {
                // autosize search
                height = Math.min(Math.max(minHeight, requiredHeight), preferredHeight)
            }

            if (height === layout.height) {
                return layout // noop if same
            }

            return {
                ...layout,
                height,
            }
        })
    }, [layout, contentRef, setLayoutState, children, isSearching, minHeight, scrollPadding, isExpanded])

    /* Minimise/Focus Handling */

    const onKeyDown = useCallback((event) => {
        if (isOpen && hasFocus) {
            // close on esc
            if (event.key === 'Escape') {
                open(false)
            }
        }
    }, [isOpen, hasFocus, open])

    useEffect(() => {
        window.addEventListener('keydown', onKeyDown)
        return () => {
            window.removeEventListener('keydown', onKeyDown)
        }
    }, [onKeyDown])

    // focus input on open
    useEffect(() => {
        if (isOpen) {
            if (inputRef.current) {
                inputRef.current.focus()
            }
        }
    }, [isOpen, inputRef])

    const toggleMinimize = useCallback(() => (
        setExpanded((isExpanded) => !isExpanded)
    ), [setExpanded])

    const onInputFocus = useCallback((event) => {
        // select input text on focus
        event.currentTarget.select()
        setHasFocus(true)
    }, [setHasFocus])

    const onInputBlur = useCallback(() => {
        setHasFocus(false)
    }, [setHasFocus])

    /* Drag/Drop Handling */

    const setLayoutPosition = useCallback((posX, posY) => {
        // update layout after dragging
        setLayoutState((layout) => {
            if (posX === layout.posX && posY === layout.posY) {
                return layout // do nothing if identical
            }
            return {
                ...layout,
                posX,
                posY,
            }
        })
    }, [setLayoutState])

    const onDragStop = useCallback((e, data) => {
        // update layout after dragging
        setLayoutPosition(data.x, data.y)
    }, [setLayoutPosition])

    /* Resize Handling */

    const onResizeStart = useCallback(() => {
        setLayout({
            resizing: true,
        })
    }, [setLayout])

    const onResizeStop = useCallback((e, data) => {
        setLayout({
            resizing: false,
            height: data.size.height, // needs to be set otherwise height won't reset to autosize on stop
            width: data.size.width,
            preferredHeight: data.size.height,
        })
    }, [setLayout])

    const shouldRenderDefault = !!(!isSearching && isExpanded && renderDefault)

    const internalContent = useMemo(() => {
        // empty content if not searching and not expanded
        if (!isSearching && !isExpanded) { return null }
        // show default if not searching and expanded
        if (shouldRenderDefault) { return renderDefault() }
        // show children otherwise
        return children
    }, [children, isSearching, isExpanded, renderDefault, shouldRenderDefault])

    // close on blur if prop set
    const onBlur = useCallback((event) => {
        if (event.currentTarget.contains(event.relatedTarget)) { return }
        if (!closeOnBlur || !open) { return }
        open(false)
    }, [open, closeOnBlur])

    const listBoxInteraction = useListBoxInteraction(listContextRef)

    // currently no way to force react-draggable to update bounds calculation
    // this means if container ends up outside bounds after resize, it stays outside bounds
    // See https://github.com/mzabriskie/react-draggable/pull/392
    // possible to recalculate position but basically requires reimplementing bounds handling in react-draggable
    // sub-optimal workaround: reset to default position on window resize
    const propsRef = useRef(props)
    const onResizeWindow = useDebounced(useCallback(() => {
        setLayoutPosition(propsRef.current.defaultPosX, propsRef.current.defaultPosY)
    }, [propsRef, setLayoutPosition]), 750)

    useEffect(() => {
        window.addEventListener('resize', onResizeWindow)
        return () => {
            window.removeEventListener('resize', onResizeWindow)
        }
    }, [onResizeWindow])

    const { width, height, posX, posY } = layout

    return (
        <MaybeDraggable
            disabled={dragDisabled}
            handle={`.${styles.dragHandle}`}
            bounds={bounds}
            position={{
                x: posX,
                y: posY,
            }}
            onStop={onDragStop}
        >
            <div
                className={cx(styles.SearchPanel, className, {
                    [styles.isSearching]: isSearching,
                    [styles.isExpanded]: isExpanded,
                })}
                hidden={!isOpen}
                ref={panelRef}
                onMouseEnter={() => listBoxInteraction.enable()}
                onMouseLeave={() => listBoxInteraction.disable()}
                onBlur={onBlur}
            >
                <ResizableBox
                    className={styles.ResizableBox}
                    width={Math.min(width, maxWidth)}
                    height={height}
                    minConstraints={[minWidth, minHeight]}
                    maxConstraints={[maxWidth, maxHeight]}
                    onResizeStop={onResizeStop}
                    onResizeStart={onResizeStart}
                >
                    <div className={styles.Container}>
                        {!headerHidden && (
                            <div className={cx(styles.Header, styles.dragHandle)}>
                                <button type="button" className={styles.minimize} onClick={toggleMinimize}>
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
                                onKeyDown={listBoxInteraction.onKeyDown}
                                ref={inputRef}
                                placeholder={placeholder}
                                value={search}
                                onChange={onChange}
                                onFocus={onInputFocus}
                                onBlur={onInputBlur}
                            />
                            <button
                                type="button"
                                className={styles.ClearButton}
                                tabIndex="-1"
                                onClick={clear}
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
                                setLayout({})
                            }}
                        >
                            <ListBox
                                key={String(!!(shouldRenderDefault && resetOnDefault))}
                                listContextRef={listContextRef}
                                ref={contentRef}
                                className={styles.Content}
                            >
                                {internalContent}
                            </ListBox>
                        </div>
                    </div>
                </ResizableBox>
            </div>
        </MaybeDraggable>
    )
}

const DEFAULT_HEIGHT = 352

SearchPanel.defaultProps = {
    bounds: 'parent',
    minWidth: 250,
    defaultWidth: 250,
    maxWidth: 600,
    defaultHeight: DEFAULT_HEIGHT,
    maxHeight: DEFAULT_HEIGHT * 2,
    minHeight: 91,
    scrollPadding: 0,
    defaultPosX: 32,
    defaultPosY: (window.innerHeight / 2) - (DEFAULT_HEIGHT / 2) - 80, // center vertically (take header into account)
}

export default React.memo(({ resetOnClose, isOpen, ...props }) => (
    <SearchPanel key={resetOnClose ? isOpen : ''} isOpen={isOpen} {...props} />
))
