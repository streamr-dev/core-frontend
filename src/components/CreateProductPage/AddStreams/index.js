// @flow

import React from 'react'
import { Form, Input } from '@streamr/streamr-layout'

import type { ProductPreview } from '../../../flowtype/product-types'
import type { Stream, StreamList } from '../../../flowtype/stream-types'
import FormGroup from '../FormGroup'

export type Props = {
    streams: StreamList,
    product: ProductPreview,
    onChange: (field: string, value: any) => void,
}

const AddStreams = ({ streams, product, onChange }: Props) => (
    <Form>
        <FormGroup title="previewStream" id="previewStream">
            <Input
                type="select"
                name="previewStream"
                id="previewStream"
                value={product.previewStream || ''}
                onChange={(e: SyntheticInputEvent<EventTarget>) => onChange('previewStream', e.target.value)}
            >
                {streams && streams.map(({id, name}: Stream) => (
                    <option key={id} value={id}>{name}</option>
                ))}
            </Input>
        </FormGroup>
        <FormGroup title="streams" id="streams">
            <Input
                type="select"
                name="streams"
                id="streams"
                multiple
                value={product.streams || []}
                onChange={(e: SyntheticInputEvent<HTMLSelectElement>) => {
                    const selected = [...e.currentTarget.selectedOptions].map((o: HTMLOptionElement) => o.value)

                    onChange('streams', selected)
                }}
            >
                {streams && streams.map(({id, name}: Stream) => (
                    <option key={id} value={id}>{name}</option>
                ))}
            </Input>
        </FormGroup>
    </Form>
)

export default AddStreams
