// @flow

import React from 'react'
import { Row, Col } from 'reactstrap'

import Toggle from '$shared/components/Toggle'
import styles from './toggleField.pcss'

type Props = {
    label: string,
    value: boolean,
    onChange: (checked: boolean) => void,
}

const ToggleField = ({ label, value, onChange }: Props) => (
    <Row>
        <Col xs={10} className={styles.label}>
            {label}
        </Col>
        <Col xs={2} className={styles.toggle}>
            <Toggle value={value} onChange={onChange} />
        </Col>
    </Row>
)

export default ToggleField
