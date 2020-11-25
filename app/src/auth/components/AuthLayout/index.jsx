import * as React from 'react'
import styled from 'styled-components'

import { CoreHelmet } from '$shared/components/Helmet'
import Logo from '../Logo'
import styles from './authLayout.pcss'

const Panel = styled.div`
`

const TitleBar = styled.div`
    font-weight: var(--medium);
    font-size: 18px;
    line-height: 64px;
    text-align: center;
`

const Footer = styled.div``

const UnstyledLayout = ({ children, ...props }) => (
    <React.Fragment>
        <CoreHelmet
            htmlAttributes={{
                class: styles.html,
            }}
        />
        <div {...props}>
            <Logo />
            <TitleBar>Streamr Core</TitleBar>
            <Panel>
                {children}
            </Panel>
            <Footer />
        </div>
    </React.Fragment>
)

const AuthLayout = styled(UnstyledLayout)`
    display: flex;
    flex-direction: column;
    flex-grow: 0.8;
    justify-content: center;
    padding: 0 2em;
    margin: 3rem auto;
    color: #323232;

    ${Panel} {
        margin-top: 40px;
    }
`

export default AuthLayout
