import React from 'react'
import Table from '../modules/Table'

const Modules = {
    TableModule: Table,
}

export default (props) => {
    const { module } = props
    const Module = Modules[module.jsModule]
    if (!Module) { return null }
    return (
        <Module {...props} />
    )
}
