// @flow

import React from 'react'
import { Row, Container, Col, Button } from '@streamr/streamr-layout'

import styles from './loadMore.pcss'

export type Props = {
    isFetching: boolean,
    onClick: () => void,
    hasMoreSearchResults: boolean,
}

const LoadMore = ({ isFetching, onClick, hasMoreSearchResults }: Props) => {
    if (!hasMoreSearchResults) {
        return null
    }

    return (
        <Container className={styles.container}>
            <Row className="justify-content-center">
                <Col xs="auto">
                    {isFetching ? (
                        <div className={styles.spinner} />
                    ) : (
                        <Button color="special" onClick={onClick}>
                            View more
                        </Button>
                    )}
                </Col>
            </Row>
        </Container>
    )
}

export default LoadMore
