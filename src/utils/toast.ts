import { ComponentProps } from 'react'
import { toaster } from 'toasterhea'
import Toast, { ToastType } from '~/shared/toasts/Toast'
import { Layer } from './Layer'

export default function toast(props: ComponentProps<typeof Toast>) {
    setTimeout(async () => {
        try {
            await toaster(Toast, Layer.Toast).pop(props)
        } catch (_) {
            // Do nothing
        }
    })
}

export function successToast(props: Omit<ComponentProps<typeof Toast>, 'type'>) {
    toast({
        type: ToastType.Success,
        ...props,
    })
}

export function errorToast(props: Omit<ComponentProps<typeof Toast>, 'type'>) {
    toast({
        type: ToastType.Warning,
        ...props,
    })
}
