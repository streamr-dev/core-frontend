// @flow

import { useContext } from 'react'

import { Context as EditControllerContext } from './EditControllerProvider'

type Props = {
    children?: Function,
}

const Modal = ({ children }: Props) => {
    const { modal } = useContext(EditControllerContext)
    const { id, save, cancel } = modal || {}

    return (id && children) ? children({
        id,
        save,
        cancel,
    }) : null
}

export default Modal
