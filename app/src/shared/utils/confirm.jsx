// @flow

import React from 'react'
import { render, unmountComponentAtNode } from 'react-dom'

import ConfirmDialog, { type Properties } from '$shared/components/ConfirmDialog'
import { isLocalStorageAvailable } from '$shared/utils/storage'

const CONFIRM_DIALOG_KEY = 'confirm.dialog'

const storage = isLocalStorageAvailable() ? localStorage : null

const confirmDialog = (name: string, props: Properties): Promise<boolean> => new Promise((resolve: Function) => {
    const { dontShowAgain, ...rest } = props

    if (!!dontShowAgain && storage) {
        const dialogPrefs = JSON.parse(storage.getItem(CONFIRM_DIALOG_KEY) || '{}') || {}
        if (dialogPrefs[name]) {
            resolve(true)
            return
        }
    }

    // Modal component takes care of mounting the dialog, just render dummy component
    const divTarget = document.createElement('div')

    render(<ConfirmDialog
        {...rest}
        onAccept={(event, dontShow) => {
            // Store "Don't show again selection"
            if (dontShowAgain && storage && dontShow) {
                const dialogPrefs = JSON.parse(storage.getItem(CONFIRM_DIALOG_KEY) || '{}') || {}
                dialogPrefs[name] = true
                storage.setItem(CONFIRM_DIALOG_KEY, JSON.stringify(dialogPrefs))
            }

            unmountComponentAtNode(divTarget)
            resolve(true)
        }}
        onReject={() => {
            unmountComponentAtNode(divTarget)
            resolve(false)
        }}
        dontShowAgain={!!storage && !!dontShowAgain}
    />, divTarget)
})

export default confirmDialog
