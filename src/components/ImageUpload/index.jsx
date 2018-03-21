// @flow

import React, {Component} from 'react'
import { Container } from '@streamr/streamr-layout'
import styles from './imageUpload.pcss'
import type { Node } from 'react'

type Props = {
    children: Node,
}

export default class Panel extends Component<Props> {
    render() {
        return (
            <div>
                I present the image uploader to the user.
            </div>
        )
    }
}
