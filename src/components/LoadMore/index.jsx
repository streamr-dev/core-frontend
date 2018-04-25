// @flow

import React from 'react'
import { Row, Container, Col, Button } from '@streamr/streamr-layout'

import styles from './loadmore.pcss'

export type Props = {
    isFetching: boolean,
    loadMore: () => void,
    hasMoreSearchResults: boolean,
}

const LoadMore = ({ isFetching, loadMore, hasMoreSearchResults }: Props) => (
    <Container className={styles.container}>
        <Row className="justify-content-center">
            <Col xs="auto">
                {hasMoreSearchResults && !isFetching &&
                    <Button color="primary" onClick={loadMore}>Load more</Button>
                }
                {isFetching &&
                    <span>Loading...</span>
                }
            </Col>
        </Row>
    </Container>
)

export default LoadMore
