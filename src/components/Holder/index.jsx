// @flow

import React, { Component } from 'react'
import { run } from 'holderjs'

type Props = {
    width: string,
    height: string,
    text?: string,
}

export default class Holder extends Component<Props, {}> {
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
        const { width, height, text } = this.props
        return <img data-src={`holder.js/${width}x${height}?text=${text || 'Image'}`} ref={this.assignImageRef} />
    }
}
