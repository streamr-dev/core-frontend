// @flow

import React from 'react'
import { Form, Input, Row, Col } from '@streamr/streamr-layout'

import FormGroup from '../FormGroup'

const PriceAndPayments = () => (
    <Form>
        <FormGroup title="price" id="price">
            <Row>
                <Col xs={4}>
                    <Input type="text" name="price" id="price" placeholder="price" />
                </Col>
                <Col xs={1}>
                    per
                </Col>
                <Col xs={4}>
                    <Input type="select" name="unit" id="unit">
                        <option value="second">Second</option>
                        <option value="minute">Minute</option>
                        <option value="hour">Hour</option>
                    </Input>
                </Col>
            </Row>
        </FormGroup>
    </Form>
)

export default PriceAndPayments
