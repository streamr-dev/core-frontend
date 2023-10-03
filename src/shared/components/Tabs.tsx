import React, {
    ComponentProps,
    HTMLAttributes,
    JSXElementConstructor,
    ReactElement,
    ReactNode,
    useEffect,
    useMemo,
    useReducer,
    useRef,
    useState,
} from 'react'
import styled, { css } from 'styled-components'
import throttle from 'lodash/throttle'
import isPreventable from '~/utils/isPreventable'
import { TABLET } from '~/shared/utils/styled'

interface InternalTabProps<P = unknown> {
    id: string
    selected?: boolean | ((params: P) => boolean) | 'id' | keyof P
}

type InheritedProps<T extends keyof JSX.IntrinsicElements | JSXElementConstructor<any>> =
    Omit<ComponentProps<T>, keyof InternalTabProps>

type TabProps<T extends keyof JSX.IntrinsicElements | JSXElementConstructor<any>> = {
    tag?: T
} & InternalTabProps<InheritedProps<T> & Pick<InternalTabProps, 'id'>> &
    InheritedProps<T>

export const Tab: <
    T extends keyof JSX.IntrinsicElements | JSXElementConstructor<any> = 'button',
>(
    props: TabProps<T>,
) => null = () => null

/**
 * Mainy used for type gating. This function checks if the given `child` is a `Tab`.
 * @param child Any instance of a ReactNode.
 * @returns `true` if the child is a `Tab`. `false` otherwise.
 */
function isTab<T extends keyof JSX.IntrinsicElements | JSXElementConstructor<any>>(
    child: ReactNode,
): child is ReactElement<TabProps<T>> {
    return !!child && typeof child === 'object' && 'type' in child && child.type === Tab
}

export const Item = styled.button<{ $selected?: boolean; $flexBasis?: number }>`
    border: 0;
    background: none;
    height: 100%;
    display: flex;
    align-items: center;
    font-family: inherit;
    font-weight: inherit;
    padding: 0 20px;
    border-radius: 6px;
    flex-shrink: 0;
    font-size: inherit;
    justify-content: center;
    line-height: 1.25em;
    text-align: center;
    min-width: 0;

    button& {
        appearance: none;
        cursor: pointer;
    }

    &,
    :hover,
    :focus,
    :active,
    :visited {
        color: #323232 !important;
        text-decoration: none;
    }

    :disabled {
        opacity: 0.5;
        cursor: not-allowed;
    }

    ${({ $flexBasis }) =>
        typeof $flexBasis === 'string' &&
        css`
            flex-basis: ${$flexBasis};
        `}

    &.full-width {
        padding: 0;
        flex: 1;
        line-height: 16px;
        @media (${TABLET}) {
            padding: 0 20px;
            flex: none;
            &.small-padding {
                padding: 0 12px;
            }
        }
    }

    &.small-padding {
        padding: 0 12px;
    }
`

const ItemContent = styled.div<{ $truncate?: boolean }>`
    ${({ $truncate = false }) =>
        $truncate &&
        css`
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
        `}
`

const Outer = styled.div`
    height: 34px;
    position: relative;
`

const Inner = styled.div`
    align-items: center;
    display: flex;
    height: 100%;
`

export const Root = styled.div`
    background: #f5f5f5;
    box-sizing: border-box;
    border-radius: 8px;
    padding: 4px;
    width: max-content;
    font-size: 14px;
    font-weight: 500;
    box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.025);
    user-select: none;
    overflow: hidden;
    max-width: 100%;
    &.full-width {
        width: 100%;
        @media (${TABLET}) {
            width: max-content;
        }
    }
`

const Trolley = styled.div<{ $selected?: boolean; $animated?: boolean }>`
    height: 100%;
    display: flex;
    align-items: center;
    position: absolute;
    visibility: hidden;
    opacity: 0;
    top: 0;
    left: 0;
    padding: 0 20px;
    white-space: nowrap;
    left: 50%;
    transform: translateX(-50%);
    min-width: 0;
    width: 100%;
    justify-content: center;
    text-align: center;

    ${({ $animated = false }) =>
        $animated &&
        css`
            transition: 200ms ease-out;
            transition-property: visibility, opacity;
        `}

    ${({ $selected = false }) =>
        $selected &&
        css`
            visibility: visible;
            opacity: 1;
        `}
`

const Rails = styled.div<{ $animated?: boolean }>`
    background: #323232;
    color: #ffffff;
    border-radius: 6px;
    height: 100%;
    position: absolute;
    transition: 200ms ease-out;
    transition-property: visiblilty, opecity;
    visibility: visible;
    opacity: 1;
    pointer-events: none;
    z-index: 1;

    ${({ $animated = false }) =>
        $animated &&
        css`
            transition: 200ms ease-out;
            transition-property: visiblilty, opecity, transform, width;
        `}
`

export interface Props extends HTMLAttributes<HTMLDivElement> {
    selection?: string
    onSelectionChange?: (selection: string) => void
    spreadEvenly?: boolean
    fullWidthOnMobile?: boolean
    smallPadding?: boolean
}

export default function Tabs({
    children,
    onSelectionChange,
    selection: selectionProp,
    spreadEvenly = false,
    fullWidthOnMobile = false,
    smallPadding = false,
    ...props
}: Props) {
    /**
     * Since `Tab` returns `null` its props is all we care about. It's a carrier. Remember
     * Rick's butter passing robot? Yeah, this here passes props – that's its purpose.
     */
    const tabs = useMemo(
        () =>
            React.Children.toArray(children)
                .filter(isTab)
                .map(({ props }) => props),
        [children],
    )

    const selectedId = useMemo(
        () =>
            tabs.find(({ selected = 'id', tag: _tag, ...rest }) => {
                /**
                 * First we check it `selected` is a string. If it is then we use it as
                 * a peroperty key. We take its property value and check if it matches
                 * `selection` passed to `Tabs`.
                 */
                if (typeof selected === 'string') {
                    return (
                        typeof selectionProp !== 'undefined' &&
                        Object.prototype.hasOwnProperty.call(rest, selected) &&
                        rest[selected] === selectionProp
                    )
                }

                /**
                 * If `selected` is a boolean then the situation is simple. If it's
                 * a function though, we call it with current Tab's props.
                 */
                return typeof selected === 'function' ? selected(rest) : selected
            })?.id,
        [tabs, selectionProp],
    )

    /**
     * `windowWidth` is listed as a dependency for the left and width calculation for
     * the `Rails` component later or. It changes on window resize.
     *
     * We only use the width here because the height doesn't affect the component.
     */
    const [windowWidth, setWindowWidth] = useState(0)

    useEffect(() => {
        let mounted = true

        const onResize = throttle(() => {
            if (mounted) {
                setWindowWidth(window.outerWidth)
            }
        }, 200)

        window.addEventListener('resize', onResize)

        return () => {
            mounted = false

            window.removeEventListener('resize', onResize)
        }
    }, [])

    /**
     * We collect HTML elements associated with each tab using callback stored in a ref.
     * The following is an index-to-callback map that holds the setters for each mounted
     * element. There's a reason to this maddness.
     *
     * For one element, to avoid extensive updates on `ref`, we'd use `useCallback`. In our
     * case we avoid it (as much as possible) using the following contraption.
     *
     * In other words, unless `children` change, 0th element will always set its ref
     * using the callback at 0th index in the map, and so on. Simple as that.
     */
    const elementSettersRef = useRef<
        Partial<Record<string, (el: HTMLElement | null) => void>>
    >({})

    useEffect(() => {
        /**
         * We reset the setters when the number of tabs change. Ideally we'd do it only when
         * reducing the number of tabs, but that'd add complexity.
         */
        elementSettersRef.current = {}
    }, [tabs.length])

    /**
     * `elements` is a list of mounted `Item` elements. We use it for left/width
     * calculations later.
     */
    const [elements, setElement] = useState<[string, HTMLElement | null][]>([])

    function setElementAt(id: string, index: number) {
        let setter = elementSettersRef.current[index]

        if (typeof setter !== 'function') {
            setter = (el) => {
                setElement((current) => {
                    const newElements = [...current]

                    newElements[index] = [id, el]

                    return newElements
                })
            }

            elementSettersRef.current[index] = setter
        }

        return setter
    }

    const [left, width] = useMemo(() => {
        let left = 0

        /**
         *  Use `windowWidth` here to avoid ignoring the `react-hooks/exhaustive-deps`
         * rule. It's safer this way. Plus, pretty much costs nothing.
         */
        windowWidth

        let width = 0

        for (let i = 0; i < elements.length; i++) {
            const [id, el] = elements[i]

            const w = el?.getBoundingClientRect().width || 0

            if (id === selectedId) {
                width = w
                break
            }

            left += w
        }

        return [left, width]
    }, [elements, selectedId, windowWidth])

    /**
     * Animation is tricky. We have to delay any of it before all the `Item` elements
     * are mounted and we know at list the width of the current one.
     */
    const canAnimate = width !== 0

    /**
     * We cannot enable animations immediately after having the width. We have to
     * let components mount without transition first to avoid making them transition
     * from an unknown location and 0 width.
     */
    const [animated, enableAnimation] = useReducer(() => true, false)

    useEffect(() => {
        if (canAnimate) {
            /**
             * At this point we know the proper width is there and the components
             * mounted. Let's give animations green light!
             */
            enableAnimation()
        }
    }, [canAnimate])

    return (
        <Root {...props} className={fullWidthOnMobile ? 'full-width' : ''}>
            <Outer>
                <Rails
                    $animated={animated}
                    style={{
                        transform: `translateX(${left}px)`,
                        width: `${width}px`,
                    }}
                >
                    {tabs.map(({ id, children }) => (
                        <Trolley
                            key={id}
                            $selected={id === selectedId}
                            $animated={animated}
                        >
                            <ItemContent $truncate={spreadEvenly}>{children}</ItemContent>
                        </Trolley>
                    ))}
                </Rails>
                <Inner>
                    {tabs.map(
                        (
                            {
                                id,
                                tag = 'button',
                                onClick,
                                disabled = false,
                                selected: _selected,
                                children,
                                ...rest
                            },
                            index,
                        ) => (
                            <Item
                                {...rest}
                                $flexBasis={
                                    spreadEvenly ? `${100 / tabs.length}%` : undefined
                                }
                                as={tag}
                                key={id}
                                className={
                                    (fullWidthOnMobile ? 'full-width ' : ' ') +
                                    (smallPadding ? 'small-padding ' : ' ')
                                }
                                ref={setElementAt(id, index)}
                                disabled={disabled}
                                onClick={(e: unknown, ...otherArgs: unknown[]) => {
                                    const preventable = isPreventable(e)

                                    if (disabled) {
                                        if (preventable) {
                                            e.preventDefault()
                                        }

                                        /**
                                         * If a Tab is disabled we don't go any further.
                                         * Additionally, if `e` is a default-preventable,
                                         * then at this point it's also taken care of.
                                         */
                                        return
                                    }

                                    /**
                                     * Anything that the *og* onClick has given us we pass
                                     * onto the `onClick` coming from the outside.
                                     */
                                    onClick?.(e, ...otherArgs)

                                    /**
                                     * It is possible to prevent selection outside of the
                                     * component. Just prevent event's default behaviour.
                                     */
                                    if (preventable && e.defaultPrevented) {
                                        return
                                    }

                                    onSelectionChange?.(id)
                                }}
                                $selected={id === selectedId}
                            >
                                <ItemContent $truncate={spreadEvenly}>
                                    {children}
                                </ItemContent>
                            </Item>
                        ),
                    )}
                </Inner>
            </Outer>
        </Root>
    )
}
