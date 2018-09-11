// @flow

import React, { Component } from 'react'
import { ModalHeader } from 'reactstrap'

type Props = {
    resourceTitle: string
}

export default class ShareDialogHeader extends Component<Props> {
    render() {
        return (
            <ModalHeader>
                Share {this.props.resourceTitle}
            </ModalHeader>
        )
    }
}
