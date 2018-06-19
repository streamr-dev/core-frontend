// @flow

import React from 'react'
import { Row, Container, Col, Button } from 'reactstrap'

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
                    <Button color="special" onClick={onClick}>
                        View more
                    </Button>
                </Col>
            </Row>
        </Container>
    )
}

export default LoadMore
