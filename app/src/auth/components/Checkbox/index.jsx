// @flow

import * as React from 'react'

import SharedCheckbox from '$shared/components/Checkbox'
import InputError from '$shared/components/FormControl/InputError'
import styles from './checkbox.pcss'

export type Props = {
    className?: string,
    checked?: boolean,
    children: React.Node,
    error?: string,
    keepError?: boolean,
}

const Checkbox = ({
    checked,
    className,
    children,
    error,
    keepError,
    ...props
}: Props) => (
    <div>
        <label className={styles.label}>
            <SharedCheckbox
                {...props}
                value={checked}
                className={className}
            />
            <span>{children}</span>
        </label>
        {!!(keepError || error) && <InputError preserved eligible message={error} />}
    </div>
)

export default Checkbox
