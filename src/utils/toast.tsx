import React, { ComponentProps } from 'react'
import { Toaster, toaster } from 'toasterhea'
import { ValidationError } from '~/errors'
import Toast, { ToastType } from '~/shared/toasts/Toast'
import { Layer } from './Layer'

export default function toast(
    props: ComponentProps<typeof Toast>,
    t?: Toaster<typeof Toast>,
) {
    setTimeout(async () => {
        try {
            await (t || toaster(Toast, Layer.Toast)).pop(props)
        } catch (_) {
            // Do nothing
        }
    })
}

export function successToast(
    props: Omit<ComponentProps<typeof Toast>, 'type'>,
    t?: Toaster<typeof Toast>,
) {
    toast(
        {
            type: ToastType.Success,
            ...props,
        },
        t,
    )
}

export function errorToast(
    props: Omit<ComponentProps<typeof Toast>, 'type'>,
    t?: Toaster<typeof Toast>,
) {
    toast(
        {
            type: ToastType.Warning,
            ...props,
        },
        t,
    )
}

interface ValidationErrorToastParams {
    title: string
    error: ValidationError
}

const vet = toaster(Toast, Layer.Toast)

export function validationErrorToast({ title, error }: ValidationErrorToastParams) {
    toast(
        {
            title,
            type: ToastType.Warning,
            desc: (
                <ul>
                    {error.messages.map((message, index) => (
                        <li key={index}>{message}</li>
                    ))}
                </ul>
            ),
        },
        vet,
    )
}
