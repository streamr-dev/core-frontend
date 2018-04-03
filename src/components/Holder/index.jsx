// @flow

import React, { Component } from 'react'
import { run } from 'holderjs'

type Props = {
    width: string | number,
    height: string | number,
    text?: string,
    theme?: string,
}

export default class Holder extends Component<Props> {
    // eslint-disable-next-line react/sort-comp
    image: ?HTMLImageElement

    assignImageRef = (ref: ?HTMLImageElement) => {
        this.image = ref
    }

    componentDidMount() {
        run({
            images: this.image,
        })
    }

    render() {
        const { width, height, text, theme } = this.props
        return (
            <img
                data-src={`holder.js/${ width }x${ height }?theme=${ theme || 'gray' }&text=${ text || 'Image' }`}
                ref={this.assignImageRef}
                alt=""
            />
        )
    }
}
