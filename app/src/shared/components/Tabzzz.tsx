import throttle from 'lodash/throttle'
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

interface InternalTabProps<P = unknown> {
    id: string
    selected?: boolean | ((params: P) => boolean) | 'id' | keyof P
}

type InheritedProps<T extends keyof JSX.IntrinsicElements | JSXElementConstructor<any> = 'button'> = Omit<ComponentProps<T>, keyof InternalTabProps>

type TabProps<T extends keyof JSX.IntrinsicElements | JSXElementConstructor<any> = 'button'> = { tag?: T } & InternalTabProps<
    InheritedProps<T> & Pick<InternalTabProps, 'id'>
> &
    InheritedProps<T>

export const Tab: <T extends keyof JSX.IntrinsicElements | JSXElementConstructor<any> = 'button'>(props: TabProps<T>) => null = () => null

function isTab<T extends keyof JSX.IntrinsicElements | JSXElementConstructor<any>>(child: ReactNode): child is ReactElement<TabProps<T>> {
    return !!child && typeof child === 'object' && 'type' in child && child.type === Tab
}

const Item = styled.button<{ $selected?: boolean; $flexBasis?: number }>`
    border: 0;
    background: none;
    height: 100%;
    display: flex;
    align-items: center;
    font-family: inherit;
    font-weight: inherit;
    padding: 0 20px;
    border-radius: 16px;
    flex-shrink: 0;
    font-size: inherit;
    justify-content: center;
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

const Root = styled.div`
    background: #f5f5f5;
    box-sizing: border-box;
    border-radius: 20px;
    padding: 4px;
    width: max-content;
    font-size: 14px;
    font-weight: 500;
    box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.025);
    user-select: none;
    overflow: hidden;
`

const Trolley = styled.div<{ $selected?: boolean }>`
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
    transition: 200ms ease-out;
    transition-property: visibility, opacity;
    left: 50%;
    transform: translateX(-50%);
    min-width: 0;
    width: 100%;
    justify-content: center;
    text-align: center;

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
    border-radius: 16px;
    height: 100%;
    position: absolute;
    transition: 200ms ease-out;
    transition-property: visiblilty, opecity;
    visibility: visible;
    opacity: 1;
    z-index: 1;

    ${({ $animated = false }) =>
        $animated &&
        css`
            transition: 200ms ease-out;
            transition-property: visiblilty, opecity, transform, width;
        `}
`

function isPreventable(e: unknown): e is Event {
    return typeof e === 'object' && !!e && 'preventDefault' in e && 'defaultPrevented' in e
}

interface Props extends HTMLAttributes<HTMLDivElement> {
    selectedId?: string
    onSelectionChange?: (selectedId: string) => void
    spreadEvenly?: boolean
}

export default function Tabzzz({ children, onSelectionChange, selectedId: selectedIdProp, spreadEvenly = false, ...props }: Props) {
    const tabs = useMemo(
        () =>
            React.Children.toArray(children)
                .filter(isTab)
                .map(({ props }) => props),
        [children],
    )

    const widthSettersRef = useRef<Partial<Record<string, (el: HTMLElement | null) => void>>>({})

    useEffect(() => {
        widthSettersRef.current = {}
    }, [children])

    const [elements, setElement] = useState<[string, HTMLElement | null][]>([])

    const selectedId = useMemo(
        () =>
            tabs.find(({ selected = 'id', tag, ...rest }) => {
                if (typeof selected === 'string') {
                    return Object.prototype.hasOwnProperty.call(rest, selected) && rest[selected] === selectedIdProp
                }

                return typeof selected === 'function' ? selected(rest) : selected
            })?.id,
        [tabs, selectedIdProp],
    )

    const [sizeCache, touchSize] = useReducer((x) => x + 1, 0)

    useEffect(() => {
        let mounted = true

        const onResize = throttle(() => {
            if (mounted) {
                touchSize()
            }
        }, 50)

        window.addEventListener('resize', onResize)

        return () => {
            mounted = false

            window.removeEventListener('resize', onResize)
        }
    }, [])

    const [left, width] = useMemo(() => {
        let left = 0

        // Use `sizeCache` here to avoid ignoring `react-hooks/exhaustive-deps` rule.
        sizeCache

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
    }, [elements, selectedId, sizeCache])

    const canAnimate = width !== 0

    const [animated, enableAnimation] = useReducer(() => true, false)

    useEffect(() => {
        if (canAnimate) {
            enableAnimation()
        }
    }, [canAnimate])

    function setElementAt(id: string, index: number) {
        let setter = widthSettersRef.current[index]

        if (typeof setter !== 'function') {
            setter = (el) => {
                setElement((current) => {
                    const newElements = [...current]

                    newElements[index] = [id, el]

                    return newElements
                })
            }

            widthSettersRef.current[index] = setter
        }

        return setter
    }

    return (
        <Root {...props}>
            <Outer>
                <Rails
                    $animated={animated}
                    style={{
                        transform: `translateX(${left}px)`,
                        width: `${width}px`,
                    }}
                >
                    {tabs.map(({ id, children }) => (
                        <Trolley key={id} $selected={id === selectedId}>
                            <ItemContent $truncate={spreadEvenly}>{children}</ItemContent>
                        </Trolley>
                    ))}
                </Rails>
                <Inner>
                    {tabs.map(({ id, tag = 'button', onClick, disabled = false, selected, children, ...rest }, index) => (
                        <Item
                            {...rest}
                            $flexBasis={spreadEvenly ? `${100 / tabs.length}%` : undefined}
                            as={tag}
                            key={id}
                            ref={setElementAt(id, index)}
                            disabled={disabled}
                            onClick={(e: unknown, ...otherArgs: unknown[]) => {
                                const preventable = isPreventable(e)

                                if (disabled) {
                                    if (preventable) {
                                        e.preventDefault()
                                    }

                                    return
                                }

                                onClick?.(e, ...otherArgs)

                                if (preventable && e.defaultPrevented) {
                                    return
                                }

                                onSelectionChange?.(id)
                            }}
                            $selected={id === selectedId}
                        >
                            <ItemContent $truncate={spreadEvenly}>{children}</ItemContent>
                        </Item>
                    ))}
                </Inner>
            </Outer>
        </Root>
    )
}
