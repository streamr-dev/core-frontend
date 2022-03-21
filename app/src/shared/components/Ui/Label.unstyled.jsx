import React from 'react'

export default function Label({ className, children }) {
    return (
        <label className={className}>
            {children}&zwnj;
        </label>
    )
}
