// @flow

import React, { type ComponentType } from 'react'

import Web3ErrorDialog from '$shared/components/Web3ErrorDialog'

import useWeb3Status from '$shared/hooks/useWeb3Status'
import type { Props as DialogProps } from '$shared/components/Dialog'

type OwnProps = {
    requireWeb3?: boolean,
    onCancel?: () => void,
}

type Props = DialogProps & OwnProps

export function withWeb3(WrappedComponent: ComponentType<any>) {
    const WithWeb3 = (props: Props) => {
        const { requireWeb3, onCancel, onClose } = props
        const { web3Error, checkingWeb3 } = useWeb3Status(requireWeb3)

        if (!!requireWeb3 && (checkingWeb3 || web3Error)) {
            return (
                <Web3ErrorDialog
                    waiting={checkingWeb3}
                    onClose={onCancel || onClose}
                    error={web3Error}
                />
            )
        }

        return (
            <WrappedComponent {...props} />
        )
    }

    WithWeb3.defaultProps = {
        requireWeb3: true,
    }

    return WithWeb3
}

export default withWeb3
