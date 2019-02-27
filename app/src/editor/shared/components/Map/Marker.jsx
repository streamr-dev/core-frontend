// @flow

import React from 'react'
import L from 'leaflet'
import { LeafletProvider, withLeaflet, MapLayer, type LatLng, type MapLayerProps } from 'react-leaflet'
import 'leaflet-rotatedmarker'

import markerPinImage from '$shared/assets/images/checkmark.svg'
import styles from './Marker.pcss'

type LeafletElement = L.Marker
type IconType = 'pin' | 'circle' | 'arrow' | 'arrowhead' | 'longarrow'

type Props = {
  icon: IconType,
  position: LatLng,
  rotation: number,
  zIndexOffset?: number,
} & MapLayerProps

const getImageForType = (type: IconType) => {
    console.log('TODO: get marker by type', type)
    return markerPinImage
}

const getIcon = (type: IconType) => {
    const icon = new L.Icon({
        iconUrl: getImageForType(type),
        iconRetinaUrl: getImageForType(type),
        iconAnchor: null,
        popupAnchor: null,
        shadowUrl: null,
        shadowSize: null,
        shadowAnchor: null,
        iconSize: new L.Point(20, 20),
        className: styles.markerIcon,
    })
    return icon
}

class Marker extends MapLayer<LeafletElement, Props> {
    createLeafletElement(props: Props): LeafletElement {
        const el = new L.Marker(props.position, this.getOptions(props))
        this.contextValue = {
            ...props.leaflet,
            popupContainer: el,
        }

        const icon = getIcon(props.icon)
        el.setIcon(icon)
        el.setRotationOrigin('50% 50%')

        return el
    }

    updateLeafletElement(fromProps: Props, toProps: Props) {
        if (toProps.position !== fromProps.position) {
            this.leafletElement.setLatLng(toProps.position)
        }
        if (toProps.icon !== fromProps.icon) {
            const newIcon = getIcon(toProps.icon)
            this.leafletElement.setIcon(newIcon)
        }
        if (toProps.zIndexOffset !== fromProps.zIndexOffset) {
            this.leafletElement.setZIndexOffset(toProps.zIndexOffset)
        }
        if (toProps.rotation !== fromProps.rotation) {
            this.leafletElement.setRotationAngle(toProps.rotation)
        }
    }

    render() {
        const { children } = this.props
        return children == null || this.contextValue == null ? null : (
            <LeafletProvider value={this.contextValue}>
                {children}
            </LeafletProvider>
        )
    }
}

export default withLeaflet(Marker)
