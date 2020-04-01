// @flow

import React from 'react'
import { Translate } from 'react-redux-i18n'
import { Link } from 'react-router-dom'
import { ErrorPageContent } from '$shared/components/GenericErrorPage'
import routes from '$routes'
import Button from '$shared/components/Button'
import BodyClass, { PAGE_SECONDARY } from '$shared/components/BodyClass'
import Layout from '$shared/components/Layout'

const CanvasErrorPage = () => (
    <Layout>
        <BodyClass className={PAGE_SECONDARY} />
        <ErrorPageContent>
            <Button
                kind="special"
                tag={Link}
                to=""
                onClick={(event) => {
                    event.preventDefault()
                    window.location.reload()
                }}
            >
                <Translate value="editor.error.refresh" />
            </Button>
            <Button
                kind="special"
                tag={Link}
                to={routes.canvases()}
                className="d-none d-md-inline-flex"
            >
                <Translate value="editor.general.backToCanvases" />
            </Button>
        </ErrorPageContent>
    </Layout>
)

export default CanvasErrorPage
