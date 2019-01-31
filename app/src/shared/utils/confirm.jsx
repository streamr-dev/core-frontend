// @flow

import React from 'react'
import { render, unmountComponentAtNode } from 'react-dom'

import ConfirmDialog, { type Properties } from '$shared/components/ConfirmDialog'

const confirmDialog = (props: Properties): Promise<boolean> => new Promise((resolve: Function) => {
    // Modal component takes care of mounting the dialog, just render dummy component
    const divTarget = document.createElement('div')

    render(<ConfirmDialog
        onAccept={() => {
            unmountComponentAtNode(divTarget)
            resolve(true)
        }}
        onReject={() => {
            unmountComponentAtNode(divTarget)
            resolve(false)
        }}
        {...props}
    />, divTarget)
})

export default confirmDialog
