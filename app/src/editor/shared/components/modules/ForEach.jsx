import React from 'react'

import ModuleSubscription from '../ModuleSubscription'

export default class ForEachModule extends React.Component {
    subscription = React.createRef()

    state = {
        selectedCanvas: undefined,
    }

    onLoad = async ({ json: { canvasKeys } }) => {
        this.setState((prevState) => ({
            selectedCanvas: prevState.selectedCanvas || (!!canvasKeys && canvasKeys[0]),
        }))
    }

    onSubCanvasSelect = (event) => {
        const { value } = event.target

        this.setState({
            selectedCanvas: value,
        })
    }

    render() {
        const { module, isActive } = this.props
        const { selectedCanvas } = this.state

        return (
            <div>
                <ModuleSubscription
                    {...this.props}
                    loadOptions={{ type: 'json' }}
                    onLoad={this.onLoad}
                    onMessage={this.onMessage}
                    module={module}
                />
                {isActive && (
                    <select
                        title="Subcanvas"
                        value={selectedCanvas}
                        onChange={this.onSubCanvasSelect}
                    >
                        {(module.canvasKeys || []).map((name, index) => (
                            <option value={index} key={name}>
                                {name}
                            </option>
                        ))}
                    </select>
                )}
            </div>
        )
    }
}
