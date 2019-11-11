// @flow

import React from 'react'
import { Translate } from 'react-redux-i18n'
import { Row, Container, Col } from 'reactstrap'

import Button from '$shared/components/Button'

import styles from './loadMore.pcss'

export type Props = {
    onClick: () => void,
    hasMoreSearchResults: boolean,
}

const LoadMore = ({ onClick, hasMoreSearchResults }: Props) => {
    if (!hasMoreSearchResults) {
        return null
    }

    return (
        <Container className={styles.container}>
            <Row className="justify-content-center">
                <Col xs="auto">
                    <Button type="special" variant="dark" onClick={onClick}>
                        <Translate value="productList.viewMore" />
                    </Button>
                </Col>
            </Row>
        </Container>
    )
}

export default LoadMore
