// @flow

import React from 'react'
import { Translate } from 'react-redux-i18n'
import { Row, Container, Col } from 'reactstrap'
import styled from 'styled-components'

import Button from '$shared/components/Button'

export type Props = {
    onClick: () => void,
    hasMoreSearchResults: boolean,
    className?: string,
}

const StyledContainer = styled(Container)`
    height: 40px;
    margin: 5em auto 0;
`

const LoadMore = ({ onClick, hasMoreSearchResults, className }: Props) => {
    if (!hasMoreSearchResults) {
        return null
    }

    return (
        <StyledContainer className={className}>
            <Row className="justify-content-center">
                <Col xs="auto">
                    <Button kind="special" variant="dark" onClick={onClick}>
                        <Translate value="productList.viewMore" />
                    </Button>
                </Col>
            </Row>
        </StyledContainer>
    )
}

export default LoadMore
