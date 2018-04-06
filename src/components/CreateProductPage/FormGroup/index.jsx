// @flow

import React from 'react'
import { FormGroup as LayoutFormGroup, Label, Col } from '@streamr/streamr-layout'

export type Props = {
    id?: string,
    title?: string,
    children?: any,
}

const FormGroup = ({ id, title, children }: Props) => (
    <LayoutFormGroup row>
        <Label for={id} sm={2}>{title}</Label>
        <Col sm={10}>
            {children}
        </Col>
    </LayoutFormGroup>
)

export default FormGroup
