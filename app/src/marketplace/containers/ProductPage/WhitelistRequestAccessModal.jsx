// @flow

import React from 'react'

import useModal from '$shared/hooks/useModal'
import WhitelistRequestAccessDialog from '$mp/components/Modal/WhitelistRequestAccessDialog'

export const WhitelistRequestAccessModal = () => {
    const { api, isOpen, value } = useModal('requestWhitelistAccess')

    if (!isOpen) {
        return null
    }

    const { contactEmail, productName } = value || {}

    return (
        <WhitelistRequestAccessDialog
            contactEmail={contactEmail}
            onClose={() => api.close({
                save: false,
                redirect: false,
            })}
            productName={productName}
        />
    )
}

export default WhitelistRequestAccessModal
