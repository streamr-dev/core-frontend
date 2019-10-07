// @flow

// FIXME(Mariusz): Current approach makes focusing R/G/B inputs within
//                 the picker closes the component. `onBlur` should be called when
//                 the outer <div> isn't neither :focus nor :focus-within.

import React from 'react'
import { SketchPicker } from 'react-color'
import { type Ref } from '$shared/flowtype/common-types'

import styles from './ColorPicker.pcss'

// Parse string in format rgba(255, 255, 255, 1.0) into an object { r:255, g:255, b:255, a:1 }
const convertRgbaToObject = (rgba: string) => {
    const components = rgba
        .replace(/\s/g, '') // get rid of all whitespaces
        .replace('rgba', '')
        .replace('(', '')
        .replace(')', '')
        .split(',')
    return {
        r: components[0],
        g: components[1],
        b: components[2],
        a: components[3],
    }
}

const convertObjectToRgba = (rgbObj: Object) => (
    `rgba(${rgbObj.r}, ${rgbObj.g}, ${rgbObj.b}, ${rgbObj.a})`
)

type Props = {
    className?: ?string,
    value: string,
    onChange: (value: string) => void,
    onFocus?: ?(event: any) => void,
    onBlur?: ?(event: any) => void,
    onClose?: ?() => void,
    disabled?: boolean,
}

type State = {
    isOpen: boolean,
}

export default class ColorPicker extends React.Component<Props, State> {
    state = {
        isOpen: false,
    }

    ref: Ref<HTMLElement> = React.createRef()

    componentDidMount() {
        window.addEventListener('keydown', this.onKeyDown)
    }

    componentWillUnmount() {
        window.removeEventListener('keydown', this.onKeyDown)
    }

    onKeyDown = (event: KeyboardEvent) => {
        const { current: root } = this.ref
        if (this.state.isOpen && event.key === 'Escape' && root) {
            root.blur()
        }
    }

    onChange = (color: Object) => {
        const rgba = convertObjectToRgba(color.rgb)
        this.props.onChange(rgba)
    }

    onFocus = (e: SyntheticInputEvent<EventTarget>) => {
        const { onFocus } = this.props
        this.open()
        if (onFocus) {
            onFocus(e)
        }
    }

    onBlur = (e: SyntheticInputEvent<EventTarget>) => {
        const { onBlur } = this.props
        this.close()
        if (onBlur) {
            onBlur(e)
        }
    }

    open = () => {
        this.setState({
            isOpen: true,
        })
    }

    close = () => {
        const { onClose } = this.props

        this.setState({
            isOpen: false,
        })

        if (onClose) {
            onClose()
        }
    }

    render() {
        const { isOpen } = this.state
        const { disabled, value: backgroundColor } = this.props
        const color = convertRgbaToObject(backgroundColor)

        return (
            <button
                type="button"
                disabled={disabled}
                className={styles.root}
                onBlur={this.onBlur}
                onFocus={this.onFocus}
                onKeyDown={this.onKeyDown}
                ref={this.ref}
                style={{
                    backgroundColor,
                }}
            >
                {isOpen && (
                    <SketchPicker
                        color={color}
                        presetColors={[]}
                        width={220}
                        onChange={this.onChange}
                    />
                )}
            </button>
        )
    }
}
