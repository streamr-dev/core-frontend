import React, { useEffect, useReducer, useState } from 'react'
import styled from 'styled-components'
import StatusLabel from '$shared/components/StatusLabel'
import TOCPage from '$shared/components/TOCPage'
import Label from '$ui/Label'
import Numeric from '$ui/Numeric'

const PARTITIONS_MIN = 1

const PARTITIONS_MAX = 99

function sanitizer(value, newValue) {
    const n = Number.parseInt(newValue, 10)

    if (Number.isNaN(n)) {
        return value
    }

    return Math.max(PARTITIONS_MIN, Math.min(PARTITIONS_MAX, n))
}

function UnstyledPartitionsSection({
    className,
    onChange,
    disabled = false,
    partitions = 1,
    desc = (
        <p>
            Partitioning enables high-volume streams to scale beyond what a typical node can handle.
            {' '}
            If you&apos;re not sure if your stream needs partitions, leave it set to 1.
        </p>
    ),
}) {
    const [value, setValue] = useState(String(partitions))

    const [sanitizedValue, setSanitizedValue] = useReducer(sanitizer, partitions)

    useEffect(() => {
        setValue(partitions)
    }, [partitions])

    useEffect(() => {
        setSanitizedValue(value)
    }, [value])

    return (
        <TOCPage.Section
            id="stream-partitions"
            title="Stream partitions"
            linkTitle="Partitions"
            status={<StatusLabel.Advanced />}
            disabled={disabled}
        >
            <div className={className}>
                {desc}
                <Partitions>
                    <Label>Partitions</Label>
                    <Numeric
                        min={PARTITIONS_MIN}
                        max={PARTITIONS_MAX}
                        value={value}
                        onChange={({ target }) => {
                            setValue(target.value)
                        }}
                        onBlur={() => {
                            if (typeof onChange === 'function' && sanitizedValue !== partitions) {
                                setValue(String(sanitizedValue))
                                onChange(sanitizedValue)
                            }
                        }}
                        disabled={disabled}
                        name="partitions"
                    />
                </Partitions>
            </div>
        </TOCPage.Section>
    )
}

const Partitions = styled.div`
    max-width: 136px;
`

const PartitionsSection = styled(UnstyledPartitionsSection)`
    > p {
        margin-bottom: 3.125rem;
        max-width: 660px;
    }
`

export default PartitionsSection
