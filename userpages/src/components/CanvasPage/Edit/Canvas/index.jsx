import React from 'react'
import { DragDropContext } from 'react-dnd'
import HTML5Backend from 'react-dnd-html5-backend'
import cx from 'classnames'

import styles from './index.pcss'
import Modules from './Modules'

export default DragDropContext(HTML5Backend)(class Canvas extends React.Component {
    render() {
        const { className, ...props } = this.props

        return (
            <div className={cx(styles.Canvas, className)}>
                {props.canvas && (
                    <Modules
                        key={props.canvas.id}
                        {...props}
                    />
                )}
            </div>
        )
    }
})
