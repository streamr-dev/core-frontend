// @flow

import React from 'react'
import { Form, Input } from '@streamr/streamr-layout'

import type { Stream, StreamList } from '../../../flowtype/stream-types'
import FormGroup from '../FormGroup'

export type Props = {
    streams: StreamList,
}

const AddStreams = ({ streams }: Props) => (
    <Form>
        <FormGroup title="previewStream" id="previewStream">
            <Input type="select" name="previewStream" id="previewStream">
                {streams && streams.map(({id, name}: Stream) => (
                    <option key={id}>{name}</option>
                ))}
            </Input>
        </FormGroup>
        <FormGroup title="streams" id="streams">
            <Input type="select" name="streams" id="streams" multiple>
                {streams && streams.map(({id, name}: Stream) => (
                    <option key={id}>{name}</option>
                ))}
            </Input>
        </FormGroup>
    </Form>
)

export default AddStreams
