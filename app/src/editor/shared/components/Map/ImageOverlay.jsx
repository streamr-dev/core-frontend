// @flow

import L from 'leaflet'
import {
    withLeaflet,
    MapLayer,
    type LatLngBounds,
    type MapLayerProps,
} from 'react-leaflet'

type LeafletElement = L.ImageOverlay
type Props = {
  attribution?: string,
  bounds?: LatLngBounds,
  opacity?: number,
  url: string,
  zIndex?: number,
} & MapLayerProps

class ImageOverlay extends MapLayer<LeafletElement, Props> {
    createLeafletElement(props: Props): LeafletElement {
        const el = new L.ImageOverlay(
            props.url,
            props.bounds,
            this.getOptions(props),
        )
        this.contextValue = {
            ...props.leaflet,
            popupContainer: el,
        }
        return el
    }

    updateLeafletElement(fromProps: Props, toProps: Props) {
        if (toProps.url !== fromProps.url) {
            this.loadImage(toProps.url)
        }
        if (toProps.bounds !== fromProps.bounds) {
            this.leafletElement.setBounds(L.latLngBounds(toProps.bounds))
        }
        if (toProps.opacity !== fromProps.opacity) {
            this.leafletElement.setOpacity(toProps.opacity)
        }
        if (toProps.zIndex !== fromProps.zIndex) {
            this.leafletElement.setZIndex(toProps.zIndex)
        }
    }

    componentDidMount() {
        super.componentDidMount()
        this.loadImage(this.props.url)
    }

    componentDidUpdate() {
        console.log('componentDidUpdate')
    }

    onLoadImage = ({ target: img }) => {
        this.leafletElement.setUrl(img.src)

        const bounds = L.latLngBounds(L.latLng(img.height, 0), L.latLng(0, img.width))
        this.leafletElement.setBounds(bounds)
    }

    loadImage = (url) => {
        const img = new Image()
        img.onload = this.onLoadImage
        img.src = url
    }

    render() {
        return null
    }
}

export default withLeaflet(ImageOverlay)
