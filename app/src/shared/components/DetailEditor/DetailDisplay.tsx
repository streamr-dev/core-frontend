import React, { FunctionComponent, ReactNode } from 'react'
import { DetailEditorDropdown } from '$shared/components/DetailEditor/DetailEditor.styles'

export const DetailDisplay: FunctionComponent<{
    icon: ReactNode
    value?: string
    link: string
}> = ({ icon, value, link }) => {
    return (
        <DetailEditorDropdown isOpen={false}>
            <a href={link} target={'_blank'} rel={'noopener noreferrer'}>
                {icon}
                {!!value && (
                    <span className={'value' + (icon ? ' has-icon' : '')}>{value}</span>
                )}
            </a>
        </DetailEditorDropdown>
    )
}
