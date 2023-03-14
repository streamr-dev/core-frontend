import React, { useEffect, useMemo, useRef, useState } from 'react'
import styled from 'styled-components'
import Dialog from '$shared/components/Dialog'
import UnstyledLoadingIndicator from '$shared/components/LoadingIndicator'
import { COLORS } from '$app/src/shared/utils/styled'

const Phase = styled.div`
    font-size: 16px;
    line-height: 24px;
    color: ${COLORS.primaryDisabled};
    align-self: start;
`

const LoadingIndicator = styled(UnstyledLoadingIndicator)`
    top: 20px;

    ::before, ::after {
        height: 8px;
        border-radius: 8px;
    }

    ::before {
        background-color: ${COLORS.secondaryHover};
    }
`

type Props = {
    onClose?: () => void,
}

const Progress = ({ onClose }: Props) => {
    return (
        <Dialog
            title="Accessing project"
            onClose={onClose}
            actions={{
                pay: {
                    title: 'Waiting',
                    kind: 'primary',
                    spinner: true,
                },
            }}
            useDarkBackdrop
            closeOnEsc={false}
            closeOnBackdropClick={false}
            centerTitle
        >
            <Phase>
                Accessing...
            </Phase>
            <LoadingIndicator loading />
        </Dialog>
    )
}

export default Progress
