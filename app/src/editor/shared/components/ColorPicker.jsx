// @flow

import React from 'react'
import { SketchPicker } from 'react-color'
import cx from 'classnames'

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
    className: string,
    value: string,
    onChange: (value: string) => void,
    onFocus: (event: any) => void,
    onBlur: (event: any) => void,
}

type State = {
    isOpen: boolean,
}

export default class ColorPicker extends React.Component<Props, State> {
    state = {
        isOpen: false,
    }

    componentDidMount() {
        window.addEventListener('keydown', this.onKeyDown)
    }

    componentWillUnmount() {
        window.removeEventListener('keydown', this.onKeyDown)
    }

    onKeyDown = (event: KeyboardEvent) => {
        if (this.state.isOpen && event.key === 'Escape') {
            this.close()
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
        this.setState({
            isOpen: false,
        })
    }

    render() {
        const { className, value } = this.props
        const { isOpen } = this.state
        const color = convertRgbaToObject(value)
        return (
            <div>
                <input
                    className={cx(className, styles.input)}
                    onFocus={this.onFocus}
                    onBlur={this.onBlur}
                    style={{
                        background: value,
                    }}
                />
                {isOpen && (
                    <div className={styles.popover}>
                        <SketchPicker
                            color={color}
                            presetColors={[]}
                            width={220}
                            onChange={this.onChange}
                        />
                    </div>
                )}
            </div>
        )
    }
}
