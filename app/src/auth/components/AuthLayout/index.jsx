// @flow

import * as React from 'react'
import styled from 'styled-components'

import CoreHelmet from '$shared/components/CoreHelmet'
import Footer from '../Footer'
import Logo from '../Logo'
import styles from './authLayout.pcss'

type Props = {
    children: React.Node,
}

const Panel = styled.div`
    input[type=email],
    input[type=text],
    input[type=password] {
        border: 0;
        box-sizing: content-box;
        color: #323232;
        display: block;
        font-size: 16px;
        height: 1rem;
        line-height: 1rem;
        outline: 0;
        padding: 0.75rem 0;
        width: 100%;
        background-color: inherit;

        ::placeholder {
            font-size: inherit;
            opacity: 0;
            padding-left: 0;
            transition: opacity 200ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;
            color: #A3A3A3;
        }

        :focus::placeholder {
            opacity: 1;
        }
    }
`

const AuthLayout = ({ children }: Props) => (
    <React.Fragment>
        <CoreHelmet
            htmlAttributes={{
                class: styles.html,
            }}
        />
        <div className={styles.root}>
            <div className={styles.outer}>
                <section className={styles.content}>
                    <div className={styles.inner}>
                        <Logo className={styles.logo} />
                        <Panel>
                            {children}
                        </Panel>
                    </div>
                </section>
                <Footer className={styles.footer} mobile />
            </div>
        </div>
    </React.Fragment>
)

export default AuthLayout
