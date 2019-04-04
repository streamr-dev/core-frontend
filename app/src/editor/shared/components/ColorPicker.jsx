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

    onChange = (color: Object) => {
        const rgba = convertObjectToRgba(color.rgb)
        this.props.onChange(rgba)
    }

    onFocus = (e: SyntheticInputEvent<EventTarget>) => {
        this.setState({
            isOpen: true,
        })
        this.props.onFocus(e)
    }

    onBlur = (e: SyntheticInputEvent<EventTarget>) => {
        this.setState({
            isOpen: false,
        })
        this.props.onBlur(e)
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
                            onChange={this.onChange}
                        />
                    </div>
                )}
            </div>
        )
    }
}
