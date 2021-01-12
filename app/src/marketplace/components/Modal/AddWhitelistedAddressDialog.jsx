import React, { useState } from 'react'
import { Translate, I18n } from 'react-redux-i18n'
import styled from 'styled-components'

import ModalPortal from '$shared/components/ModalPortal'
import Dialog from '$shared/components/Dialog'
import Label from '$ui/Label'
import Text from '$ui/Text'
import { isEthereumAddress } from '$mp/utils/validate'

const UnstyledAddWhitelistedAddressDialog = ({ onClose, onContinue, ...props }) => {
    const [address, setAddress] = useState('')

    return (
        <ModalPortal>
            <Dialog
                title={I18n.t('modal.whitelistEdit.addAddressTitle')}
                onClose={() => onClose()}
                actions={{
                    cancel: {
                        title: I18n.t('modal.common.cancel'),
                        onClick: () => onClose(),
                        kind: 'link',
                    },
                    add: {
                        title: I18n.t('modal.whitelistEdit.add'),
                        kind: 'primary',
                        onClick: () => onContinue(address),
                        disabled: !isEthereumAddress(address),
                    },
                }}
                {...props}
            >
                <Label>
                    <Translate value="modal.whitelistEdit.addressLabel" />
                </Label>
                <Text
                    onCommit={(val) => setAddress(val)}
                    placeholder={I18n.t('modal.whitelistEdit.addressPlaceholder')}
                />
            </Dialog>
        </ModalPortal>
    )
}

const AddWhitelistedAddressDialog = styled(UnstyledAddWhitelistedAddressDialog)`
    ${Label} {
        align-self: start;
        width: 100%;
        text-align: left;
    }
`

export default AddWhitelistedAddressDialog
