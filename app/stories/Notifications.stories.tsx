import React from "react"
import {Meta} from "@storybook/react"
import { ModalPortalProvider } from '$app/src/shared/contexts/ModalPortal'
import Notifications from "$shared/components/Notifications"
import ErrorDialog from "$mp/components/Modal/ErrorDialog"
import {NotificationIcon} from "$shared/utils/constants"

export const Basic = () => {
    const title = 'Lorem ipsum dolor sit. But hey, you always have emat!'
    return (
        <React.Fragment>
            <div id="modal-root" />
            <ModalPortalProvider>
                <button
                    type="button"
                    onClick={() => {
                        Notification.push({
                            title,
                        })
                    }}
                >
                    Add notification
                </button>
                {Object.values(NotificationIcon).map((icon) => (
                    <button
                        key={icon}
                        type="button"
                        onClick={() => {
                            Notification.push({
                                title,
                                icon,
                            })
                        }}
                    >
                        Add {icon} notification
                    </button>
                ))}
                <Notifications />
                {(
                    <ErrorDialog title="Godlike!" message="Hello world!" onClose={() => {}} />
                )}
            </ModalPortalProvider>
        </React.Fragment>
    )
}
Basic.story = {
    name: 'basic'
}

const meta: Meta<typeof Basic> = {
    title: 'Shared/Notifications',
    component: Basic,
    decorators: [(Story) => {
        return <div style={{
            color: '#323232',
            padding: '15px',
        }}>
            <Story/>
        </div>
    }]
}
export default meta
