// @flow

import React from 'react'
import { Link } from 'react-router-dom'
import { Button } from '@streamr/streamr-layout'

import errorPageImage from '../../../assets/app_crashed.png'
import links from '../../links'

import styles from './errorPageView.pcss'

const ErrorPageView = () => (
    <section className={styles.errorPageView}>
        <div className={styles.imageContainer}>
            <img src={errorPageImage} alt="App crashed" />
        </div>
        <p className={styles.text}>
            Oops. Something has broken down here.
            Please try one of the links below
            to get things back on track.
        </p>
        <div className={styles.buttonContainer}>
            <Link to={links.main}>
                <Button className={styles.button} color="special">
                    Marketplace Top
                </Button>
            </Link>
            <Link to={links.myProducts}>
                <Button className={styles.button} color="special">
                    My Products
                </Button>
            </Link>
        </div>
    </section>
)

export default ErrorPageView
