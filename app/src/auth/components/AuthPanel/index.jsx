import React, { useContext } from 'react'
import styled from 'styled-components'
import { Schema } from 'yup'

import AuthFormContext from '$auth/contexts/AuthForm'
import AuthPanelNav from '../AuthPanelNav'
import styles from './authPanel.pcss'

const Panel = styled.div`
    background: #FFFFFF;
    box-shadow: 0px 0px 30px rgba(0, 0, 0, 0.05);
    border-radius: 4px;
`

const Header = styled.div`
  border-bottom: 1px solid #F2F1F1;
  font-size: 1.125rem;
  line-height: 80px;
  text-align: center;
  user-select: none;
`

const UnstyledAuthPanel = ({
    children,
    onPrev,
    validationSchemas,
    onValidationError,
    ...props
}) => {
    const {
        form,
        isProcessing,
        next,
        prev,
        setIsProcessing,
        step,
    } = useContext(AuthFormContext)
    const totalSteps = React.Children.count(children)
    const child = React.Children.toArray(children)[step]

    return (
        <div {...props}>
            <Panel>
                <Header>
                    Connect a wallet
                </Header>
                <div className={styles.body}>
                    {React.cloneElement(child, {
                        current: true,
                        form,
                        isProcessing,
                        next,
                        onValidationError,
                        setIsProcessing,
                        step,
                        totalSteps,
                        validationSchema: validationSchemas[step],
                    })}
                </div>
            </Panel>
        </div>
    )
}

const AuthPanel = styled(UnstyledAuthPanel)`
    margin: 0 auto;
    max-width: 528px;
    width: 100%;
`

export default AuthPanel
