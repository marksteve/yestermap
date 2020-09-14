import mapboxgl from 'mapbox-gl'
import { useEffect, useRef, useState } from 'react'
import { ControlContainer, HistoryControl } from '../components/HistoryControl'
import { useHistory } from '../stores/history'
import styles from '../styles/Home.module.css'

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN

export default function Home() {
  const container = useRef()
  const map = useRef()
  const [controlContainer, setControlContainer] = useState(null)
  const data = useHistory((state) => state.data)

  useEffect(() => {
    map.current = new mapboxgl.Map({
      container: container.current,
      style: 'mapbox://styles/marksteve/ckeznuxx31uox19nyua9akkkp',
      center: [-74.5, 40],
      center: [121.7, 12.9],
      zoom: 3,
    })

    map.current.on('load', () => {
      map.current.addSource('history', {
        type: 'geojson',
        data: data,
      })

      map.current.addLayer({
        id: 'history',
        type: 'symbol',
        source: 'history',
        paint: {
          'icon-opacity': [
            'interpolate',
            ['linear'],
            ['get', 'index'],
            0,
            1,
            99,
            0.2,
          ],
          'text-color': '#4a3f22',
          'text-halo-color': '#d4c6a0',
          'text-halo-width': 2,
        },
        layout: {
          'icon-image': 'marker',
          'icon-size': [
            'interpolate',
            ['linear'],
            ['get', 'index'],
            0,
            1,
            99,
            0.2,
          ],
          'text-font': ['Playfair Display Bold'],
          'text-field': ['get', 'timestamp'],
          'text-offset': [0, 1.25],
          'text-anchor': 'top',
        },
      })

      map.current.loadImage('/marker.png', (err, image) => {
        if (err) throw err
        map.current.addImage('marker', image)
      })

      const controlContainer = new ControlContainer()
      map.current.addControl(controlContainer, 'top-left')
      setControlContainer(controlContainer.container)
    })
  }, [container])

  useEffect(() => {
    const source = map.current.getSource('history')
    if (!source) {
      return
    }
    source.setData(data)
    const [lng, lat] = data.features[0].geometry.coordinates
    map.current.fitBounds(new mapboxgl.LngLat(lng, lat).toBounds(5000))
  }, [data])

  let control = null
  if (controlContainer) {
    control = <HistoryControl container={controlContainer} />
  }

  return (
    <div className={styles.map} ref={container}>
      {control}
    </div>
  )
}
