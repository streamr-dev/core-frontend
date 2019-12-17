// @flow

import React from 'react'
import { SortableHandle } from 'react-sortable-hoc'

const Handle = ({ ...props }: {}) => (
    <svg {...props} width="32" height="32" xmlns="http://www.w3.org/2000/svg">
        <g stroke="#525252" fill="none" fillRule="evenodd" strokeLinecap="round">
            <path d="M12 7h8M12 13h8M12 19h8M12 25h8" />
        </g>
    </svg>
)

export default SortableHandle(Handle)
