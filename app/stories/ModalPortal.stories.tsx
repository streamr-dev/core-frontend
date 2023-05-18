import React from "react"
import {Meta} from "@storybook/react"
import StoryRouter from 'storybook-react-router'
import { ModalPortalProvider } from '$app/src/shared/contexts/ModalPortal'
import ErrorDialog from "$mp/components/Modal/ErrorDialog"

export const Basic = () => (
    <React.Fragment>
        <div id="modal-root" />
        <ModalPortalProvider>
            <h1>Lorem ipsum cause dolor sit emat!</h1>
            {<ErrorDialog title="Godlike!" message="Hello world!" onClose={() => {}} />}
        </ModalPortalProvider>
    </React.Fragment>
)
Basic.story = {
    name: 'basic'
}

const meta: Meta<typeof Basic> = {
    title: 'Shared/ModalPortal',
    component: Basic,
    decorators: [(Story) => {
        return <div style={{
            color: '#323232',
            padding: '15px',
        }}>
            <StoryRouter>
                <Story/>
            </StoryRouter>
        </div>
    }]
}
export default meta
