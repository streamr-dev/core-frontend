// @flow

import React from 'react'
import { Row, Container, Col, Button } from '@streamr/streamr-layout'

import styles from './loadmore.pcss'

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
                    {!isFetching &&
                        <Button color="primary" onClick={onClick}>Load more</Button>
                    }
                    {isFetching &&
                        <span>Loading...</span>
                    }
                </Col>
            </Row>
        </Container>
    )
}

export default LoadMore
