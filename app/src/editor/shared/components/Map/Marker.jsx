// @flow

import React from 'react'
import { render } from 'react-dom'
import L from 'leaflet'
import { LeafletProvider, withLeaflet, MapLayer, type LatLng, type MapLayerProps } from 'react-leaflet'
import 'leaflet-rotatedmarker'

import styles from './Marker.pcss'

type LeafletElement = L.Marker
type IconType = 'pin' | 'circle' | 'arrow' | 'arrowhead' | 'longarrow'

type Props = {
  icon: IconType,
  color: string,
  position: LatLng,
  rotation: number,
  zIndexOffset?: number,
} & MapLayerProps

const CircleIcon = ({ color }) => (
    <svg viewBox="0 0 12 12" xmlns="http://www.w3.org/2000/svg">
        <g transform="translate(-6 -6)" fillRule="evenodd">
            <path d="M0 0h24v24H0z" fill="none" />
            <circle fill={color} cx="12" cy="12" r="6" />
        </g>
    </svg>
)

class Marker extends MapLayer<LeafletElement, Props> {
    createLeafletElement(props: Props): LeafletElement {
        const el = new L.Marker(props.position, this.getOptions(props))
        this.contextValue = {
            ...props.leaflet,
            popupContainer: el,
        }

        const icon = new L.DivIcon({
            iconSize: new L.Point(16, 16),
            className: styles.marker,
        })
        el.setIcon(icon)
        el.setRotationOrigin('50% 50%')

        return el
    }

    updateLeafletElement(fromProps: Props, toProps: Props) {
        if (toProps.position !== fromProps.position) {
            this.leafletElement.setLatLng(toProps.position)
        }
        if (toProps.zIndexOffset !== fromProps.zIndexOffset) {
            this.leafletElement.setZIndexOffset(toProps.zIndexOffset)
        }
        if (toProps.rotation !== fromProps.rotation) {
            this.leafletElement.setRotationAngle(toProps.rotation)
        }
    }

    componentDidMount() {
        super.componentDidMount()
        this.renderComponent()
    }

    componentDidUpdate(fromProps) {
        this.renderComponent()
        this.updateLeafletElement(fromProps, this.props)
    }

    renderComponent = () => {
        /* eslint-disable-next-line no-underscore-dangle */
        const container = this.leafletElement._icon

        const component = (
            <LeafletProvider value={this.contextValue}>
                <CircleIcon color={this.props.color} />
                {this.props.children}
            </LeafletProvider>
        )

        if (container) {
            render(
                component,
                container,
            )
        }
    }

    render() {
        return null
    }
}

export default withLeaflet(Marker)
