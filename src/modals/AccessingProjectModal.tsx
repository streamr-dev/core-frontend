import React from 'react'
import styled from 'styled-components'
import { Buttons } from '~/components/Buttons'
import PrestyledLoadingIndicator from '~/shared/components/LoadingIndicator'
import { COLORS } from '~/shared/utils/styled'
import Modal from './Modal'
import { Footer } from './BaseModal'

const Content = styled.div`
    margin: 0 auto;
    padding: 48px 24px 56px;
    max-width: 448px;
    width: 100%;

    p {
        margin: 0 0 16px;
    }
`

const LoadingIndicator = styled(PrestyledLoadingIndicator)`
    div {
        border-radius: 8px;
        height: 8px;
    }

    div:before,
    div:after {
        border-radius: 8px;
    }

    div:before {
        background-color: ${COLORS.secondaryHover};
    }
`

export default function AccessingProjectModal() {
    return (
        <Modal title="Accessing project" onBeforeAbort={() => false} darkBackdrop>
            <Content>
                <p>Accessing…</p>
                <LoadingIndicator loading />
            </Content>
            <Footer>
                <Buttons
                    actions={{
                        ok: {
                            title: 'Waiting',
                            kind: 'primary',
                            spinner: true,
                        },
                    }}
                />
            </Footer>
        </Modal>
    )
}
