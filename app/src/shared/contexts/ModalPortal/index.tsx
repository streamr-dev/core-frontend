import { Context as ReactContext, ReactNode } from 'react'
import React from 'react'
export type ModalPortalContextModel = {
    isModalOpen: boolean
    registerModal: (() => void) | null | undefined
    unregisterModal: (() => void) | null | undefined
}
const defaultContext: ModalPortalContextModel = {
    isModalOpen: false,
    registerModal: undefined,
    unregisterModal: undefined,
}
export const ModalPortalContext: ReactContext<ModalPortalContextModel> = React.createContext(defaultContext)
type Props = {
    children: ReactNode
}
type State = {
    isModalOpen: boolean
    registerModal: () => void
    unregisterModal: () => void
}
export class ModalPortalProvider extends React.Component<Props, State> {
    state = {
        isModalOpen: false,
        registerModal: this.registerModal.bind(this),
        unregisterModal: this.unregisterModal.bind(this),
    }
    count = 0

    registerModal(): void {
        this.count = this.count + 1
        this.setState({
            isModalOpen: true,
        })
    }

    unregisterModal(): void {
        this.count = this.count - 1

        if (this.count < 0) {
            throw new Error('Negative number of open modals. Something went surprisingly wrong.')
        }

        this.setState({
            isModalOpen: this.count !== 0,
        })
    }

    render(): ReactNode {
        const { children } = this.props
        const { isModalOpen, registerModal, unregisterModal } = this.state
        return (
            <div id="app">
                <ModalPortalContext.Provider
                    value={{
                        isModalOpen,
                        registerModal,
                        unregisterModal,
                    }}
                >
                    {children}
                </ModalPortalContext.Provider>
            </div>
        )
    }
}
export { ModalPortalContext as Context, ModalPortalProvider as Provider }
