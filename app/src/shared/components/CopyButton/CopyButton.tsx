import React, {FunctionComponent, useCallback} from "react"
import styled from "styled-components"
import Button from "$shared/components/Button"
import useCopy from "$shared/hooks/useCopy"
import Notification from "$shared/utils/Notification"
import {NotificationIcon} from "$shared/utils/constants"
import SvgIcon from "$shared/components/SvgIcon"

const Btn = styled(Button)`
  width: 32px;
  height: 32px;
  border-radius: 100%;
  margin-left: 10px;
  display: grid;
  svg {
    width: 22px;
  }
`

type CopyButtonProps = {
    valueToCopy: string,
    notificationTitle?: string,
    notificationDescription?: string
}

export const CopyButton: FunctionComponent<CopyButtonProps> = ({
    valueToCopy,
    notificationTitle= 'Copied!',
    notificationDescription
}) => {
    const {copy} = useCopy()
    const handleCopy = useCallback(() => {
        copy(valueToCopy)
        Notification.push({title: notificationTitle, description: notificationDescription, icon: NotificationIcon.CHECKMARK})
    }, [])
    return <Btn onClick={handleCopy}  type={'button'} kind={'secondary'} size={'mini'}>
        <SvgIcon name={'copy'}/>
    </Btn>
}
