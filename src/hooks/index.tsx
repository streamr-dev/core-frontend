import React from 'react'
import { useEffect } from 'react'
import { toaster } from 'toasterhea'
import Toast, { ToastType } from '~/shared/toasts/Toast'
import { Layer } from '~/utils/Layer'

const infoToast = toaster(Toast, Layer.Toast)

export function useInfoToastEffect() {
    useEffect(() => {
        let timeoutId: number | undefined

        let recentKey: string | undefined

        function onKeyUp() {
            recentKey = undefined

            if (timeoutId) {
                clearTimeout(timeoutId)

                timeoutId = undefined
            }
        }

        function onKeyDown(e: KeyboardEvent) {
            if (e.key === recentKey) {
                return
            }

            onKeyUp()

            recentKey = e.key

            if (e.key !== 'i') {
                return
            }

            timeoutId = window.setTimeout(async () => {
                try {
                    await infoToast.pop({
                        type: ToastType.Info,
                        title: 'Version info',
                        desc: (
                            <ul>
                                <li>Hub v{process.env.HUB_VERSION}</li>
                                <li>
                                    StreamrClient v{process.env.STREAMR_CLIENT_VERSION}
                                </li>
                            </ul>
                        ),
                        okLabel: 'Dismiss',
                    })
                } catch (e) {
                    // Ignore.
                }
            }, 1500)
        }

        document.addEventListener('keydown', onKeyDown)

        document.addEventListener('keyup', onKeyUp)

        return () => {
            document.removeEventListener('keydown', onKeyDown)

            document.removeEventListener('keyup', onKeyUp)

            onKeyUp()
        }
    }, [])
}
