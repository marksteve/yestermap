import mapboxgl from 'mapbox-gl'
import { useEffect, useRef, useState } from 'react'
import { bezier } from 'turf'
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
      map.current.addSource('lines', {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features: [],
        },
      })

      map.current.addSource('points', {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features: [],
        },
      })

      map.current.addLayer({
        id: 'lines',
        type: 'line',
        source: 'lines',
        paint: {
          'line-color': '#4a3f22',
          'line-width': 2,
          'line-dasharray': [2, 4],
        },
        layout: {
          'line-cap': 'round',
          'line-join': 'round',
        },
      })

      map.current.addLayer({
        id: 'points',
        type: 'symbol',
        source: 'points',
        paint: {
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
            9,
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
    const lines = map.current.getSource('lines')
    const points = map.current.getSource('points')

    if (!lines || !points || !data.length) {
      return
    }

    if (data.length > 1) {
      lines.setData(
        bezier({
          type: 'Feature',
          properties: {},
          geometry: {
            type: 'LineString',
            coordinates: data.map((location, i) => [
              location.longitude,
              location.latitude,
            ]),
          },
        })
      )
    } else {
      lines.setData({
        type: 'FeatureCollection',
        features: [],
      })
    }

    points.setData({
      type: 'FeatureCollection',
      features: data.map((location, i) => ({
        type: 'Feature',
        properties: { ...location, index: i },
        geometry: {
          type: 'Point',
          coordinates: [location.longitude, location.latitude],
        },
      })),
    })

    const { longitude, latitude } = data[0]
    map.current.fitBounds(
      new mapboxgl.LngLat(longitude, latitude).toBounds(5000)
    )
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
