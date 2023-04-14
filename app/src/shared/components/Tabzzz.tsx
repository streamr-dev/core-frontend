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

const Item = styled.button<{ $selected?: boolean }>`
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
}

export default function Tabzzz({ children, onSelectionChange, selectedId: selectedIdProp }: Props) {
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

    const [left, width] = useMemo(() => {
        let left = 0

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
    }, [elements, selectedId])

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
        <Root>
            <Outer>
                <Rails
                    $animated={animated}
                    style={{
                        transform: `translateX(${left}px)`,
                        width: `${width}px`,
                    }}
                >
                    {tabs.map(({ id, selected, children, ...rest }) => (
                        <Trolley key={id} $selected={id === selectedId}>
                            {children}
                        </Trolley>
                    ))}
                </Rails>
                <Inner>
                    {tabs.map(({ id, tag = 'button', onClick, disabled = false, selected, ...rest }, index) => (
                        <Item
                            {...rest}
                            as={tag}
                            key={id}
                            ref={setElementAt(id, index)}
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
                        />
                    ))}
                </Inner>
            </Outer>
        </Root>
    )
}
