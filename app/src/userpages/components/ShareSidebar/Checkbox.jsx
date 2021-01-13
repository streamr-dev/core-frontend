import React, { useCallback } from 'react'
import styled from 'styled-components'
import { I18n } from 'react-redux-i18n'
import SharedCheckbox from '$shared/components/Checkbox'

const UnstyledCheckbox = ({
    className,
    id,
    operationKey,
    onChange: onChangeProp,
    ...props
}) => {
    const onChange = useCallback((e) => {
        onChangeProp(operationKey, !!e.target.checked)
    }, [onChangeProp, operationKey])

    return (
        <div className={className}>
            <SharedCheckbox {...props} id={id} onChange={onChange} />
            <label htmlFor={id}>
                {I18n.t(`share.permissions.${operationKey.toLowerCase()}`)}
            </label>
        </div>
    )
}

const Checkbox = styled(UnstyledCheckbox)`
    align-items: center;
    display: flex;

    input {
        display: block;
        margin-right: 0;
    }

    label {
        flex-grow: 1;
        line-height: normal;
        margin: 0 0 0 16px;
    }
`

const List = styled.div`
    display: grid;
    grid-row-gap: 16px;
    grid-template-columns: 1fr 1fr;
`

Object.assign(Checkbox, {
    List,
})

export default Checkbox
